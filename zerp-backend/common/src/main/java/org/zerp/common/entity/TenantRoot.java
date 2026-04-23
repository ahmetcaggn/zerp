package org.zerp.common.entity;

import lombok.Getter;
import org.zerp.common.permission.entity.Permittable;

import java.util.UUID;

@Getter
public class TenantRoot implements Permittable {
    private TenantRoot() {};

    public static final TenantRoot INSTANCE = new TenantRoot();

    private final UUID id = new UUID(0L, 0L);

    @Override
    public Permittable getParent() {
        // in permittable hierarchy, tenant is the root, so it has no parent
        return null;
    }
}
