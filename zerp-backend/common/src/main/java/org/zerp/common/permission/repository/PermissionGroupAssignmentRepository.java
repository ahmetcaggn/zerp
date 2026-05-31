package org.zerp.common.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.PermissionGroupAssignment;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionGroupAssignmentRepository extends JpaRepository<PermissionGroupAssignment, UUID> {
    Optional<PermissionGroupAssignment> findByTenantIdAndPermissionGroupIdAndUserIdAndTargetTypeAndTargetId(
            UUID tenantId,
            UUID permissionGroupId,
            UUID userId,
            PermissionTargetType targetType,
            UUID targetId
    );

    Optional<PermissionGroupAssignment> findByIdAndTenantId(UUID id, UUID tenantId);

    List<PermissionGroupAssignment> findAllByTenantIdAndPermissionGroupId(UUID tenantId, UUID permissionGroupId);

    List<PermissionGroupAssignment> findAllByTenantIdAndUserIdOrderByCreatedAtDesc(UUID tenantId, UUID userId);

    boolean existsByTenantIdAndPermissionGroupId(UUID tenantId, UUID permissionGroupId);
}
