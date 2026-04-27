package org.zerp.common.dto.feign.user.keycloak;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeycloakCreateUserResponseDTO {
    private UUID userId;
}
