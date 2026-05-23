package org.zerp.employee.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.zerp.common.entity.employee.EmploymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateEmployeeRequestDto {

    @NotBlank(message = "Username cannot be blank")
    @Pattern(regexp = "^[a-zA-Z0-9._-]{3,255}$", message = "Username must be 3-255 characters and contain only letters, digits, dots, hyphens, or underscores")
    private String username;

    @NotBlank(message = "Temporary password cannot be blank")
    @Size(min = 8, message = "Temporary password must be at least 8 characters")
    private String tempPassword;

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

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

    private UUID managerId;

    private BigDecimal salary;

    private Boolean isActive = true;

    private List<EmployeeContactDto> contacts;

    private UUID tenantId;
}
