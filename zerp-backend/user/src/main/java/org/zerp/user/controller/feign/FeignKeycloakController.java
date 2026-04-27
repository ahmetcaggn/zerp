package org.zerp.user.controller.feign;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserResponseDTO;
import org.zerp.user.service.FeignKeycloakService;

@Hidden
@RestController
@RequiredArgsConstructor
@RequestMapping("/feign/keycloak")
public class FeignKeycloakController {
    private final FeignKeycloakService service;

    @PostMapping
    ResponseEntity<ApiResponse<KeycloakCreateUserResponseDTO>> createUser(@Valid @RequestBody KeycloakCreateUserRequestDTO body) {
        return ResponseEntity.ok(ApiResponse.success(service.createUser(body)));
    }
}
