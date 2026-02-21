package org.zerp.employee.mapper;

import org.springframework.stereotype.Component;
import org.zerp.common.model.Employee;
import org.zerp.common.model.EmployeeContact;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.EmployeeContactDto;
import org.zerp.employee.dtos.response.EmployeeContactResponseDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.dtos.response.ManagerDto;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EmployeeMapper {

    public Employee toEntity(CreateEmployeeRequestDto dto) {
        Employee employee = new Employee();
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmployeeCode(dto.getEmployeeCode());
        employee.setEmail(dto.getEmail());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setNationalId(dto.getNationalId());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setHireDate(dto.getHireDate());
        employee.setStatus(dto.getStatus());
        employee.setRole(dto.getRole());
        employee.setSalary(dto.getSalary());
        employee.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return employee;
    }

    public EmployeeResponseDto toResponseDto(Employee employee) {
        EmployeeResponseDto dto = new EmployeeResponseDto();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setEmail(employee.getEmail());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setNationalId(employee.getNationalId());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setHireDate(employee.getHireDate());
        dto.setTerminationDate(employee.getTerminationDate());
        dto.setStatus(employee.getStatus());
        dto.setRole(employee.getRole());
        dto.setSalary(employee.getSalary());
        dto.setIsActive(employee.getIsActive());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());

        if (employee.getManager() != null) {
            dto.setManager(toManagerDto(employee.getManager()));
        }

        if (employee.getContacts() != null) {
            dto.setContacts(employee.getContacts().stream()
                    .map(this::toContactResponseDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public EmployeeListResponseDto toListResponseDto(Employee employee) {
        EmployeeListResponseDto dto = new EmployeeListResponseDto();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setEmail(employee.getEmail());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setStatus(employee.getStatus());
        dto.setRole(employee.getRole());
        dto.setIsActive(employee.getIsActive());
        return dto;
    }

    public ManagerDto toManagerDto(Employee manager) {
        ManagerDto dto = new ManagerDto();
        dto.setId(manager.getId());
        dto.setFirstName(manager.getFirstName());
        dto.setLastName(manager.getLastName());
        dto.setEmployeeCode(manager.getEmployeeCode());
        dto.setEmail(manager.getEmail());
        return dto;
    }

    public EmployeeContact toContactEntity(EmployeeContactDto dto) {
        EmployeeContact contact = new EmployeeContact();
        contact.setId(dto.getId());
        contact.setType(dto.getType());
        contact.setValue(dto.getValue());
        contact.setContactPersonName(dto.getContactPersonName());
        contact.setRelationship(dto.getRelationship());
        contact.setPrimary(dto.isPrimary());
        return contact;
    }

    public EmployeeContactResponseDto toContactResponseDto(EmployeeContact contact) {
        EmployeeContactResponseDto dto = new EmployeeContactResponseDto();
        dto.setId(contact.getId());
        dto.setType(contact.getType());
        dto.setValue(contact.getValue());
        dto.setContactPersonName(contact.getContactPersonName());
        dto.setRelationship(contact.getRelationship());
        dto.setPrimary(contact.isPrimary());
        return dto;
    }

    public List<EmployeeResponseDto> toResponseDtoList(List<Employee> employees) {
        return employees.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<EmployeeListResponseDto> toListResponseDtoList(List<Employee> employees) {
        return employees.stream()
                .map(this::toListResponseDto)
                .collect(Collectors.toList());
    }
}
