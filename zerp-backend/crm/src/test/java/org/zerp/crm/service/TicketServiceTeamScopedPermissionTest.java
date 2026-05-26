package org.zerp.crm.service;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.domain.Specification;
import org.zerp.common.entity.crm.TicketAssignmentEntity;
import org.zerp.common.entity.crm.TicketCommentEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.crm.dto.ticket.AddCommentRequest;
import org.zerp.crm.dto.ticket.ChangePriorityRequest;
import org.zerp.crm.dto.ticket.ChangeStatusRequest;
import org.zerp.crm.dto.ticket.TicketAssignmentResponse;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.permission.CrmPermissionEvaluator;
import org.zerp.crm.repository.TeamMemberRepository;
import org.zerp.crm.repository.TeamRepository;
import org.zerp.crm.repository.TicketRepository;
import org.zerp.crm.service.ticket.TicketResponseMapper;
import org.zerp.crm.service.ticket.TicketValueParser;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTeamScopedPermissionTest {

    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private TeamMemberRepository teamMemberRepository;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private TicketResponseMapper ticketResponseMapper;
    @Mock
    private TicketValueParser ticketValueParser;
    @Mock
    private EntityManager entityManager;
    @Mock
    private CurrentTenantIdResolver currentTenantIdResolver;
    @Mock
    private CurrentUserIdResolver currentUserIdResolver;
    @Mock
    private FilterRefiner filterRefiner;
    @Mock
    private CrmPermissionEvaluator permissionEvaluator;

    @InjectMocks
    private TicketService service;

    private UUID userId;
    private UUID tenantId;
    private UUID teamId;
    private UUID agentId;
    private UUID ticketId;
    private TicketEntity ticket;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        tenantId = UUID.randomUUID();
        teamId = UUID.randomUUID();
        agentId = UUID.randomUUID();
        ticketId = UUID.randomUUID();
        ticket = buildTicket(ticketId, tenantId, teamId, agentId, true);

        when(currentUserIdResolver.resolve()).thenReturn(userId);
    }

    @Test
    void findByIdOmitsAssignmentWhenReadAssignmentPermissionMissing() {
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(permissionEvaluator.canReadTicket(eq(userId), any(CrmPermissionEvaluator.TicketTarget.class))).thenReturn(true);
        when(permissionEvaluator.canReadTicketAssignment(eq(userId), any(CrmPermissionEvaluator.TicketParent.class)))
                .thenReturn(false);
        when(ticketResponseMapper.toResponse(ticket)).thenReturn(responseWithAssignment(ticketId, tenantId, teamId));

        TicketResponse response = service.findById(ticketId);

        assertThat(response.currentAssignment()).isNull();

        ArgumentCaptor<CrmPermissionEvaluator.TicketTarget> ticketTargetCaptor =
                ArgumentCaptor.forClass(CrmPermissionEvaluator.TicketTarget.class);
        verify(permissionEvaluator).canReadTicket(eq(userId), ticketTargetCaptor.capture());
        assertThat(ticketTargetCaptor.getValue().assignedTeamId()).isEqualTo(teamId);
        assertThat(ticketTargetCaptor.getValue().assignedAgentId()).isEqualTo(agentId);

        ArgumentCaptor<CrmPermissionEvaluator.TicketParent> ticketParentCaptor =
                ArgumentCaptor.forClass(CrmPermissionEvaluator.TicketParent.class);
        verify(permissionEvaluator).canReadTicketAssignment(eq(userId), ticketParentCaptor.capture());
        assertThat(ticketParentCaptor.getValue().assignedTeamId()).isEqualTo(teamId);
        assertThat(ticketParentCaptor.getValue().assignedAgentId()).isEqualTo(agentId);
    }

    @Test
    void findByIdKeepsAssignmentWhenReadAssignmentPermissionExists() {
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(permissionEvaluator.canReadTicket(eq(userId), any(CrmPermissionEvaluator.TicketTarget.class))).thenReturn(true);
        when(permissionEvaluator.canReadTicketAssignment(eq(userId), any(CrmPermissionEvaluator.TicketParent.class)))
                .thenReturn(true);
        when(ticketResponseMapper.toResponse(ticket)).thenReturn(responseWithAssignment(ticketId, tenantId, teamId));

        TicketResponse response = service.findById(ticketId);

        assertThat(response.currentAssignment()).isNotNull();
        assertThat(response.currentAssignment().teamId()).isEqualTo(teamId);
    }

    @Test
    void findByIdWithInactiveAssignmentPassesNullAssignedTeamIdAndDeniesRead() {
        TicketEntity inactiveAssignmentTicket = buildTicket(ticketId, tenantId, teamId, agentId, false);
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(inactiveAssignmentTicket));
        when(permissionEvaluator.canReadTicket(eq(userId), any(CrmPermissionEvaluator.TicketTarget.class))).thenReturn(false);

        assertThatThrownBy(() -> service.findById(ticketId))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class)
                .hasMessageContaining("403 FORBIDDEN");

        ArgumentCaptor<CrmPermissionEvaluator.TicketTarget> ticketTargetCaptor =
                ArgumentCaptor.forClass(CrmPermissionEvaluator.TicketTarget.class);
        verify(permissionEvaluator).canReadTicket(eq(userId), ticketTargetCaptor.capture());
        assertThat(ticketTargetCaptor.getValue().assignedTeamId()).isNull();
        assertThat(ticketTargetCaptor.getValue().assignedAgentId()).isNull();
    }

    @Test
    void changeStatusUsesActiveAssignedTeamInUpdatePermissionCheck() {
        stubUserReferenceLookup();
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(permissionEvaluator.canUpdateTicket(eq(userId), any(CrmPermissionEvaluator.TicketTarget.class))).thenReturn(true);
        when(ticketRepository.save(any(TicketEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(ticketResponseMapper.toResponse(any(TicketEntity.class))).thenReturn(responseWithoutSensitiveFields(ticketId, tenantId));

        service.changeStatus(ticketId, new ChangeStatusRequest(TicketEntity.TicketStatus.IN_PROGRESS));

        ArgumentCaptor<CrmPermissionEvaluator.TicketTarget> ticketTargetCaptor =
                ArgumentCaptor.forClass(CrmPermissionEvaluator.TicketTarget.class);
        verify(permissionEvaluator).canUpdateTicket(eq(userId), ticketTargetCaptor.capture());
        assertThat(ticketTargetCaptor.getValue().assignedTeamId()).isEqualTo(teamId);
        assertThat(ticketTargetCaptor.getValue().assignedAgentId()).isEqualTo(agentId);
    }

    @Test
    void changePriorityUsesActiveAssignedTeamInUpdatePermissionCheck() {
        stubUserReferenceLookup();
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(permissionEvaluator.canUpdateTicket(eq(userId), any(CrmPermissionEvaluator.TicketTarget.class))).thenReturn(true);
        when(ticketRepository.save(any(TicketEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(ticketResponseMapper.toResponse(any(TicketEntity.class))).thenReturn(responseWithoutSensitiveFields(ticketId, tenantId));

        service.changePriority(ticketId, new ChangePriorityRequest(TicketEntity.TicketPriority.HIGH));

        ArgumentCaptor<CrmPermissionEvaluator.TicketTarget> ticketTargetCaptor =
                ArgumentCaptor.forClass(CrmPermissionEvaluator.TicketTarget.class);
        verify(permissionEvaluator).canUpdateTicket(eq(userId), ticketTargetCaptor.capture());
        assertThat(ticketTargetCaptor.getValue().assignedTeamId()).isEqualTo(teamId);
        assertThat(ticketTargetCaptor.getValue().assignedAgentId()).isEqualTo(agentId);
    }

    @Test
    void addCommentAllowsTeamScopedCreateCommentPermission() {
        stubUserReferenceLookup();
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(permissionEvaluator.canCreateTicketComment(eq(userId), any(CrmPermissionEvaluator.TicketParent.class)))
                .thenReturn(true);
        when(currentTenantIdResolver.resolve()).thenReturn(tenantId);
        when(teamMemberRepository.existsByUserAndTenantAndRoleIn(eq(userId), eq(tenantId), anyCollection()))
                .thenReturn(false);
        when(ticketRepository.save(any(TicketEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(ticketResponseMapper.toResponse(any(TicketEntity.class))).thenReturn(responseWithoutSensitiveFields(ticketId, tenantId));

        TicketResponse response = service.addComment(ticketId, new AddCommentRequest("test-comment", false));

        assertThat(response).isNotNull();
        assertThat(ticket.getComments()).hasSize(1);
        TicketCommentEntity createdComment = ticket.getComments().getFirst();
        assertThat(createdComment.getContent()).isEqualTo("test-comment");

        ArgumentCaptor<CrmPermissionEvaluator.TicketParent> ticketParentCaptor =
                ArgumentCaptor.forClass(CrmPermissionEvaluator.TicketParent.class);
        verify(permissionEvaluator).canCreateTicketComment(eq(userId), ticketParentCaptor.capture());
        assertThat(ticketParentCaptor.getValue().assignedTeamId()).isEqualTo(teamId);
        assertThat(ticketParentCaptor.getValue().assignedAgentId()).isEqualTo(agentId);
    }

    @Test
    void findWithFiltersDelegatesToPermissionScopedSpecification() {
        when(permissionEvaluator.filterReadTickets(userId)).thenReturn(Specification.unrestricted());
        when(filterRefiner.refinedOrBadRequest(any(Map.class), eq(TicketEntity.class))).thenReturn(Specification.unrestricted());
        when(ticketRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(ticket)));
        when(ticketResponseMapper.toResponse(ticket)).thenReturn(responseWithoutSensitiveFields(ticketId, tenantId));

        service.findWithFilters(Map.of(), org.springframework.data.domain.PageRequest.of(0, 20));

        verify(permissionEvaluator).filterReadTickets(userId);
    }

    private TicketEntity buildTicket(UUID id, UUID tenantId, UUID assignedTeamId, UUID assignedAgentId,
                                     boolean assignmentActive) {
        TicketEntity entity = new TicketEntity();
        entity.setId(id);
        entity.setTenantId(tenantId);
        entity.setTitle("ticket-title");
        entity.setDescription("ticket-description");
        entity.setStatus(TicketEntity.TicketStatus.OPEN);
        entity.setPriority(TicketEntity.TicketPriority.MEDIUM);
        entity.setType(org.zerp.common.entity.crm.IssueType.QUESTION);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setTags(Set.of());
        entity.setCustomAttributes(Map.of());

        TeamEntity team = new TeamEntity();
        team.setId(assignedTeamId);
        team.setTenantId(tenantId);

        TicketAssignmentEntity assignment = new TicketAssignmentEntity();
        assignment.setId(UUID.randomUUID());
        assignment.setTicket(entity);
        assignment.setTeam(team);
        if (assignedAgentId != null) {
            AppUser assignedAgent = new AppUser();
            assignedAgent.setId(assignedAgentId);
            assignment.setAgentParty(assignedAgent);
        }
        assignment.setActive(assignmentActive);
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setTenantId(tenantId);
        entity.setCurrentAssignment(assignment);
        return entity;
    }

    private TicketResponse responseWithAssignment(UUID ticketId, UUID tenantId, UUID assignedTeamId) {
        return new TicketResponse(
                ticketId,
                "ticket-title",
                "ticket-description",
                "OPEN",
                "MEDIUM",
                "QUESTION",
                tenantId,
                null,
                LocalDateTime.now(),
                LocalDateTime.now(),
                null,
                null,
                Set.of(),
                Map.of(),
                Set.of(),
                List.of(),
                new TicketAssignmentResponse(UUID.randomUUID(), assignedTeamId, null, true, LocalDateTime.now()),
                List.of(),
                null
        );
    }

    private TicketResponse responseWithoutSensitiveFields(UUID ticketId, UUID tenantId) {
        return new TicketResponse(
                ticketId,
                "ticket-title",
                "ticket-description",
                "OPEN",
                "MEDIUM",
                "QUESTION",
                tenantId,
                null,
                LocalDateTime.now(),
                LocalDateTime.now(),
                null,
                null,
                Set.of(),
                Map.of(),
                Set.of(),
                List.of(),
                null,
                List.of(),
                null
        );
    }

    private void stubUserReferenceLookup() {
        when(entityManager.getReference(eq(AppUser.class), any(UUID.class))).thenAnswer(invocation -> {
            UUID refId = invocation.getArgument(1);
            AppUser ref = new AppUser();
            ref.setId(refId);
            return ref;
        });
    }
}
