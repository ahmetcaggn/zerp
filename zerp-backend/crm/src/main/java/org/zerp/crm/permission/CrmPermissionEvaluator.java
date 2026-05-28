package org.zerp.crm.permission;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.zerp.common.entity.crm.TeamMemberEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionActionSets;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;
import org.zerp.crm.repository.TeamMemberRepository;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Component
@RequiredArgsConstructor
public class CrmPermissionEvaluator {
    private static final Set<PermissionTargetType> CRM_TARGET_TYPES = EnumSet.of(
            PermissionTargetType.TEAM,
            PermissionTargetType.TEAM_MEMBER,
            PermissionTargetType.TICKET,
            PermissionTargetType.TICKET_HISTORY,
            PermissionTargetType.TICKET_COMMENT,
            PermissionTargetType.TICKET_ASSIGNMENT,
            PermissionTargetType.TICKET_ATTACHMENT,
            PermissionTargetType.TICKET_SLA_TRACKING,
            PermissionTargetType.TICKET_WATCHER
    );

    private static final Set<PermissionAction> HANDLED_CRM_ACTIONS = EnumSet.of(
            PermissionAction.CREATE_TEAM,
            PermissionAction.READ_TEAM,
            PermissionAction.UPDATE_TEAM,
            PermissionAction.DELETE_TEAM,
            PermissionAction.CREATE_TEAM_MEMBER,
            PermissionAction.READ_TEAM_MEMBER,
            PermissionAction.UPDATE_TEAM_MEMBER,
            PermissionAction.DELETE_TEAM_MEMBER,
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
    );

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

    public record TicketParent(UUID ticketId, UUID tenantId, UUID assignedTeamId, UUID assignedAgentId) {
    }

    public record TicketTarget(UUID ticketId, UUID tenantId, UUID assignedTeamId, UUID assignedAgentId) {
    }

    public record TicketChildTarget(UUID childId, UUID ticketId, UUID tenantId, UUID assignedTeamId,
                                    UUID assignedAgentId) {
    }

    public record TicketAttachmentParent(UUID commentId, UUID ticketId, UUID tenantId, UUID assignedTeamId,
                                         UUID assignedAgentId) {
    }

    public record TicketAttachmentTarget(UUID attachmentId, UUID commentId, UUID ticketId, UUID tenantId,
                                         UUID assignedTeamId, UUID assignedAgentId) {
    }

    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;
    private final TeamMemberRepository teamMemberRepository;

    @PostConstruct
    void validateCrmPermissionCoverage() {
        Set<PermissionAction> expected = EnumSet.noneOf(PermissionAction.class);
        for (PermissionAction action : PermissionAction.values()) {
            if (CRM_TARGET_TYPES.contains(action.minTargetType)
                    || action == PermissionAction.CREATE_TEAM
                    || action == PermissionAction.CREATE_TICKET) {
                expected.add(action);
            }
        }

        if (!HANDLED_CRM_ACTIONS.equals(expected)) {
            Set<PermissionAction> missingInEvaluator = EnumSet.copyOf(expected);
            missingInEvaluator.removeAll(HANDLED_CRM_ACTIONS);

            Set<PermissionAction> unexpectedInEvaluator = EnumSet.copyOf(HANDLED_CRM_ACTIONS);
            unexpectedInEvaluator.removeAll(expected);

            throw new IllegalStateException(
                    "CRM permission action coverage mismatch. Missing: "
                            + missingInEvaluator + ", unexpected: " + unexpectedInEvaluator);
        }
    }

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
        Set<UUID> permittedTeamIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TEAM, PermissionAction.READ_TEAM);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TEAM);
        boolean hasTenantRootAccess = commonPermissionService.hasRootPermission(
                userId, PermissionAction.READ_TEAM);

        log.info("user {} permitted: {} teams, {} tenants, tenant root access: {}",
                userId, permittedTeamIds.size(), permittedTenantIds.size(), hasTenantRootAccess);

        if (hasTenantRootAccess) {
            return Specification.unrestricted();
        }

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedTeamIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
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
                userId, PermissionAction.READ_TICKET, target.ticketId(), target.tenantId(),
                target.assignedTeamId(), target.assignedAgentId());
    }

    public boolean canCreateTicket(UUID userId, TenantParent parent) {
        return hasTicketHierarchyPermission(userId, PermissionAction.CREATE_TICKET, null, parent.tenantId(), null, null);
    }

    public boolean canUpdateTicket(UUID userId, TicketTarget target) {
        return hasTicketHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET, target.ticketId(), target.tenantId(),
                target.assignedTeamId(), target.assignedAgentId());
    }

    public boolean canPatchTicket(UUID userId, TicketTarget target) {
        return canUpdateTicket(userId, target);
    }

    public boolean canDeleteTicket(UUID userId, TicketTarget target) {
        return hasTicketHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET, target.ticketId(), target.tenantId(),
                target.assignedTeamId(), target.assignedAgentId());
    }

    public Specification<TicketEntity> filterReadTickets(UUID userId) {
        Set<UUID> permittedTicketIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TICKET, PermissionAction.READ_TICKET);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TICKET);
        Set<UUID> permittedTeamIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TEAM, PermissionAction.READ_TICKET);
        Set<UUID> permittedUserIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.USER, PermissionAction.READ_TICKET);
        boolean hasTenantRootAccess = commonPermissionService.hasRootPermission(
                userId, PermissionAction.READ_TICKET);

        log.debug("user {} permitted: {} tickets, {} tenants, {} teams, {} users, tenant root access: {}",
                userId, permittedTicketIds.size(), permittedTenantIds.size(), permittedTeamIds.size(),
                permittedUserIds.size(), hasTenantRootAccess);

        if (hasTenantRootAccess) {
            return Specification.unrestricted();
        }

        List<Specification<TicketEntity>> specifications = new ArrayList<>(List.of(
                (root, _, _) -> root.get("id").in(permittedTicketIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        ));

        Set<UUID> leaderPermittedTeamIds = new HashSet<>();
        Set<UUID> memberPermittedTeamIds = new HashSet<>();
        if (!permittedTeamIds.isEmpty()) {
            List<TeamMemberEntity> memberships = teamMemberRepository.findAllByUserIdAndTeamIdIn(userId, permittedTeamIds);
            for (TeamMemberEntity membership : memberships) {
                if (membership == null
                        || membership.getTeam() == null
                        || membership.getTeam().getId() == null
                        || membership.getRole() == null) {
                    continue;
                }
                UUID membershipTeamId = membership.getTeam().getId();
                if (membership.getRole() == TeamMemberEntity.TeamMemberRole.LEADER) {
                    leaderPermittedTeamIds.add(membershipTeamId);
                } else if (membership.getRole() == TeamMemberEntity.TeamMemberRole.MEMBER) {
                    memberPermittedTeamIds.add(membershipTeamId);
                }
            }
        }

        if (!leaderPermittedTeamIds.isEmpty()) {
            specifications.add((root, _, cb) -> {
                var assignmentJoin = root.join("currentAssignment", JoinType.LEFT);
                return cb.and(
                        cb.isTrue(assignmentJoin.get("active")),
                        assignmentJoin.get("team").get("id").in(leaderPermittedTeamIds)
                );
            });
        }

        if (!memberPermittedTeamIds.isEmpty()) {
            specifications.add((root, _, cb) -> {
                var assignmentJoin = root.join("currentAssignment", JoinType.LEFT);
                return cb.and(
                        cb.isTrue(assignmentJoin.get("active")),
                        assignmentJoin.get("team").get("id").in(memberPermittedTeamIds),
                        assignmentJoin.get("agentParty").get("id").in(Set.of(userId))
                );
            });
        }

        if (!permittedUserIds.isEmpty()) {
            specifications.add((root, _, cb) -> {
                var assignmentJoin = root.join("currentAssignment", JoinType.LEFT);
                return cb.and(
                        cb.isTrue(assignmentJoin.get("active")),
                        assignmentJoin.get("agentParty").get("id").in(permittedUserIds)
                );
            });
        }

        return Specification.anyOf(specifications);
    }

    // =============================================
    // TICKET_HISTORY
    // =============================================

    public boolean canReadTicketHistory(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canReadTicketHistory(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canCreateTicketHistory(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canUpdateTicketHistory(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canPatchTicketHistory(UUID userId, TicketChildTarget target) {
        return canUpdateTicketHistory(userId, target);
    }

    public boolean canDeleteTicketHistory(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_HISTORY, PermissionTargetType.TICKET_HISTORY,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    // =============================================
    // TICKET_COMMENT
    // =============================================

    public boolean canReadTicketComment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canReadTicketComment(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canCreateTicketComment(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canUpdateTicketComment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canPatchTicketComment(UUID userId, TicketChildTarget target) {
        return canUpdateTicketComment(userId, target);
    }

    public boolean canDeleteTicketComment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_COMMENT, PermissionTargetType.TICKET_COMMENT,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    // =============================================
    // TICKET_ASSIGNMENT
    // =============================================

    public boolean canReadTicketAssignment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canReadTicketAssignment(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canCreateTicketAssignment(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canUpdateTicketAssignment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canPatchTicketAssignment(UUID userId, TicketChildTarget target) {
        return canUpdateTicketAssignment(userId, target);
    }

    public boolean canDeleteTicketAssignment(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_ASSIGNMENT, PermissionTargetType.TICKET_ASSIGNMENT,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    // =============================================
    // TICKET_ATTACHMENT
    // =============================================

    public boolean canReadTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.READ_TICKET_ATTACHMENT,
                target.attachmentId(), target.commentId(), target.ticketId(), target.tenantId(),
                target.assignedTeamId(), target.assignedAgentId());
    }

    public boolean canReadTicketAttachment(UUID userId, TicketAttachmentParent parent) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.READ_TICKET_ATTACHMENT,
                null, parent.commentId(), parent.ticketId(), parent.tenantId(),
                parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canCreateTicketAttachment(UUID userId, TicketAttachmentParent parent) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_ATTACHMENT,
                null, parent.commentId(), parent.ticketId(), parent.tenantId(),
                parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canUpdateTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_ATTACHMENT,
                target.attachmentId(), target.commentId(), target.ticketId(), target.tenantId(),
                target.assignedTeamId(), target.assignedAgentId());
    }

    public boolean canPatchTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return canUpdateTicketAttachment(userId, target);
    }

    public boolean canDeleteTicketAttachment(UUID userId, TicketAttachmentTarget target) {
        return hasTicketAttachmentHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_ATTACHMENT,
                target.attachmentId(), target.commentId(), target.ticketId(), target.tenantId(),
                target.assignedTeamId(), target.assignedAgentId());
    }

    // =============================================
    // TICKET_SLA_TRACKING
    // =============================================

    public boolean canReadTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canReadTicketSlaTracking(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canCreateTicketSlaTracking(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canUpdateTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canPatchTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return canUpdateTicketSlaTracking(userId, target);
    }

    public boolean canDeleteTicketSlaTracking(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_SLA_TRACKING, PermissionTargetType.TICKET_SLA_TRACKING,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    // =============================================
    // TICKET_WATCHER
    // =============================================

    public boolean canReadTicketWatcher(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canReadTicketWatcher(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.READ_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canCreateTicketWatcher(UUID userId, TicketParent parent) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.CREATE_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                null, parent.ticketId(), parent.tenantId(), parent.assignedTeamId(), parent.assignedAgentId());
    }

    public boolean canUpdateTicketWatcher(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.UPDATE_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
    }

    public boolean canPatchTicketWatcher(UUID userId, TicketChildTarget target) {
        return canUpdateTicketWatcher(userId, target);
    }

    public boolean canDeleteTicketWatcher(UUID userId, TicketChildTarget target) {
        return hasTicketChildHierarchyPermission(
                userId, PermissionAction.DELETE_TICKET_WATCHER, PermissionTargetType.TICKET_WATCHER,
                target.childId(), target.ticketId(), target.tenantId(), target.assignedTeamId(),
                target.assignedAgentId());
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
                userId, action, teamId, tenantId);

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
                userId, action, teamMemberId, teamId, tenantId);

        boolean permitted = !result.isEmpty();
        log.debug("Team member hierarchy permission result - userId: {}, action: {}, permitted: {}",
                userId, action, permitted);
        return permitted;
    }

    private boolean hasTicketHierarchyPermission(
            UUID userId,
            PermissionAction action,
            UUID ticketId,
            UUID tenantId,
            UUID assignedTeamId,
            UUID assignedAgentId
    ) {
        UUID teamScopeId = isAssignmentScopedTicketAction(action) ? assignedTeamId : null;
        UUID agentScopeId = isAssignmentScopedTicketAction(action) ? assignedAgentId : null;
        log.trace("Checking ticket hierarchy permission - userId: {}, action: {}, ticketId: {}, tenantId: {}, assignedTeamId: {}, assignedAgentId: {}",
                userId, action, ticketId, tenantId, teamScopeId, agentScopeId);

        List<Permission> result = permissionRepository.findAllByUserAndTicketHierarchy(
                userId, action, ticketId, teamScopeId, agentScopeId, tenantId
        );

        boolean permitted = isAssignmentScopedPermissionResultPermitted(userId, action, result, assignedTeamId, assignedAgentId);
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
            UUID tenantId,
            UUID assignedTeamId,
            UUID assignedAgentId
    ) {
        UUID teamScopeId = isAssignmentScopedTicketAction(action) ? assignedTeamId : null;
        UUID agentScopeId = isAssignmentScopedTicketAction(action) ? assignedAgentId : null;
        log.trace("Checking ticket child hierarchy permission - userId: {}, action: {}, childType: {}, childId: {}, ticketId: {}, tenantId: {}, assignedTeamId: {}, assignedAgentId: {}",
                userId, action, childType, childId, ticketId, tenantId, teamScopeId, agentScopeId);

        List<Permission> result = permissionRepository.findAllByUserAndTicketChildHierarchy(
                userId, action, childType, childId, ticketId, teamScopeId, agentScopeId, tenantId
        );

        boolean permitted = isAssignmentScopedPermissionResultPermitted(userId, action, result, assignedTeamId, assignedAgentId);
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
            UUID tenantId,
            UUID assignedTeamId,
            UUID assignedAgentId
    ) {
        UUID teamScopeId = isAssignmentScopedTicketAction(action) ? assignedTeamId : null;
        UUID agentScopeId = isAssignmentScopedTicketAction(action) ? assignedAgentId : null;
        log.trace("Checking ticket attachment hierarchy permission - userId: {}, action: {}, attachmentId: {}, commentId: {}, ticketId: {}, tenantId: {}, assignedTeamId: {}, assignedAgentId: {}",
                userId, action, attachmentId, commentId, ticketId, tenantId, teamScopeId, agentScopeId);

        List<Permission> result = permissionRepository.findAllByUserAndTicketAttachmentHierarchy(
                userId, action, attachmentId, commentId, ticketId, teamScopeId, agentScopeId, tenantId
        );

        boolean permitted = isAssignmentScopedPermissionResultPermitted(userId, action, result, assignedTeamId, assignedAgentId);
        log.debug("Ticket attachment hierarchy permission result - userId: {}, action: {}, permitted: {}",
                userId, action, permitted);
        return permitted;
    }

    private boolean isAssignmentScopedPermissionResultPermitted(
            UUID userId,
            PermissionAction action,
            List<Permission> result,
            UUID assignedTeamId,
            UUID assignedAgentId
    ) {
        if (result.isEmpty()) {
            return false;
        }
        if (!isAssignmentScopedTicketAction(action)) {
            return true;
        }

        boolean hasNonTeamGrant = result.stream()
                .anyMatch(permission -> permission.getTargetType() != PermissionTargetType.TEAM);
        if (hasNonTeamGrant) {
            return true;
        }

        return isTeamScopedAssignmentGrantSatisfied(userId, assignedTeamId, assignedAgentId);
    }

    private boolean isTeamScopedAssignmentGrantSatisfied(
            UUID userId,
            UUID assignedTeamId,
            UUID assignedAgentId
    ) {
        if (assignedTeamId == null) {
            return false;
        }

        Optional<TeamMemberEntity> teamMembership = teamMemberRepository.findByTeamIdAndUserId(assignedTeamId, userId);
        if (teamMembership.isEmpty() || teamMembership.get().getRole() == null) {
            return false;
        }

        TeamMemberEntity.TeamMemberRole role = teamMembership.get().getRole();
        if (role == TeamMemberEntity.TeamMemberRole.LEADER) {
            return true;
        }

        return role == TeamMemberEntity.TeamMemberRole.MEMBER
                && assignedAgentId != null
                && assignedAgentId.equals(userId);
    }

    private boolean isAssignmentScopedTicketAction(PermissionAction action) {
        return PermissionActionSets.ASSIGNMENT_SCOPED_TICKET_ACTIONS.contains(action);
    }
}
