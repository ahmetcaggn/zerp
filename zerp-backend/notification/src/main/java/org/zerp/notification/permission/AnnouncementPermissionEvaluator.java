package org.zerp.notification.permission;
 
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;
 
import java.util.UUID;
 
@Component
@RequiredArgsConstructor
public class AnnouncementPermissionEvaluator {
    private final CommonPermissionService commonPermissionService;
    private final PermissionRepository permissionRepository;
 
    public boolean canReadAnnouncements(UUID userId, UUID tenantId) {
        if (userId == null || tenantId == null) {
            return false;
        }
        return commonPermissionService.isAdminAny(userId, tenantId)
                || permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId,
                PermissionTargetType.TENANT,
                PermissionAction.READ_ANNOUNCEMENT,
                tenantId
        );
    }
 
    public boolean canCreateAnnouncements(UUID userId, UUID tenantId) {
        if (userId == null || tenantId == null) {
            return false;
        }
        return commonPermissionService.isAdminAny(userId, tenantId)
                || permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId,
                PermissionTargetType.TENANT,
                PermissionAction.CREATE_ANNOUNCEMENT,
                tenantId
        );
    }
}
