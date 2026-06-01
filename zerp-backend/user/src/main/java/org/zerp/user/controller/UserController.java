package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.user.dto.UserResponseDTO;
import org.zerp.user.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "Users", description = "API for managing users")
public class UserController extends ResourceController<UserResponseDTO, UserResponseDTO, Void, Void, UUID> {
    private final UserService service;

    @Override
    protected IResourceService<UserResponseDTO, UserResponseDTO, Void, Void, UUID> getService() {
        return service;
    }

    @Operation(summary = "Get currently authenticated user profile")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getCurrentUser() {
        return ResponseEntity.ok(buildResponse(service.findCurrentUser()));
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<UserResponseDTO>> create(Void data) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<UserResponseDTO>> patch(UUID uuid, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<UserResponseDTO>> update(UUID uuid, Void data) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<List<UUID>>> patchMany(List<UUID> id, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<Void>> delete(UUID uuid) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<List<UUID>>> deleteMany(List<UUID> id) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}
