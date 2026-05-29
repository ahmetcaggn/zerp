package org.zerp.sale.dto.shop;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

public record ShopImageContentResponseDTO(
        Resource resource,
        MediaType contentType
) {
}
