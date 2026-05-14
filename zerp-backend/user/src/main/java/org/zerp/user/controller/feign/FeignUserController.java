package org.zerp.user.controller.feign;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.user.service.FeignUserService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feign/users")
@Tag(name = "Feign User", description = "API for checking user existence and creating if not exist, used by other " +
        "services via Feign client")
@Hidden
public class FeignUserController {
    private final FeignUserService service;

    @PostMapping
    public ResponseEntity<ApiResponse<UserCheckResponseDTO>> checkUserExists(
            @RequestBody UserCreateIfNotExistRequestDTO request
    ) {
        if (request == null || request.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id is required");
        }

        UserCheckResponseDTO response = service.checkUserExists(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        service.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
