package org.zerp.notification.dtos.response;

import org.zerp.common.ErrorType;
import org.zerp.notification.dtos.request.EmailEmployeeListRequestDto;
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
