package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.Hidden;
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
import org.zerp.user.dto.permittable.PermittableResponseDTO;
import org.zerp.user.dto.permittable.PermittableTreeNodeDTO;
import org.zerp.user.service.PermittableService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/user/permittables")
@RequiredArgsConstructor
@Tag(name = "Permittables", description = "API for searching permittable objects (permission targets)")
public class PermittableController extends ResourceController<PermittableResponseDTO, PermittableResponseDTO, Void, Void, UUID> {
    private final PermittableService service;

    @Override
    protected PermittableService getService() {
        return service;
    }

    @GetMapping("/tree")
    public ResponseEntity<ApiResponse<PermittableTreeNodeDTO>> getTree() {
        PermittableTreeNodeDTO tree = service.getPermittableTree();
        return ResponseEntity.ok(ApiResponse.success(tree));
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<List<UUID>>> deleteMany(List<UUID> id) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<Void>> delete(UUID uuid) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<List<UUID>>> patchMany(List<UUID> id, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<PermittableResponseDTO>> update(UUID uuid, Void data) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<PermittableResponseDTO>> patch(UUID uuid, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<PermittableResponseDTO>> create(Void data) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<PermittableResponseDTO>> getOne(UUID uuid) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Hidden
    public ResponseEntity<ApiResponse<List<PermittableResponseDTO>>> getMany(List<UUID> id) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}
