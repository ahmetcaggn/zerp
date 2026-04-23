package org.zerp.common.permission.entity;

public enum PermissionTargetType {
    TENANT,

    STOCK_RESOURCE,

    EMPLOYEE,

    // ticket
    TICKET,
    TICKET_HISTORY,


    SHOP,
    ;

    static PermissionTargetType fromType(Class<Permittable> type) {
        final var annotation = type.getAnnotation(PermissionTargetTypeAnnotation.class);
        if (annotation == null) {
            throw new IllegalArgumentException("Class " + type.getName() +
                    " does not have PermissionTargetTypeAnnotation");
        }
        return annotation.type();
    }
}
