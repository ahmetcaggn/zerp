package org.zerp.user.controller.feign;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.user.service.FeignUserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feign/users")
public class FeignUserController {
    private final FeignUserService service;

    @PostMapping
    ResponseEntity<UserCheckResponseDTO> checkUserExists(UserCreateIfNotExistRequestDTO request) {
        return ResponseEntity.ok(service.checkUserExists(request));
    }
}
