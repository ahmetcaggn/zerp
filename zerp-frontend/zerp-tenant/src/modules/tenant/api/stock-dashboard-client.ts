import { stockDashboardMockByShopId } from './mock-stock-dashboard-data'

export const stockDashboardClient = {
  async getOverview(shopId: string) {
    return stockDashboardMockByShopId[shopId] ?? stockDashboardMockByShopId['shop-beyoglu']
  },
}
