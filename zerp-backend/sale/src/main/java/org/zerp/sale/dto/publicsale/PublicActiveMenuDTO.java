package org.zerp.sale.dto.publicsale;

import lombok.Data;
import org.zerp.common.entity.sale.MenuLanguage;

import java.util.UUID;

@Data
public class PublicActiveMenuDTO {
    private UUID id;
    private String name;
    private String description;
    private boolean isActive;
    private MenuLanguage language;
}
