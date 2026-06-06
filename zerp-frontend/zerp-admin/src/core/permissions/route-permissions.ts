import { type PermissionAction, PermissionActions } from './use-permissions'

interface RoutePermissionChecks {
  hasAnyPermission: (actions: readonly PermissionAction[]) => boolean
  hasAnyPermissionForTarget: (
    actions: readonly PermissionAction[],
    target: {
      targetType: string
      targetId?: string | null
      tenantId?: string | null
      parentTargets?: Array<{ targetType: string; targetId?: string | null }>
    },
  ) => boolean
}

interface RoutePermissionMatch {
  pattern: RegExp
  allow?: true
  actions?: readonly PermissionAction[]
  target?: {
    targetType: string
    targetParam: string
    tenantParam?: string
    actions: readonly PermissionAction[]
  }
}

const ROUTE_PERMISSION_RULES: readonly RoutePermissionMatch[] = [
  { pattern: /^\/dashboard\/?$/, allow: true },
  { pattern: /^\/profile\/?$/, allow: true },
  {
    pattern: /^\/tenants\/?$/,
    actions: [
      PermissionActions.READ_TENANT,
      PermissionActions.UPDATE_TENANT,
      PermissionActions.ADMIN,
    ],
  },
  {
    pattern: /^\/tenants\/(?<tenantId>[^/]+)\/?$/,
    target: {
      targetType: 'TENANT',
      targetParam: 'tenantId',
      tenantParam: 'tenantId',
      actions: [
        PermissionActions.READ_TENANT,
        PermissionActions.UPDATE_TENANT,
        PermissionActions.ADMIN,
      ],
    },
  },
  {
    pattern: /^\/tenants\/(?<tenantId>[^/]+)\/employees\/new\/?$/,
    actions: [PermissionActions.CREATE_EMPLOYEE_ANY_TENANT],
  },
  {
    pattern: /^\/tenants\/(?<tenantId>[^/]+)\/permission-groups(?:\/[^/]+)?\/?$/,
    target: {
      targetType: 'TENANT',
      targetParam: 'tenantId',
      tenantParam: 'tenantId',
      actions: [PermissionActions.ADMIN],
    },
  },
  {
    pattern: /^\/shops\/?$/,
    actions: [
      PermissionActions.READ_SHOP,
      PermissionActions.READ_TENANT,
      PermissionActions.UPDATE_TENANT,
      PermissionActions.ADMIN,
    ],
  },
  {
    pattern: /^\/teams\/?$/,
    actions: [PermissionActions.READ_TEAM, PermissionActions.ADMIN],
  },
  {
    pattern: /^\/teams\/[^/]+\/?$/,
    actions: [PermissionActions.READ_TEAM, PermissionActions.ADMIN],
  },
  {
    pattern: /^\/team-tickets(?:\/[^/]+)?\/?$/,
    actions: [PermissionActions.READ_TICKET, PermissionActions.ADMIN],
  },
  {
    pattern: /^\/assigned-tickets\/?$/,
    actions: [PermissionActions.READ_TICKET, PermissionActions.ADMIN],
  },
]

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

  if (matchedRule.actions) {
    return checks.hasAnyPermission(matchedRule.actions)
  }

  if (!matchedRule.target) {
    return true
  }

  const match = matchedRule.pattern.exec(normalizedRoutePath)
  const targetId = match?.groups?.[matchedRule.target.targetParam]
  const tenantId = matchedRule.target.tenantParam
    ? match?.groups?.[matchedRule.target.tenantParam]
    : undefined

  if (!targetId) {
    return false
  }

  return checks.hasAnyPermissionForTarget(matchedRule.target.actions, {
    targetType: matchedRule.target.targetType,
    targetId,
    tenantId,
    parentTargets:
      matchedRule.target.targetType === 'TENANT' || !tenantId
        ? []
        : [{ targetType: 'TENANT', targetId: tenantId }],
  })
}
