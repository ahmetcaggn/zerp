package org.zerp.employee.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.employee.EmployeeContact;
import org.zerp.common.entity.employee.EmploymentStatus;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.employee.Exception.DuplicateResourceException;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.EmployeeContactDto;
import org.zerp.employee.dtos.request.UpdateEmployeeRequestDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.mapper.EmployeeMapper;
import org.zerp.employee.permission.EmployeePermissionEvaluator;
import org.zerp.employee.repository.EmployeeRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class EmployeeService implements IResourceService<EmployeeResponseDto, EmployeeListResponseDto,
        CreateEmployeeRequestDto, UpdateEmployeeRequestDto, UUID> {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final EmployeePermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;

    // =============================================
    // IResourceService overrides
    // =============================================

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = resolveCurrentUserId();
        Specification<Employee> spec = buildSpecificationFromFilters(filters);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        return employeeRepository.findAll(spec, pageable).map(employeeMapper::toListResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDto> findAllById(List<UUID> ids) {
        UUID userId = resolveCurrentUserId();
        List<EmployeeResponseDto> result = new ArrayList<>();
        for (UUID id : ids) {
            employeeRepository.findByIdWithContactsAndNotDeleted(id)
                    .filter(employee -> permissionEvaluator.canRead(userId, employee))
                    .map(employeeMapper::toResponseDto)
                    .ifPresent(result::add);
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDto findById(UUID id) {
        UUID userId = resolveCurrentUserId();
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        if (!permissionEvaluator.canRead(userId, employee)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Employee");
        }

        return employeeMapper.toResponseDto(employee);
    }

    @Override
    @Transactional
    public EmployeeResponseDto create(CreateEmployeeRequestDto dto) {
        UUID userId = resolveCurrentUserId();
        UUID tenantId = resolveCurrentTenantId();
        validateUniqueConstraints(dto.getEmail(), dto.getNationalId(), null);

        // TODO bu ileride keycloak'a istek atilip kullanici kayit edilecek sekidle duzenlenecek.
        UUID tempEmployeeId = UUID.randomUUID();

        Employee employee = employeeMapper.toEntity(dto);
        employee.setId(tempEmployeeId);
        employee.setTenantId(tenantId);
        // TODO bu ileride keycloak'a istek atilip kullanici kayit edilecek sekidle duzenlenecek.'
        employee.setUsername("test-username");
//        employee.setVersion(0L);

        // TODO ileride temp sifre de input olarak alinacak.

        if (!permissionEvaluator.canCreate(userId,
                new EmployeePermissionEvaluator.TenantParent(tenantId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Employee");
        }

        if (dto.getManagerId() != null) {
            Employee manager = employeeRepository.findByIdAndNotDeleted(dto.getManagerId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found: " + dto.getManagerId()));
            employee.setManager(manager);
        }

        if (dto.getContacts() != null && !dto.getContacts().isEmpty()) {
            for (EmployeeContactDto contactDto : dto.getContacts()) {
                EmployeeContact contact = employeeMapper.toContactEntity(contactDto);
                employee.addContact(contact);
            }
        }

        return employeeMapper.toResponseDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public EmployeeResponseDto update(UUID id, UpdateEmployeeRequestDto data) {
        UUID userId = resolveCurrentUserId();
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        if (!permissionEvaluator.canUpdate(userId,
                new EmployeePermissionEvaluator.EmployeeTarget(employee.getId(), employee.getTenant().getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Employee");
        }

        validateUniqueConstraints(data.getEmail(), data.getNationalId(), id);

        if (data.getFirstName() != null) employee.setFirstName(data.getFirstName());
        if (data.getLastName() != null) employee.setLastName(data.getLastName());
        if (data.getEmail() != null) employee.setEmail(data.getEmail());
        if (data.getPhoneNumber() != null) employee.setPhoneNumber(data.getPhoneNumber());
        if (data.getNationalId() != null) employee.setNationalId(data.getNationalId());
        if (data.getDateOfBirth() != null) employee.setDateOfBirth(data.getDateOfBirth());
        if (data.getHireDate() != null) employee.setHireDate(data.getHireDate());
        if (data.getTerminationDate() != null) employee.setTerminationDate(data.getTerminationDate());
        if (data.getStatus() != null) employee.setStatus(data.getStatus());
        if (data.getSalary() != null) employee.setSalary(data.getSalary());

        if (data.getManagerId() != null) {
            if (data.getManagerId().equals(id)) {
                throw new IllegalArgumentException("Employee cannot be their own manager");
            }
            Employee manager = employeeRepository.findByIdAndNotDeleted(data.getManagerId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found: " + data.getManagerId()));
            employee.setManager(manager);
        }

        if (data.getContacts() != null) {
            updateContacts(employee, data.getContacts());
        }

        return employeeMapper.toResponseDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public EmployeeResponseDto patch(UUID id, Map<String, Object> fields) {
        UUID userId = resolveCurrentUserId();
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        if (!permissionEvaluator.canPatch(userId,
                new EmployeePermissionEvaluator.EmployeeTarget(employee.getId(), employee.getTenant().getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Employee");
        }

        String email = fields.containsKey("email") ? (String) fields.get("email") : null;
        String nationalId = fields.containsKey("nationalId") ? (String) fields.get("nationalId") : null;
        validateUniqueConstraints(email, nationalId, id);

        applyFieldUpdates(employee, fields);

        if (fields.containsKey("managerId")) {
            UUID managerId = UUID.fromString(fields.get("managerId").toString());
            if (managerId.equals(id)) {
                throw new IllegalArgumentException("Employee cannot be their own manager");
            }
            Employee manager = employeeRepository.findByIdAndNotDeleted(managerId)
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found: " + managerId));
            employee.setManager(manager);
        }

        if (fields.containsKey("contacts")) {
            @SuppressWarnings("unchecked")
            List<EmployeeContactDto> contactDtos = (List<EmployeeContactDto>) fields.get("contacts");
            updateContacts(employee, contactDtos);
        }

        return employeeMapper.toResponseDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        List<UUID> updated = new ArrayList<>();
        for (UUID id : ids) {
            try {
                patch(id, fields);
                updated.add(id);
            } catch (EntityNotFoundException ignored) {
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        UUID userId = resolveCurrentUserId();
        Employee employee = employeeRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        if (!permissionEvaluator.canDelete(userId,
                new EmployeePermissionEvaluator.EmployeeTarget(employee.getId(), employee.getTenant().getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Employee");
        }
        employee.deleteEmployee();
        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public List<UUID> deleteMany(List<UUID> ids) {
        List<UUID> deleted = new ArrayList<>();
        for (UUID id : ids) {
            try {
                deleteById(id);
                deleted.add(id);
            } catch (EntityNotFoundException ignored) {
            }
        }
        return deleted;
    }

    // =============================================
    // Specialised queries (not covered by interface)
    // =============================================

    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> searchEmployees(String keyword, Pageable pageable) {
        return employeeRepository.searchEmployeesNotDeleted(keyword, pageable)
                .map(employeeMapper::toListResponseDto);
    }

    /**
     * Get all soft-deleted employees for admin/audit purposes.
     */
    @Transactional(readOnly = true)
    public List<EmployeeListResponseDto> getDeletedEmployees() {
        return employeeMapper.toListResponseDtoList(employeeRepository.findAllDeleted());
    }

    /**
     * Get all soft-deleted employees with pagination.
     */
    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> getDeletedEmployeesPaginated(Pageable pageable) {
        return employeeRepository.findAllDeleted(pageable).map(employeeMapper::toListResponseDto);
    }

    // =============================================
    // Private helpers
    // =============================================

    private void validateUniqueConstraints(String email, String nationalId, UUID excludeId) {
        if (email != null) {
            employeeRepository.findByEmailAndNotDeleted(email).ifPresent(existing -> {
                if (!existing.getId().equals(excludeId)) {
                    throw new DuplicateResourceException("This email address is already in use: " + email);
                }
            });
        }
        if (nationalId != null) {
            employeeRepository.findByNationalIdAndNotDeleted(nationalId).ifPresent(existing -> {
                if (!existing.getId().equals(excludeId)) {
                    throw new DuplicateResourceException("This national ID is already in use: " + nationalId);
                }
            });
        }
    }

    private void applyFieldUpdates(Employee employee, Map<String, Object> fields) {
        if (fields.containsKey("firstName")) employee.setFirstName((String) fields.get("firstName"));
        if (fields.containsKey("lastName")) employee.setLastName((String) fields.get("lastName"));
        if (fields.containsKey("email")) employee.setEmail((String) fields.get("email"));
        if (fields.containsKey("phoneNumber")) employee.setPhoneNumber((String) fields.get("phoneNumber"));
        if (fields.containsKey("nationalId")) employee.setNationalId((String) fields.get("nationalId"));
        if (fields.containsKey("dateOfBirth"))
            employee.setDateOfBirth(LocalDate.parse(fields.get("dateOfBirth").toString()));
        if (fields.containsKey("hireDate"))
            employee.setHireDate(LocalDate.parse(fields.get("hireDate").toString()));
        if (fields.containsKey("terminationDate"))
            employee.setTerminationDate(LocalDate.parse(fields.get("terminationDate").toString()));
        if (fields.containsKey("status"))
            employee.setStatus(EmploymentStatus.valueOf(fields.get("status").toString()));
        if (fields.containsKey("salary"))
            employee.setSalary(new BigDecimal(fields.get("salary").toString()));
    }

    private void updateContacts(Employee employee, List<EmployeeContactDto> contactDtos) {
        employee.getContacts().clear();
        for (EmployeeContactDto contactDto : contactDtos) {
            EmployeeContact contact = employeeMapper.toContactEntity(contactDto);
            employee.addContact(contact);
        }
    }

    private Specification<Employee> buildSpecificationFromFilters(Map<String, String> filters) {
        Specification<Employee> spec = filterRefiner.refined(filters, Employee.class);
        log.debug("Built specification from filters: filters={}, spec={}", filters, spec);
        return spec;
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }

    private UUID resolveCurrentTenantId() {
        return currentTenantIdResolver.resolve();
    }
}
