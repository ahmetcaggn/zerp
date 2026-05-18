export const queryKeys = {
  tenant: {
    storeSummary: ['tenant', 'store-summary'] as const,
    employees: ['tenant', 'employees'] as const,
  },
  client: {
    stores: ['client', 'stores'] as const,
    orders: ['client', 'orders'] as const,
  },
  admin: {
    tenants: ['admin', 'tenants'] as const,
    employees: ['admin', 'employees'] as const,
    shops: ['admin', 'shops'] as const,
    health: ['admin', 'health'] as const,
    teams: ['admin', 'teams'] as const,
    teamMemberCandidates: ['admin', 'team-member-candidates'] as const,
    teamTickets: ['admin', 'team-tickets'] as const,
    ticketAssignmentTeams: ['admin', 'ticket-assignment-teams'] as const,
    ticketAssignmentTeamMembers: ['admin', 'ticket-assignment-team-members'] as const,
    permissions: ['admin', 'permissions'] as const,
  },
}
