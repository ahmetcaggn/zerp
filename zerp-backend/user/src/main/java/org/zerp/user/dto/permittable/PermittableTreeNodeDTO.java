package org.zerp.user.dto.permittable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermittableTreeNodeDTO {
    private UUID id;
    private String title;
    private PermissionTargetType targetType;

    /**
     * Actions directly granted to the user on this node.
     * <p>
     * Empty when this node is an ancestor included only to keep the tree
     * connected — NOT because the user has a direct permission on it.
     * Actions are never inherited downward: a child node only shows its own grants.
     */
    private Set<PermissionAction> actions;

    /** Nested child nodes (same structure, recursively). */
    private List<PermittableTreeNodeDTO> children;
}
