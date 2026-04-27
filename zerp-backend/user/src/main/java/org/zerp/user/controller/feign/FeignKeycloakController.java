package org.zerp.user.controller.feign;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserResponseDTO;
import org.zerp.user.service.FeignKeycloakService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feign/keycloak/users")
@Tag(name = "Feign Keycloak", description = "API for creating Keycloak users, used by other services via Feign client")
public class FeignKeycloakController {
    private final FeignKeycloakService service;

    @PostMapping
    ResponseEntity<ApiResponse<KeycloakCreateUserResponseDTO>> createUser(
            @Valid @RequestBody KeycloakCreateUserRequestDTO body) {
        return ResponseEntity.ok(ApiResponse.success(service.createUser(body)));
    }
}
