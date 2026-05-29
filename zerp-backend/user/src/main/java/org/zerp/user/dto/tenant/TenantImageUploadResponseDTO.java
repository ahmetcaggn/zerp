package org.zerp.user.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TenantImageUploadResponseDTO {
    private String imageId;
    private String contentType;
    private String originalFileName;
}
