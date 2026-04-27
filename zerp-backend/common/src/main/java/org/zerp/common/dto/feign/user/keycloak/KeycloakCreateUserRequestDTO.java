package org.zerp.common.dto.feign.user.keycloak;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeycloakCreateUserRequestDTO {
    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be a valid email address")
    private String email;

    @Size(min = 8, message = "Temporary password must be at least 8 characters long")
    private String tempPassword;

    @NotBlank(message = "Tenant ID cannot be blank")
    private UUID tenantId;
}
