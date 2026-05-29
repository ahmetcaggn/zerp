package org.zerp.user.dto.tenant;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

public record TenantImageContentResponseDTO(
        Resource resource,
        MediaType contentType
) {
}
