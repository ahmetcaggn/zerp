package org.zerp.sale.dto.publicsale;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PublicShopMenuResponseDTO {
    private UUID shopId;
    private PublicActiveMenuDTO activeMenu;
    private List<PublicMenuCategoryDTO> categories;
    private String message;
}
