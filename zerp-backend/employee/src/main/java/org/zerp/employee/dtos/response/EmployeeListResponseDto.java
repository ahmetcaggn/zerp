package org.zerp.employee.dtos.response;

import lombok.Data;
import org.zerp.common.entity.employee.EmploymentStatus;

import java.util.UUID;

@Data
public class EmployeeListResponseDto {

    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private EmploymentStatus status;
}
