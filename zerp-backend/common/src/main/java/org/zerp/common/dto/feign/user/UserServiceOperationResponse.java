package org.zerp.common.dto.feign.user;

import lombok.Getter;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.ErrorDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public class UserServiceOperationResponse {
    private final HttpStatusCode statusCode;
    private final ApiResponse<UserCheckResponseDTO> successBody;
    private final ApiResponse<ErrorDetails> errorBody;

    private UserServiceOperationResponse(
            HttpStatusCode statusCode,
            ApiResponse<UserCheckResponseDTO> successBody,
            ApiResponse<ErrorDetails> errorBody
    ) {
        this.statusCode = statusCode;
        this.successBody = successBody;
        this.errorBody = errorBody;
    }

    public static UserServiceOperationResponse success(
            HttpStatusCode statusCode,
            ApiResponse<UserCheckResponseDTO> successBody
    ) {
        return new UserServiceOperationResponse(statusCode, successBody, null);
    }

    public static UserServiceOperationResponse error(
            HttpStatusCode statusCode,
            ApiResponse<ErrorDetails> errorBody
    ) {
        return new UserServiceOperationResponse(statusCode, null, errorBody);
    }

    public boolean isSuccess() {
        return statusCode.is2xxSuccessful();
    }

    public boolean isConflict() {
        return statusCode.value() == HttpStatus.CONFLICT.value();
    }
}
