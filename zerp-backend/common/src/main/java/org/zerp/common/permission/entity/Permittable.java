package org.zerp.common.permission.entity;

import java.util.UUID;

public interface Permittable {
    UUID getId();

    String getTitle();

    Permittable getParent();
}
