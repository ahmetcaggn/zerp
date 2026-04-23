package org.zerp.employee.dtos.response;

import lombok.Data;

import java.util.UUID;

@Data
public class ManagerDto {

    private UUID id;

    private String firstName;

    private String lastName;

    private String email;
}
