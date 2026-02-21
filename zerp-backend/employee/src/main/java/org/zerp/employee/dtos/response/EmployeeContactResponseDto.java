package org.zerp.employee.dtos.response;

import lombok.Data;
import org.zerp.common.model.ContactType;

@Data
public class EmployeeContactResponseDto {

    private Long id;

    private ContactType type;

    private String value;

    private String contactPersonName;

    private String relationship;

    private boolean isPrimary;
}
