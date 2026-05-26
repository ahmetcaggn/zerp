export type ShopDashboardTrendDirection = 'up' | 'down' | 'neutral'
export type ShopDashboardMetricUnit = 'currency' | 'count' | 'percent' | 'text'
export type ShopDashboardLowStockTone = 'critical' | 'warning'

export type ShopDashboardSalesChannelId = 'TABLE_SERVICE' | 'TAKEAWAY' | 'DELIVERY' | 'ONLINE'

export interface ShopDashboardCategorySalesDto {
  categoryId: string
  categoryName: string
  revenue: number
  percentage: number
}

export interface ShopDashboardTopProductDto {
  menuItemId: string
  menuItemName: string
  soldCount: number
  revenue: number
}

export interface ShopDashboardTrendPointDto {
  label: string
  revenue: number
  averageCheck: number
}

export interface ShopDashboardSalesChannelDto {
  channelId: ShopDashboardSalesChannelId
  value: number
  percentage: number
}

export interface ShopDashboardPerformanceDto {
  totalRevenue: number
  totalRevenueDeltaPercentage: number | null
  averageCheck: number
  averageCheckDeltaPercentage: number | null
  totalTableServiceCount: number
  totalTableServiceCountDeltaPercentage: number | null
  customerSatisfaction: number | null
}

export interface ShopDashboardLowStockDto {
  stockResourceId: string
  name: string
  quantity: number
  reorderThreshold: number
  unitType: string | null
}

export interface ShopDashboardOverviewResponseDto {
  dailyRevenue: number
  averageCheck: number
  activeTableCount: number
  totalTableCount: number
  trend: ShopDashboardTrendPointDto[]
  salesChannels: ShopDashboardSalesChannelDto[]
  categorySales: ShopDashboardCategorySalesDto[]
  topProducts: ShopDashboardTopProductDto[]
  performance: ShopDashboardPerformanceDto
  lowStock: ShopDashboardLowStockDto[]
  lastUpdatedAt: string
}
