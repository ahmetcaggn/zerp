import type { Locale } from '@/core/types/common'

export const ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  unauthorized: '/unauthorized',
  employees: '/employees',
  permissionGroups: '/permission-groups',
  tickets: '/tickets',
  notifications: '/notifications',
  profile: '/profile',
  shops: '/shops',
  stock: '/stock',
  catalog: '/catalog',
  catalogMenus: '/catalog/menus',
  catalogCategories: '/catalog/categories',
  catalogMenuItems: '/catalog/menu-items',
  catalogProducts: '/catalog/products',
  sale: '/sale',
  tables: '/tables',
} as const

export const PUBLIC_PATHS = [ROUTES.root, ROUTES.login, ROUTES.register] as const
export const AUTH_PATHS = [ROUTES.login, ROUTES.register] as const
export const PROTECTED_PATHS = [
  ROUTES.dashboard,
  ROUTES.catalog,
  ROUTES.sale,
  ROUTES.stock,
  ROUTES.tables,
  ROUTES.employees,
  ROUTES.permissionGroups,
  ROUTES.tickets,
  ROUTES.notifications,
  ROUTES.shops,
  ROUTES.profile,
] as const

export function withLocale(locale: Locale, path: string): string {
  if (!path.startsWith('/')) {
    return `/${locale}/${path}`
  }

  if (path === '/') {
    return `/${locale}`
  }

  return `/${locale}${path}`
}
