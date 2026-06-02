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
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.HashSet;

@Log4j2
@Component
@RequiredArgsConstructor
public class EmployeePermissionEvaluator {
	private final PermissionRepository permissionRepository;
	private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, Employee employee) {
        if (employee == null || employee.getId() == null || employee.getTenantId() == null) {
            return false;
        }

        UUID tenantId = employee.getTenantId();
        UUID employeeId = employee.getId();
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting read access to employee", userId, tenantId);
            return true;
        }

        return hasRootReadScope(userId)
                || hasTenantPermission(userId, PermissionAction.READ_EMPLOYEE, tenantId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_EMPLOYEE, tenantId)
                || hasTenantPermission(userId, PermissionAction.DELETE_EMPLOYEE, tenantId)
                || hasTenantPermission(userId, PermissionAction.READ_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN, tenantId)
                || hasEmployeeHierarchyPermission(userId, PermissionAction.READ_EMPLOYEE, employeeId, tenantId)
                || hasEmployeeHierarchyPermission(userId, PermissionAction.UPDATE_EMPLOYEE, employeeId, tenantId)
                || hasEmployeeHierarchyPermission(userId, PermissionAction.DELETE_EMPLOYEE, employeeId, tenantId);
    }

	public boolean canCreate(UUID userId, UUID tenantId) {
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting create access to employee", userId, tenantId);
            return true;
        }

		List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
				userId,
				PermissionAction.CREATE_EMPLOYEE,
				null,
				tenantId
		);
		return !result.isEmpty();
	}

    public boolean canCreateAnyTenant(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.CREATE_EMPLOYEE_ANY_TENANT);
    }

    public boolean canUpdate(UUID userId, Employee employee) {
        if (commonPermissionService.isAdminAny(userId, employee.getTenantId())) {
            log.debug("User {} is admin for tenant {}, granting update access to employee", userId, employee.getTenantId());
            return true;
        }
		List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
				userId,
				PermissionAction.UPDATE_EMPLOYEE,
				employee.getId(),
				employee.getTenantId()
		);
		return !result.isEmpty();
	}

	public boolean canPatch(UUID userId, Employee target) {
		return canUpdate(userId, target);
	}

	public boolean canDelete(UUID userId, Employee target) {
        if (commonPermissionService.isAdminAny(userId, target.getTenantId())) {
            log.debug("User {} is admin for tenant {}, granting delete access to employee", userId, target.getTenantId());
            return true;
        }
		List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
				userId,
				PermissionAction.DELETE_EMPLOYEE,
				target.getId(),
				target.getTenantId()
		);
		return !result.isEmpty();
	}

	public Specification<Employee> filterRead(UUID userId) {
        if (hasRootReadScope(userId)) {
            return Specification.unrestricted();
        }

        boolean isAdminOnTenantRoot = commonPermissionService.isAdminOnTenantRoot(userId);
        if (isAdminOnTenantRoot) {
            return Specification.unrestricted();
        }

        UUID managingTenantId = commonPermissionService.getTenantIdIfTheUserIsAdminOnIt(userId);
        if (managingTenantId != null) {
            return (root, _, _) -> root.get("tenantId").equalTo(managingTenantId);
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
            return (root, _, _) -> {
                Join<Object, Object> tenantJoin = root.join("tenant", JoinType.INNER);
                return tenantJoin.get("id").in(permittedTenantIds);
            };
        }

		return Specification.anyOf(
				(root, _, _) -> root.get("id").in(permittedEmployeeIds),
				(root, _, _) -> {
					Join<Object, Object> tenantJoin = root.join("tenant", JoinType.INNER);
					return tenantJoin.get("id").in(permittedTenantIds);
				}
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
                userId, PermissionTargetType.TENANT, PermissionAction.ADMIN
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
                || commonPermissionService.hasRootPermission(userId, PermissionAction.ADMIN)
                || canCreateAnyTenant(userId);
    }
}
