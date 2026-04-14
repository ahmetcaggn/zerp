package org.zerp.employee.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Path;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.employee.EmployeeContact;
import org.zerp.common.entity.employee.EmploymentStatus;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.FilterType;
import org.zerp.employee.Exception.DuplicateResourceException;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.EmployeeContactDto;
import org.zerp.employee.dtos.request.UpdateEmployeeRequestDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.mapper.EmployeeMapper;
import org.zerp.employee.repository.EmployeeRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployeeService implements IResourceService<EmployeeResponseDto, EmployeeListResponseDto,
        CreateEmployeeRequestDto, UpdateEmployeeRequestDto, Long> {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    // =============================================
    // IResourceService overrides
    // =============================================

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> findWithFilters(Map<String, String> filters, Pageable pageable) {
        Specification<Employee> spec = buildSpecificationFromFilters(filters);
        return employeeRepository.findAll(spec, pageable).map(employeeMapper::toListResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> findWithTargetAndFilters(String target, String targetId,
                                                                  Map<String, String> filters, Pageable pageable) {
        Specification<Employee> spec = buildSpecificationFromFilters(filters);
        spec = spec.and((root, _, cb) -> {
            Path<?> path = root;
            for (String part : target.split("\\.")) {
                path = path.get(part);
            }
            return cb.equal(path, targetId);
        });
        return employeeRepository.findAll(spec, pageable).map(employeeMapper::toListResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDto> findAllById(Iterable<Long> ids) {
        List<EmployeeResponseDto> result = new ArrayList<>();
        for (Long id : ids) {
            employeeRepository.findByIdWithContactsAndNotDeleted(id)
                    .map(employeeMapper::toResponseDto)
                    .ifPresent(result::add);
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDto findById(Long id) {
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));
        return employeeMapper.toResponseDto(employee);
    }

    @Override
    @Transactional
    public EmployeeResponseDto create(CreateEmployeeRequestDto dto) {
        validateUniqueConstraints(dto.getEmail(), dto.getNationalId(), null);

        Employee employee = employeeMapper.toEntity(dto);

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
    public EmployeeResponseDto update(Long id, UpdateEmployeeRequestDto data) {
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

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
    public EmployeeResponseDto patch(Long id, Map<String, Object> fields) {
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        String email = fields.containsKey("email") ? (String) fields.get("email") : null;
        String nationalId = fields.containsKey("nationalId") ? (String) fields.get("nationalId") : null;
        validateUniqueConstraints(email, nationalId, id);

        applyFieldUpdates(employee, fields);

        if (fields.containsKey("managerId")) {
            Long managerId = Long.valueOf(fields.get("managerId").toString());
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
    public List<Long> patchMany(Iterable<Long> ids, Map<String, Object> fields) {
        List<Long> updated = new ArrayList<>();
        for (Long id : ids) {
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
    public void deleteById(Long id) {
        Employee employee = employeeRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));
        employeeRepository.delete(employee);
    }

    @Override
    @Transactional
    public List<Long> deleteMany(Iterable<Long> ids) {
        List<Long> deleted = new ArrayList<>();
        for (Long id : ids) {
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

    private void validateUniqueConstraints(String email, String nationalId, Long excludeId) {
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
        Specification<Employee> spec = Specification.unrestricted();
        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            int lastDotIndex = key.lastIndexOf('.');
            if (lastDotIndex < 0 || lastDotIndex == key.length() - 1) continue;
            String field = key.substring(0, lastDotIndex);
            FilterType filterType = FilterType.fromCode(key.substring(lastDotIndex + 1));
            if (filterType == null) continue;
            spec = spec.and((root, _, cb) -> {
                if (filterType == FilterType.EQUAL)
                    return cb.equal(root.get(field), entry.getValue());
                if (filterType == FilterType.NOT_EQUAL)
                    return cb.notEqual(root.get(field), entry.getValue());
                if (filterType == FilterType.GREATER_THAN_OR_EQUAL)
                    return cb.greaterThanOrEqualTo(root.get(field), entry.getValue());
                if (filterType == FilterType.LESS_THAN_OR_EQUAL)
                    return cb.lessThanOrEqualTo(root.get(field), entry.getValue());
                if (filterType == FilterType.LIKE)
                    return cb.like(root.get(field), "%" + entry.getValue() + "%");
                throw new IllegalArgumentException("Unsupported filter type: " + filterType);
            });
        }
        return spec;
    }
}
