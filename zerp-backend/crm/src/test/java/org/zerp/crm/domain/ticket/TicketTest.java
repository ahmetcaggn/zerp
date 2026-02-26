package org.zerp.crm.domain.ticket;

import org.junit.jupiter.api.*;

@DisplayName("Ticket Domain Tests")
public class TicketTest {

    /**
     * Setup method to run once before all tests in this class. Can be used to initialize shared resources or configurations.
     */
    @BeforeAll
    static void setupAll() {
        System.out.println("--- Tests ---");
    }

    private String defaultTitle;
    private String defaultDescription;
    private Integer defaultTenantId;
    private Integer defaultUserId;
    private TicketPriority defaultPriority;

    /**
     * Setup method to run before each test. Initializes default values for the tests.
     */
    @BeforeEach
    void setUp() {
        // Initialize default values for each test
        defaultTitle = "Test Ticket";
        defaultDescription = "This is a test ticket created for unit testing.";
        defaultTenantId = 500;
        defaultUserId = 1000;
        defaultPriority = TicketPriority.MEDIUM;
    }

    @Nested
    @DisplayName("First Response SLA Tests")
    class FirstResponseSlaTests {

        @Test
        @DisplayName("Should record first response when agent adds public comment")
        void should_Record_First_Response_When_Agent_Adds_Public_Comment() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // When
            ticket.addComment(2000, Comment.AuthorType.AGENT, "This is a public comment from an agent.", false);

            // Then
            Assertions.assertNotNull(ticket.getSlaTracking().getFirstResponseAt(), "First response should be recorded when an agent adds a public comment.");
            Assertions.assertFalse(ticket.getSlaTracking().isFirstResponseBreached(), "First response should not be breached immediately after recording.");
        }

        @Test
        @DisplayName("Should not record first response when customer adds public comment")
        void should_Not_Record_First_Response_When_Customer_Adds_Public_Comment() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // When
            ticket.addComment(3000, Comment.AuthorType.CUSTOMER, "This is a public comment from a customer.", false);

            // Then
            Assertions.assertNull(ticket.getSlaTracking().getFirstResponseAt(), "First response should not be recorded when a customer adds a public comment.");
        }
    }

    @Nested
    @DisplayName("Ticket Status Change Tests")
    class TicketStatusChangeTests {

        @Test
        @DisplayName("Should not change closed ticket's status")
        void should_Not_Change_Closed_Ticket_Status() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.changeStatus(TicketStatus.IN_PROGRESS, defaultUserId);
            ticket.changeStatus(TicketStatus.RESOLVED, defaultUserId);
            ticket.changeStatus(TicketStatus.CLOSED, defaultUserId);

            // When & Then
            Assertions.assertThrows(IllegalStateException.class, () -> {
                ticket.changeStatus(TicketStatus.OPEN, defaultUserId);
            }, "Changing status of a closed ticket should throw an exception.");
        }

        @Test
        @DisplayName("Should not change cancelled ticket's status")
        void should_Not_Change_Cancelled_Ticket_Status() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.changeStatus(TicketStatus.CANCELLED, defaultUserId);

            // When & Then
            Assertions.assertThrows(IllegalStateException.class, () -> {
                ticket.changeStatus(TicketStatus.OPEN, defaultUserId);
            }, "Changing status of a cancelled ticket should throw an exception.");
        }

        @Test
        @DisplayName("Should allow resolved ticket to be reopened")
        void should_Allow_Resolved_Ticket_To_Be_Reopened() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.changeStatus(TicketStatus.IN_PROGRESS, defaultUserId);
            ticket.changeStatus(TicketStatus.RESOLVED, defaultUserId);

            // When & Then
            Assertions.assertDoesNotThrow(() -> {
                ticket.changeStatus(TicketStatus.OPEN, defaultUserId);
            }, "Changing status of a resolved ticket to open should not throw an exception.");
        }

        @Test
        @DisplayName("Should allow resolved ticket to be closed")
        void should_Allow_Resolved_Ticket_To_Be_Closed() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.changeStatus(TicketStatus.IN_PROGRESS, defaultUserId);
            ticket.changeStatus(TicketStatus.RESOLVED, defaultUserId);

            // When & Then
            Assertions.assertDoesNotThrow(() -> {
                ticket.changeStatus(TicketStatus.CLOSED, defaultUserId);
            }, "Changing status of a resolved ticket to closed should not throw an exception.");
        }
    }

    @Nested
    @DisplayName("Comment Addition Tests")
    class CommentAdditionTests {
        @Test
        @DisplayName("Should not allow comment addition to closed ticket")
        void should_Not_Allow_Comment_Addition_To_Closed_Ticket() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.changeStatus(TicketStatus.IN_PROGRESS, defaultUserId);
            ticket.changeStatus(TicketStatus.RESOLVED, defaultUserId);
            ticket.changeStatus(TicketStatus.CLOSED, defaultUserId);

            // When & Then
            Assertions.assertThrows(IllegalStateException.class, () -> {
                ticket.addComment(2000, Comment.AuthorType.AGENT, "Attempting to add a comment to a closed ticket.", false);
            }, "Adding a comment to a closed ticket should throw an exception.");
        }

        @Test
        @DisplayName("Should not allow comment addition to cancelled ticket")
        void should_Not_Allow_Comment_Addition_To_Cancelled_Ticket() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.changeStatus(TicketStatus.CANCELLED, defaultUserId);

            // When & Then
            Assertions.assertThrows(IllegalStateException.class, () -> {
                ticket.addComment(2000, Comment.AuthorType.AGENT, "Attempting to addq a comment to a cancelled ticket.", false);
            }, "Adding a comment to a cancelled ticket should throw an exception.");
        }
    }

    @Nested
    @DisplayName("History Tracking Tests")
    class HistoryTrackingTests {
        @Test
        @DisplayName("Should track history of status changes")
        void should_Track_History_Of_Status_Changes() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // When
            ticket.changeStatus(TicketStatus.IN_PROGRESS, defaultUserId);
            ticket.changeStatus(TicketStatus.RESOLVED, defaultUserId);

            // Then
            Assertions.assertEquals(3, ticket.getHistoryEntries().size(), "There should be 2 history entries for the status changes.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The first history entry should be for the ticket creation.");
            Assertions.assertEquals(History.EventType.STATUS_CHANGED, ticket.getHistoryEntries().get(1).getEventType(), "The first history entry should be for the first status change.");
            Assertions.assertEquals(History.EventType.STATUS_CHANGED, ticket.getHistoryEntries().get(2).getEventType(), "The second history entry should be for the second status change.");
        }

        @Test
        @DisplayName("Should track history of comment additions")
        void should_Track_History_Of_Comment_Additions() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // When
            ticket.addComment(2000, Comment.AuthorType.AGENT, "First comment.", false);
            ticket.addComment(3000, Comment.AuthorType.CUSTOMER, "Second comment.", false);

            // Then
            Assertions.assertEquals(3, ticket.getHistoryEntries().size(), "There should be 2 history entries for the comment additions.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The first history entry should be for the ticket creation.");
            Assertions.assertEquals(History.EventType.COMMENT_ADDED, ticket.getHistoryEntries().get(1).getEventType(), "The first history entry should be for the first comment addition.");
            Assertions.assertEquals(History.EventType.COMMENT_ADDED, ticket.getHistoryEntries().get(2).getEventType(), "The second history entry should be for the second comment addition.");
        }

        @Test
        @DisplayName("Should track history of priority changes")
        void should_Track_History_Of_Priority_Changes() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // When
            ticket.changePriority(TicketPriority.CRITICAL, defaultUserId);

            // Then
            Assertions.assertEquals(2, ticket.getHistoryEntries().size(), "There should be 1 history entry for the priority change.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The first history entry should be for the ticket creation.");
            Assertions.assertEquals(History.EventType.PRIORITY_CHANGED, ticket.getHistoryEntries().get(1).getEventType(), "The history entry should be for the priority change.");
        }

        @Test
        @DisplayName("Should track history of ticket creation")
        void should_Track_History_Of_Ticket_Creation() {
            // Given & When
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // Then
            Assertions.assertEquals(1, ticket.getHistoryEntries().size(), "There should be 1 history entry for the ticket creation.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The history entry should be for the ticket creation.");
        }

        @Test
        @DisplayName("Should track history of ticket assignment to agent")
        void should_Track_History_Of_Ticket_Assignment_To_Agent() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // When
            ticket.assignToAgent(400, 2000, defaultUserId);

            // Then
            Assertions.assertEquals(3, ticket.getHistoryEntries().size(), "There should be 2 history entry for the ticket assignment.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The first history entry should be for the ticket creation.");
            Assertions.assertEquals(History.EventType.ASSIGNED, ticket.getHistoryEntries().get(1).getEventType(), "The history entry should be for the ticket assignment.");
            Assertions.assertEquals(History.EventType.STATUS_CHANGED, ticket.getHistoryEntries().get(2).getEventType(), "The second history entry should be for the status change to in progress.");
        }

        @Test
        @DisplayName("Should track history of ticket assignment to team")
        void should_Track_History_Of_Ticket_Assignment_To_Team() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);

            // When
            ticket.assignToTeam(400, defaultUserId);

            // Then
            Assertions.assertEquals(3, ticket.getHistoryEntries().size(), "There should be 1 history entry for the ticket assignment.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The first history entry should be for the ticket creation.");
            Assertions.assertEquals(History.EventType.STATUS_CHANGED, ticket.getHistoryEntries().get(1).getEventType(), "The history entry should be for the ticket assignment to team.");
            Assertions.assertEquals(History.EventType.ASSIGNED, ticket.getHistoryEntries().get(2).getEventType(), "The second history entry should be for the status change to in progress.");
        }

        @Test
        @DisplayName("Should track history of ticket unassignment")
        void should_Track_History_Of_Ticket_Unassignment() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.assignToAgent(400, 2000, defaultUserId);

            // When
            ticket.unassign(2000);

            // Then
            Assertions.assertEquals(5, ticket.getHistoryEntries().size(), "There should be 2 history entries for the ticket assignment and unassignment.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The first history entry should be for the ticket creation.");
            Assertions.assertEquals(History.EventType.ASSIGNED, ticket.getHistoryEntries().get(1).getEventType(), "The history entry should be for the ticket assignment.");
            Assertions.assertEquals(History.EventType.STATUS_CHANGED, ticket.getHistoryEntries().get(2).getEventType(), "The second history entry should be for the status change to in progress.");
            Assertions.assertEquals(History.EventType.UNASSIGNED, ticket.getHistoryEntries().get(3).getEventType(), "The second history entry should be for the ticket unassignment.");
            Assertions.assertEquals(History.EventType.STATUS_CHANGED, ticket.getHistoryEntries().get(4).getEventType(), "The second history entry should be for the status change to in progress.");
        }

        @Test
        @DisplayName("Should track history of ticket reassignment")
        void should_Track_History_Of_Ticket_Reassignment() {
            // Given
            Ticket ticket = Ticket.create(defaultTitle, defaultDescription, defaultTenantId, defaultUserId, defaultPriority);
            ticket.assignToAgent(400, 2000, defaultUserId);

            // When
            ticket.assignToAgent(400, 3000, defaultUserId);

            // Then
            Assertions.assertEquals(4, ticket.getHistoryEntries().size(), "There should be 2 history entries for the ticket assignment and reassignment.");
            Assertions.assertEquals(History.EventType.CREATED, ticket.getHistoryEntries().get(0).getEventType(), "The first history entry should be for the ticket creation.");
            Assertions.assertEquals(History.EventType.ASSIGNED, ticket.getHistoryEntries().get(1).getEventType(), "The first history entry should be for the initial ticket assignment.");
            Assertions.assertEquals(History.EventType.STATUS_CHANGED, ticket.getHistoryEntries().get(2).getEventType(), "The second history entry should be for the status change to in progress.");
            Assertions.assertEquals(History.EventType.REASSIGNED, ticket.getHistoryEntries().get(3).getEventType(), "The second history entry should be for the ticket reassignment.");
        }
    }

    /**
     * Teardown method to run once after all tests in this class. Can be used to clean up shared resources or configurations.
     */
    @AfterAll
    static void tearDownAll() {
        System.out.println("--- Tests done ---");
    }
}
