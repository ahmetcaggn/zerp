package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.user.dto.UserResponseDTO;
import org.zerp.user.service.UserService;

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
}
