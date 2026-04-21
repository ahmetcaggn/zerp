package org.zerp.common.permission.entity;

import static org.zerp.common.permission.entity.PermissionTargetType.*;

public enum PermissionAction {
    // TENANT level
    ADMIN_TENANT(TENANT),
    UPDATE_TENANT(TENANT),
    READ_TENANT(TENANT),
    CREATE_STOCK_RESOURCE(TENANT),

    // STOCK_RESOURCE level
    ADMIN_STOCK_RESOURCE(STOCK_RESOURCE),
    UPDATE_STOCK_RESOURCE(STOCK_RESOURCE),
    DELETE_STOCK_RESOURCE(STOCK_RESOURCE),
    READ_STOCK_RESOURCE(STOCK_RESOURCE)
    ;

    PermissionAction(PermissionTargetType minTargetType) {
        this.minTargetType = minTargetType;
    }

    public final PermissionTargetType minTargetType;
}
