package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.ProductExtraOption;
import org.zerp.common.entity.sale.ProductExtraOptionItem;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionCreateDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionUpdateDTO;
import org.zerp.sale.mapper.ProductExtraOptionMapper;
import org.zerp.sale.permission.ProductExtraOptionPermissionEvaluator;
import org.zerp.sale.repository.ProductExtraOptionRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProductExtraOptionService implements
        IResourceService<ProductExtraOptionDTO, ProductExtraOptionDTO, ProductExtraOptionCreateDTO, ProductExtraOptionUpdateDTO, UUID> {
    private final ProductExtraOptionPermissionEvaluator permissionEvaluator;
    private final ProductExtraOptionRepository repository;
    private final ProductExtraOptionMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductExtraOptionDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding ProductExtraOptions with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<ProductExtraOption> spec = filterRefiner.refinedOrBadRequest(filters, ProductExtraOption.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<ProductExtraOptionDTO> results = repository.findAll(spec, pageable).map(this::toDTOWithItems);
        log.debug("Found {} ProductExtraOptions", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductExtraOptionDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<ProductExtraOptionDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(option -> {
                if (permissionEvaluator.canRead(userId, option)) {
                    results.add(toDTOWithItems(option));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductExtraOptionDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        ProductExtraOption option = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductExtraOption not found"));
        if (!permissionEvaluator.canRead(userId, option)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read ProductExtraOption");
        }
        return toDTOWithItems(option);
    }

    @Override
    @Transactional
    public ProductExtraOptionDTO create(ProductExtraOptionCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        if (!permissionEvaluator.canCreate(userId, data.getProductId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create ProductExtraOption");
        }

        ProductExtraOption option = mapper.toEntity(data);
        option.setTenantId(tenantId);

        if (data.getItems() != null) {
            data.getItems().forEach(itemDTO -> {
                ProductExtraOptionItem item = mapper.toItemEntity(itemDTO);
                item.setExtraOption(option);
                option.getItems().add(item);
            });
        }

        ProductExtraOption saved = repository.save(option);
        log.info("Created ProductExtraOption with id: {}", saved.getId());
        return toDTOWithItems(saved);
    }

    @Override
    @Transactional
    public ProductExtraOptionDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        ProductExtraOption option = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductExtraOption not found"));
        if (!permissionEvaluator.canPatch(userId, option)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch ProductExtraOption");
        }
        if (data.containsKey("name")) option.setName((String) data.get("name"));
        if (data.containsKey("description")) option.setDescription((String) data.get("description"));
        if (data.containsKey("price")) option.setPrice(new BigDecimal(data.get("price").toString()));
        if (data.containsKey("isActive")) option.setActive((Boolean) data.get("isActive"));
        ProductExtraOption updated = repository.save(option);
        return toDTOWithItems(updated);
    }

    @Override
    @Transactional
    public ProductExtraOptionDTO update(UUID uuid, ProductExtraOptionUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        ProductExtraOption option = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductExtraOption not found"));
        if (!permissionEvaluator.canUpdate(userId, option)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update ProductExtraOption");
        }

        mapper.updateEntityFromDTO(data, option);

        if (data.getItems() != null) {
            option.getItems().clear();
            data.getItems().forEach(itemDTO -> {
                ProductExtraOptionItem item = mapper.toItemEntity(itemDTO);
                item.setExtraOption(option);
                option.getItems().add(item);
            });
        }

        ProductExtraOption updated = repository.save(option);
        log.info("Updated ProductExtraOption with id: {}", uuid);
        return toDTOWithItems(updated);
    }

    @Override
    @Transactional
    public List<UUID> patchMany(List<UUID> uuids, Map<String, Object> fields) {
        List<UUID> updated = new ArrayList<>();
        for (UUID uuid : uuids) {
            try {
                patch(uuid, fields);
                updated.add(uuid);
            } catch (ResponseStatusException e) {
                log.debug("Failed to patch ProductExtraOption with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        ProductExtraOption option = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductExtraOption not found"));
        if (!permissionEvaluator.canDelete(userId, option)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete ProductExtraOption");
        }
        repository.delete(option);
        log.info("Deleted ProductExtraOption with id: {}", uuid);
    }

    @Override
    @Transactional
    public List<UUID> deleteMany(List<UUID> uuids) {
        List<UUID> deleted = new ArrayList<>();
        for (UUID uuid : uuids) {
            try {
                deleteById(uuid);
                deleted.add(uuid);
            } catch (ResponseStatusException e) {
                log.debug("Failed to delete ProductExtraOption with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private ProductExtraOptionDTO toDTOWithItems(ProductExtraOption option) {
        ProductExtraOptionDTO dto = mapper.toDTO(option);
        dto.setItems(option.getItems().stream().map(mapper::toItemDTO).toList());
        return dto;
    }
}
