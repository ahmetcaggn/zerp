package org.zerp.sale.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.zerp.common.entity.sale.TableOrder;
import org.zerp.common.entity.sale.TableOrderItem;
import org.zerp.sale.dto.tableorder.TableOrderDTO;
import org.zerp.sale.dto.tableorder.TableOrderItemDTO;

@Mapper(componentModel = "spring")
public interface TableOrderMapper {

    @Mapping(source = "shopTable.id", target = "shopTableId")
    @Mapping(source = "shopTable.name", target = "shopTableName")
    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "shop.name", target = "shopName")
    @Mapping(source = "tenantId", target = "tenantId")
    TableOrderDTO toDTO(TableOrder entity);

    @Mapping(source = "menuItem.id", target = "menuItemId")
    @Mapping(source = "menuItem.name", target = "menuItemName")
    TableOrderItemDTO toItemDTO(TableOrderItem item);
}
