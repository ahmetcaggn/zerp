export type StockDashboardMetricUnit = 'currency' | 'count' | 'text'
export type StockDashboardMetricTone = 'success' | 'info' | 'warning' | 'danger' | 'accent'
export type StockDashboardResourceStatus = 'healthy' | 'low' | 'critical'
export type StockDashboardTab = 'resources' | 'movements' | 'counts'
export type StockDashboardMovementType =
  | 'purchase'
  | 'sale'
  | 'waste'
  | 'adjustment'
  | 'transfer'
  | 'return'
  | 'count-adjustment'
  | 'consumption'

export interface StockDashboardMetric {
  id: 'resourceKinds' | 'totalQuantity' | 'inventoryValue' | 'criticalResources' | 'pendingOrders'
  label: string
  value: number | string
  unit: StockDashboardMetricUnit
  helperText: string
  tone: StockDashboardMetricTone
}

export interface StockDashboardFilterOption {
  label: string
  value: string
}

export interface StockDashboardResourceRow {
  id: string
  name: string
  category: string
  categoryColor: string
  unitType: string
  quantity: number
  reorderThreshold: number
  unitPrice: number
  stockValue: number
  status: StockDashboardResourceStatus
  statusLabel: string
}

export interface StockDashboardMovementRow {
  id: string
  resourceName: string
  type: StockDashboardMovementType
  typeLabel: string
  quantityLabel: string
  actor: string
  timestampLabel: string
  notes?: string
}

export interface StockDashboardCountRow {
  id: string
  countDate: string
  countDateLabel: string
  statusLabel: string
  status: 'draft' | 'inProgress' | 'completed'
  discrepancyLabel: string
  responsible: string
}

export interface StockDashboardDistributionItem {
  label: string
  count: number
  percentage: number
  color: string
}

export interface StockDashboardValuableItem {
  id: string
  name: string
  value: number
}

export interface StockDashboardQuickAction {
  id: 'add-resource' | 'start-count' | 'stock-report' | 'stock-movements'
  label: string
  description: string
}

export interface StockDashboardAlert {
  title: string
  description: string
  ctaLabel: string
}

export interface StockDashboardData {
  shopId: string
  shopName: string
  title: string
  subtitle: string
  reportDateLabel: string
  lastUpdatedAt: string
  tabs: Array<{ key: StockDashboardTab; label: string }>
  metrics: StockDashboardMetric[]
  searchPlaceholder: string
  categoryOptions: StockDashboardFilterOption[]
  unitOptions: StockDashboardFilterOption[]
  statusOptions: StockDashboardFilterOption[]
  resources: StockDashboardResourceRow[]
  movements: StockDashboardMovementRow[]
  counts: StockDashboardCountRow[]
  distribution: StockDashboardDistributionItem[]
  valuableResources: StockDashboardValuableItem[]
  quickActions: StockDashboardQuickAction[]
  alert: StockDashboardAlert
}
