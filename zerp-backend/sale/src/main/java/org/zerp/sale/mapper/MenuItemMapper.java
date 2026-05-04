package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.sale.dto.menuitem.MenuItemCreateDTO;
import org.zerp.sale.dto.menuitem.MenuItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemUpdateDTO;

@Mapper(componentModel = "spring")
public interface MenuItemMapper {
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "products", ignore = true)
    MenuItem toEntity(MenuItemCreateDTO dto);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "tenantId", target = "tenantId")
    @Mapping(target = "productIds", expression = "java(entity.getProducts() == null ? java.util.List.of() : entity.getProducts().stream().map(org.zerp.common.entity.sale.Product::getId).collect(java.util.stream.Collectors.toList()))")
    MenuItemDTO toDTO(MenuItem entity);

    @Mapping(target = "products", ignore = true)
    void updateEntityFromDTO(MenuItemUpdateDTO dto, @MappingTarget MenuItem entity);
}
