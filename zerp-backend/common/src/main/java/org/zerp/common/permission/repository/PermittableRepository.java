package org.zerp.common.permission.repository;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.criteria.Selection;
import jakarta.persistence.metamodel.EntityType;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.Permittable;

import org.zerp.common.entity.TenantRoot;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Log4j2
@Repository
@RequiredArgsConstructor
public class PermittableRepository {
    private final EntityManager entityManager;
    @lombok.Getter
    private final Map<PermissionTargetType, Class<?>> targetTypeToEntityClass = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        for (EntityType<?> entityType : entityManager.getMetamodel().getEntities()) {
            Class<?> javaType = entityType.getJavaType();
            PermissionTargetTypeAnnotation annotation = javaType.getDeclaredAnnotation(PermissionTargetTypeAnnotation.class);
            if (annotation != null) {
                targetTypeToEntityClass.put(annotation.type(), javaType);
            }
        }
        targetTypeToEntityClass.put(PermissionTargetType.TENANT_ROOT, TenantRoot.class);
    }

    /**
     * Resolves the tenantId of an entity mapped to the given PermissionTargetType.
     * Only searches classes that map to a tracked Permittable entity in the runtime.
     *
     * @param id         the entity ID
     * @param targetType the conceptual PermissionTargetType boundary
     * @return the resolved tenant ID if the entity exists and contains one
     */
    public Optional<UUID> findTenantIdByIdAndTargetType(UUID id, PermissionTargetType targetType) {
        if (targetType == PermissionTargetType.TENANT_ROOT) {
            return Optional.empty();
        }

        Class<?> entityClass = targetTypeToEntityClass.get(targetType);

        if (entityClass == null || !BaseEntity.class.isAssignableFrom(entityClass)) {
            log.debug("Entity class not found or does not contain tenant information for target type: {}", targetType);
            return Optional.empty();
        }

        try {
            var cb = entityManager.getCriteriaBuilder();
            var query = cb.createQuery(UUID.class);
            var root = query.from(entityClass);

            query.select(root.get("tenantId"))
                    .where(cb.equal(root.get("id"), id));

            UUID tenantId = entityManager.createQuery(query).getSingleResult();
            return Optional.ofNullable(tenantId);
        } catch (NoResultException e) {
            log.debug("No entity found for tenant_id resolution with id {} in {}", id, entityClass.getSimpleName());
            return Optional.empty();
        } catch (Exception e) {
            log.error("Failed to resolve tenant_id for {} with id {}: {}", entityClass.getSimpleName(), id, e.getMessage());
            return Optional.empty();
        }
    }

    @SuppressWarnings("unchecked")
    public Page<Permittable> findAllByTargetType(
            PermissionTargetType targetType,
            @SuppressWarnings("rawtypes") Specification spec,
            Pageable pageable) {
        if (targetType == PermissionTargetType.TENANT_ROOT) {
            return new PageImpl<>(List.of(TenantRoot.INSTANCE), pageable, 1);
        }
        Class<?> entityClass = targetTypeToEntityClass.get(targetType);
        if (entityClass == null || !Permittable.class.isAssignableFrom(entityClass)) {
            return Page.empty();
        }

        try {
            var cb = entityManager.getCriteriaBuilder();

            // Count query
            var countQuery = cb.createQuery(Long.class);
            var countRoot = countQuery.from(entityClass);
            countQuery.select(cb.count(countRoot));
            if (spec != null) {
                countQuery.where(spec.toPredicate(countRoot, countQuery, cb));
            }
            Long total = entityManager.createQuery(countQuery).getSingleResult();

            // Data query
            var query = cb.createQuery(entityClass);
            var root = query.from(entityClass);
            //noinspection rawtypes
            query.select((Selection) root);

            if (spec != null) {
                query.where(spec.toPredicate(root, query, cb));
            }

            // Apply sorting from pageable
            if (pageable.getSort().isSorted()) {
                List<jakarta.persistence.criteria.Order> orders = new ArrayList<>();
                pageable.getSort().forEach(order -> {
                    if (order.isAscending()) {
                        orders.add(cb.asc(root.get(order.getProperty())));
                    } else {
                        orders.add(cb.desc(root.get(order.getProperty())));
                    }
                });
                query.orderBy(orders);
            }

            List<Permittable> results = (List<Permittable>) entityManager.createQuery(query)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(pageable.getPageSize())
                    .getResultList();

            return new PageImpl<>(results, pageable, total);
        } catch (Exception e) {
            log.error("Failed to query permittables for type {}: {}", targetType, e.getMessage());
            return Page.empty();
        }
    }

    /**
     * Bulk-loads {@link Permittable} entities of a given {@link PermissionTargetType}
     * whose IDs are in the provided collection.
     * <p>
     * Returns an empty list if the targetType is not mapped to any entity class,
     * or if the mapped class does not implement {@link Permittable}.
     *
     * @param targetType the permission target type to look up
     * @param ids        the set of entity IDs to fetch
     * @return the matching Permittable entities in an unspecified order
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public List<Permittable> findAllByTargetTypeAndIds(
            PermissionTargetType targetType,
            Collection<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        if (targetType == PermissionTargetType.TENANT_ROOT) {
            if (ids.contains(TenantRoot.ID)) {
                return List.of(TenantRoot.INSTANCE);
            }
            return Collections.emptyList();
        }
        Class<?> entityClass = targetTypeToEntityClass.get(targetType);
        if (entityClass == null || !Permittable.class.isAssignableFrom(entityClass)) {
            log.debug("No Permittable entity mapped to targetType: {}", targetType);
            return Collections.emptyList();
        }

        try {
            var cb = entityManager.getCriteriaBuilder();
            var query = cb.createQuery(entityClass);
            var root = query.from(entityClass);
            query.select((Selection) root)
                    .where(root.get("id").in(ids));
            return (List<Permittable>) entityManager.createQuery(query).getResultList();
        } catch (Exception e) {
            log.error("Failed to bulk-load permittables for type {} with {} ids: {}",
                    targetType, ids.size(), e.getMessage());
            return Collections.emptyList();
        }
    }
}

