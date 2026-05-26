import { httpClient } from '@/core/api/http-client'

import type { ShopDashboardOverviewResponseDto } from '../types/shop-dashboard'

export const shopDashboardClient = {
  async getOverview(shopId: string) {
    return httpClient.get<ShopDashboardOverviewResponseDto>(`/sale/shops/${shopId}/dashboard-overview`)
  },
}
