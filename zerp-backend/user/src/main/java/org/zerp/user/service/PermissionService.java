package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.user.permission.PermissionPermissionEvaluator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class PermissionService implements IResourceService<Permission, Permission, Permission, Permission, Long> {
    private final PermissionRepository repository;
    private final PermissionPermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<Permission> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = resolveCurrentUserId();

        Specification<Permission> spec = buildSpecificationFromFilters(filters);
        spec = permissionEvaluator.filterRead(userId).and(spec);

        try {
            return repository.findAll(spec, pageable);
        } catch (DataAccessException e) {
            if (e.getCause() instanceof FilterError.Runtime fe) {
                log.warn("Filter error while processing filters {}: {}", filters, fe.getMessage(), e);
                throw FilterErrorUtils.toResponseStatusException(fe.getError());
            }
            log.error("Unexpected error while processing filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            log.error("Unexpected error while processing filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter parameters: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permission> findAllById(List<Long> ids) {
        UUID userId = resolveCurrentUserId();
        List<Permission> result = new ArrayList<>();

        Map<Long, Permission> permissionById = new HashMap<>();
        repository.findAllById(ids).forEach(permission -> permissionById.put(permission.getId(), permission));

        for (Long id : ids) {
            Permission permission = permissionById.get(id);
            if (permission != null && permissionEvaluator.canRead(userId, toTarget(permission))) {
                result.add(permission);
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Permission findById(Long id) {
        UUID userId = resolveCurrentUserId();
        Permission permission = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found"));

        if (!permissionEvaluator.canRead(userId, toTarget(permission))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Permission");
        }

        return permission;
    }

    @Override
    @Transactional
    public Permission create(Permission data) {
        UUID userId = resolveCurrentUserId();
        validateRequiredFields(data);

        if (!permissionEvaluator.canCreate(userId, toDraft(data))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Permission");
        }

        Permission toSave = Permission.builder()
                .userId(data.getUserId())
                .targetType(data.getTargetType())
                .targetId(data.getTargetId())
                .action(data.getAction())
                .build();

        return repository.save(toSave);
    }

    @Override
    @Transactional
    public Permission patch(Long id, Map<String, Object> fields) {
        UUID userId = resolveCurrentUserId();
        Permission existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found"));

        applyFieldUpdates(existing, fields);
        validateRequiredFields(existing);

        if (!permissionEvaluator.canPatch(userId, toTarget(existing))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Permission");
        }

        return repository.save(existing);
    }

    @Override
    @Transactional
    public Permission update(Long id, Permission data) {
        UUID userId = resolveCurrentUserId();
        Permission existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found"));

        validateRequiredFields(data);

        if (!permissionEvaluator.canUpdate(userId, toTarget(existing.getId(), data))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Permission");
        }

        existing.setUserId(data.getUserId());
        existing.setTargetType(data.getTargetType());
        existing.setTargetId(data.getTargetId());
        existing.setAction(data.getAction());

        return repository.save(existing);
    }

    @Override
    @Transactional
    public List<Long> patchMany(List<Long> ids, Map<String, Object> fields) {
        UUID userId = resolveCurrentUserId();
        List<Long> updated = new ArrayList<>();

        Map<Long, Permission> existingById = new HashMap<>();
        repository.findAllById(ids).forEach(permission -> existingById.put(permission.getId(), permission));

        Map<Long, Permission> toSaveById = new HashMap<>();

        for (Long id : ids) {
            Permission existing = existingById.get(id);
            if (existing == null) {
                log.debug("Skipping patch for permission id {}", id);
                continue;
            }

            try {
                applyFieldUpdates(existing, fields);
                validateRequiredFields(existing);

                if (!permissionEvaluator.canPatch(userId, toTarget(existing))) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Permission");
                }

                updated.add(id);
                toSaveById.put(id, existing);
            } catch (ResponseStatusException e) {
                log.debug("Skipping patch for permission id {}", id, e);
            }
        }

        if (!toSaveById.isEmpty()) {
            repository.saveAll(toSaveById.values());
        }

        return updated;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        UUID userId = resolveCurrentUserId();
        Permission existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found"));

        if (!permissionEvaluator.canDelete(userId, toTarget(existing))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Permission");
        }

        repository.delete(existing);
    }

    @Override
    @Transactional
    public List<Long> deleteMany(List<Long> ids) {
        UUID userId = resolveCurrentUserId();
        List<Long> deleted = new ArrayList<>();

        Map<Long, Permission> existingById = new HashMap<>();
        repository.findAllById(ids).forEach(permission -> existingById.put(permission.getId(), permission));

        List<Permission> toDelete = new ArrayList<>();
        Set<Long> scheduledIds = new HashSet<>();

        for (Long id : ids) {
            Permission existing = existingById.get(id);
            if (existing == null) {
                log.debug("Permission not found. Skipping delete for permission id {}", id);
                continue;
            }

            if (!permissionEvaluator.canDelete(userId, toTarget(existing))) {
                log.warn("Skipping delete for permission id {} due to user is not permitted", id);
                continue;
            }

            // Preserve prior duplicate-id behavior: same id is deleted/reported once.
            if (scheduledIds.add(id)) {
                toDelete.add(existing);
                deleted.add(id);
            }
        }

        if (!toDelete.isEmpty()) {
            repository.deleteAll(toDelete);
        }

        return deleted;
    }

    public List<PermissionAction> getAllPermissions() {
        if (!permissionEvaluator.canReadPermissionActions(resolveCurrentUserId())) {
            log.warn("User {} attempted to read Permission actions without sufficient permissions",
                    resolveCurrentUserId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You don't have permission to read Permission actions");
        }
        return List.of(PermissionAction.values());
    }

    private void validateRequiredFields(Permission permission) {
        if (permission == null
                || permission.getUserId() == null
                || permission.getTargetType() == null
                || permission.getTargetId() == null
                || permission.getAction() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "userId, targetType, targetId and action are required");
        }
    }

    private void applyFieldUpdates(Permission permission, Map<String, Object> fields) {
        if (fields.containsKey("userId") && fields.get("userId") != null) {
            permission.setUserId(parseUuidOrBadRequest("userId", fields.get("userId").toString()));
        }
        if (fields.containsKey("targetType") && fields.get("targetType") != null) {
            permission.setTargetType(parseTargetTypeOrBadRequest(fields.get("targetType").toString()));
        }
        if (fields.containsKey("targetId") && fields.get("targetId") != null) {
            permission.setTargetId(parseUuidOrBadRequest("targetId", fields.get("targetId").toString()));
        }
        if (fields.containsKey("action") && fields.get("action") != null) {
            permission.setAction(parseActionOrBadRequest(fields.get("action").toString()));
        }
    }

    private Specification<Permission> buildSpecificationFromFilters(Map<String, String> filters) {
        log.debug("Building specification from filters: {}", filters);
        Specification<Permission> spec = filterRefiner.refinedOrBadRequest(filters, Permission.class);
        log.debug("Built specification from filters: {}, spec: {}", filters, spec);
        return spec;
    }

    private PermissionAction parseActionOrBadRequest(String rawValue) {
        try {
            return PermissionAction.valueOf(rawValue);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid action value");
        }
    }

    private PermissionTargetType parseTargetTypeOrBadRequest(String rawValue) {
        try {
            return PermissionTargetType.valueOf(rawValue);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid target type value");
        }
    }

    private UUID parseUuidOrBadRequest(String fieldName, String rawValue) {
        try {
            return UUID.fromString(rawValue);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid UUID format for " + fieldName
            );
        }
    }

    private PermissionPermissionEvaluator.PermissionTarget toTarget(Permission permission) {
        return new PermissionPermissionEvaluator.PermissionTarget(
                permission.getId(),
                permission.getUserId(),
                permission.getTargetType(),
                permission.getTargetId(),
                permission.getAction()
        );
    }

    private PermissionPermissionEvaluator.PermissionTarget toTarget(Long id, Permission permission) {
        return new PermissionPermissionEvaluator.PermissionTarget(
                id,
                permission.getUserId(),
                permission.getTargetType(),
                permission.getTargetId(),
                permission.getAction()
        );
    }

    private PermissionPermissionEvaluator.PermissionDraft toDraft(Permission permission) {
        return new PermissionPermissionEvaluator.PermissionDraft(
                permission.getUserId(),
                permission.getTargetType(),
                permission.getTargetId(),
                permission.getAction()
        );
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }
}
