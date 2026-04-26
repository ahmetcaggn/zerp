package org.zerp.common.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.List;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
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

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND p.targetType = 'TENANT_ROOT'
                AND p.targetId = :tenantRootId
            """)
    List<Permission> findAllByUserAndTenantRootPermission(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("tenantRootId") UUID tenantRootId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:ticketId IS NOT NULL AND p.targetType = 'TICKET' AND p.targetId = :ticketId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                )
            """)
    List<Permission> findAllByUserAndTicketHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("ticketId") UUID ticketId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:teamId IS NOT NULL AND p.targetType = 'TEAM' AND p.targetId = :teamId)
                  OR (:tenantRootId IS NOT NULL AND p.targetType = 'TENANT_ROOT' AND p.targetId = :tenantRootId)
                )
            """)
    List<Permission> findAllByUserAndTeamHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("teamId") UUID teamId,
            @Param("tenantRootId") UUID tenantRootId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:teamMemberId IS NOT NULL AND p.targetType = 'TEAM_MEMBER' AND p.targetId = :teamMemberId)
                  OR (:teamId IS NOT NULL AND p.targetType = 'TEAM' AND p.targetId = :teamId)
                  OR (:tenantRootId IS NOT NULL AND p.targetType = 'TENANT_ROOT' AND p.targetId = :tenantRootId)
                )
            """)
    List<Permission> findAllByUserAndTeamMemberHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("teamMemberId") UUID teamMemberId,
            @Param("teamId") UUID teamId,
            @Param("tenantRootId") UUID tenantRootId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:childId IS NOT NULL AND p.targetType = :childType AND p.targetId = :childId)
                  OR (:ticketId IS NOT NULL AND p.targetType = 'TICKET' AND p.targetId = :ticketId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                )
            """)
    List<Permission> findAllByUserAndTicketChildHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("childType") PermissionTargetType childType,
            @Param("childId") UUID childId,
            @Param("ticketId") UUID ticketId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:attachmentId IS NOT NULL AND p.targetType = 'TICKET_ATTACHMENT' AND p.targetId = :attachmentId)
                  OR (:commentId IS NOT NULL AND p.targetType = 'TICKET_COMMENT' AND p.targetId = :commentId)
                  OR (:ticketId IS NOT NULL AND p.targetType = 'TICKET' AND p.targetId = :ticketId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                )
            """)
    List<Permission> findAllByUserAndTicketAttachmentHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("attachmentId") UUID attachmentId,
            @Param("commentId") UUID commentId,
            @Param("ticketId") UUID ticketId,
            @Param("tenantId") UUID tenantId
    );

    @Query("SELECT p.targetId FROM Permission p " +
            "WHERE p.userId = :userId AND p.targetType = :type AND p.action = :action")
    List<UUID> findTargetIdsByUserAndTargetTypeAndAction(@Param("userId") UUID userId,
                                                         @Param("type") PermissionTargetType type,
                                                         @Param("action") PermissionAction action);
}
