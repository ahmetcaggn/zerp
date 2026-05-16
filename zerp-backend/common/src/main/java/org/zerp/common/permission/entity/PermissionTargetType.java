package org.zerp.common.permission.entity;

public enum PermissionTargetType {
    TENANT_ROOT(null, null),

    TENANT(TENANT_ROOT, null),

    USER(TENANT, "tenantId"),

    EMPLOYEE(TENANT, "tenantId"),

    // ticket
    TICKET(TENANT, "tenantId"),
    TICKET_HISTORY(TICKET, "ticket.id"),
    TICKET_COMMENT(TICKET, "ticket.id"),
    TICKET_ASSIGNMENT(TICKET, "ticket.id"),
    TICKET_ATTACHMENT(TICKET, "ticket.id"),
    TICKET_SLA_TRACKING(TICKET, "ticket.id"),
    TICKET_WATCHER(TICKET, "ticket.id"),

    // team
    TEAM(TENANT, "tenantId"),
    TEAM_MEMBER(TEAM, "team.id"),

    // shop
    SHOP(TENANT, "tenantId"),

    // stock management
    STOCK_COUNT(SHOP, "shop.id"),
    STOCK_RESOURCE(SHOP, "shop.id"),
    STOCK_MOVEMENT(STOCK_RESOURCE, "stockResource.id"),

    // product
    PRODUCT(SHOP, "shop.id"),
    PRODUCT_RECIPE(PRODUCT, "product.id"),
    PRODUCT_EXTRA_OPTION(PRODUCT, "product.id"),

    // menu
    MENU(SHOP, "shop.id"),
    MENU_CATEGORY(MENU, "menu.id"),
    MENU_ITEM(MENU_CATEGORY, "menuCategory.id"),

    // table management
    SHOP_TABLE(SHOP, "shop.id"),
    TABLE_ORDER(SHOP_TABLE, "shop_table.id"),
    ;

    public final PermissionTargetType parent;
    public final String parentIdFilter;

    PermissionTargetType(PermissionTargetType parent, String parentIdFilter) {
        this.parent = parent;
        this.parentIdFilter = parentIdFilter;
    }

    public static PermissionTargetType fromType(Class<? extends Permittable> type) {
        final var annotation = type.getAnnotation(PermissionTargetTypeAnnotation.class);
        if (annotation == null) {
            throw new IllegalArgumentException("Class " + type.getName() +
                    " does not have PermissionTargetTypeAnnotation");
        }
        return annotation.type();
    }
}
