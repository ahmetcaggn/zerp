package org.zerp.resource.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.resource.dto.resource.StockResourceCreateDTO;
import org.zerp.resource.dto.resource.StockResourceDTO;
import org.zerp.resource.dto.resource.StockResourceUpdateDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface StockResourceMapper {
    @Mapping(target = "shop", ignore = true)
    StockResource toEntity(StockResourceCreateDTO dto);

    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "shop.name", target = "shopName")
    @Mapping(source = "tenantId", target = "tenantId")
    StockResourceDTO toDTO(StockResource entity);

    void updateEntityFromDTO(StockResourceUpdateDTO dto, @MappingTarget StockResource entity);
}
