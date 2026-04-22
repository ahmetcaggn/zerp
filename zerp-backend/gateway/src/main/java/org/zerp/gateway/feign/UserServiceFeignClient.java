package org.zerp.gateway.feign;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.ErrorDetails;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.common.dto.feign.user.UserServiceOperationResponse;
import reactor.core.publisher.Mono;

@Service
public class UserServiceFeignClient {

    private final WebClient.Builder webClientBuilder;

    public UserServiceFeignClient(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public Mono<UserServiceOperationResponse> createUserIfNotExists(UserCreateIfNotExistRequestDTO request) {
        return webClientBuilder.build()
                .post()
                .uri("lb://USER/feign/users")
                .bodyValue(request)
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return response.bodyToMono(new ParameterizedTypeReference<ApiResponse<UserCheckResponseDTO>>() {
                                })
                                .defaultIfEmpty(ApiResponse.success(UserCheckResponseDTO.builder().build()))
                                .map(body -> UserServiceOperationResponse.success(response.statusCode(), body));
                    }

                    return response.bodyToMono(new ParameterizedTypeReference<ApiResponse<ErrorDetails>>() {
                            })
                            .defaultIfEmpty(ApiResponse.<ErrorDetails>builder()
                                    .success(false)
                                    .statusCode(response.statusCode().value())
                                    .message("User service request failed")
                                    .data(ErrorDetails.of("USER_SERVICE_ERROR", "Unknown user service error"))
                                    .build())
                            .onErrorResume(_ -> Mono.just(ApiResponse.<ErrorDetails>builder()
                                    .success(false)
                                    .statusCode(response.statusCode().value())
                                    .message("User service request failed")
                                    .data(ErrorDetails.of("USER_SERVICE_ERROR", "Failed to parse user service error payload"))
                                    .build()))
                            .map(body -> UserServiceOperationResponse.error(response.statusCode(), body));
                });
    }
}
