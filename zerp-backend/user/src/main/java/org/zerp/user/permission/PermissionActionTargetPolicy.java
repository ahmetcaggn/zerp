package org.zerp.user.permission;

import lombok.Getter;
import org.springframework.stereotype.Component;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionActionSets;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Getter
@Component
public class PermissionActionTargetPolicy {
    private final Map<PermissionAction, List<PermissionTargetType>> assignableTargetsByAction;

    public PermissionActionTargetPolicy() {
        EnumMap<PermissionAction, List<PermissionTargetType>> map = new EnumMap<>(PermissionAction.class);

        for (PermissionAction action : PermissionAction.values()) {
            List<PermissionTargetType> assignableTargets = new ArrayList<>();
            PermissionTargetType current = action.minTargetType;
            while (current != null) {
                assignableTargets.add(current);
                current = current.parent;
            }

            if (PermissionActionSets.ASSIGNMENT_SCOPED_TICKET_ACTIONS.contains(action) &&
                    !assignableTargets.contains(PermissionTargetType.TEAM)) {
                assignableTargets.add(PermissionTargetType.TEAM);
            }

            map.put(action, Collections.unmodifiableList(assignableTargets));
        }

        this.assignableTargetsByAction = Collections.unmodifiableMap(map);
    }

    public boolean isAssignable(PermissionAction action, PermissionTargetType targetType) {
        if (action == null || targetType == null) {
            return false;
        }
        List<PermissionTargetType> assignableTargets = assignableTargetsByAction.get(action);
        return assignableTargets != null && assignableTargets.contains(targetType);
    }

}
