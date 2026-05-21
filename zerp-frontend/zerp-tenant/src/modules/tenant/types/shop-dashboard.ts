export type ShopDashboardTrendDirection = 'up' | 'down' | 'neutral'
export type ShopDashboardMetricUnit = 'currency' | 'count' | 'percent' | 'text'
export type ShopDashboardLowStockTone = 'critical' | 'warning'

export interface ShopDashboardMetricDelta {
  value: number
  unit: 'percent' | 'count'
  direction: ShopDashboardTrendDirection
  comparisonLabel: string
}

export interface ShopDashboardMetricProgress {
  value: number
  label: string
  color: string
}

export interface ShopDashboardMetric {
  id: 'dailyRevenue' | 'averageCheck' | 'activeTables' | 'cancelRate'
  label: string
  value: number | string
  unit: ShopDashboardMetricUnit
  delta?: ShopDashboardMetricDelta
  secondaryLabel?: string
  progress?: ShopDashboardMetricProgress
}

export interface ShopDashboardTrendPoint {
  label: string
  revenue: number
  averageCheck: number
}

export interface ShopDashboardChannelItem {
  label: string
  value: number
  percentage: number
  color: string
}

export interface ShopDashboardCategoryItem {
  id: string
  label: string
  sales: number
  percentage: number
  color: string
}

export interface ShopDashboardTopProductItem {
  id: string
  name: string
  soldCount: number
  revenue: number
}

export interface ShopDashboardPerformanceItem {
  id: string
  label: string
  value: number | string
  unit: ShopDashboardMetricUnit
  deltaText?: string
}

export interface ShopDashboardLowStockItem {
  id: string
  name: string
  remainingLabel: string
  progress: number
  statusLabel: string
  tone: ShopDashboardLowStockTone
}

export interface ShopDashboardQuickAction {
  id: 'add-employee' | 'send-notification' | 'new-ticket' | 'view-stock' | 'open-cashier'
  label: string
  description: string
  href: string
}

export interface ShopDashboardData {
  shopId: string
  shopName: string
  subtitle: string
  reportDateLabel: string
  rangeLabel: string
  lastUpdatedAt: string
  metrics: ShopDashboardMetric[]
  trend: ShopDashboardTrendPoint[]
  salesChannels: ShopDashboardChannelItem[]
  categorySales: ShopDashboardCategoryItem[]
  topProducts: ShopDashboardTopProductItem[]
  performance: ShopDashboardPerformanceItem[]
  lowStock: ShopDashboardLowStockItem[]
  quickActions: ShopDashboardQuickAction[]
}
