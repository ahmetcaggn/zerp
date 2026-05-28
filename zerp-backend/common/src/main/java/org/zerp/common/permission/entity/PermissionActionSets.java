package org.zerp.common.permission.entity;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

public final class PermissionActionSets {
    private PermissionActionSets() {
    }

    public static final Set<PermissionAction> ASSIGNMENT_SCOPED_TICKET_ACTIONS =
            Collections.unmodifiableSet(EnumSet.of(
                    PermissionAction.CREATE_TICKET,
                    PermissionAction.READ_TICKET,
                    PermissionAction.UPDATE_TICKET,
                    PermissionAction.DELETE_TICKET,
                    PermissionAction.READ_TICKET_HISTORY,
                    PermissionAction.CREATE_TICKET_COMMENT,
                    PermissionAction.READ_TICKET_COMMENT,
                    PermissionAction.UPDATE_TICKET_COMMENT,
                    PermissionAction.DELETE_TICKET_COMMENT,
                    PermissionAction.CREATE_TICKET_ASSIGNMENT,
                    PermissionAction.READ_TICKET_ASSIGNMENT,
                    PermissionAction.UPDATE_TICKET_ASSIGNMENT,
                    PermissionAction.DELETE_TICKET_ASSIGNMENT,
                    PermissionAction.CREATE_TICKET_ATTACHMENT,
                    PermissionAction.READ_TICKET_ATTACHMENT,
                    PermissionAction.UPDATE_TICKET_ATTACHMENT,
                    PermissionAction.DELETE_TICKET_ATTACHMENT,
                    PermissionAction.READ_TICKET_SLA_TRACKING,
                    PermissionAction.CREATE_TICKET_WATCHER,
                    PermissionAction.READ_TICKET_WATCHER,
                    PermissionAction.UPDATE_TICKET_WATCHER,
                    PermissionAction.DELETE_TICKET_WATCHER
            ));
}
