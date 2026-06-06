package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.Permittable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.repository.PermittableRepository;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.user.dto.permittable.PermittableResponseDTO;
import org.zerp.user.dto.permittable.PermittableTreeNodeDTO;
import org.zerp.user.permission.PermittablePermissionEvaluator;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class PermittableService
        implements IResourceService<PermittableResponseDTO, PermittableResponseDTO, Void, Void, UUID> {
    private final PermittableRepository permittableRepository;
    private final PermissionRepository permissionRepository;
    private final FilterRefiner filterRefiner;
    private final PermittablePermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver currentUserIdResolver;

    @Override
    public Page<PermittableResponseDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = currentUserIdResolver.resolve();
        String targetTypeStr = filters.get("targetType");
        if (targetTypeStr == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetType filter is required");
        }

        PermissionTargetType targetType;
        try {
            targetType = PermissionTargetType.valueOf(targetTypeStr);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid targetType: " + targetTypeStr);
        }

        // Remove targetType from filters before passing to FilterRefiner to avoid mapping errors
        Map<String, String> entityFilters = new HashMap<>(filters);
        entityFilters.remove("targetType");

        // Handle parentId filter if present
        if (entityFilters.containsKey("parentId")) {
            String parentId = entityFilters.remove("parentId");
            if (targetType.parentIdFilter != null) {
                entityFilters.put(targetType.parentIdFilter, parentId);
            }
        }

        Class<?> entityClass = permittableRepository.getTargetTypeToEntityClass().get(targetType);
        if (entityClass == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No entity mapped to targetType: " + targetType);
        }

        Page<Permittable> page = fetchWithSecurity(targetType, entityClass, entityFilters, userId, pageable);

        List<PermittableResponseDTO> dtos = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    private <T> Page<Permittable> fetchWithSecurity(PermissionTargetType targetType, Class<T> entityClass, Map<String, String> filters, UUID userId, Pageable pageable) {
        Specification<T> spec = filterRefiner.refinedOrBadRequest(filters, entityClass);
        spec = spec.and(permissionEvaluator.filterRead(userId));
        return permittableRepository.findAllByTargetType(targetType, spec, pageable);
    }

    @Override
    public List<PermittableResponseDTO> findAllById(List<UUID> ids) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO findById(UUID id) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO create(Void data) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO patch(UUID id, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO update(UUID id, Void data) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public void deleteById(UUID id) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public List<UUID> deleteMany(List<UUID> ids) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    private PermittableResponseDTO toDTO(Permittable permittable) {
        if (permittable == null) return null;
        return PermittableResponseDTO.builder()
                .id(permittable.getId())
                .title(permittable.getTitle())
                .targetType(PermissionTargetType.fromType(permittable))
                .build();
    }

    /**
     * Builds the full permission tree for the current user.
     *
     * <p>Algorithm (2 + N DB round-trips, no N+1):
     * <ol>
     *   <li>Load all {@link Permission} rows for the user — 1 query.</li>
     *   <li>Group by targetType; for each type bulk-load the actual
     *       {@link Permittable} entities whose IDs appear in the permissions
     *       — 1 query per distinct targetType.</li>
     *   <li>Walk {@link Permittable#getParent()} upward from every loaded node
     *       to collect ancestor nodes needed to keep the tree connected.
     *       Ancestors that the user has no explicit permission on will appear
     *       in the tree with an empty {@code actions} set.</li>
     *   <li>Build the nested {@link PermittableTreeNodeDTO} structure in-memory.</li>
     * </ol>
     */
    public PermittableTreeNodeDTO getPermittableTree() {
        UUID userId = currentUserIdResolver.resolve();

        // ── Step 1: load all permission rows for the user ────────────────────
        List<Permission> permissions = permissionRepository.findAllByUserId(userId);

        // Build a map: nodeId → Set<PermissionAction> (direct grants only)
        Map<UUID, Set<PermissionAction>> directActions = new HashMap<>();
        // Also group targetIds by targetType so we can bulk-load entities
        Map<PermissionTargetType, Set<UUID>> idsByType = new HashMap<>();

        for (Permission p : permissions) {
            directActions
                    .computeIfAbsent(p.getTargetId(), _ -> new LinkedHashSet<>())
                    .add(p.getAction());
            idsByType
                    .computeIfAbsent(p.getTargetType(), _ -> new LinkedHashSet<>())
                    .add(p.getTargetId());
        }

        // ── Step 2: bulk-load Permittable entities per targetType ────────────
        // allNodes: id → Permittable entity (directly permitted nodes only for now)
        // nodeTargetTypes: id → PermissionTargetType (avoids reflection on JPA proxies later)
        Map<UUID, Permittable> allNodes = new LinkedHashMap<>();
        Map<UUID, PermissionTargetType> nodeTargetTypes = new HashMap<>();
        for (Map.Entry<PermissionTargetType, Set<UUID>> entry : idsByType.entrySet()) {
            List<Permittable> entities =
                    permittableRepository.findAllByTargetTypeAndIds(entry.getKey(), entry.getValue());
            for (Permittable entity : entities) {
                allNodes.put(entity.getId(), entity);
                // We already know the type from the map key — safe, no proxy issue
                nodeTargetTypes.put(entity.getId(), entry.getKey());
            }
        }

        // ── Step 3: walk getParent() to collect ancestor nodes ───────────────
        // We iterate a work-list so ancestors of ancestors are also included.
        Set<UUID> visited = new HashSet<>(allNodes.keySet());
        Deque<Permittable> workList = new ArrayDeque<>(allNodes.values());

        while (!workList.isEmpty()) {
            Permittable node = workList.poll();
            Permittable parent = node.getParent();
            if (parent == null || visited.contains(parent.getId())) {
                continue;
            }
            visited.add(parent.getId());
            allNodes.put(parent.getId(), parent);
            // Resolve type via annotation walk-up — safe against Hibernate CGLIB proxies
            // whose getClass() returns a generated subclass without the annotation.
            PermissionTargetType parentType = resolveTargetType(parent);
            if (parentType != null) {
                nodeTargetTypes.put(parent.getId(), parentType);
            }
            workList.add(parent);
        }

        // ── Step 4: build the nested DTO tree in-memory ──────────────────────
        // Map nodeId → its DTO (children list is mutable)
        Map<UUID, PermittableTreeNodeDTO> dtoMap = new LinkedHashMap<>();
        for (Permittable node : allNodes.values()) {
            // Use the pre-resolved type map — never call fromType(node.getClass()) here
            // because ancestor nodes may be Hibernate proxy instances.
            PermissionTargetType targetType = nodeTargetTypes.get(node.getId());
            if (targetType == null) {
                log.warn("Could not resolve PermissionTargetType for node id={}, skipping", node.getId());
                continue;
            }
            dtoMap.put(node.getId(), PermittableTreeNodeDTO.builder()
                    .id(node.getId())
                    .title(node.getTitle())
                    .targetType(targetType)
                    .actions(directActions.getOrDefault(node.getId(), Collections.emptySet()))
                    .children(new ArrayList<>())
                    .build());
        }

        // Wire children to parents; find the single root (parent absent from tree = TENANT_ROOT)
        PermittableTreeNodeDTO root = null;
        for (Permittable node : allNodes.values()) {
            PermittableTreeNodeDTO dto = dtoMap.get(node.getId());
            if (dto == null) continue; // skipped in step 4 due to unresolved type
            Permittable parent = node.getParent();
            if (parent != null && dtoMap.containsKey(parent.getId())) {
                dtoMap.get(parent.getId()).getChildren().add(dto);
            } else {
                if (root != null) {
                    log.warn("Multiple root nodes found in permission tree for user {}. " +
                                    "Expected exactly one (TENANT_ROOT). Extra root: id={}, type={}",
                            userId, dto.getId(), dto.getTargetType());
                } else {
                    root = dto;
                }
            }
        }

        return root;
    }

    /**
     * Resolves the {@link PermissionTargetType} for a {@link Permittable} node by
     * walking up the class hierarchy until {@link PermissionTargetTypeAnnotation} is found.
     * <p>
     * This is necessary because JPA/Hibernate may return CGLIB proxy objects whose
     * {@code getClass()} returns a generated subclass that does <em>not</em> carry the
     * annotation directly. Walking to {@code getSuperclass()} reaches the real entity class.
     *
     * @return the resolved type, or {@code null} if not found (should not happen for
     * well-annotated entities)
     */
    private PermissionTargetType resolveTargetType(Permittable node) {
        Class<?> clazz = node.getClass();
        while (clazz != null && clazz != Object.class) {
            PermissionTargetTypeAnnotation ann = clazz.getAnnotation(PermissionTargetTypeAnnotation.class);
            if (ann != null) {
                return ann.type();
            }
            clazz = clazz.getSuperclass();
        }
        log.warn("Could not find @PermissionTargetTypeAnnotation on {} or any superclass", node.getClass().getName());
        return null;
    }
}
