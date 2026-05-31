export type SalesDashboardTrendDirection = 'up' | 'down' | 'neutral'
export type SalesDashboardMetricUnit = 'currency' | 'count' | 'percent' | 'text'

export interface SalesDashboardMetricDelta {
  value: number
  unit: 'percent' | 'count'
  direction: SalesDashboardTrendDirection
  comparisonLabel: string
}

export interface SalesDashboardMetric {
  id: 'totalSales' | 'averageBasket' | 'totalOrders' | 'totalStores'
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
}

export interface TenantSalesDashboardMetricDeltaResponseDto {
  totalSalesDeltaPercentage: number | null
  averageBasketDeltaPercentage: number | null
  totalOrdersDeltaPercentage: number | null
}

export interface TenantSalesDashboardTrendPointResponseDto {
  label: string
  sales: number
  orders: number
}

export interface TenantSalesDashboardCityDistributionResponseDto {
  city: string
  storeCount: number
  percentage: number
}

export interface TenantSalesDashboardStorePerformanceResponseDto {
  storeId: string
  storeName: string
  sales: number
  orderCount: number
}

export interface TenantSalesDashboardSummaryResponseDto {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topProductName: string | null
  topStoreName: string | null
}

export interface TenantSalesDashboardOverviewResponseDto {
  totalSales: number
  averageBasket: number
  totalOrders: number
  totalStores: number
  metricsDelta: TenantSalesDashboardMetricDeltaResponseDto
  trend: TenantSalesDashboardTrendPointResponseDto[]
  cityDistribution: TenantSalesDashboardCityDistributionResponseDto[]
  storePerformance: TenantSalesDashboardStorePerformanceResponseDto[]
  summary: TenantSalesDashboardSummaryResponseDto
  lastUpdatedAt: string
}
