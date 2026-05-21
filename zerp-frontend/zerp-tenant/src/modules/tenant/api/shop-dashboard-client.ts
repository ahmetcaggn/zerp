import { shopDashboardMockById, shopDashboardMockShops } from './mock-shop-dashboard-data'

export const shopDashboardClient = {
  async getOverview(shopId: string) {
    return shopDashboardMockById[shopId] ?? shopDashboardMockById[shopDashboardMockShops[0].id]
  },
}
