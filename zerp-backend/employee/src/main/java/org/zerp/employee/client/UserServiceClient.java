package org.zerp.employee.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserResponseDTO;
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

    @PostMapping("/feign/users")
    ResponseEntity<ApiResponse<UserCheckResponseDTO>> saveUserToDb(@RequestBody UserCreateIfNotExistRequestDTO request);

    @DeleteMapping("/feign/users/{id}")
    ResponseEntity<ApiResponse<Void>> deleteUserFromDb(@PathVariable UUID id);
}
