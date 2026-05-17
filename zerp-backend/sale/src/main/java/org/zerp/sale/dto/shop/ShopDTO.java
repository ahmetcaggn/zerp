package org.zerp.sale.dto.shop;

import lombok.Data;
import org.zerp.common.entity.sale.MenuLanguage;

import java.util.UUID;

@Data
public class ShopDTO {
    private UUID id;
    private String name;
    private String description;
    private MenuLanguage defaultMenuLanguage;
    private UUID tenantId;
}
