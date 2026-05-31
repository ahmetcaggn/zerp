package org.zerp.common.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.PermissionGroup;
import org.zerp.common.permission.entity.PermissionGroupSource;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionGroupRepository extends JpaRepository<PermissionGroup, UUID> {
    List<PermissionGroup> findAllByTenantIdAndSourceOrderByNameAsc(UUID tenantId, PermissionGroupSource source);

    @Query("""
            SELECT pg
            FROM PermissionGroup pg
            WHERE pg.tenantId = :tenantId
              AND (pg.source IS NULL OR pg.source = org.zerp.common.permission.entity.PermissionGroupSource.CUSTOM)
            ORDER BY pg.name ASC
            """)
    List<PermissionGroup> findCustomByTenantIdOrderByNameAsc(@Param("tenantId") UUID tenantId);

    Optional<PermissionGroup> findByIdAndTenantId(UUID id, UUID tenantId);

    Optional<PermissionGroup> findByTenantIdAndSourceAndCode(
            UUID tenantId,
            PermissionGroupSource source,
            PredefinedPermissionGroupCode code
    );

    Optional<PermissionGroup> findByTenantIdAndCode(UUID tenantId, PredefinedPermissionGroupCode code);

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
