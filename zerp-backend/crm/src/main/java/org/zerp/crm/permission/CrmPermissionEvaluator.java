package org.zerp.crm.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.PermittableService;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Component
@RequiredArgsConstructor
public class CrmPermissionEvaluator {
    public record TenantRootParent() {
    }

    public record TenantParent(UUID tenantId) {
    }

    public record TeamParent(UUID teamId, UUID tenantId) {
    }

    public record TeamTarget(UUID teamId, UUID tenantId) {
    }

    public record TeamMemberTarget(UUID teamMemberId, UUID teamId, UUID tenantId) {
    }

    public record TicketParent(UUID ticketId, UUID tenantId) {
    }

    public record TicketTarget(UUID ticketId, UUID tenantId) {
    }

    public record TicketChildTarget(UUID childId, UUID ticketId, UUID tenantId) {
    }

    public record TicketAttachmentParent(UUID commentId, UUID ticketId, UUID tenantId) {
    }

    public record TicketAttachmentTarget(UUID attachmentId, UUID commentId, UUID ticketId, UUID tenantId) {
    }

    private final PermissionRepository permissionRepository;
    private final PermittableService permittableService;

    // =============================================
    // TEAM
    // =============================================

    public boolean canReadTeam(UUID userId, TeamTarget target) {
        return hasTeamHierarchyPermission(
                userId, PermissionAction.READ_TEAM, target.teamId(), target.tenantId());
    }

    public boolean canCreateTeam(UUID userId, TenantParent parent) {
        return hasTeamHierarchyPermission(
                userId, PermissionAction.CREATE_TEAM, null, parent.tenantId());
    }

    public boolean canUpdateTeam(UUID userId, TeamTarget target) {
        return hasTeamHierarchyPermission(
                userId, PermissionAction.UPDATE_TEAM, target.teamId(), target.tenantId());
    }

    public boolean canPatchTeam(UUID userId, TeamTarget target) {
        return canUpdateTeam(userId, target);
    }

    public boolean canDeleteTeam(UUID userId, TeamTarget target) {
        return hasTeamHierarchyPermission(
                userId, PermissionAction.DELETE_TEAM, target.teamId(), target.tenantId());
    }

    public Specification<TeamEntity> filterReadTeams(UUID userId) {
        Set<UUID> permittedTeamIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.TEAM, PermissionAction.READ_TEAM);
        Set<UUID> permittedTenantIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TEAM);
        boolean hasTenantRootAccess = permittableService.hasRootPermission(
                userId, PermissionAction.READ_TEAM);

        log.info("user {} permitted: {} teams, {} tenants, tenant root access: {}",
                userId, permittedTeamIds.size(), permittedTenantIds.size(), hasTenantRootAccess);

        if (hasTenantRootAccess) {
            return Specification.unrestricted();
        }

        return Specification.anyOf(
                (root, query, cb) -> root.get("id").in(permittedTeamIds),
                (root, query, cb) -> root.get("tenantId").in(permittedTenantIds)
        );
    }

    // =============================================
    // TEAM_MEMBER
    // =============================================

    public boolean canReadTeamMember(UUID userId, TeamMemberTarget target) {
        return hasTeamMemberHierarchyPermission(
                userId, PermissionAction.READ_TEAM_MEMBER,
                target.teamMemberId(), target.teamId(), target.tenantId());
    }

    public boolean canCreateTeamMember(UUID userId, TeamParent parent) {
        return hasTeamMemberHierarchyPermission(
                userId, PermissionAction.CREATE_TEAM_MEMBER,
                null, parent.teamId(), parent.tenantId());
    }

    public boolean canUpdateTeamMember(UUID userId, TeamMemberTarget target) {
        return hasTeamMemberHierarchyPermission(
                userId, PermissionAction.UPDATE_TEAM_MEMBER,
                target.teamMemberId(), target.teamId(), target.tenantId());
    }

    public boolean canPatchTeamMember(UUID userId, TeamMemberTarget target) {
        return canUpdateTeamMember(userId, target);
    }

    public boolean canDeleteTeamMember(UUID userId, TeamMemberTarget target) {
        return hasTeamMemberHierarchyPermission(
                userId, PermissionAction.DELETE_TEAM_MEMBER,
                target.teamMemberId(), target.teamId(), target.tenantId());
    }

    // =============================================
    // TICKET
    // =============================================

    public boolean canReadTicket(UUID userId, TicketTarget target) {
        return hasTicketHierarchyPermission(
                userId, PermissionAction.READ_TICKET, target.ticketId(), target.tenantId());
    }

    public boolean canCreateTicket(UUID userId, TenantParent parent) {
        return hasTicketHierarchyPermission(userId, PermissionAction.CREATE_TICKET, null, parent.tenantId());
    }

    public boolean canUpdateTicket(UUID userId, TicketTarget target) {
        return hasTicketHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET, target.ticketId(), target.tenantId());
    }

    public boolean canPatchTicket(UUID userId, TicketTarget target) {
        return canUpdateTicket(userId, target);
    }

    public boolean canDeleteTicket(UUID userId, TicketTarget target) {
        return hasTicketHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET, target.ticketId(), target.tenantId());
    }

    public Specification<TicketEntity> filterReadTickets(UUID userId) {
        Set<UUID> permittedTicketIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.TICKET, PermissionAction.READ_TICKET);
        Set<UUID> permittedTenantIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TICKET);

        log.debug("user {} permitted: {} tickets, {} tenants",
                userId, permittedTicketIds.size(), permittedTenantIds.size());

        return Specification.anyOf(
                (root, query, cb) -> root.get("id").in(permittedTicketIds),
                (root, query, cb) -> root.get("tenantId").in(permittedTenantIds)
        );
    }

    // =============================================
    // TICKET_HISTORY
    // =============================================

    public boolean canReadTicketHistory(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canCreateTicketHistory(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                null, parent.ticketId(), parent.tenantId());
    }

    public boolean canUpdateTicketHistory(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canPatchTicketHistory(UUID userId, TicketChildTarget target) {
        return canUpdateTicketHistory(userId, target);
    }

    public boolean canDeleteTicketHistory(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                target.childId(), target.ticketId(), target.tenantId());
    }

    // =============================================
    // TICKET_COMMENT
    // =============================================

    public boolean canReadTicketComment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canCreateTicketComment(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                null, parent.ticketId(), parent.tenantId());
    }

    public boolean canUpdateTicketComment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canPatchTicketComment(UUID userId, TicketChildTarget target) {
        return canUpdateTicketComment(userId, target);
    }

    public boolean canDeleteTicketComment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                target.childId(), target.ticketId(), target.tenantId());
    }

    // =============================================
    // TICKET_ASSIGNMENT
    // =============================================

    public boolean canReadTicketAssignment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canCreateTicketAssignment(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                null, parent.ticketId(), parent.tenantId());
    }

    public boolean canUpdateTicketAssignment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canPatchTicketAssignment(UUID userId, TicketChildTarget target) {
        return canUpdateTicketAssignment(userId, target);
    }

    public boolean canDeleteTicketAssignment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                target.childId(), target.ticketId(), target.tenantId());
    }

    // =============================================
    // TICKET_ATTACHMENT
    // =============================================

    public boolean canReadTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.READ_TICKET_ATTACHMENT,
                target.attachmentId(), target.commentId(), target.ticketId(), target.tenantId());
    }

    public boolean canCreateTicketAttachment(UUID userId, TicketAttachmentParent parent) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_ATTACHMENT,
                null, parent.commentId(), parent.ticketId(), parent.tenantId());
    }

    public boolean canUpdateTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_ATTACHMENT,
                target.attachmentId(), target.commentId(), target.ticketId(), target.tenantId());
    }

    public boolean canPatchTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return canUpdateTicketAttachment(userId, target);
    }

    public boolean canDeleteTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_ATTACHMENT,
                target.attachmentId(), target.commentId(), target.ticketId(), target.tenantId());
    }

    // =============================================
    // TICKET_SLA_TRACKING
    // =============================================

    public boolean canReadTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canCreateTicketSlaTracking(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                null, parent.ticketId(), parent.tenantId());
    }

    public boolean canUpdateTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canPatchTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return canUpdateTicketSlaTracking(userId, target);
    }

    public boolean canDeleteTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                target.childId(), target.ticketId(), target.tenantId());
    }

    // =============================================
    // TICKET_WATCHER
    // =============================================

    public boolean canReadTicketWatcher(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canCreateTicketWatcher(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                null, parent.ticketId(), parent.tenantId());
    }

    public boolean canUpdateTicketWatcher(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                target.childId(), target.ticketId(), target.tenantId());
    }

    public boolean canPatchTicketWatcher(UUID userId, TicketChildTarget target) {
        return canUpdateTicketWatcher(userId, target);
    }

    public boolean canDeleteTicketWatcher(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                target.childId(), target.ticketId(), target.tenantId());
    }

    // =============================================
    // Hierarchy helpers
    // =============================================

    private boolean hasTeamHierarchyPermission(
            UUID userId,
            PermissionAction action,
            UUID teamId,
            UUID tenantId
    ) {
        log.trace("Checking team hierarchy permission - userId: {}, action: {}, teamId: {}, tenantId: {}",
                userId, action, teamId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndTeamHierarchy(
                userId, action, teamId);

        boolean permitted = !result.isEmpty();
        log.debug("Team hierarchy permission result - userId: {}, action: {}, permitted: {}",
                userId, action, permitted);
        return permitted;
    }

    private boolean hasTeamMemberHierarchyPermission(
            UUID userId,
            PermissionAction action,
            UUID teamMemberId,
            UUID teamId,
            UUID tenantId
    ) {
        log.trace("Checking team member hierarchy permission - userId: {}, action: {}, teamMemberId: {}, teamId: {}, tenantId: {}",
                userId, action, teamMemberId, teamId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndTeamMemberHierarchy(
                userId, action, teamMemberId, teamId);

        boolean permitted = !result.isEmpty();
        log.debug("Team member hierarchy permission result - userId: {}, action: {}, permitted: {}",
                userId, action, permitted);
        return permitted;
    }

    private boolean hasTicketHierarchyPermission(
            UUID userId,
            PermissionAction action,
            UUID ticketId,
            UUID tenantId
    ) {
        log.trace("Checking ticket hierarchy permission - userId: {}, action: {}, ticketId: {}, tenantId: {}",
                userId, action, ticketId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndTicketHierarchy(
                userId, action, ticketId, tenantId
        );

        boolean permitted = !result.isEmpty();
        log.debug("Ticket hierarchy permission result - userId: {}, action: {}, permitted: {}",
                userId, action, permitted);
        return permitted;
    }

    private boolean hasTicketChildHierarchyPermission(
            UUID userId,
            PermissionAction action,
            PermissionTargetType childType,
            UUID childId,
            UUID ticketId,
            UUID tenantId
    ) {
        log.trace("Checking ticket child hierarchy permission - userId: {}, action: {}, childType: {}, childId: {}, ticketId: {}, tenantId: {}",
                userId, action, childType, childId, ticketId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndTicketChildHierarchy(
                userId, action, childType, childId, ticketId, tenantId
        );

        boolean permitted = !result.isEmpty();
        log.debug("Ticket child hierarchy permission result - userId: {}, action: {}, childType: {}, permitted: {}",
                userId, action, childType, permitted);
        return permitted;
    }

    private boolean hasTicketAttachmentHierarchyPermission(
            UUID userId,
            PermissionAction action,
            UUID attachmentId,
            UUID commentId,
            UUID ticketId,
            UUID tenantId
    ) {
        log.trace("Checking ticket attachment hierarchy permission - userId: {}, action: {}, attachmentId: {}, commentId: {}, ticketId: {}, tenantId: {}",
                userId, action, attachmentId, commentId, ticketId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndTicketAttachmentHierarchy(
                userId, action, attachmentId, commentId, ticketId, tenantId
        );

        boolean permitted = !result.isEmpty();
        log.debug("Ticket attachment hierarchy permission result - userId: {}, action: {}, permitted: {}",
                userId, action, permitted);
        return permitted;
    }
}
