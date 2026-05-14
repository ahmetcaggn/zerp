package org.zerp.common.permission.entity;

public enum PermissionTargetType {
    TENANT_ROOT(null),

    TENANT(TENANT_ROOT),

    USER(TENANT),

    EMPLOYEE(TENANT),

    // ticket
    TICKET(TENANT),
    TICKET_HISTORY(TICKET),
    TICKET_COMMENT(TICKET),
    TICKET_ASSIGNMENT(TICKET),
    TICKET_ATTACHMENT(TICKET),
    TICKET_SLA_TRACKING(TICKET),
    TICKET_WATCHER(TICKET),

    // team
    TEAM(TENANT),
    TEAM_MEMBER(TEAM),

    // shop
    SHOP(TENANT),
    SHOP_TABLE(SHOP),

    // stock management
    STOCK_COUNT(SHOP),
    STOCK_RESOURCE(SHOP),
    STOCK_MOVEMENT(STOCK_RESOURCE),

    // product
    PRODUCT(SHOP),
    PRODUCT_RECIPE(PRODUCT),
    PRODUCT_EXTRA_OPTION(PRODUCT),

    // menu
    MENU(SHOP),
    MENU_CATEGORY(MENU),
    MENU_ITEM(MENU_CATEGORY),
    ;

    public final PermissionTargetType parent;

    PermissionTargetType(PermissionTargetType parent) {
        this.parent = parent;
    }

    static PermissionTargetType fromType(Class<? extends Permittable> type) {
        final var annotation = type.getAnnotation(PermissionTargetTypeAnnotation.class);
        if (annotation == null) {
            throw new IllegalArgumentException("Class " + type.getName() +
                    " does not have PermissionTargetTypeAnnotation");
        }
        return annotation.type();
    }
}
