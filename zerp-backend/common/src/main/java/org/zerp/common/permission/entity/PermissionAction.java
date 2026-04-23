package org.zerp.common.permission.entity;

import static org.zerp.common.permission.entity.PermissionTargetType.*;

public enum PermissionAction {
    // TENANT level
    ADMIN_TENANT(TENANT),
    UPDATE_TENANT(TENANT),
    READ_TENANT(TENANT),
    CREATE_STOCK_RESOURCE(TENANT),
    CREATE_EMPLOYEE(TENANT),

    // STOCK_RESOURCE level
    ADMIN_STOCK_RESOURCE(STOCK_RESOURCE),
    UPDATE_STOCK_RESOURCE(STOCK_RESOURCE),
    DELETE_STOCK_RESOURCE(STOCK_RESOURCE),
    READ_STOCK_RESOURCE(STOCK_RESOURCE),

    // EMPLOYEE level
    READ_EMPLOYEE(EMPLOYEE),
    UPDATE_EMPLOYEE(EMPLOYEE),
    DELETE_EMPLOYEE(EMPLOYEE),

    // TICKET level
    READ_TICKET(TICKET),
    UPDATE_TICKET(TICKET),
    DELETE_TICKET(TICKET),

    // TICKET_HISTORY level
    READ_TICKET_HISTORY(TICKET_HISTORY),
    UPDATE_TICKET_HISTORY(TICKET_HISTORY),
    DELETE_TICKET_HISTORY(TICKET_HISTORY)
    ;

    PermissionAction(PermissionTargetType minTargetType) {
        this.minTargetType = minTargetType;
    }

    public final PermissionTargetType minTargetType;
}
