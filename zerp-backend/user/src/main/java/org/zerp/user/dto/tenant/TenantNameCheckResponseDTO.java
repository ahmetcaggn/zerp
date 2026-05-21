package org.zerp.user.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantNameCheckResponseDTO {
    private String name;
    private Boolean available;
}
