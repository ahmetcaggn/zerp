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
    /**
     * Returns every {@link Permission} row that belongs to the given user,
     * across all target types and target IDs. Used to build the full
     * permission tree for a user in a single query.
     */
    @Query("SELECT p FROM Permission p WHERE p.userId = :userId")
    List<Permission> findAllByUserId(@Param("userId") UUID userId);

    List<Permission> findAllByUserIdAndTargetTypeAndActionAndTargetId(
            UUID userId,
            PermissionTargetType targetType,
            PermissionAction action,
            UUID targetId
    );

    @Query("""
            SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END FROM Permission p
                  WHERE p.userId = :userId
                    AND p.action = 'ADMIN'
                    AND p.targetType = 'TENANT'
                    AND p.targetId = :tenantId
            """)
    Boolean existsAdminByUserIdAndTenantId(
            @Param("userId") UUID userId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END FROM Permission p
                  WHERE p.userId = :userId
                    AND p.action = 'ADMIN'
                    AND p.targetType = 'TENANT_ROOT'
                    AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID}
            """)
    Boolean existsAdminByUserIdOnTenantRoot(
            @Param("userId") UUID userId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:targetUserId IS NOT NULL AND p.targetType = 'USER' AND p.targetId = :targetUserId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndUserHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("targetUserId") UUID targetUserId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:stockResourceId IS NOT NULL AND p.targetType = 'STOCK_RESOURCE' AND p.targetId = :stockResourceId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndStockResourceHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("stockResourceId") UUID stockResourceId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:employeeId IS NOT NULL AND p.targetType = 'EMPLOYEE' AND p.targetId = :employeeId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
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
                AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID}
            """)
    List<Permission> findAllByUserAndTenantRootPermission(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:ticketId IS NOT NULL AND p.targetType = 'TICKET' AND p.targetId = :ticketId)
                  OR (:assignedTeamId IS NOT NULL AND p.targetType = 'TEAM' AND p.targetId = :assignedTeamId)
                  OR (:assignedAgentId IS NOT NULL AND p.targetType = 'USER' AND p.targetId = :assignedAgentId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndTicketHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("ticketId") UUID ticketId,
            @Param("assignedTeamId") UUID assignedTeamId,
            @Param("assignedAgentId") UUID assignedAgentId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:teamId IS NOT NULL AND p.targetType = 'TEAM' AND p.targetId = :teamId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndTeamHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("teamId") UUID teamId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:teamMemberId IS NOT NULL AND p.targetType = 'TEAM_MEMBER' AND p.targetId = :teamMemberId)
                  OR (:teamId IS NOT NULL AND p.targetType = 'TEAM' AND p.targetId = :teamId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndTeamMemberHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("teamMemberId") UUID teamMemberId,
            @Param("teamId") UUID teamId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:childId IS NOT NULL AND p.targetType = :childType AND p.targetId = :childId)
                  OR (:ticketId IS NOT NULL AND p.targetType = 'TICKET' AND p.targetId = :ticketId)
                  OR (:assignedTeamId IS NOT NULL AND p.targetType = 'TEAM' AND p.targetId = :assignedTeamId)
                  OR (:assignedAgentId IS NOT NULL AND p.targetType = 'USER' AND p.targetId = :assignedAgentId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndTicketChildHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("childType") PermissionTargetType childType,
            @Param("childId") UUID childId,
            @Param("ticketId") UUID ticketId,
            @Param("assignedTeamId") UUID assignedTeamId,
            @Param("assignedAgentId") UUID assignedAgentId,
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
                  OR (:assignedTeamId IS NOT NULL AND p.targetType = 'TEAM' AND p.targetId = :assignedTeamId)
                  OR (:assignedAgentId IS NOT NULL AND p.targetType = 'USER' AND p.targetId = :assignedAgentId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndTicketAttachmentHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("attachmentId") UUID attachmentId,
            @Param("commentId") UUID commentId,
            @Param("ticketId") UUID ticketId,
            @Param("assignedTeamId") UUID assignedTeamId,
            @Param("assignedAgentId") UUID assignedAgentId,
            @Param("tenantId") UUID tenantId
    );

    @Query("SELECT p.targetId FROM Permission p " +
            "WHERE p.userId = :userId AND p.targetType = :type AND p.action = :action")
    List<UUID> findTargetIdsByUserAndTargetTypeAndAction(@Param("userId") UUID userId,
                                                         @Param("type") PermissionTargetType type,
                                                         @Param("action") PermissionAction action);

    @Query("""
            SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END FROM Permission p
              WHERE p.userId = :userId
                AND p.targetType = :type
                AND p.action = :action
                AND p.targetId = :targetId
            """)
    boolean existsByUserAndTargetTypeAndActionAndTargetId(@Param("userId") UUID userId,
                                                          @Param("type") PermissionTargetType type,
                                                          @Param("action") PermissionAction action,
                                                          @Param("targetId") UUID targetId);

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:stockCountId IS NOT NULL AND p.targetType = 'STOCK_COUNT' AND p.targetId = :stockCountId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndStockCountHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("stockCountId") UUID stockCountId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:stockMovementId IS NOT NULL AND p.targetType = 'STOCK_MOVEMENT' AND p.targetId = :stockMovementId)
                  OR (:stockResourceId IS NOT NULL AND p.targetType = 'STOCK_RESOURCE' AND p.targetId = :stockResourceId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndStockMovementHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("stockMovementId") UUID stockMovementId,
            @Param("stockResourceId") UUID stockResourceId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:productId IS NOT NULL AND p.targetType = 'PRODUCT' AND p.targetId = :productId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndProductHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("productId") UUID productId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:recipeId IS NOT NULL AND p.targetType = 'PRODUCT_RECIPE' AND p.targetId = :recipeId)
                  OR (:productId IS NOT NULL AND p.targetType = 'PRODUCT' AND p.targetId = :productId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndProductRecipeHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("recipeId") UUID recipeId,
            @Param("productId") UUID productId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:extraOptionId IS NOT NULL AND p.targetType = 'PRODUCT_EXTRA_OPTION' AND p.targetId = :extraOptionId)
                  OR (:productId IS NOT NULL AND p.targetType = 'PRODUCT' AND p.targetId = :productId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndProductExtraOptionHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("extraOptionId") UUID extraOptionId,
            @Param("productId") UUID productId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:menuId IS NOT NULL AND p.targetType = 'MENU' AND p.targetId = :menuId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndMenuHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("menuId") UUID menuId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:categoryId IS NOT NULL AND p.targetType = 'MENU_CATEGORY' AND p.targetId = :categoryId)
                  OR (:menuId IS NOT NULL AND p.targetType = 'MENU' AND p.targetId = :menuId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndMenuCategoryHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("categoryId") UUID categoryId,
            @Param("menuId") UUID menuId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:itemId IS NOT NULL AND p.targetType = 'MENU_ITEM' AND p.targetId = :itemId)
                  OR (:categoryId IS NOT NULL AND p.targetType = 'MENU_CATEGORY' AND p.targetId = :categoryId)
                  OR (:menuId IS NOT NULL AND p.targetType = 'MENU' AND p.targetId = :menuId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndMenuItemHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("itemId") UUID itemId,
            @Param("categoryId") UUID categoryId,
            @Param("menuId") UUID menuId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndShopHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:tableId IS NOT NULL AND p.targetType = 'SHOP_TABLE' AND p.targetId = :tableId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndShopTableHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("tableId") UUID tableId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );

    @Query("""
            SELECT p FROM Permission p
              WHERE p.userId = :userId
                AND p.action = :action
                AND (
                     (:orderId IS NOT NULL AND p.targetType = 'TABLE_ORDER' AND p.targetId = :orderId)
                  OR (:tableId IS NOT NULL AND p.targetType = 'SHOP_TABLE' AND p.targetId = :tableId)
                  OR (:shopId IS NOT NULL AND p.targetType = 'SHOP' AND p.targetId = :shopId)
                  OR (:tenantId IS NOT NULL AND p.targetType = 'TENANT' AND p.targetId = :tenantId)
                  OR (p.targetType = 'TENANT_ROOT' AND p.targetId = :#{T(org.zerp.common.entity.TenantRoot).ID})
                )
            """)
    List<Permission> findAllByUserAndTableOrderHierarchy(
            @Param("userId") UUID userId,
            @Param("action") PermissionAction action,
            @Param("orderId") UUID orderId,
            @Param("tableId") UUID tableId,
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId
    );
}
