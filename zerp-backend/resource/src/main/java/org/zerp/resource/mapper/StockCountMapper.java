package org.zerp.resource.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.resource.StockCount;
import org.zerp.common.entity.resource.StockCountItem;
import org.zerp.resource.dto.stockcount.StockCountCreateDTO;
import org.zerp.resource.dto.stockcount.StockCountDTO;
import org.zerp.resource.dto.stockcount.StockCountItemDTO;
import org.zerp.resource.dto.stockcount.StockCountUpdateDTO;

@Mapper(componentModel = "spring")
public interface StockCountMapper {
    @Mapping(source = "shopId", target = "shop.id")
    StockCount toEntity(StockCountCreateDTO dto);

    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "shop.name", target = "shopName")
    @Mapping(source = "shop.tenantId", target = "tenantId")
    StockCountDTO toDTO(StockCount entity);

    @Mapping(source = "stockResource.id", target = "stockResourceId")
    @Mapping(source = "stockResource.name", target = "stockResourceName")
    @Mapping(source = "stockResource.unitType.abbreviation", target = "unitTypeAbbreviation")
    StockCountItemDTO toItemDTO(StockCountItem entity);

    void updateEntityFromDTO(StockCountUpdateDTO dto, @MappingTarget StockCount entity);
}
