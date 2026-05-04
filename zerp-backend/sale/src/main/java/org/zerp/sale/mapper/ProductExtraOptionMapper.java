package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.ProductExtraOption;
import org.zerp.common.entity.sale.ProductExtraOptionItem;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionCreateDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionItemCreateDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionItemDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionUpdateDTO;

@Mapper(componentModel = "spring")
public interface ProductExtraOptionMapper {
    @Mapping(source = "productId", target = "product.id")
    @Mapping(target = "items", ignore = true)
    ProductExtraOption toEntity(ProductExtraOptionCreateDTO dto);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.tenantId", target = "tenantId")
    ProductExtraOptionDTO toDTO(ProductExtraOption entity);

    @Mapping(source = "stockResourceId", target = "stockResource.id")
    ProductExtraOptionItem toItemEntity(ProductExtraOptionItemCreateDTO dto);

    @Mapping(source = "stockResource.id", target = "stockResourceId")
    @Mapping(source = "stockResource.name", target = "stockResourceName")
    ProductExtraOptionItemDTO toItemDTO(ProductExtraOptionItem entity);

    @Mapping(target = "items", ignore = true)
    void updateEntityFromDTO(ProductExtraOptionUpdateDTO dto, @MappingTarget ProductExtraOption entity);
}
