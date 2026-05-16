package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.sale.dto.shoptable.ShopTableCreateDTO;
import org.zerp.sale.dto.shoptable.ShopTableDTO;
import org.zerp.sale.dto.shoptable.ShopTableUpdateDTO;

@Mapper(componentModel = "spring")
public interface ShopTableMapper {

    @Mapping(target = "shop", ignore = true)
    ShopTable toEntity(ShopTableCreateDTO dto);

    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "shop.name", target = "shopName")
    @Mapping(source = "tenantId", target = "tenantId")
    ShopTableDTO toDTO(ShopTable entity);

    void updateEntityFromDTO(ShopTableUpdateDTO dto, @MappingTarget ShopTable entity);
}
