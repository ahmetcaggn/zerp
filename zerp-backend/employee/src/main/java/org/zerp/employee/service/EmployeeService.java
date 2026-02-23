package org.zerp.employee.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.common.model.Employee;
import org.zerp.common.model.EmployeeContact;
import org.zerp.common.model.EmploymentStatus;
import org.zerp.common.model.Role;
import org.zerp.employee.Exception.DuplicateResourceException;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.EmployeeContactDto;
import org.zerp.employee.dtos.request.UpdateEmployeeRequestDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.mapper.EmployeeMapper;
import org.zerp.employee.repository.EmployeeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    @Transactional
    public EmployeeResponseDto createEmployee(CreateEmployeeRequestDto dto) {
        validateUniqueConstraints(dto.getEmail(), dto.getEmployeeCode(), dto.getNationalId(), null);

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

        Employee savedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponseDto(savedEmployee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));
        return employeeMapper.toResponseDto(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeListResponseDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAllNotDeleted();
        return employeeMapper.toListResponseDtoList(employees);
    }

    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> getEmployeesPaginated(Pageable pageable) {
        return employeeRepository.findAllNotDeleted(pageable)
                .map(employeeMapper::toListResponseDto);
    }

    @Transactional(readOnly = true)
    public List<EmployeeListResponseDto> getEmployeesByStatus(EmploymentStatus status) {
        List<Employee> employees = employeeRepository.findByStatusAndNotDeleted(status);
        return employeeMapper.toListResponseDtoList(employees);
    }

    @Transactional(readOnly = true)
    public List<EmployeeListResponseDto> getEmployeesByManager(Long managerId) {
        List<Employee> employees = employeeRepository.findByManagerIdAndNotDeleted(managerId);
        return employeeMapper.toListResponseDtoList(employees);
    }

    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> searchEmployees(String keyword, Pageable pageable) {
        return employeeRepository.searchEmployeesNotDeleted(keyword, pageable)
                .map(employeeMapper::toListResponseDto);
    }

    @Transactional
    public EmployeeResponseDto updateEmployee(Long id, UpdateEmployeeRequestDto dto) {
        Employee employee = employeeRepository.findByIdWithContactsAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));

        validateUniqueConstraints(dto.getEmail(), dto.getEmployeeCode(), dto.getNationalId(), id);

        updateEmployeeFields(employee, dto);

        if (dto.getManagerId() != null) {
            if (dto.getManagerId().equals(id)) {
                throw new IllegalArgumentException("Employee cannot be their own manager");
            }
            Employee manager = employeeRepository.findByIdAndNotDeleted(dto.getManagerId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found: " + dto.getManagerId()));
            employee.setManager(manager);
        }

        if (dto.getContacts() != null) {
            updateContacts(employee, dto.getContacts());
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponseDto(updatedEmployee);
    }

    /**
     * Soft delete an employee by setting isDeleted flag to true.
     * The record remains in the database but is excluded from normal queries.
     */
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));
        
        // Use soft delete from BaseEntity
        employee.softDelete(null); // TODO: Pass actual user ID when security is implemented
        employeeRepository.save(employee);
    }

    /**
     * Permanently delete an employee from the database.
     * Use with caution - this action cannot be undone.
     */
    @Transactional
    public void hardDeleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EntityNotFoundException("Employee not found: " + id);
        }
        employeeRepository.deleteById(id);
    }

    /**
     * Restore a soft-deleted employee.
     */
    @Transactional
    public EmployeeResponseDto restoreEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));
        
        if (!employee.getIsDeleted()) {
            throw new IllegalArgumentException("Employee is not deleted");
        }
        
        employee.restore();
        Employee savedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponseDto(savedEmployee);
    }

    /**
     * Get all soft-deleted employees for admin/audit purposes.
     */
    @Transactional(readOnly = true)
    public List<EmployeeListResponseDto> getDeletedEmployees() {
        List<Employee> employees = employeeRepository.findAllDeleted();
        return employeeMapper.toListResponseDtoList(employees);
    }

    /**
     * Get all soft-deleted employees with pagination.
     */
    @Transactional(readOnly = true)
    public Page<EmployeeListResponseDto> getDeletedEmployeesPaginated(Pageable pageable) {
        return employeeRepository.findAllDeleted(pageable)
                .map(employeeMapper::toListResponseDto);
    }


    private void validateUniqueConstraints(String email, String employeeCode, String nationalId, Long excludeId) {
        if (email != null) {
            employeeRepository.findByEmailAndNotDeleted(email).ifPresent(existing -> {
                if (excludeId == null || !existing.getId().equals(excludeId)) {
                    throw new DuplicateResourceException("This email address is already in use: " + email);
                }
            });
        }

        if (nationalId != null) {
            employeeRepository.findByNationalIdAndNotDeleted(nationalId).ifPresent(existing -> {
                if (excludeId == null || !existing.getId().equals(excludeId)) {
                    throw new DuplicateResourceException("This national ID is already in use: " + nationalId);
                }
            });
        }
    }

    private void updateEmployeeFields(Employee employee, UpdateEmployeeRequestDto dto) {
        if (dto.getFirstName() != null) employee.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) employee.setLastName(dto.getLastName());
        if (dto.getEmail() != null) employee.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) employee.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getNationalId() != null) employee.setNationalId(dto.getNationalId());
        if (dto.getDateOfBirth() != null) employee.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getHireDate() != null) employee.setHireDate(dto.getHireDate());
        if (dto.getTerminationDate() != null) employee.setTerminationDate(dto.getTerminationDate());
        if (dto.getStatus() != null) employee.setStatus(dto.getStatus());
        if (dto.getSalary() != null) employee.setSalary(dto.getSalary());
    }

    private void updateContacts(Employee employee, List<EmployeeContactDto> contactDtos) {
        employee.getContacts().clear();
        for (EmployeeContactDto contactDto : contactDtos) {
            EmployeeContact contact = employeeMapper.toContactEntity(contactDto);
            employee.addContact(contact);
        }
    }
}
