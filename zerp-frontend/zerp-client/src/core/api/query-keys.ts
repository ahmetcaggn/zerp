export const queryKeys = {
  tenant: {
    storeSummary: ['tenant', 'store-summary'] as const,
    employees: ['tenant', 'employees'] as const,
  },
  client: {
    stores: ['client', 'stores'] as const,
    orders: ['client', 'orders'] as const,
    restaurants: {
      shops: ['client', 'restaurants', 'shops'] as const,
      nearbyShops: ['client', 'restaurants', 'nearby-shops'] as const,
      menu: ['client', 'restaurants', 'menu'] as const,
      products: ['client', 'restaurants', 'products'] as const,
    },
  },
  admin: {
    tenants: ['admin', 'tenants'] as const,
    health: ['admin', 'health'] as const,
  },
}
