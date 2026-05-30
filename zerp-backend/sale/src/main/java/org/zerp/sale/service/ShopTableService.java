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
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.shoptable.ShopTableCreateDTO;
import org.zerp.sale.dto.shoptable.ShopTableDTO;
import org.zerp.sale.dto.shoptable.ShopTableUpdateDTO;
import org.zerp.sale.mapper.ShopTableMapper;
import org.zerp.sale.permission.ShopTablePermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;
import org.zerp.sale.repository.ShopTableRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class ShopTableService implements
        IResourceService<ShopTableDTO, ShopTableDTO, ShopTableCreateDTO, ShopTableUpdateDTO, UUID> {

    private final ShopTablePermissionEvaluator permissionEvaluator;
    private final ShopTableRepository repository;
    private final ShopRepository shopRepository;
    private final ShopTableMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<ShopTableDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        Map<String, String> normalizedFilters = normalizeShopFilters(filters);
        log.trace("Finding ShopTables with filters: {}", normalizedFilters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<ShopTable> spec = filterRefiner.refinedOrBadRequest(normalizedFilters, ShopTable.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<ShopTableDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} ShopTables", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShopTableDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<ShopTableDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(table -> {
                if (permissionEvaluator.canRead(userId, table)) {
                    results.add(mapper.toDTO(table));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public ShopTableDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        ShopTable table = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ShopTable not found"));
        if (!permissionEvaluator.canRead(userId, table)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read ShopTable");
        }
        return mapper.toDTO(table);
    }

    @Override
    @Transactional
    public ShopTableDTO create(ShopTableCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        Shop shop = resolveShop(data.getShopId());
        UUID tenantId = shop.getTenantId();
        if (!permissionEvaluator.canCreate(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create ShopTable");
        }
        ShopTable table = mapper.toEntity(data);
        table.setShop(shop);
        table.setTenantId(tenantId);
        ShopTable saved = repository.save(table);
        log.info("Created ShopTable with id: {}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public ShopTableDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        ShopTable table = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ShopTable not found"));
        if (!permissionEvaluator.canPatch(userId, table)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch ShopTable");
        }
        applyFieldUpdates(table, data);
        ShopTable updated = repository.save(table);
        log.info("Patched ShopTable with id: {}", uuid);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public ShopTableDTO update(UUID uuid, ShopTableUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        ShopTable table = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ShopTable not found"));
        if (!permissionEvaluator.canUpdate(userId, table)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update ShopTable");
        }
        mapper.updateEntityFromDTO(data, table);
        ShopTable updated = repository.save(table);
        log.info("Updated ShopTable with id: {}", uuid);
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
                log.debug("Failed to patch ShopTable with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        ShopTable table = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ShopTable not found"));
        if (!permissionEvaluator.canDelete(userId, table)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete ShopTable");
        }
        repository.delete(table);
        log.info("Deleted ShopTable with id: {}", uuid);
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
                log.debug("Failed to delete ShopTable with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private void applyFieldUpdates(ShopTable table, Map<String, Object> fields) {
        if (fields.containsKey("name")) table.setName((String) fields.get("name"));
        if (fields.containsKey("description")) table.setDescription((String) fields.get("description"));
        if (fields.containsKey("capacity")) table.setCapacity((Integer) fields.get("capacity"));
        if (fields.containsKey("floor")) table.setFloor((Integer) fields.get("floor"));
        if (fields.containsKey("status")) table.setStatus(
                org.zerp.common.entity.sale.ShopTableStatus.valueOf((String) fields.get("status")));
    }

    private Shop resolveShop(UUID shopId) {
        if (shopId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shopId is required");
        }
        return shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
    }

    private Map<String, String> normalizeShopFilters(Map<String, String> filters) {
        Map<String, String> normalized = new HashMap<>(filters);
        String shopId = normalized.remove("shopId");
        if (shopId != null && !shopId.isBlank()) {
            normalized.putIfAbsent("shop.id", shopId);
        }
        return normalized;
    }
}
