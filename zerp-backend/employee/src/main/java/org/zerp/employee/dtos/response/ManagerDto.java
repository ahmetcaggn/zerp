package org.zerp.employee.dtos.response;

import lombok.Data;

@Data
public class ManagerDto {

    private Long id;

    private String firstName;

    private String lastName;

    private String employeeCode;

    private String email;
}
