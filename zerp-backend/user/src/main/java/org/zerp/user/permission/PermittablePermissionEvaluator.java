package org.zerp.user.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.TenantRoot;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PermittablePermissionEvaluator {
    private final PermissionRepository permissionRepository;

    public <T> Specification<T> filterRead(UUID userId) {
        // Check for TENANT_ROOT access
        boolean hasRootAccess = permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId, PermissionTargetType.TENANT_ROOT, PermissionAction.ADMIN, TenantRoot.ID);

        if (hasRootAccess) {
            return Specification.unrestricted();
        }

        // Check for specific TENANT access
        List<UUID> allowedTenantIds = permissionRepository.findTargetIdsByUserAndTargetTypeAndAction(
                userId, PermissionTargetType.TENANT, PermissionAction.ADMIN);

        if (allowedTenantIds.isEmpty()) {
            return (_, _, cb) -> cb.disjunction(); // No access
        }

        return (root, _, _) -> {
            // For Tenant entity itself, check 'id' field
            if (root.getJavaType().equals(Tenant.class)) {
                return root.get("id").in(allowedTenantIds);
            }
            // For other entities, check 'tenantId' field
            return root.get("tenantId").in(allowedTenantIds);
        };
    }
}
