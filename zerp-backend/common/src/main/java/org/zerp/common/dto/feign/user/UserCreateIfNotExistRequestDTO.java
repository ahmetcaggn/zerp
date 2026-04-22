package org.zerp.common.dto.feign.user;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserCreateIfNotExistRequestDTO {
    private UUID id;
    private String username;
    private String email;
}
