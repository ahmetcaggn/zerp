package org.zerp.employee.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.zerp.common.entity.employee.ContactType;

@Data
public class EmployeeContactDto {

    private Long id;

    @NotNull(message = "Contact type cannot be null")
    private ContactType type;

    @NotBlank(message = "Contact value cannot be blank")
    private String value;

    private String contactPersonName;

    private String relationship;
}
