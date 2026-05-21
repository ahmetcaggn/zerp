package org.zerp.sale.dto.menu;

import lombok.Data;
import org.zerp.common.entity.sale.MenuLanguage;

import java.util.UUID;

@Data
public class MenuDTO {
    private UUID id;
    private String name;
    private String description;
    private boolean isActive;
    private MenuLanguage language;
    private UUID shopId;
    private String shopName;
    private UUID tenantId;
}
