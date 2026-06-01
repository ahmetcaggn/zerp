package org.zerp.common.permission.entity;

import java.util.List;

public enum PredefinedPermissionGroupCode {
    CASHIER(
            "Cashier",
            "Point-of-sale focused access for handling table orders and menu lookup.",
            PermissionGroupScopeType.SHOP,
            List.of(
                    PermissionAction.READ_SHOP,
                    PermissionAction.READ_SHOP_TABLE,
                    PermissionAction.READ_TABLE_ORDER,
                    PermissionAction.READ_SALE_HISTORY,
                    PermissionAction.CREATE_TABLE_ORDER,
                    PermissionAction.UPDATE_TABLE_ORDER,
                    PermissionAction.READ_MENU,
                    PermissionAction.READ_MENU_CATEGORY,
                    PermissionAction.READ_MENU_ITEM,
                    PermissionAction.READ_PRODUCT,
                    PermissionAction.READ_PRODUCT_EXTRA_OPTION
            )),
    WAITER(
            "Waiter",
            "Floor-service access for managing active tables and table orders.",
            PermissionGroupScopeType.SHOP,
            List.of(
                    PermissionAction.READ_SHOP,
                    PermissionAction.READ_SHOP_TABLE,
                    PermissionAction.READ_TABLE_ORDER,
                    PermissionAction.CREATE_TABLE_ORDER,
                    PermissionAction.UPDATE_TABLE_ORDER,
                    PermissionAction.READ_MENU,
                    PermissionAction.READ_MENU_CATEGORY,
                    PermissionAction.READ_MENU_ITEM
            )),
    STOCK_MANAGER(
            "Stock Manager",
            "Inventory-focused access for stock resources, movements, and counts.",
            PermissionGroupScopeType.SHOP,
            List.of(
                    PermissionAction.READ_SHOP,
                    PermissionAction.READ_STOCK_RESOURCE,
                    PermissionAction.CREATE_STOCK_RESOURCE,
                    PermissionAction.UPDATE_STOCK_RESOURCE,
                    PermissionAction.READ_STOCK_MOVEMENT,
                    PermissionAction.CREATE_STOCK_MOVEMENT,
                    PermissionAction.CREATE_STOCK_ENTRY,
                    PermissionAction.CREATE_STOCK_ADJUSTMENT,
                    PermissionAction.CREATE_STOCK_WASTE,
                    PermissionAction.CREATE_STOCK_RETURN,
                    PermissionAction.READ_STOCK_COUNT,
                    PermissionAction.CREATE_STOCK_COUNT,
                    PermissionAction.UPDATE_STOCK_COUNT,
                    PermissionAction.APPROVE_STOCK_COUNT
            )),
    CATALOG_MANAGER(
            "Catalog Manager",
            "Catalog management access for products, recipes, extra options, and menus.",
            PermissionGroupScopeType.SHOP,
            List.of(
                    PermissionAction.READ_SHOP,
                    PermissionAction.READ_PRODUCT,
                    PermissionAction.CREATE_PRODUCT,
                    PermissionAction.UPDATE_PRODUCT,
                    PermissionAction.READ_PRODUCT_RECIPE,
                    PermissionAction.CREATE_PRODUCT_RECIPE,
                    PermissionAction.UPDATE_PRODUCT_RECIPE,
                    PermissionAction.READ_PRODUCT_EXTRA_OPTION,
                    PermissionAction.CREATE_PRODUCT_EXTRA_OPTION,
                    PermissionAction.UPDATE_PRODUCT_EXTRA_OPTION,
                    PermissionAction.READ_MENU,
                    PermissionAction.CREATE_MENU,
                    PermissionAction.UPDATE_MENU,
                    PermissionAction.READ_MENU_CATEGORY,
                    PermissionAction.CREATE_MENU_CATEGORY,
                    PermissionAction.UPDATE_MENU_CATEGORY,
                    PermissionAction.READ_MENU_ITEM,
                    PermissionAction.CREATE_MENU_ITEM,
                    PermissionAction.UPDATE_MENU_ITEM
            )),
    TENANT_SUPERVISOR(
            "Tenant Supervisor",
            "Tenant-level oversight for people, tickets, and teams.",
            PermissionGroupScopeType.TENANT,
            List.of(
                    PermissionAction.READ_TENANT,
                    PermissionAction.UPDATE_TENANT,
                    PermissionAction.READ_EMPLOYEE,
                    PermissionAction.CREATE_EMPLOYEE,
                    PermissionAction.UPDATE_EMPLOYEE,
                    PermissionAction.READ_USER,
                    PermissionAction.READ_PERMISSION,
                    PermissionAction.READ_TICKET,
                    PermissionAction.CREATE_TICKET,
                    PermissionAction.UPDATE_TICKET,
                    PermissionAction.READ_TICKET_COMMENT,
                    PermissionAction.CREATE_TICKET_COMMENT,
                    PermissionAction.READ_TICKET_HISTORY,
                    PermissionAction.READ_TEAM,
                    PermissionAction.CREATE_TEAM,
                    PermissionAction.UPDATE_TEAM,
                    PermissionAction.READ_TEAM_MEMBER,
                    PermissionAction.CREATE_TEAM_MEMBER,
                    PermissionAction.UPDATE_TEAM_MEMBER
            ));

    private final String displayName;
    private final String description;
    private final PermissionGroupScopeType scopeType;
    private final List<PermissionAction> actions;

    PredefinedPermissionGroupCode(
            String displayName,
            String description,
            PermissionGroupScopeType scopeType,
            List<PermissionAction> actions
    ) {
        this.displayName = displayName;
        this.description = description;
        this.scopeType = scopeType;
        this.actions = List.copyOf(actions);
    }

    public String displayName() {
        return displayName;
    }

    public String description() {
        return description;
    }

    public PermissionGroupScopeType scopeType() {
        return scopeType;
    }

    public List<PermissionAction> actions() {
        return actions;
    }
}
