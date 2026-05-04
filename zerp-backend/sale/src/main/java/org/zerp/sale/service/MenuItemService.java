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
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.Product;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.menuitem.MenuItemCreateDTO;
import org.zerp.sale.dto.menuitem.MenuItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemUpdateDTO;
import org.zerp.sale.mapper.MenuItemMapper;
import org.zerp.sale.permission.MenuItemPermissionEvaluator;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.MenuCategoryRepository;
import org.zerp.sale.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class MenuItemService implements
        IResourceService<MenuItemDTO, MenuItemDTO, MenuItemCreateDTO, MenuItemUpdateDTO, UUID> {
    private final MenuItemPermissionEvaluator permissionEvaluator;
    private final MenuItemRepository repository;
    private final MenuCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final MenuItemMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<MenuItemDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding MenuItems with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<MenuItem> spec = filterRefiner.refinedOrBadRequest(filters, MenuItem.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<MenuItemDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} MenuItems", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<MenuItemDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(item -> {
                if (permissionEvaluator.canRead(userId, item)) {
                    results.add(mapper.toDTO(item));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canRead(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read MenuItem");
        }
        return mapper.toDTO(item);
    }

    @Override
    @Transactional
    public MenuItemDTO create(MenuItemCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        if (!permissionEvaluator.canCreate(userId, data.getCategoryId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create MenuItem");
        }
        MenuItem item = mapper.toEntity(data);
        item.setCategory(categoryRepository.getReferenceById(data.getCategoryId()));
        item.setTenantId(tenantId);
        MenuItem saved = repository.save(item);
        log.info("Created MenuItem with id: {}", saved.getId());
        
        handleProductAssignments(saved, data.getProductIds());
        
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public MenuItemDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canPatch(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch MenuItem");
        }
        applyFieldUpdates(item, data);
        MenuItem updated = repository.save(item);
        log.info("Patched MenuItem with id: {}", uuid);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public MenuItemDTO update(UUID uuid, MenuItemUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canUpdate(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update MenuItem");
        }
        
        mapper.updateEntityFromDTO(data, item);
        MenuItem updated = repository.save(item);
        
        handleProductAssignments(updated, data.getProductIds());
        log.info("Updated MenuItem with id: {}", uuid);
        return mapper.toDTO(updated);
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
                log.debug("Failed to patch MenuItem with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canDelete(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete MenuItem");
        }
        productRepository.findByMenuItemId(uuid).forEach(p -> {
            p.setMenuItem(null);
            productRepository.save(p);
        });
        repository.delete(item);
        log.info("Deleted MenuItem with id: {}", uuid);
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
                log.debug("Failed to delete MenuItem with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private void applyFieldUpdates(MenuItem item, Map<String, Object> fields) {
        if (fields.containsKey("name")) item.setName((String) fields.get("name"));
        if (fields.containsKey("description")) item.setDescription((String) fields.get("description"));
        if (fields.containsKey("price")) item.setPrice(new BigDecimal(fields.get("price").toString()));
        if (fields.containsKey("imageId")) item.setImageId((String) fields.get("imageId"));
    }

    private void handleProductAssignments(MenuItem item, List<UUID> newProductIds) {
        if (newProductIds == null) {
            return;
        }
        List<Product> currentProducts = productRepository.findByMenuItemId(item.getId());
        
        for (Product product : currentProducts) {
            if (!newProductIds.contains(product.getId())) {
                product.setMenuItem(null);
                productRepository.save(product);
            }
        }
        
        for (UUID productId : newProductIds) {
            boolean alreadyAssigned = currentProducts.stream()
                .anyMatch(p -> p.getId().equals(productId));
            if (!alreadyAssigned) {
                productRepository.findById(productId).ifPresent(product -> {
                    product.setMenuItem(item);
                    productRepository.save(product);
                });
            }
        }
    }
}
