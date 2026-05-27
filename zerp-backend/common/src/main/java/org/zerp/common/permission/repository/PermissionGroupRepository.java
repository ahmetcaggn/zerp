package org.zerp.common.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.PermissionGroup;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionGroupRepository extends JpaRepository<PermissionGroup, UUID> {
    List<PermissionGroup> findAllByTenantIdOrderByNameAsc(UUID tenantId);

    Optional<PermissionGroup> findByIdAndTenantId(UUID id, UUID tenantId);

    @Query("""
            SELECT CASE WHEN COUNT(pg) > 0 THEN TRUE ELSE FALSE END
            FROM PermissionGroup pg
            WHERE pg.tenantId = :tenantId
              AND LOWER(pg.name) = LOWER(:name)
              AND (:excludedId IS NULL OR pg.id <> :excludedId)
            """)
    boolean existsByTenantIdAndNameIgnoreCase(
            @Param("tenantId") UUID tenantId,
            @Param("name") String name,
            @Param("excludedId") UUID excludedId
    );
}
