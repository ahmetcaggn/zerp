package org.zerp.employee.dtos.response;

import lombok.Data;
import org.zerp.common.entity.employee.EmploymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EmployeeResponseDto {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String nationalId;

    private LocalDate dateOfBirth;

    private LocalDate hireDate;

    private LocalDate terminationDate;

    private EmploymentStatus status;

    private ManagerDto manager;

    private BigDecimal salary;

    private List<EmployeeContactResponseDto> contacts;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
