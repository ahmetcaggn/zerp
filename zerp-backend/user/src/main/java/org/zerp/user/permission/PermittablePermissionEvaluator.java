package org.zerp.user.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.TenantRoot;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PermittablePermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public <T> Specification<T> filterRead(UUID userId) {
        boolean isAdminOnTenantRoot = commonPermissionService.isAdminOnTenantRoot(userId);
        if (isAdminOnTenantRoot) {
            return Specification.unrestricted();
        }

        UUID managingTenantId = commonPermissionService.getTenantIdIfTheUserIsAdminOnIt(userId);
        if (managingTenantId != null) {
            return (root, _, _) -> {
                if (root.getJavaType().equals(Tenant.class)) {
                    return root.get("id").equalTo(managingTenantId);
                }
                return root.get("tenantId").equalTo(managingTenantId);
            };
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
