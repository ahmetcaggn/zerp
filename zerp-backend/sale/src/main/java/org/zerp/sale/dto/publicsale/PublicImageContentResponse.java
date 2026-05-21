package org.zerp.sale.dto.publicsale;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

public record PublicImageContentResponse(
        Resource resource,
        MediaType contentType
) {
}
