package org.zerp.employee.dtos.response;

import org.zerp.common.entity.employee.ErrorType;
import org.zerp.employee.dtos.request.EmailEmployeeListRequestDto;
import lombok.Data;

@Data
public class TemplateDto {
    private String serviceName;
    private String errorCode;
    private ErrorType errorType;
    private String errorMessage;
    private String exceptionStackTrace;

    public TemplateDto(EmailEmployeeListRequestDto emailEmployeeListRequestDto) {
        this.serviceName = emailEmployeeListRequestDto.getServiceName();
        this.errorCode = emailEmployeeListRequestDto.getErrorCode();
        this.errorType = emailEmployeeListRequestDto.getErrorType();
        this.errorMessage = emailEmployeeListRequestDto.getErrorMessage();
        this.exceptionStackTrace = emailEmployeeListRequestDto.getExceptionStackTrace();
    }


}
