package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.Menu;
import org.zerp.sale.dto.menu.MenuCreateDTO;
import org.zerp.sale.dto.menu.MenuDTO;
import org.zerp.sale.dto.menu.MenuUpdateDTO;

@Mapper(componentModel = "spring")
public interface MenuMapper {
    @Mapping(target = "shop", ignore = true)
    Menu toEntity(MenuCreateDTO dto);

    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "shop.name", target = "shopName")
    @Mapping(source = "tenantId", target = "tenantId")
    @Mapping(source = "language", target = "language")
    MenuDTO toDTO(Menu entity);

    @Mapping(target = "active", ignore = true)
    void updateEntityFromDTO(MenuUpdateDTO dto, @MappingTarget Menu entity);
}
