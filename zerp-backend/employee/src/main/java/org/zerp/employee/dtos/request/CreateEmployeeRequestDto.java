package org.zerp.employee.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;
import org.zerp.common.model.EmploymentStatus;
import org.zerp.common.model.Role;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateEmployeeRequestDto {

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    @NotBlank(message = "Employee code cannot be blank")
    private String employeeCode;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Please enter a valid email address")
    private String email;

    private String phoneNumber;

    private String nationalId;

    private LocalDate dateOfBirth;

    @NotNull(message = "Hire date cannot be null")
    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;

    private EmploymentStatus status;

    private Long managerId;

    @NotNull(message = "Role cannot be null")
    private Role role;

    private BigDecimal salary;

    private Boolean isActive = true;

    private List<EmployeeContactDto> contacts;
}
