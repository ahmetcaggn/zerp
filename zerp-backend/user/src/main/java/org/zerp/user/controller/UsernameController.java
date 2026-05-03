package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.user.UsernameCheckResponseDTO;
import org.zerp.user.service.UsernameService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/usernames")
@Tag(name = "Usernames", description = "API for checking username availability")
public class UsernameController {
    private final UsernameService service;

    @GetMapping("/check")
    ResponseEntity<ApiResponse<UsernameCheckResponseDTO>> checkUsername(
            @NotBlank(message = "Username cannot be blank")
            @Pattern(
                    regexp = UsernameService.USERNAME_PATTERN_STRING,
                    message = UsernameService.USERNAME_VALIDATION_MESSAGE
            )
            @RequestParam(name = "username") String username) {
        return ResponseEntity.ok(ApiResponse.success(service.isUsernameAvailable(username)));
    }
}
