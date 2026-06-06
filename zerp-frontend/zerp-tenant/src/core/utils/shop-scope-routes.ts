import { ROUTES } from '@/core/constants/routes'

export const SHOP_ONLY_PATHS = [
  ROUTES.catalog,
  ROUTES.tables,
  ROUTES.sale,
  ROUTES.stock,
] as const

export const GLOBAL_ONLY_PATHS = [
  ROUTES.employees,
  ROUTES.tickets,
  ROUTES.announcements,
] as const

export function isShopOnlyPath(pathname: string): boolean {
  return SHOP_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function isGlobalOnlyPath(pathname: string): boolean {
  return GLOBAL_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}
