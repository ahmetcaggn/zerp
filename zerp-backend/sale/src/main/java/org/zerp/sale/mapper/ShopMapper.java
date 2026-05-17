package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.zerp.common.entity.Shop;
import org.zerp.sale.dto.shop.ShopDTO;

@Mapper(componentModel = "spring")
public interface ShopMapper {
    @Mapping(source = "tenantId", target = "tenantId")
    @Mapping(source = "defaultMenuLanguage", target = "defaultMenuLanguage")
    ShopDTO toDTO(Shop entity);
}
