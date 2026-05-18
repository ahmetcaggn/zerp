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
        List<Permission> result = permissionRepository.findAllByUserAndEmployeeHierarchy(
                userId,
                PermissionAction.READ_EMPLOYEE,
                employee.getId(),
                employee.getParent().getId()
        );
        return !result.isEmpty();
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
		Set<UUID> permittedEmployeeIds = commonPermissionService.getAllPermitted(
				userId, PermissionTargetType.EMPLOYEE, PermissionAction.READ_EMPLOYEE);
		Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
				userId, PermissionTargetType.TENANT, PermissionAction.READ_EMPLOYEE);

		log.debug("user {} permitted: {} employees, {} tenants",
				userId, permittedEmployeeIds.size(), permittedTenantIds.size());

		return Specification.anyOf(
				(root, _, _) -> root.get("id").in(permittedEmployeeIds),
				(root, _, cb) -> root.get("tenant").get("id").in(permittedTenantIds)
		);
	}
}
