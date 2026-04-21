package org.zerp.common.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.List;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    @Query("""
            SELECT p FROM Permission p
              WHERE p.employeeId = :employeeId
                AND p.action = :action
                AND (
                     (:stockResourceId IS NOT NULL AND p.targetType = 'STOCK_RESOURCE' AND p.targetId = :stockResourceId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                )
            """)
    List<Permission> findAllByUserAndStockResourceHierarchy(
            @Param("employeeId") Long employeeId,
            @Param("action") PermissionAction action,
            @Param("stockResourceId") UUID stockResourceId,
            @Param("tenantId") UUID tenantId
    );

    @Query("SELECT p.targetId FROM Permission p " +
            "WHERE p.employeeId = :employeeId AND p.targetType = :type AND p.action = :action")
    List<UUID> findTargetIdsByUserAndTargetTypeAndAction(@Param("employeeId") Long employeeId,
                                                         @Param("type") PermissionTargetType type,
                                                         @Param("action") PermissionAction action);
}
