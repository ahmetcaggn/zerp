package org.zerp.sale.dto.shop;

public record ShopImageUploadResponseDTO(
        String imageId,
        String contentType,
        String originalFileName
) {
}
