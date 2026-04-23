package org.zerp.common.permission.entity;

public enum PermissionTargetType {
    TENANT,

    STOCK_RESOURCE,

    EMPLOYEE,

    // ticket
    TICKET,
    TICKET_HISTORY,
    TICKET_COMMENT,
    TICKET_ASSIGNMENT,
    TICKET_ATTACHMENT,
    TICKET_SLA_TRACKING,
    TICKET_WATCHER,

    // team
    TEAM,
    TEAM_MEMBER,


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
