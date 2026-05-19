package org.zerp.sale.dto.menuitem;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MenuItemImageUploadResponseDTO {
    private String imageId;
    private String contentType;
    private String originalFileName;
}
