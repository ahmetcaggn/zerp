export type SalesDashboardTrendDirection = 'up' | 'down' | 'neutral'
export type SalesDashboardMetricUnit = 'currency' | 'count' | 'percent' | 'text'
export type SalesDashboardInsightTone = 'positive' | 'warning' | 'info' | 'report'

export interface SalesDashboardMetricDelta {
  value: number
  unit: 'percent' | 'count'
  direction: SalesDashboardTrendDirection
  comparisonLabel: string
}

export interface SalesDashboardMetric {
  id: 'totalSales' | 'averageBasket' | 'totalOrders' | 'conversionRate' | 'totalStores'
  label: string
  value: number
  unit: Exclude<SalesDashboardMetricUnit, 'text'>
  delta?: SalesDashboardMetricDelta
}

export interface SalesDashboardTrendPoint {
  label: string
  sales: number
  orders: number
}

export interface SalesDashboardCityDistributionItem {
  city: string
  storeCount: number
  percentage: number
  color: string
}

export interface SalesDashboardStorePerformanceItem {
  storeId: string
  storeName: string
  sales: number
  orderCount: number
}

export interface SalesDashboardSummaryItem {
  id: string
  label: string
  value: number | string
  unit: SalesDashboardMetricUnit
}

export interface SalesDashboardQuickAction {
  id: string
  label: string
  description: string
  href: string
}

export interface SalesDashboardInsightItem {
  id: string
  title: string
  description: string
  timestampLabel: string
  tone: SalesDashboardInsightTone
}

export interface TenantSalesDashboardData {
  title: string
  subtitle: string
  scopeLabel: string
  rangeLabel: string
  reportDateLabel: string
  lastUpdatedAt: string
  metrics: SalesDashboardMetric[]
  trend: SalesDashboardTrendPoint[]
  cityDistribution: SalesDashboardCityDistributionItem[]
  storePerformance: SalesDashboardStorePerformanceItem[]
  summary: SalesDashboardSummaryItem[]
  quickActions: SalesDashboardQuickAction[]
  insights: SalesDashboardInsightItem[]
}
