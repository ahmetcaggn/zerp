package org.zerp.resource.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.zerp.common.entity.resource.StockMovement;
import org.zerp.resource.dto.stockmovement.StockMovementCreateDTO;
import org.zerp.resource.dto.stockmovement.StockMovementDTO;

@Mapper(componentModel = "spring")
public interface StockMovementMapper {
    @Mapping(source = "stockResourceId", target = "stockResource.id")
    StockMovement toEntity(StockMovementCreateDTO dto);

    @Mapping(source = "stockResource.id", target = "stockResourceId")
    @Mapping(source = "stockResource.name", target = "stockResourceName")
    @Mapping(source = "stockResource.tenantId", target = "tenantId")
    StockMovementDTO toDTO(StockMovement entity);
}
