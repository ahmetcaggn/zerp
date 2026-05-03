package org.zerp.common.permission.repository;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.metamodel.EntityType;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.entity.base.BaseEntity;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Log4j2
@Repository
@RequiredArgsConstructor
public class PermittableTenantRepository {
    private final EntityManager entityManager;
    private final Map<PermissionTargetType, Class<?>> targetTypeToEntityClass = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        for (EntityType<?> entityType : entityManager.getMetamodel().getEntities()) {
            Class<?> javaType = entityType.getJavaType();
            PermissionTargetTypeAnnotation annotation = javaType.getAnnotation(PermissionTargetTypeAnnotation.class);
            if (annotation != null && BaseEntity.class.isAssignableFrom(javaType)) {
                targetTypeToEntityClass.put(annotation.type(), javaType);
            }
        }
    }

    /**
     * Resolves the tenantId of an entity mapped to the given PermissionTargetType.
     * Only searches classes that map to a tracked BaseEntity in the runtime.
     *
     * @param id         the entity ID
     * @param targetType the conceptual PermissionTargetType boundary
     * @return the resolved tenant ID if the entity exists and contains one
     */
    public Optional<UUID> findTenantIdByIdAndTargetType(UUID id, PermissionTargetType targetType) {
        Class<?> entityClass = targetTypeToEntityClass.get(targetType);

        if (entityClass == null) {
            log.debug("Entity class not found or does not extend BaseEntity for target type: {}", targetType);
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
            log.debug("No entity found with id {} for entity config {}", id, entityClass.getSimpleName());
            return Optional.empty();
        } catch (Exception e) {
            log.error("Failed to query tenant_id for {} with id {}: {}", entityClass.getSimpleName(), id, e.getMessage());
            return Optional.empty();
        }
    }
}
