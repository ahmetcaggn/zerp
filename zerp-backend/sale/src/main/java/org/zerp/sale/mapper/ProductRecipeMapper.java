package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.ProductRecipe;
import org.zerp.common.entity.sale.ProductRecipeItem;
import org.zerp.sale.dto.productrecipe.ProductRecipeCreateDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeItemCreateDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeItemDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeUpdateDTO;

@Mapper(componentModel = "spring")
public interface ProductRecipeMapper {
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "items", ignore = true)
    ProductRecipe toEntity(ProductRecipeCreateDTO dto);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.tenantId", target = "tenantId")
    ProductRecipeDTO toDTO(ProductRecipe entity);

    @Mapping(target = "stockResource", ignore = true)
    ProductRecipeItem toItemEntity(ProductRecipeItemCreateDTO dto);

    @Mapping(source = "stockResource.id", target = "stockResourceId")
    @Mapping(source = "stockResource.name", target = "stockResourceName")
    ProductRecipeItemDTO toItemDTO(ProductRecipeItem entity);

    @Mapping(target = "items", ignore = true)
    void updateEntityFromDTO(ProductRecipeUpdateDTO dto, @MappingTarget ProductRecipe entity);
}
