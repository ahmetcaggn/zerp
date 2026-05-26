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

export interface ShopDashboardOverviewResponseDto {
  dailyRevenue: number
  averageCheck: number
  activeTableCount: number
  totalTableCount: number
  categorySales: ShopDashboardCategorySalesDto[]
  topProducts: ShopDashboardTopProductDto[]
  lastUpdatedAt: string
}
