package org.zerp.employee.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.HashSet;

@Log4j2
@Component
@RequiredArgsConstructor
public class EmployeePermissionEvaluator {
	public record EmployeeTarget(UUID employeeId, UUID tenantId) {
	}

	public record TenantParent(UUID tenantId) {
	}

	private final PermissionRepository permissionRepository;
	private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, Employee employee) {
        if (employee == null || employee.getId() == null || employee.getTenantId() == null) {
            return false;
        }

        UUID tenantId = employee.getTenantId();
        UUID employeeId = employee.getId();

        return hasRootReadScope(userId)
                || hasTenantPermission(userId, PermissionAction.READ_EMPLOYEE, tenantId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_EMPLOYEE, tenantId)
                || hasTenantPermission(userId, PermissionAction.DELETE_EMPLOYEE, tenantId)
                || hasTenantPermission(userId, PermissionAction.READ_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN_TENANT, tenantId)
                || hasEmployeeHierarchyPermission(userId, PermissionAction.READ_EMPLOYEE, employeeId, tenantId)
                || hasEmployeeHierarchyPermission(userId, PermissionAction.UPDATE_EMPLOYEE, employeeId, tenantId)
                || hasEmployeeHierarchyPermission(userId, PermissionAction.DELETE_EMPLOYEE, employeeId, tenantId);
    }

	public boolean canCreate(UUID userId, TenantParent parent) {
		List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
				userId,
				PermissionAction.CREATE_EMPLOYEE,
				null,
				parent.tenantId()
		);
		return !result.isEmpty();
	}

    public boolean canCreateAnyTenant(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.CREATE_EMPLOYEE_ANY_TENANT);
    }

	public boolean canUpdate(UUID userId, EmployeeTarget target) {
		List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
				userId,
				PermissionAction.UPDATE_EMPLOYEE,
				target.employeeId(),
				target.tenantId()
		);
		return !result.isEmpty();
	}

	public boolean canPatch(UUID userId, EmployeeTarget target) {
		return canUpdate(userId, target);
	}

	public boolean canDelete(UUID userId, EmployeeTarget target) {
		List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
				userId,
				PermissionAction.DELETE_EMPLOYEE,
				target.employeeId(),
				target.tenantId()
		);
		return !result.isEmpty();
	}

	public Specification<Employee> filterRead(UUID userId) {
        if (hasRootReadScope(userId)) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedEmployeeIds = collectReadableEmployeeIds(userId);
        Set<UUID> permittedTenantIds = collectReadableTenantIds(userId);

        log.debug("user {} permitted: {} employees, {} tenants",
                userId, permittedEmployeeIds.size(), permittedTenantIds.size());

        if (permittedEmployeeIds.isEmpty() && permittedTenantIds.isEmpty()) {
            return (_, _, cb) -> cb.disjunction();
        }

        if (permittedTenantIds.isEmpty()) {
            return (root, _, _) -> root.get("id").in(permittedEmployeeIds);
        }

        if (permittedEmployeeIds.isEmpty()) {
            return (root, _, _) -> root.get("tenantId").in(permittedTenantIds);
        }

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedEmployeeIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
	}

    private Set<UUID> collectReadableEmployeeIds(UUID userId) {
        Set<UUID> readableEmployeeIds = new HashSet<>(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.EMPLOYEE, PermissionAction.READ_EMPLOYEE
        ));
        readableEmployeeIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.EMPLOYEE, PermissionAction.UPDATE_EMPLOYEE
        ));
        readableEmployeeIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.EMPLOYEE, PermissionAction.DELETE_EMPLOYEE
        ));
        return readableEmployeeIds;
    }

    private Set<UUID> collectReadableTenantIds(UUID userId) {
        Set<UUID> readableTenantIds = new HashSet<>(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_EMPLOYEE
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.UPDATE_EMPLOYEE
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.DELETE_EMPLOYEE
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TENANT
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.UPDATE_TENANT
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.ADMIN_TENANT
        ));
        return readableTenantIds;
    }

    private boolean hasEmployeeHierarchyPermission(UUID userId, PermissionAction action, UUID employeeId, UUID tenantId) {
        List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
                userId, action, employeeId, tenantId
        );
        return !result.isEmpty();
    }

    private boolean hasTenantPermission(UUID userId, PermissionAction action, UUID tenantId) {
        return permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId, PermissionTargetType.TENANT, action, tenantId
        );
    }

    private boolean hasRootReadScope(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.READ_EMPLOYEE)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.UPDATE_EMPLOYEE)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.DELETE_EMPLOYEE)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TENANT)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.UPDATE_TENANT)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.ADMIN_TENANT)
                || canCreateAnyTenant(userId);
    }
}
