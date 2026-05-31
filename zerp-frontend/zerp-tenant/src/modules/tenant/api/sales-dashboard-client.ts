import { httpClient } from '@/core/api/http-client'

import type { TenantSalesDashboardOverviewResponseDto } from '../types/sales-dashboard'

export const salesDashboardClient = {
  async getOverview() {
    return httpClient.get<TenantSalesDashboardOverviewResponseDto>('/sale/shops/dashboard-overview')
  },
}
