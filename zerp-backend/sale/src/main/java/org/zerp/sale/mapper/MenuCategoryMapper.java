package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.sale.dto.menucategory.MenuCategoryCreateDTO;
import org.zerp.sale.dto.menucategory.MenuCategoryDTO;
import org.zerp.sale.dto.menucategory.MenuCategoryUpdateDTO;

@Mapper(componentModel = "spring")
public interface MenuCategoryMapper {
    @Mapping(source = "menuId", target = "menu.id")
    MenuCategory toEntity(MenuCategoryCreateDTO dto);

    @Mapping(source = "menu.id", target = "menuId")
    @Mapping(source = "menu.name", target = "menuName")
    @Mapping(source = "tenantId", target = "tenantId")
    MenuCategoryDTO toDTO(MenuCategory entity);

    void updateEntityFromDTO(MenuCategoryUpdateDTO dto, @MappingTarget MenuCategory entity);
}
