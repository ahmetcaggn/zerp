package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.zerp.common.entity.sale.MenuItemProduct;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.sale.dto.menuitem.MenuItemProductDTO;
import org.zerp.sale.dto.menuitem.MenuItemCreateDTO;
import org.zerp.sale.dto.menuitem.MenuItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemUpdateDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface MenuItemMapper {
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "productItems", ignore = true)
    MenuItem toEntity(MenuItemCreateDTO dto);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "tenantId", target = "tenantId")
    @Mapping(target = "productIds", expression = "java(mapProductIds(entity))")
    @Mapping(target = "productItems", expression = "java(mapProductItems(entity))")
    MenuItemDTO toDTO(MenuItem entity);

    @Mapping(target = "productItems", ignore = true)
    @Mapping(target = "products", ignore = true)
    void updateEntityFromDTO(MenuItemUpdateDTO dto, @MappingTarget MenuItem entity);

    default List<UUID> mapProductIds(MenuItem entity) {
        if (entity.getProductItems() == null || entity.getProductItems().isEmpty()) {
            if (entity.getProducts() == null || entity.getProducts().isEmpty()) {
                return List.of();
            }
            return entity.getProducts().stream().map(org.zerp.common.entity.sale.Product::getId).toList();
        }

        List<UUID> result = new ArrayList<>();
        for (MenuItemProduct item : entity.getProductItems()) {
            if (item == null || item.getProduct() == null || item.getProduct().getId() == null) {
                continue;
            }
            int qty = item.getQuantity() == null || item.getQuantity() < 1 ? 1 : item.getQuantity();
            for (int i = 0; i < qty; i += 1) {
                result.add(item.getProduct().getId());
            }
        }
        return result;
    }

    default List<MenuItemProductDTO> mapProductItems(MenuItem entity) {
        if (entity.getProductItems() == null || entity.getProductItems().isEmpty()) {
            if (entity.getProducts() == null || entity.getProducts().isEmpty()) {
                return List.of();
            }
            return entity.getProducts().stream().map(product -> {
                MenuItemProductDTO dto = new MenuItemProductDTO();
                dto.setProductId(product.getId());
                dto.setProductName(product.getName());
                dto.setQuantity(1);
                return dto;
            }).toList();
        }

        return entity.getProductItems().stream().map(item -> {
            MenuItemProductDTO dto = new MenuItemProductDTO();
            if (item.getProduct() != null) {
                dto.setProductId(item.getProduct().getId());
                dto.setProductName(item.getProduct().getName());
            }
            dto.setQuantity(item.getQuantity() == null || item.getQuantity() < 1 ? 1 : item.getQuantity());
            return dto;
        }).toList();
    }
}
