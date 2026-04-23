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
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:stockResourceId IS NOT NULL AND p.targetType = 'STOCK_RESOURCE' AND p.targetId = :stockResourceId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                )
            """)
    List<Permission> findAllByUserAndStockResourceHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("stockResourceId") UUID stockResourceId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:employeeId IS NOT NULL AND p.targetType = 'EMPLOYEE' AND p.targetId = :employeeId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                )
            """)
    List<Permission> findAllByUserAndEmployeeHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("employeeId") UUID employeeId,
            @Param("tenantId") UUID tenantId
    );

    @Query("SELECT p.targetId FROM Permission p " +
            "WHERE p.userId = :userId AND p.targetType = :type AND p.action = :action")
    List<UUID> findTargetIdsByUserAndTargetTypeAndAction(@Param("userId") UUID userId,
                                                         @Param("type") PermissionTargetType type,
                                                         @Param("action") PermissionAction action);
}
