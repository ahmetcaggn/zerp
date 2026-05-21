import { tenantSalesDashboardMock } from './mock-sales-dashboard-data'

export const salesDashboardClient = {
  async getOverview() {
    return tenantSalesDashboardMock
  },
}
