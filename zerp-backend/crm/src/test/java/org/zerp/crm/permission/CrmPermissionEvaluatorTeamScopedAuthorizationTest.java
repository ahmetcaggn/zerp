package org.zerp.crm.permission;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import org.zerp.common.entity.TenantRoot;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TeamMemberEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;
import org.zerp.crm.repository.TeamMemberRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CrmPermissionEvaluatorTeamScopedAuthorizationTest {

    @Mock
    private PermissionRepository permissionRepository;
    @Mock
    private CommonPermissionService commonPermissionService;
    @Mock
    private TeamMemberRepository teamMemberRepository;

    private CrmPermissionEvaluator evaluator;
    private UUID userId;
    private UUID ticketId;
    private UUID tenantId;
    private UUID teamAId;
    private UUID teamBId;
    private UUID agentAId;
    private UUID agentBId;

    @BeforeEach
    void setUp() {
        evaluator = new CrmPermissionEvaluator(permissionRepository, commonPermissionService, teamMemberRepository);
        userId = UUID.randomUUID();
        ticketId = UUID.randomUUID();
        tenantId = UUID.randomUUID();
        teamAId = UUID.randomUUID();
        teamBId = UUID.randomUUID();
        agentAId = UUID.randomUUID();
        agentBId = UUID.randomUUID();
    }

    @Test
    void readTicketTeamPermissionDoesNotApplyWhenAssignmentInactive() {
        when(permissionRepository.findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.READ_TICKET), eq(ticketId), eq((UUID) null), eq((UUID) null), eq(tenantId)))
                .thenReturn(List.of());

        boolean canRead = evaluator.canReadTicket(
                userId,
                new CrmPermissionEvaluator.TicketTarget(ticketId, tenantId, null, null)
        );

        assertThat(canRead).isFalse();
    }

    @Test
    void readTicketUserPermissionAllowsOnlyAssignedAgent() {
        when(permissionRepository.findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.READ_TICKET), eq(ticketId), eq((UUID) null), eq(agentAId), eq(tenantId)))
                .thenReturn(List.of(permission(PermissionAction.READ_TICKET, PermissionTargetType.USER, agentAId)));
        when(permissionRepository.findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.READ_TICKET), eq(ticketId), eq((UUID) null), eq(agentBId), eq(tenantId)))
                .thenReturn(List.of());

        boolean canReadAgentA = evaluator.canReadTicket(
                userId,
                new CrmPermissionEvaluator.TicketTarget(ticketId, tenantId, null, agentAId)
        );
        boolean canReadAgentB = evaluator.canReadTicket(
                userId,
                new CrmPermissionEvaluator.TicketTarget(ticketId, tenantId, null, agentBId)
        );

        assertThat(canReadAgentA).isTrue();
        assertThat(canReadAgentB).isFalse();
    }

    @Test
    void readTicketTenantPermissionStillAllowsVisibility() {
        when(permissionRepository.findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.READ_TICKET), eq(ticketId), eq(teamBId), eq((UUID) null), eq(tenantId)))
                .thenReturn(List.of(permission(PermissionAction.READ_TICKET, PermissionTargetType.TENANT, tenantId)));

        boolean canRead = evaluator.canReadTicket(
                userId,
                new CrmPermissionEvaluator.TicketTarget(ticketId, tenantId, teamBId, null)
        );

        assertThat(canRead).isTrue();
    }

    @Test
    void createTicketCommentUsesAssignedTeamForTeamScopedAction() {
        when(permissionRepository.findAllByUserAndTicketChildHierarchy(
                eq(userId),
                eq(PermissionAction.CREATE_TICKET_COMMENT),
                eq(PermissionTargetType.TICKET_COMMENT),
                eq((UUID) null),
                eq(ticketId),
                eq(teamAId),
                eq((UUID) null),
                eq(tenantId)))
                .thenReturn(List.of(permission(PermissionAction.CREATE_TICKET_COMMENT, PermissionTargetType.TEAM, teamAId)));
        when(teamMemberRepository.findByTeamIdAndUserId(teamAId, userId))
                .thenReturn(Optional.of(teamMembership(teamAId, TeamMemberEntity.TeamMemberRole.LEADER)));

        boolean canCreateComment = evaluator.canCreateTicketComment(
                userId,
                new CrmPermissionEvaluator.TicketParent(ticketId, tenantId, teamAId, null)
        );

        assertThat(canCreateComment).isTrue();
    }

    @Test
    void deleteTicketDoesNotUseAssignedTeamScope() {
        when(permissionRepository.findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.DELETE_TICKET), eq(ticketId), eq((UUID) null), eq((UUID) null), eq(tenantId)))
                .thenReturn(List.of(permission(PermissionAction.DELETE_TICKET, PermissionTargetType.TICKET, ticketId)));

        boolean canDelete = evaluator.canDeleteTicket(
                userId,
                new CrmPermissionEvaluator.TicketTarget(ticketId, tenantId, teamAId, agentAId)
        );

        assertThat(canDelete).isTrue();

        ArgumentCaptor<UUID> assignedTeamCaptor = ArgumentCaptor.forClass(UUID.class);
        ArgumentCaptor<UUID> assignedAgentCaptor = ArgumentCaptor.forClass(UUID.class);
        verify(permissionRepository).findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.DELETE_TICKET), eq(ticketId),
                assignedTeamCaptor.capture(), assignedAgentCaptor.capture(), eq(tenantId));
        assertThat(assignedTeamCaptor.getValue()).isNull();
        assertThat(assignedAgentCaptor.getValue()).isNull();
    }

    @Test
    void filterReadTicketsIncludesActiveAssignmentConstraintForTeamPermission() {
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TICKET, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TENANT, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TEAM, PermissionAction.READ_TICKET))
                .thenReturn(Set.of(teamAId));
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.USER, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TICKET)).thenReturn(false);
        when(teamMemberRepository.findAllByUserIdAndTeamIdIn(userId, Set.of(teamAId)))
                .thenReturn(List.of(teamMembership(teamAId, TeamMemberEntity.TeamMemberRole.LEADER)));

        Specification<TicketEntity> spec = evaluator.filterReadTickets(userId);
        Root<TicketEntity> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Predicate falsePredicate = mock(Predicate.class);
        Predicate activePredicate = mock(Predicate.class);
        Predicate teamPredicate = mock(Predicate.class);
        Predicate teamBranchPredicate = mock(Predicate.class);
        Predicate finalPredicate = mock(Predicate.class);

        @SuppressWarnings("unchecked")
        Path<Object> ticketIdPath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Path<Object> tenantIdPath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Join<Object, Object> assignmentJoin = mock(Join.class);
        @SuppressWarnings("unchecked")
        Path<Boolean> activePath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Path<Object> teamPath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Path<Object> teamIdPath = mock(Path.class);

        when(root.get("id")).thenReturn(ticketIdPath);
        when(root.get("tenantId")).thenReturn(tenantIdPath);
        when(root.join("currentAssignment", jakarta.persistence.criteria.JoinType.LEFT)).thenReturn(assignmentJoin);
        when(assignmentJoin.get("active")).thenReturn((Path) activePath);
        when(assignmentJoin.get("team")).thenReturn((Path) teamPath);
        when(teamPath.get("id")).thenReturn((Path) teamIdPath);

        when(ticketIdPath.in(Set.of())).thenReturn(falsePredicate);
        when(tenantIdPath.in(Set.of())).thenReturn(falsePredicate);
        when(cb.isTrue(activePath)).thenReturn(activePredicate);
        when(teamIdPath.in(Set.of(teamAId))).thenReturn(teamPredicate);
        when(cb.and(activePredicate, teamPredicate)).thenReturn(teamBranchPredicate);
        when(cb.or(any(Predicate.class), any(Predicate.class))).thenReturn(finalPredicate);

        Predicate result = spec.toPredicate(root, query, cb);

        assertThat(result).isEqualTo(finalPredicate);
        verify(root).join("currentAssignment", jakarta.persistence.criteria.JoinType.LEFT);
        verify(cb).isTrue(activePath);
    }

    @Test
    void readTicketTeamPermissionForMemberRequiresSelfAssignment() {
        when(permissionRepository.findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.READ_TICKET), eq(ticketId), eq(teamAId), eq(userId), eq(tenantId)))
                .thenReturn(List.of(permission(PermissionAction.READ_TICKET, PermissionTargetType.TEAM, teamAId)));
        when(permissionRepository.findAllByUserAndTicketHierarchy(
                eq(userId), eq(PermissionAction.READ_TICKET), eq(ticketId), eq(teamAId), eq(agentBId), eq(tenantId)))
                .thenReturn(List.of(permission(PermissionAction.READ_TICKET, PermissionTargetType.TEAM, teamAId)));
        when(teamMemberRepository.findByTeamIdAndUserId(teamAId, userId))
                .thenReturn(Optional.of(teamMembership(teamAId, TeamMemberEntity.TeamMemberRole.MEMBER)));

        boolean canReadSelfAssigned = evaluator.canReadTicket(
                userId,
                new CrmPermissionEvaluator.TicketTarget(ticketId, tenantId, teamAId, userId)
        );
        boolean canReadOtherAssigned = evaluator.canReadTicket(
                userId,
                new CrmPermissionEvaluator.TicketTarget(ticketId, tenantId, teamAId, agentBId)
        );

        assertThat(canReadSelfAssigned).isTrue();
        assertThat(canReadOtherAssigned).isFalse();
    }

    @Test
    void filterReadTicketsIncludesActiveAssignmentConstraintForAgentPermission() {
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TICKET, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TENANT, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TEAM, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.USER, PermissionAction.READ_TICKET))
                .thenReturn(Set.of(agentAId));
        when(commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TICKET)).thenReturn(false);

        Specification<TicketEntity> spec = evaluator.filterReadTickets(userId);
        Root<TicketEntity> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Predicate falsePredicate = mock(Predicate.class);
        Predicate activePredicate = mock(Predicate.class);
        Predicate agentPredicate = mock(Predicate.class);
        Predicate agentBranchPredicate = mock(Predicate.class);
        Predicate finalPredicate = mock(Predicate.class);

        @SuppressWarnings("unchecked")
        Path<Object> ticketIdPath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Path<Object> tenantIdPath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Join<Object, Object> assignmentJoin = mock(Join.class);
        @SuppressWarnings("unchecked")
        Path<Boolean> activePath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Path<Object> agentPath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Path<Object> agentIdPath = mock(Path.class);

        when(root.get("id")).thenReturn(ticketIdPath);
        when(root.get("tenantId")).thenReturn(tenantIdPath);
        when(root.join("currentAssignment", jakarta.persistence.criteria.JoinType.LEFT)).thenReturn(assignmentJoin);
        when(assignmentJoin.get("active")).thenReturn((Path) activePath);
        when(assignmentJoin.get("agentParty")).thenReturn((Path) agentPath);
        when(agentPath.get("id")).thenReturn((Path) agentIdPath);

        when(ticketIdPath.in(Set.of())).thenReturn(falsePredicate);
        when(tenantIdPath.in(Set.of())).thenReturn(falsePredicate);
        when(cb.isTrue(activePath)).thenReturn(activePredicate);
        when(agentIdPath.in(Set.of(agentAId))).thenReturn(agentPredicate);
        when(cb.and(activePredicate, agentPredicate)).thenReturn(agentBranchPredicate);
        when(cb.or(any(Predicate.class), any(Predicate.class))).thenReturn(finalPredicate);

        Predicate result = spec.toPredicate(root, query, cb);

        assertThat(result).isEqualTo(finalPredicate);
        verify(root).join("currentAssignment", jakarta.persistence.criteria.JoinType.LEFT);
        verify(cb).isTrue(activePath);
    }

    @Test
    void filterReadTicketsDoesNotJoinAssignmentWhenNoTeamPermission() {
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TICKET, PermissionAction.READ_TICKET))
                .thenReturn(Set.of(ticketId));
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TENANT, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TEAM, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.USER, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TICKET)).thenReturn(false);

        Specification<TicketEntity> spec = evaluator.filterReadTickets(userId);
        Root<TicketEntity> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Predicate ticketPredicate = mock(Predicate.class);
        Predicate tenantPredicate = mock(Predicate.class);
        Predicate finalPredicate = mock(Predicate.class);

        @SuppressWarnings("unchecked")
        Path<Object> ticketIdPath = mock(Path.class);
        @SuppressWarnings("unchecked")
        Path<Object> tenantIdPath = mock(Path.class);

        when(root.get("id")).thenReturn(ticketIdPath);
        when(root.get("tenantId")).thenReturn(tenantIdPath);
        when(ticketIdPath.in(Set.of(ticketId))).thenReturn(ticketPredicate);
        when(tenantIdPath.in(Set.of())).thenReturn(tenantPredicate);
        when(cb.or(any(Predicate.class), any(Predicate.class))).thenReturn(finalPredicate);

        Predicate result = spec.toPredicate(root, query, cb);

        assertThat(result).isEqualTo(finalPredicate);
        verify(root, never()).join(eq("currentAssignment"), any());
    }

    @Test
    void filterReadTicketsWithTenantRootPermissionReturnsUnrestrictedSpecification() {
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TICKET, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TENANT, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.TEAM, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.getAllPermitted(userId, PermissionTargetType.USER, PermissionAction.READ_TICKET))
                .thenReturn(Set.of());
        when(commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TICKET)).thenReturn(true);

        Specification<TicketEntity> spec = evaluator.filterReadTickets(userId);
        Predicate result = spec.toPredicate(mock(Root.class), mock(CriteriaQuery.class), mock(CriteriaBuilder.class));

        assertThat(result).isNull();
    }

    private Permission permission(PermissionAction action, PermissionTargetType targetType, UUID targetId) {
        Permission permission = new Permission();
        permission.setUserId(userId);
        permission.setAction(action);
        permission.setTargetType(targetType);
        permission.setTargetId(targetId != null ? targetId : TenantRoot.ID);
        return permission;
    }

    private TeamMemberEntity teamMembership(UUID teamId, TeamMemberEntity.TeamMemberRole role) {
        TeamEntity team = new TeamEntity();
        team.setId(teamId);

        TeamMemberEntity membership = new TeamMemberEntity();
        membership.setTeam(team);
        membership.setRole(role);
        return membership;
    }
}
