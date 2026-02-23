package org.zerp.employee.dtos.request;

import org.zerp.common.entity.employee.ErrorType;
import lombok.Data;

import java.util.Set;

@Data
public class EmailEmployeeListRequestDto {
    private Set<String> emailToList;
    private String serviceName;
    private String errorCode;
    private ErrorType errorType;
    private String errorMessage;
    private String exceptionStackTrace;
}
