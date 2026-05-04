export const queryKeys = {
  tenant: {
    storeSummary:   ['tenant', 'store-summary'] as const,
    employees:      ['tenant', 'employees'] as const,
    tickets:        ['tenant', 'tickets'] as const,
    notifications:  ['tenant', 'notifications'] as const,
    stockResources: ['tenant', 'stock-resources'] as const,
    stockMovements: ['tenant', 'stock-movements'] as const,
    stockCounts:    ['tenant', 'stock-counts'] as const,
  },
  client: {
    stores: ['client', 'stores'] as const,
    orders: ['client', 'orders'] as const,
  },
  admin: {
    tenants: ['admin', 'tenants'] as const,
    health: ['admin', 'health'] as const,
  },
}
