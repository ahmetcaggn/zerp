package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.Product;
import org.zerp.sale.dto.product.ProductCreateDTO;
import org.zerp.sale.dto.product.ProductDTO;
import org.zerp.sale.dto.product.ProductUpdateDTO;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "shop", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "metric", ignore = true)
    @Mapping(target = "menuItem", ignore = true)
    Product toEntity(ProductCreateDTO dto);

    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "shop.name", target = "shopName")
    @Mapping(source = "type.id", target = "typeId")
    @Mapping(source = "type.name", target = "typeName")
    @Mapping(source = "metric.id", target = "metricId")
    @Mapping(source = "metric.name", target = "metricName")
    @Mapping(source = "menuItem.id", target = "menuItemId")
    @Mapping(source = "tenantId", target = "tenantId")
    ProductDTO toDTO(Product entity);

    @Mapping(target = "type", ignore = true)
    @Mapping(target = "metric", ignore = true)
    @Mapping(target = "menuItem", ignore = true)
    void updateEntityFromDTO(ProductUpdateDTO dto, @MappingTarget Product entity);
}
