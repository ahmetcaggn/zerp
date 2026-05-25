package org.zerp.employee.dtos.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdminCreateEmployeeRequestDto extends CreateEmployeeRequestDto {
    private UUID tenantId;
}
