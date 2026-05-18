package org.zerp.sale.dto.adminshop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminShopNameCheckResponseDTO {
    private UUID tenantId;
    private String name;
    private Boolean available;
}
