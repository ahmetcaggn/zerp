package org.zerp.employee.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;
import org.zerp.common.entity.employee.EmploymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class UpdateEmployeeRequestDto {

    private String firstName;

    private String lastName;

    @Email(message = "Please enter a valid email address")
    private String email;

    private String phoneNumber;

    private String nationalId;

    private LocalDate dateOfBirth;

    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;

    private LocalDate terminationDate;

    private EmploymentStatus status;

    private UUID managerId;

    private BigDecimal salary;

    private List<EmployeeContactDto> contacts;
}
