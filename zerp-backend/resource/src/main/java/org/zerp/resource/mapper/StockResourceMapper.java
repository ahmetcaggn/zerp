package org.zerp.resource.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.resource.dto.resource.StockResourceCreateDTO;
import org.zerp.resource.dto.resource.StockResourceDTO;
import org.zerp.resource.dto.resource.StockResourceUpdateDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StockResourceMapper {

    @Mapping(source = "tenantId", target = "tenant.id")
    StockResource toEntity(StockResourceCreateDTO dto);

    @Mapping(source = "tenant.id", target = "tenantId")
    StockResourceDTO toDTO(StockResource entity);

    void updateEntityFromDTO(StockResourceUpdateDTO dto, @MappingTarget StockResource entity);

    @Mapping(source = "tenant.id", target = "tenantId")
    List<StockResourceDTO> toDTOList(List<StockResource> entities);
}

