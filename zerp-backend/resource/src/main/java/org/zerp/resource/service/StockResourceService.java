package org.zerp.resource.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.FilterType;
import org.zerp.common.util.CurrentUserIdResolver;
import org.zerp.resource.dto.resource.StockResourceCreateDTO;
import org.zerp.resource.dto.resource.StockResourceDTO;
import org.zerp.resource.dto.resource.StockResourceUpdateDTO;
import org.zerp.resource.mapper.StockResourceMapper;
import org.zerp.resource.permission.StockResourcePermissionEvaluator;
import org.zerp.resource.repository.StockResourceRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class StockResourceService implements
        IResourceService<StockResourceDTO, StockResourceDTO, StockResourceCreateDTO, StockResourceUpdateDTO, UUID> {
    private final StockResourcePermissionEvaluator permissionEvaluator;
    private final StockResourceRepository repository;
    private final StockResourceMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;

    @Override
    @Transactional(readOnly = true)
    public Page<StockResourceDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding StockResources with filters: {} and pageable: {}", filters, pageable);
        UUID userId = resolveCurrentUserId();

        Specification<StockResource> spec = buildSpecificationFromFilters(filters);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<StockResourceDTO> results = repository.findAll(spec, pageable)
                .map(mapper::toDTO);

        log.debug("Found {} StockResources with filters", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockResourceDTO> findAllById(List<UUID> uuids) {
        log.trace("Finding all StockResources by IDs");
        UUID userId = resolveCurrentUserId();

        List<StockResourceDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(stockResource -> {
                if (permissionEvaluator.canRead(userId,
                        new StockResourcePermissionEvaluator.StockResourceTarget(id, stockResource.getTenant().getId()))) {
                    log.trace("Fetched StockResource with id: {}", id);
                    results.add(mapper.toDTO(stockResource));
                }
            });
        }

        log.debug("Found {} StockResources out of requested IDs", results.size());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public StockResourceDTO findById(UUID uuid) {
        log.trace("Finding StockResource by id: {}", uuid);
        UUID userId = resolveCurrentUserId();

        StockResource stockResource = repository.findById(uuid).orElseThrow(() -> {
            log.warn("StockResource not found with id: {}", uuid);
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "StockResource not found");
        });

        if (!permissionEvaluator.canRead(userId,
                new StockResourcePermissionEvaluator.StockResourceTarget(uuid, stockResource.getTenant().getId()))) {
            log.warn("Permission denied for reading StockResource with id: {}", uuid);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read StockResource");
        }

        log.debug("Successfully retrieved StockResource with id: {}", uuid);
        return mapper.toDTO(stockResource);
    }

    @Override
    @Transactional
    public StockResourceDTO create(StockResourceCreateDTO data) {
        log.trace("Creating new StockResource with data: {}", data);
        UUID userId = resolveCurrentUserId();

        StockResource stockResource = mapper.toEntity(data);

        if (!permissionEvaluator.canCreate(userId,
                new StockResourcePermissionEvaluator.TenantParent(stockResource.getTenant().getId()))) {
            log.warn("Permission denied for creating StockResource in tenant: {}",
                    stockResource.getTenant().getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create StockResource");
        }

        StockResource saved = repository.save(stockResource);
        log.info("Successfully created StockResource with id: {}", saved.getId());

        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public StockResourceDTO patch(UUID uuid, Map<String, Object> data) {
        log.trace("Patching StockResource with id: {} and data: {}", uuid, data);
        UUID userId = resolveCurrentUserId();

        StockResource stockResource = repository.findById(uuid).orElseThrow(() -> {
            log.warn("StockResource not found with id: {} for patching", uuid);
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "StockResource not found");
        });

        if (!permissionEvaluator.canPatch(userId,
                new StockResourcePermissionEvaluator.StockResourceTarget(uuid, stockResource.getTenant().getId()))) {
            log.warn("Permission denied for patching StockResource with id: {}", uuid);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch StockResource");
        }

        applyFieldUpdates(stockResource, data);

        StockResource updated = repository.save(stockResource);
        log.info("Successfully patched StockResource with id: {}", uuid);

        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public StockResourceDTO update(UUID uuid, StockResourceUpdateDTO data) {
        log.trace("Updating StockResource with id: {} and data: {}", uuid, data);
        UUID userId = resolveCurrentUserId();

        StockResource stockResource = repository.findById(uuid).orElseThrow(() -> {
            log.warn("StockResource not found with id: {} for updating", uuid);
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "StockResource not found");
        });

        if (!permissionEvaluator.canUpdate(userId,
                new StockResourcePermissionEvaluator.StockResourceTarget(uuid, stockResource.getTenant().getId()))) {
            log.warn("Permission denied for updating StockResource with id: {}", uuid);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update StockResource");
        }

        mapper.updateEntityFromDTO(data, stockResource);

        StockResource updated = repository.save(stockResource);
        log.info("Successfully updated StockResource with id: {}", uuid);

        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public List<UUID> patchMany(List<UUID> uuids, Map<String, Object> fields) {
        log.trace("Batch patching StockResources with fields: {}", fields);

        List<UUID> updated = new ArrayList<>();
        for (UUID uuid : uuids) {
            try {
                patch(uuid, fields);
                updated.add(uuid);
            } catch (ResponseStatusException e) {
                log.debug("Failed to patch StockResource with id: {}", uuid, e);
            }
        }

        log.info("Successfully patched {} StockResources of {}", updated.size(), uuids.size());
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        log.trace("Deleting StockResource with id: {}", uuid);
        UUID userId = resolveCurrentUserId();

        StockResource stockResource = repository.findById(uuid).orElseThrow(() -> {
            log.warn("StockResource not found with id: {} for deletion", uuid);
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "StockResource not found");
        });

        if (!permissionEvaluator.canDelete(userId,
                new StockResourcePermissionEvaluator.StockResourceTarget(uuid, stockResource.getTenant().getId()))) {
            log.warn("Permission denied for deleting StockResource with id: {}", uuid);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete StockResource");
        }

        repository.delete(stockResource);
        log.info("Successfully deleted StockResource with id: {}", uuid);
    }

    @Override
    @Transactional
    public List<UUID> deleteMany(List<UUID> uuids) {
        log.trace("Batch deleting StockResources");

        List<UUID> deleted = new ArrayList<>();
        for (UUID uuid : uuids) {
            try {
                deleteById(uuid);
                deleted.add(uuid);
            } catch (ResponseStatusException e) {
                log.debug("Failed to delete StockResource with id: {}", uuid, e);
            }
        }

        log.info("Successfully deleted {} StockResources", deleted.size());
        return deleted;
    }

    // =============================================
    // Private helpers
    // =============================================

    /**
     * Apply field updates to a StockResource entity from a map of field values.
     * Only fields present in the data map will be updated.
     */
    private void applyFieldUpdates(StockResource stockResource, Map<String, Object> fields) {
        log.trace("Applying {} field updates to StockResource", fields.size());

        if (fields.containsKey("name")) {
            String name = (String) fields.get("name");
            stockResource.setName(name);
            log.trace("Updated name field to: {}", name);
        }

        log.debug("Field update completed for StockResource");
    }

    /**
     * Build a Specification for querying StockResources based on filter criteria.
     * Filters are expected in the format: "fieldName.filterType"
     */
    private Specification<StockResource> buildSpecificationFromFilters(Map<String, String> filters) {
        log.trace("Building specification from {} filters", filters.size());

        Specification<StockResource> spec = Specification.unrestricted();

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            int lastDotIndex = key.lastIndexOf('.');

            if (lastDotIndex < 0 || lastDotIndex == key.length() - 1) {
                log.warn("Invalid filter format: {}", key);
                continue;
            }

            String field = key.substring(0, lastDotIndex);
            FilterType filterType = FilterType.fromCode(key.substring(lastDotIndex + 1));

            if (filterType == null) {
                log.warn("Unsupported filter type for key: {}", key);
                continue;
            }

            log.trace("Adding filter - field: {}, type: {}, value: {}", field, filterType, entry.getValue());

            spec = spec.and((root, _, cb) -> {
                if (filterType == FilterType.EQUAL)
                    return cb.equal(root.get(field), entry.getValue());
                if (filterType == FilterType.NOT_EQUAL)
                    return cb.notEqual(root.get(field), entry.getValue());
                if (filterType == FilterType.GREATER_THAN_OR_EQUAL)
                    return cb.greaterThanOrEqualTo(root.get(field), entry.getValue());
                if (filterType == FilterType.LESS_THAN_OR_EQUAL)
                    return cb.lessThanOrEqualTo(root.get(field), entry.getValue());
                if (filterType == FilterType.LIKE)
                    return cb.like(root.get(field), "%" + entry.getValue() + "%");

                log.error("Unsupported filter type: {}", filterType);
                throw new IllegalArgumentException("Unsupported filter type: " + filterType);
            });
        }

        log.debug("Specification built with {} filter conditions", filters.size());
        return spec;
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }
}
