package org.zerp.employee.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.employee.EmployeeContact;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.EmployeeContactDto;
import org.zerp.employee.dtos.response.EmployeeContactResponseDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.dtos.response.ManagerDto;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "manager", ignore = true)
    @Mapping(target = "contacts", ignore = true)
    @Mapping(target = "terminationDate", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "version", ignore = true)
    Employee toEntity(CreateEmployeeRequestDto dto);

    EmployeeResponseDto toResponseDto(Employee employee);

    EmployeeListResponseDto toListResponseDto(Employee employee);

    ManagerDto toManagerDto(Employee manager);

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "version", ignore = true)
    EmployeeContact toContactEntity(EmployeeContactDto dto);

    EmployeeContactResponseDto toContactResponseDto(EmployeeContact contact);

    List<EmployeeResponseDto> toResponseDtoList(List<Employee> employees);

    List<EmployeeListResponseDto> toListResponseDtoList(List<Employee> employees);
}
