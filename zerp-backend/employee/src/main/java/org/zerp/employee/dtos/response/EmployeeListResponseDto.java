package org.zerp.employee.dtos.response;

import lombok.Data;
import org.zerp.common.model.EmploymentStatus;
import org.zerp.common.model.Role;

@Data
public class EmployeeListResponseDto {

    private Long id;

    private String firstName;

    private String lastName;

    private String employeeCode;

    private String email;

    private String phoneNumber;

    private EmploymentStatus status;

    private Role role;

    private Boolean isActive;
}
