package org.zerp.gateway.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.ErrorDetails;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.common.dto.feign.user.UserServiceOperationResponse;
import org.zerp.gateway.feign.UserServiceFeignClient;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LazyUserCreateService {
    private final UserServiceFeignClient userServiceClient;

    public Mono<CheckUserResult> checkUser(Jwt jwt) {
        final UUID id;
        final UUID tenantId;
        try {
            id = UUID.fromString(jwt.getSubject());
        } catch (RuntimeException ex) {
            return Mono.just(CheckUserResult.failure(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_SUB",
                    "JWT subject must be a valid UUID"
            ));
        }
        try {
            tenantId = UUID.fromString(jwt.getClaimAsString("tenant_id"));
        } catch (RuntimeException ex) {
            return Mono.just(CheckUserResult.failure(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_TENANT_ID",
                    "JWT tenant_id claim must be a valid UUID"
            ));
        }

        UserCreateIfNotExistRequestDTO userCreateRequest = UserCreateIfNotExistRequestDTO.builder()
                .id(id)
                .email(jwt.getClaimAsString("email"))
                .username(jwt.getClaimAsString("preferred_username"))
                .tenantId(tenantId)
                .build();

        return userServiceClient.createUserIfNotExists(userCreateRequest)
                .map(result -> mapResult(result, userCreateRequest))
                .onErrorResume(_ -> Mono.just(CheckUserResult.failure(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "USER_SERVICE_UNAVAILABLE",
                        "Failed to reach user service"
                )));
    }

    private CheckUserResult mapResult(UserServiceOperationResponse result, UserCreateIfNotExistRequestDTO request) {
        if (result.isSuccess()) {
            return CheckUserResult.success(
                    request.getId(),
                    request.getEmail(),
                    request.getUsername(),
                    toHttpStatus(result.getStatusCode())
            );
        }

        if (result.isConflict()) {
            return CheckUserResult.success(
                    request.getId(),
                    request.getEmail(),
                    request.getUsername(),
                    HttpStatus.OK
            );
        }

        String message = resolveErrorMessage(result.getErrorBody());
        String errorCode = resolveErrorCode(result.getErrorBody());

        return CheckUserResult.failure(
                toHttpStatus(result.getStatusCode()),
                errorCode,
                message
        );
    }

    private String resolveErrorMessage(ApiResponse<ErrorDetails> errorBody) {
        if (errorBody == null) {
            return "User service request failed";
        }

        ErrorDetails details = errorBody.getData();
        if (details != null && details.getDetails() != null && !details.getDetails().isBlank()) {
            return details.getDetails();
        }

        if (errorBody.getMessage() != null && !errorBody.getMessage().isBlank()) {
            return errorBody.getMessage();
        }

        return "User service request failed";
    }

    private String resolveErrorCode(ApiResponse<ErrorDetails> errorBody) {
        if (errorBody != null && errorBody.getData() != null) {
            String errorCode = errorBody.getData().getErrorCode();
            if (errorCode != null && !errorCode.isBlank()) {
                return errorCode;
            }
        }
        return "USER_SERVICE_ERROR";
    }

    private HttpStatus toHttpStatus(HttpStatusCode statusCode) {
        if (statusCode instanceof HttpStatus httpStatus) {
            return httpStatus;
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
