package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.MenuItemProduct;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.MenuItemProduct;
import org.zerp.sale.dto.menuitem.MenuItemCreateDTO;
import org.zerp.sale.dto.menuitem.MenuItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemProductItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemUpdateDTO;

import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface MenuItemMapper {
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "productLinks", ignore = true)
    MenuItem toEntity(MenuItemCreateDTO dto);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "tenantId", target = "tenantId")
    @Mapping(target = "productItems", expression = "java(toProductItems(entity.getProductLinks()))")
    MenuItemDTO toDTO(MenuItem entity);

    @Mapping(target = "productLinks", ignore = true)
    void updateEntityFromDTO(MenuItemUpdateDTO dto, @MappingTarget MenuItem entity);

    default List<MenuItemProductItemDTO> toProductItems(List<MenuItemProduct> productLinks) {
        if (productLinks == null || productLinks.isEmpty()) {
            return List.of();
        }
        return productLinks.stream()
                .sorted(Comparator.comparing(link -> link.getProduct().getName(), String.CASE_INSENSITIVE_ORDER))
                .map(this::toProductItem)
                .toList();
    }

    default MenuItemProductItemDTO toProductItem(MenuItemProduct productLink) {
        MenuItemProductItemDTO dto = new MenuItemProductItemDTO();
        dto.setProductId(productLink.getProduct().getId());
        dto.setQuantity(productLink.getQuantity());
        return dto;
    }
}
