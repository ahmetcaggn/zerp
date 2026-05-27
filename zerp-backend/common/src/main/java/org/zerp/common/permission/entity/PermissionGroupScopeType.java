package org.zerp.common.permission.entity;

public enum PermissionGroupScopeType {
    TENANT,
    SHOP;

    public PermissionTargetType toTargetType() {
        return switch (this) {
            case TENANT -> PermissionTargetType.TENANT;
            case SHOP -> PermissionTargetType.SHOP;
        };
    }
}
