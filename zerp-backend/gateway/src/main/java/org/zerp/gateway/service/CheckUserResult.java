package org.zerp.gateway.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckUserResult {
    private boolean success;
    private HttpStatus httpStatus;
    private String errorCode;
    private String message;
    private UUID userId;
    private String email;
    private String username;

    public static CheckUserResult success(UUID userId, String email, String username, HttpStatus httpStatus) {
        return CheckUserResult.builder()
                .success(true)
                .httpStatus(httpStatus)
                .userId(userId)
                .email(email)
                .username(username)
                .build();
    }

    public static CheckUserResult failure(HttpStatus httpStatus, String errorCode, String message) {
        return CheckUserResult.builder()
                .success(false)
                .httpStatus(httpStatus)
                .errorCode(errorCode)
                .message(message)
                .build();
    }
}
