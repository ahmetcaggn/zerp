import { ROUTES } from '@/core/constants/routes'

import { type PermissionAction, PermissionActions } from './use-permissions'

interface RoutePermissionChecks {
  currentShopId?: string | null
  hasAnyPermission: (actions: readonly PermissionAction[]) => boolean
  hasTenantPermission: (action: PermissionAction) => boolean
  hasShopPermission: (action: PermissionAction, shopId?: string | null) => boolean
  hasAnyShopPermission: (actions: readonly PermissionAction[], shopId?: string | null) => boolean
}

type RoutePermissionScope = 'ACTION' | 'TENANT' | 'SHOP' | 'DASHBOARD'

interface RoutePermissionMatch {
  pattern: RegExp
  allow?: true
  scope?: RoutePermissionScope
  actions?: readonly PermissionAction[]
}

const SHOP_READ_ACTIONS: readonly PermissionAction[] = [PermissionActions.READ_SHOP]
const SHOP_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_SHOP,
  PermissionActions.UPDATE_SHOP,
]

const EMPLOYEE_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_EMPLOYEE,
  PermissionActions.CREATE_EMPLOYEE,
  PermissionActions.UPDATE_EMPLOYEE,
  PermissionActions.DELETE_EMPLOYEE,
]

const TICKET_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_TICKET,
  PermissionActions.UPDATE_TICKET,
  PermissionActions.DELETE_TICKET,
  PermissionActions.CREATE_TICKET,
  PermissionActions.READ_TICKET_COMMENT,
  PermissionActions.CREATE_TICKET_COMMENT,
  PermissionActions.READ_TICKET_ASSIGNMENT,
  PermissionActions.CREATE_TICKET_ASSIGNMENT,
  PermissionActions.READ_TICKET_ATTACHMENT,
  PermissionActions.CREATE_TICKET_ATTACHMENT,
  PermissionActions.READ_TICKET_HISTORY,
  PermissionActions.READ_TICKET_SLA_TRACKING,
]

const CATALOG_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_PRODUCT,
  PermissionActions.CREATE_PRODUCT,
  PermissionActions.UPDATE_PRODUCT,
  PermissionActions.READ_MENU,
  PermissionActions.CREATE_MENU,
  PermissionActions.READ_MENU_ITEM,
  PermissionActions.CREATE_MENU_ITEM,
  PermissionActions.UPDATE_MENU_ITEM,
  PermissionActions.DELETE_MENU_ITEM,
]

const TABLE_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_SHOP_TABLE,
  PermissionActions.CREATE_SHOP_TABLE,
  PermissionActions.UPDATE_SHOP_TABLE,
  PermissionActions.READ_TABLE_ORDER,
]

const SALE_PAGE_ORDER_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_TABLE_ORDER,
  PermissionActions.UPDATE_TABLE_ORDER,
]

const SALE_HISTORY_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_SALE_HISTORY,
  PermissionActions.READ_TABLE_ORDER,
]

const STOCK_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_STOCK_RESOURCE,
  PermissionActions.CREATE_STOCK_RESOURCE,
  PermissionActions.UPDATE_STOCK_RESOURCE,
  PermissionActions.READ_STOCK_MOVEMENT,
  PermissionActions.CREATE_STOCK_MOVEMENT,
  PermissionActions.CREATE_STOCK_ENTRY,
  PermissionActions.CREATE_STOCK_ADJUSTMENT,
  PermissionActions.CREATE_STOCK_WASTE,
  PermissionActions.CREATE_STOCK_RETURN,
  PermissionActions.UPDATE_STOCK_MOVEMENT,
  PermissionActions.READ_STOCK_COUNT,
  PermissionActions.CREATE_STOCK_COUNT,
  PermissionActions.UPDATE_STOCK_COUNT,
]

const PERMISSION_GROUP_PAGE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.ADMIN,
  PermissionActions.READ_PERMISSION,
]

const ROUTE_PERMISSION_RULES: readonly RoutePermissionMatch[] = [
  {
    pattern: /^\/dashboard\/?$/,
    scope: 'DASHBOARD',
    actions: [PermissionActions.READ_DASHBOARD, PermissionActions.READ_SHOP],
  },
  { pattern: /^\/profile\/?$/, allow: true },
  { pattern: /^\/test(?:\/.*)?$/, allow: true },
  { pattern: /^\/shops\/?$/, scope: 'ACTION', actions: SHOP_PAGE_ACTIONS },
  {
    pattern: /^\/employees\/new\/?$/,
    scope: 'TENANT',
    actions: [PermissionActions.CREATE_EMPLOYEE],
  },
  { pattern: /^\/employees(?:\/[^/]+)?\/?$/, scope: 'ACTION', actions: EMPLOYEE_PAGE_ACTIONS },
  {
    pattern: /^\/permission-groups(?:\/[^/]+)?\/?$/,
    scope: 'TENANT',
    actions: PERMISSION_GROUP_PAGE_ACTIONS,
  },
  { pattern: /^\/tickets(?:\/[^/]+)?\/?$/, scope: 'ACTION', actions: TICKET_PAGE_ACTIONS },
  { pattern: /^\/notifications\/?$/, allow: true },
  { pattern: /^\/catalog(?:\/.*)?$/, scope: 'SHOP', actions: CATALOG_PAGE_ACTIONS },
  { pattern: /^\/tables\/?$/, scope: 'SHOP', actions: TABLE_PAGE_ACTIONS },
  { pattern: /^\/sale\/?$/, scope: 'SHOP', actions: SALE_PAGE_ORDER_ACTIONS },
  { pattern: /^\/sale-history(?:\/[^/]+)?\/?$/, scope: 'SHOP', actions: SALE_HISTORY_PAGE_ACTIONS },
  { pattern: /^\/shop-qr\/?$/, scope: 'SHOP', actions: SHOP_READ_ACTIONS },
  { pattern: /^\/stock\/?$/, scope: 'SHOP', actions: STOCK_PAGE_ACTIONS },
]

const FALLBACK_ROUTE_CANDIDATES = [
  ROUTES.dashboard,
  ROUTES.shops,
  ROUTES.catalog,
  ROUTES.tables,
  ROUTES.sale,
  ROUTES.saleHistory,
  ROUTES.shopQr,
  ROUTES.stock,
  ROUTES.employees,
  ROUTES.permissionGroups,
  ROUTES.tickets,
] as const

export function removeLocalePrefix(pathname: string, locale: string): string {
  const normalizedPathname = pathname.split('?')[0]?.replace(/\/+$/, '') || '/'
  const localePrefix = `/${locale}`

  if (normalizedPathname === localePrefix) {
    return '/'
  }

  if (normalizedPathname.startsWith(`${localePrefix}/`)) {
    return normalizedPathname.slice(localePrefix.length) || '/'
  }

  return normalizedPathname
}

export function canAccessProtectedRoute(routePath: string, checks: RoutePermissionChecks): boolean {
  const normalizedRoutePath = routePath.replace(/\/+$/, '') || '/'
  const matchedRule = ROUTE_PERMISSION_RULES.find((rule) => rule.pattern.test(normalizedRoutePath))

  if (!matchedRule) {
    return false
  }

  if (matchedRule.allow) {
    return true
  }

  const actions = matchedRule.actions ?? []

  if (matchedRule.scope === 'TENANT') {
    return (
      actions.some((action) => checks.hasTenantPermission(action)) ||
      checks.hasAnyPermission(actions)
    )
  }

  if (matchedRule.scope === 'SHOP') {
    if (normalizedRoutePath === '/sale') {
      return Boolean(
        checks.currentShopId &&
        (checks.hasShopPermission(PermissionActions.READ_SHOP_TABLE, checks.currentShopId) ||
          checks.hasAnyPermission([PermissionActions.READ_SHOP_TABLE])) &&
        (checks.hasAnyShopPermission(actions, checks.currentShopId) ||
          checks.hasAnyPermission(actions)),
      )
    }

    return Boolean(
      checks.currentShopId &&
      (checks.hasAnyShopPermission(actions, checks.currentShopId) ||
        checks.hasAnyPermission(actions)),
    )
  }

  if (matchedRule.scope === 'DASHBOARD') {
    return checks.currentShopId
      ? checks.hasAnyShopPermission(actions, checks.currentShopId) ||
          checks.hasAnyPermission(actions)
      : actions.some((action) => checks.hasTenantPermission(action)) ||
          checks.hasAnyPermission(actions)
  }

  return checks.hasAnyPermission(actions) || checks.hasTenantPermission(PermissionActions.ADMIN)
}

export function getFirstAccessibleProtectedRoute(
  checks: RoutePermissionChecks,
  excludeRoute?: string,
): string | undefined {
  const normalizedExcludeRoute = excludeRoute?.replace(/\/+$/, '') || undefined

  return FALLBACK_ROUTE_CANDIDATES.find((route) => {
    const normalizedRoute = route.replace(/\/+$/, '') || '/'
    return (
      normalizedRoute !== normalizedExcludeRoute &&
      canAccessProtectedRoute(normalizedRoute, checks)
    )
  })
}
