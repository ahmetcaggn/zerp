package org.zerp.crm.service;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.*;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.crm.*;
import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.TicketEntity.TicketStatus;
import org.zerp.common.entity.crm.TicketEntity.TicketType;
import org.zerp.common.entity.user.AppUser;
import org.zerp.crm.dto.ticket.*;
import org.zerp.crm.repository.TicketRepository;
import org.zerp.crm.service.ticket.TicketResponseMapper;
import org.zerp.crm.service.ticket.TicketSpecificationBuilder;
import org.zerp.crm.service.ticket.TicketValueParser;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("Ticket Service Tests")
public class TicketServiceTest {

    private TicketRepository ticketRepository;
    private EntityManager entityManager;
    private TicketService ticketService;

    private UUID defaultTenantId;
    private UUID defaultUserId;

    @BeforeEach
    void setUp() {
        ticketRepository = mock(TicketRepository.class);
        entityManager = mock(EntityManager.class);
        TicketValueParser ticketValueParser = new TicketValueParser();
        TicketSpecificationBuilder ticketSpecificationBuilder = new TicketSpecificationBuilder(ticketValueParser);
        TicketResponseMapper ticketResponseMapper = new TicketResponseMapper();
        ticketService = new TicketService(
                ticketRepository,
                ticketResponseMapper,
                ticketSpecificationBuilder,
                ticketValueParser,
                entityManager
        );

        defaultTenantId = UUID.randomUUID();
        defaultUserId = UUID.randomUUID();

        // Default: save returns the entity with an ID set
        when(ticketRepository.save(any(TicketEntity.class))).thenAnswer(invocation -> {
            TicketEntity saved = invocation.getArgument(0);
            if (saved.getId() == null) {
                saved.setId(UUID.randomUUID());
            }
            return saved;
        });

        when(entityManager.getReference(eq(Tenant.class), any(UUID.class))).thenAnswer(invocation -> {
            UUID id = invocation.getArgument(1);
            Tenant tenant = new Tenant();
            tenant.setId(id);
            return tenant;
        });

        when(entityManager.getReference(eq(AppUser.class), any(UUID.class))).thenAnswer(invocation -> {
            UUID id = invocation.getArgument(1);
            AppUser appUser = new AppUser();
            appUser.setId(id);
            return appUser;
        });

        when(entityManager.getReference(eq(TeamEntity.class), any(UUID.class))).thenAnswer(invocation -> {
            UUID id = invocation.getArgument(1);
            TeamEntity team = new TeamEntity();
            team.setId(id);
            return team;
        });
    }

    private CreateTicketRequest defaultCreateRequest() {
        return new CreateTicketRequest("Test Ticket", "Description", defaultTenantId, TicketPriority.MEDIUM, TicketType.QUESTION);
    }

    private TicketEntity createSavedEntity() {
        TicketEntity entity = new TicketEntity();
        entity.setId(UUID.randomUUID());
        entity.setTitle("Test Ticket");
        entity.setDescription("Description");
        entity.setStatus(TicketStatus.OPEN);
        entity.setPriority(TicketPriority.MEDIUM);
        entity.setType(TicketType.QUESTION);
        entity.setTenant(tenant(defaultTenantId));
        entity.setReporter(reporter(defaultUserId));
        entity.setCreatedAt(LocalDateTime.now());

        // SLA
        TicketSlaTrackingEntity sla = new TicketSlaTrackingEntity();
        sla.setTicket(entity);
        sla.setFirstResponseDueAt(LocalDateTime.now().plusMinutes(240));
        sla.setResolutionDueAt(LocalDateTime.now().plusMinutes(960));
        sla.setIsFirstResponseBreached(false);
        sla.setIsResolutionBreached(false);
        sla.setIsPaused(false);
        sla.setTotalPausedTimeMinutes(0);
        entity.setSlaTracking(sla);

        // Created history
        TicketHistoryEntity h = new TicketHistoryEntity();
        h.setTicket(entity);
        h.setEventType(TicketHistoryEntity.EventType.CREATED);
        h.setActorParty(reporter(defaultUserId));
        h.setPayload("Ticket created with priority: MEDIUM");
        h.setOccurredAt(LocalDateTime.now());
        entity.getHistory().add(h);

        return entity;
    }

    private Tenant tenant(UUID id) {
        Tenant tenant = new Tenant();
        tenant.setId(id);
        return tenant;
    }

    private AppUser reporter(UUID id) {
        AppUser appUser = new AppUser();
        appUser.setId(id);
        return appUser;
    }

    @Nested
    @DisplayName("First Response SLA Tests")
    class FirstResponseSlaTests {

        @Test
        @DisplayName("Should record first response when agent adds public comment")
        void should_Record_First_Response_When_Agent_Adds_Public_Comment() {
            TicketEntity entity = createSavedEntity();
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            ticketService.addComment(ticketId, new AddCommentRequest("Agent reply", false), UUID.randomUUID());

            Assertions.assertNotNull(entity.getSlaTracking().getFirstResponseAt(),
                    "First response should be recorded when an agent adds a public comment.");
            Assertions.assertFalse(entity.getSlaTracking().getIsFirstResponseBreached(),
                    "First response should not be breached immediately after recording.");
        }

        @Test
        @DisplayName("Should not record first response when comment is internal")
        void should_Not_Record_First_Response_When_Internal_Comment() {
            TicketEntity entity = createSavedEntity();
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            ticketService.addComment(ticketId, new AddCommentRequest("Internal note", true), UUID.randomUUID());

            Assertions.assertNull(entity.getSlaTracking().getFirstResponseAt(),
                    "First response should not be recorded for internal comments.");
        }
    }

    @Nested
    @DisplayName("Ticket Status Change Tests")
    class TicketStatusChangeTests {

        @Test
        @DisplayName("Should not change closed ticket's status")
        void should_Not_Change_Closed_Ticket_Status() {
            TicketEntity entity = createSavedEntity();
            entity.setStatus(TicketStatus.CLOSED);
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            Assertions.assertThrows(IllegalStateException.class, () ->
                    ticketService.changeStatus(ticketId, new ChangeStatusRequest(TicketStatus.OPEN), defaultUserId),
                    "Changing status of a closed ticket should throw an exception.");
        }

        @Test
        @DisplayName("Should not change cancelled ticket's status")
        void should_Not_Change_Cancelled_Ticket_Status() {
            TicketEntity entity = createSavedEntity();
            entity.setStatus(TicketStatus.CANCELLED);
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            Assertions.assertThrows(IllegalStateException.class, () ->
                    ticketService.changeStatus(ticketId, new ChangeStatusRequest(TicketStatus.OPEN), defaultUserId),
                    "Changing status of a cancelled ticket should throw an exception.");
        }

        @Test
        @DisplayName("Should allow resolved ticket to be reopened")
        void should_Allow_Resolved_Ticket_To_Be_Reopened() {
            TicketEntity entity = createSavedEntity();
            entity.setStatus(TicketStatus.RESOLVED);
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            Assertions.assertDoesNotThrow(() ->
                    ticketService.changeStatus(ticketId, new ChangeStatusRequest(TicketStatus.OPEN), defaultUserId),
                    "Changing status of a resolved ticket to open should not throw an exception.");
        }

        @Test
        @DisplayName("Should allow resolved ticket to be closed")
        void should_Allow_Resolved_Ticket_To_Be_Closed() {
            TicketEntity entity = createSavedEntity();
            entity.setStatus(TicketStatus.RESOLVED);
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            Assertions.assertDoesNotThrow(() ->
                    ticketService.changeStatus(ticketId, new ChangeStatusRequest(TicketStatus.CLOSED), defaultUserId),
                    "Changing status of a resolved ticket to closed should not throw an exception.");
        }
    }

    @Nested
    @DisplayName("Comment Addition Tests")
    class CommentAdditionTests {

        @Test
        @DisplayName("Should not allow comment addition to closed ticket")
        void should_Not_Allow_Comment_Addition_To_Closed_Ticket() {
            TicketEntity entity = createSavedEntity();
            entity.setStatus(TicketStatus.CLOSED);
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            Assertions.assertThrows(IllegalStateException.class, () ->
                    ticketService.addComment(ticketId, new AddCommentRequest("Test", false), UUID.randomUUID()),
                    "Adding a comment to a closed ticket should throw an exception.");
        }

        @Test
        @DisplayName("Should not allow comment addition to cancelled ticket")
        void should_Not_Allow_Comment_Addition_To_Cancelled_Ticket() {
            TicketEntity entity = createSavedEntity();
            entity.setStatus(TicketStatus.CANCELLED);
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            Assertions.assertThrows(IllegalStateException.class, () ->
                    ticketService.addComment(ticketId, new AddCommentRequest("Test", false), UUID.randomUUID()),
                    "Adding a comment to a cancelled ticket should throw an exception.");
        }
    }

    @Nested
    @DisplayName("History Tracking Tests")
    class HistoryTrackingTests {

        @Test
        @DisplayName("Should track history of ticket creation")
        void should_Track_History_Of_Ticket_Creation() {
            TicketResponse response = ticketService.createTicket(defaultCreateRequest(), defaultUserId);

            // The save mock returns the entity, which should have history entries
            verify(ticketRepository).save(argThat(entity -> {
                Assertions.assertFalse(entity.getHistory().isEmpty(), "Should have history entries");
                Assertions.assertEquals(TicketHistoryEntity.EventType.CREATED,
                        entity.getHistory().get(0).getEventType(),
                        "First history should be CREATED");
                return true;
            }));
        }

        @Test
        @DisplayName("Should track history of status changes")
        void should_Track_History_Of_Status_Changes() {
            TicketEntity entity = createSavedEntity();
            int initialHistorySize = entity.getHistory().size();
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            ticketService.changeStatus(ticketId, new ChangeStatusRequest(TicketStatus.IN_PROGRESS), defaultUserId);

            Assertions.assertTrue(entity.getHistory().size() > initialHistorySize,
                    "Status change should add history entry");
            TicketHistoryEntity lastHistory = entity.getHistory().get(entity.getHistory().size() - 1);
            Assertions.assertEquals(TicketHistoryEntity.EventType.STATUS_CHANGED,
                    lastHistory.getEventType(), "Last history should be STATUS_CHANGED");
        }

        @Test
        @DisplayName("Should track history of priority changes")
        void should_Track_History_Of_Priority_Changes() {
            TicketEntity entity = createSavedEntity();
            int initialHistorySize = entity.getHistory().size();
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            ticketService.changePriority(ticketId, new ChangePriorityRequest(TicketPriority.CRITICAL), defaultUserId);

            Assertions.assertTrue(entity.getHistory().size() > initialHistorySize,
                    "Priority change should add history entry");
            TicketHistoryEntity lastHistory = entity.getHistory().get(entity.getHistory().size() - 1);
            Assertions.assertEquals(TicketHistoryEntity.EventType.PRIORITY_CHANGED,
                    lastHistory.getEventType(), "Last history should be PRIORITY_CHANGED");
        }

        @Test
        @DisplayName("Should track history of ticket assignment to agent")
        void should_Track_History_Of_Ticket_Assignment_To_Agent() {
            TicketEntity entity = createSavedEntity();
            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            UUID agentId = UUID.randomUUID();
            ticketService.assignTicket(ticketId, new AssignTicketRequest(UUID.randomUUID(), agentId), defaultUserId);

            boolean hasAssigned = entity.getHistory().stream()
                    .anyMatch(h -> h.getEventType() == TicketHistoryEntity.EventType.ASSIGNED);
            Assertions.assertTrue(hasAssigned, "Should have ASSIGNED history entry");
        }

        @Test
        @DisplayName("Should track history of ticket unassignment")
        void should_Track_History_Of_Ticket_Unassignment() {
            TicketEntity entity = createSavedEntity();
            // Set up an existing active assignment
            TicketAssignmentEntity assignment = new TicketAssignmentEntity();
            assignment.setTicket(entity);
            TeamEntity team = new TeamEntity();
            team.setId(UUID.randomUUID());
            assignment.setTeam(team);
            assignment.setAgentParty(reporter(UUID.randomUUID()));
            assignment.setAssignedByParty(reporter(defaultUserId));
            assignment.setActive(true);
            assignment.setAssignedAt(LocalDateTime.now());
            entity.setCurrentAssignment(assignment);
            entity.setStatus(TicketStatus.IN_PROGRESS);

            UUID ticketId = entity.getId();
            when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(entity));

            ticketService.unassignTicket(ticketId, UUID.randomUUID());

            boolean hasUnassigned = entity.getHistory().stream()
                    .anyMatch(h -> h.getEventType() == TicketHistoryEntity.EventType.UNASSIGNED);
            Assertions.assertTrue(hasUnassigned, "Should have UNASSIGNED history entry");
        }
    }
}
