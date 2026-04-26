package org.zerp.common.dto.feign.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateIfNotExistRequestDTO {
    private UUID id;
    private String username;
    private String email;
    private UUID tenantId;
}
