package org.zerp.user.dto.permittable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermittableResponseDTO {
    private UUID id;
    private String title;
    private PermissionTargetType targetType;
}
