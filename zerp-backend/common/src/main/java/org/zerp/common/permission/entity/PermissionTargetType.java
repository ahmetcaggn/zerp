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

    private static Class<?> resolveActualClass(Object entity) {
        if (entity instanceof org.hibernate.proxy.HibernateProxy proxy) {
            return proxy.getHibernateLazyInitializer().getPersistentClass();
        }
        return entity.getClass();
    }

    public static PermissionTargetType fromType(Object entity) {
        if (entity == null) {
            throw new IllegalArgumentException("Entity cannot be null");
        }

        Class<?> actualClass = resolveActualClass(entity);
        final var annotation = actualClass.getDeclaredAnnotation(PermissionTargetTypeAnnotation.class);

        if (annotation == null) {
            throw new IllegalArgumentException("Class " + actualClass.getName() +
                    " does not have PermissionTargetTypeAnnotation");
        }
        return annotation.type();
    }
}
