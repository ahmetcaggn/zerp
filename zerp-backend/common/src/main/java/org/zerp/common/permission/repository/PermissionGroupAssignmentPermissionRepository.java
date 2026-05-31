package org.zerp.common.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionGroupAssignmentPermission;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionGroupAssignmentPermissionRepository extends JpaRepository<PermissionGroupAssignmentPermission, Long> {
    boolean existsByPermissionGroupAssignmentIdAndActionAndTargetTypeAndTargetId(
            UUID permissionGroupAssignmentId,
            PermissionAction action,
            PermissionTargetType targetType,
            UUID targetId
    );

    List<PermissionGroupAssignmentPermission> findAllByPermissionGroupAssignmentId(UUID permissionGroupAssignmentId);

    Optional<PermissionGroupAssignmentPermission> findByPermissionGroupAssignmentIdAndActionAndTargetTypeAndTargetId(
            UUID permissionGroupAssignmentId,
            PermissionAction action,
            PermissionTargetType targetType,
            UUID targetId
    );

    boolean existsByPermissionIdAndPermissionGroupAssignmentIdNot(Long permissionId, UUID permissionGroupAssignmentId);
}
