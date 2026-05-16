package org.zerp.employee.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserResponseDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakUpdateUserRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakUpdateUserResponseDTO;
import org.zerp.common.dto.user.UsernameCheckResponseDTO;

import java.util.UUID;

@FeignClient(name = "USER")
public interface UserServiceClient {

    @GetMapping("/user/usernames/check")
    ResponseEntity<ApiResponse<UsernameCheckResponseDTO>> checkUsername(@RequestParam String username);

    @PostMapping("/feign/keycloak/users")
    ResponseEntity<ApiResponse<KeycloakCreateUserResponseDTO>> createKeycloakUser(@RequestBody KeycloakCreateUserRequestDTO request);

    @DeleteMapping("/feign/keycloak/users/{id}")
    ResponseEntity<ApiResponse<Void>> deleteKeycloakUser(@PathVariable UUID id);

    @PutMapping("/feign/keycloak/users/{id}")
    ResponseEntity<ApiResponse<KeycloakUpdateUserResponseDTO>> updateKeycloakUser(@PathVariable UUID id, @RequestBody KeycloakUpdateUserRequestDTO request);
}
