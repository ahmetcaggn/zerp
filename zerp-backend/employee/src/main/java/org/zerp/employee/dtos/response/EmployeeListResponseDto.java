package org.zerp.employee.dtos.response;

import lombok.Data;
import org.zerp.common.entity.employee.EmploymentStatus;

@Data
public class EmployeeListResponseDto {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private EmploymentStatus status;
}
