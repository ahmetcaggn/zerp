'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo } from 'react'

import { httpClient } from '@/core/api/http-client'
import { queryKeys } from '@/core/api/query-keys'
import { toRaQueryString } from '@/core/api/resource-types'
import { useAuth } from '@/core/auth/client/use-auth'

import {
  createPermissionEvaluator,
  type PermissionCheckTarget,
  type PermissionGrant,
  type PermissionTargetType,
  type TicketPermissionTarget,
} from './permission-evaluator'

export const PermissionActions = {
  CREATE_EMPLOYEE_ANY_TENANT: 'CREATE_EMPLOYEE_ANY_TENANT',
  ADMIN: 'ADMIN',
  UPDATE_TENANT: 'UPDATE_TENANT',
  READ_TENANT: 'READ_TENANT',
  CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
  READ_ANNOUNCEMENT: 'READ_ANNOUNCEMENT',
  CREATE_EMPLOYEE: 'CREATE_EMPLOYEE',
  CREATE_TICKET: 'CREATE_TICKET',
  CREATE_TEAM: 'CREATE_TEAM',
  ADMIN_SHOP: 'ADMIN_SHOP',
  UPDATE_SHOP: 'UPDATE_SHOP',
  DELETE_SHOP: 'DELETE_SHOP',
  READ_SHOP: 'READ_SHOP',
  READ_DASHBOARD: 'READ_DASHBOARD',
  CREATE_STOCK_RESOURCE: 'CREATE_STOCK_RESOURCE',
  CREATE_PRODUCT: 'CREATE_PRODUCT',
  CREATE_MENU: 'CREATE_MENU',
  CREATE_SHOP_TABLE: 'CREATE_SHOP_TABLE',
  CREATE_STOCK_COUNT: 'CREATE_STOCK_COUNT',
  READ_SALE_HISTORY: 'READ_SALE_HISTORY',
  READ_USER: 'READ_USER',
  READ_PERMISSION: 'READ_PERMISSION',
  ADMIN_STOCK_RESOURCE: 'ADMIN_STOCK_RESOURCE',
  UPDATE_STOCK_RESOURCE: 'UPDATE_STOCK_RESOURCE',
  DELETE_STOCK_RESOURCE: 'DELETE_STOCK_RESOURCE',
  READ_STOCK_RESOURCE: 'READ_STOCK_RESOURCE',
  CREATE_STOCK_MOVEMENT: 'CREATE_STOCK_MOVEMENT',
  CREATE_STOCK_ENTRY: 'CREATE_STOCK_ENTRY',
  CREATE_STOCK_ADJUSTMENT: 'CREATE_STOCK_ADJUSTMENT',
  CREATE_STOCK_WASTE: 'CREATE_STOCK_WASTE',
  CREATE_STOCK_RETURN: 'CREATE_STOCK_RETURN',
  READ_EMPLOYEE: 'READ_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  READ_TEAM: 'READ_TEAM',
  UPDATE_TEAM: 'UPDATE_TEAM',
  DELETE_TEAM: 'DELETE_TEAM',
  CREATE_TEAM_MEMBER: 'CREATE_TEAM_MEMBER',
  READ_TEAM_MEMBER: 'READ_TEAM_MEMBER',
  UPDATE_TEAM_MEMBER: 'UPDATE_TEAM_MEMBER',
  DELETE_TEAM_MEMBER: 'DELETE_TEAM_MEMBER',
  READ_TICKET: 'READ_TICKET',
  UPDATE_TICKET: 'UPDATE_TICKET',
  DELETE_TICKET: 'DELETE_TICKET',
  CREATE_TICKET_COMMENT: 'CREATE_TICKET_COMMENT',
  CREATE_TICKET_ASSIGNMENT: 'CREATE_TICKET_ASSIGNMENT',
  CREATE_TICKET_ATTACHMENT: 'CREATE_TICKET_ATTACHMENT',
  CREATE_TICKET_WATCHER: 'CREATE_TICKET_WATCHER',
  READ_TICKET_HISTORY: 'READ_TICKET_HISTORY',
  READ_TICKET_COMMENT: 'READ_TICKET_COMMENT',
  UPDATE_TICKET_COMMENT: 'UPDATE_TICKET_COMMENT',
  DELETE_TICKET_COMMENT: 'DELETE_TICKET_COMMENT',
  READ_TICKET_ASSIGNMENT: 'READ_TICKET_ASSIGNMENT',
  UPDATE_TICKET_ASSIGNMENT: 'UPDATE_TICKET_ASSIGNMENT',
  DELETE_TICKET_ASSIGNMENT: 'DELETE_TICKET_ASSIGNMENT',
  READ_TICKET_ATTACHMENT: 'READ_TICKET_ATTACHMENT',
  UPDATE_TICKET_ATTACHMENT: 'UPDATE_TICKET_ATTACHMENT',
  DELETE_TICKET_ATTACHMENT: 'DELETE_TICKET_ATTACHMENT',
  READ_TICKET_SLA_TRACKING: 'READ_TICKET_SLA_TRACKING',
  READ_TICKET_WATCHER: 'READ_TICKET_WATCHER',
  UPDATE_TICKET_WATCHER: 'UPDATE_TICKET_WATCHER',
  DELETE_TICKET_WATCHER: 'DELETE_TICKET_WATCHER',
  READ_STOCK_MOVEMENT: 'READ_STOCK_MOVEMENT',
  UPDATE_STOCK_MOVEMENT: 'UPDATE_STOCK_MOVEMENT',
  DELETE_STOCK_MOVEMENT: 'DELETE_STOCK_MOVEMENT',
  ADMIN_STOCK_COUNT: 'ADMIN_STOCK_COUNT',
  APPROVE_STOCK_COUNT: 'APPROVE_STOCK_COUNT',
  UPDATE_STOCK_COUNT: 'UPDATE_STOCK_COUNT',
  DELETE_STOCK_COUNT: 'DELETE_STOCK_COUNT',
  READ_STOCK_COUNT: 'READ_STOCK_COUNT',
  ADMIN_PRODUCT: 'ADMIN_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  READ_PRODUCT: 'READ_PRODUCT',
  CREATE_PRODUCT_RECIPE: 'CREATE_PRODUCT_RECIPE',
  CREATE_PRODUCT_EXTRA_OPTION: 'CREATE_PRODUCT_EXTRA_OPTION',
  ADMIN_PRODUCT_RECIPE: 'ADMIN_PRODUCT_RECIPE',
  UPDATE_PRODUCT_RECIPE: 'UPDATE_PRODUCT_RECIPE',
  DELETE_PRODUCT_RECIPE: 'DELETE_PRODUCT_RECIPE',
  READ_PRODUCT_RECIPE: 'READ_PRODUCT_RECIPE',
  ADMIN_PRODUCT_EXTRA_OPTION: 'ADMIN_PRODUCT_EXTRA_OPTION',
  UPDATE_PRODUCT_EXTRA_OPTION: 'UPDATE_PRODUCT_EXTRA_OPTION',
  DELETE_PRODUCT_EXTRA_OPTION: 'DELETE_PRODUCT_EXTRA_OPTION',
  READ_PRODUCT_EXTRA_OPTION: 'READ_PRODUCT_EXTRA_OPTION',
  ADMIN_MENU: 'ADMIN_MENU',
  UPDATE_MENU: 'UPDATE_MENU',
  DELETE_MENU: 'DELETE_MENU',
  READ_MENU: 'READ_MENU',
  CREATE_MENU_CATEGORY: 'CREATE_MENU_CATEGORY',
  ADMIN_MENU_CATEGORY: 'ADMIN_MENU_CATEGORY',
  UPDATE_MENU_CATEGORY: 'UPDATE_MENU_CATEGORY',
  DELETE_MENU_CATEGORY: 'DELETE_MENU_CATEGORY',
  READ_MENU_CATEGORY: 'READ_MENU_CATEGORY',
  CREATE_MENU_ITEM: 'CREATE_MENU_ITEM',
  ADMIN_MENU_ITEM: 'ADMIN_MENU_ITEM',
  UPDATE_MENU_ITEM: 'UPDATE_MENU_ITEM',
  DELETE_MENU_ITEM: 'DELETE_MENU_ITEM',
  READ_MENU_ITEM: 'READ_MENU_ITEM',
  ADMIN_SHOP_TABLE: 'ADMIN_SHOP_TABLE',
  UPDATE_SHOP_TABLE: 'UPDATE_SHOP_TABLE',
  DELETE_SHOP_TABLE: 'DELETE_SHOP_TABLE',
  READ_SHOP_TABLE: 'READ_SHOP_TABLE',
  CREATE_TABLE_ORDER: 'CREATE_TABLE_ORDER',
  ADMIN_TABLE_ORDER: 'ADMIN_TABLE_ORDER',
  UPDATE_TABLE_ORDER: 'UPDATE_TABLE_ORDER',
  DELETE_TABLE_ORDER: 'DELETE_TABLE_ORDER',
  READ_TABLE_ORDER: 'READ_TABLE_ORDER',
} as const

export type PermissionAction = (typeof PermissionActions)[keyof typeof PermissionActions]

interface CurrentUserPermissionContextValue {
  currentTenantId?: string
  isLoadingPermissions: boolean
  permissionsError: unknown
  permissionActions: ReadonlySet<string>
  permissionGrants: readonly PermissionGrant[]
  hasPermission: (action: PermissionAction) => boolean
  hasAnyPermission: (actions: readonly PermissionAction[]) => boolean
  hasAllPermissions: (actions: readonly PermissionAction[]) => boolean
  hasGrant: (
    action: PermissionAction,
    targetType: PermissionTargetType,
    targetId?: string | null,
  ) => boolean
  hasPermissionForTarget: (action: PermissionAction, target: PermissionCheckTarget) => boolean
  hasAnyPermissionForTarget: (
    actions: readonly PermissionAction[],
    target: PermissionCheckTarget,
  ) => boolean
  hasTicketPermission: (action: PermissionAction, target: TicketPermissionTarget) => boolean
  hasTenantPermission: (action: PermissionAction) => boolean
  hasShopPermission: (action: PermissionAction, shopId?: string | null) => boolean
  hasAnyShopPermission: (actions: readonly PermissionAction[], shopId?: string | null) => boolean
  getDisabledReason: (can: boolean, label: string) => string | undefined
}

const EMPTY_PERMISSIONS = new Set<string>()

const defaultContextValue: CurrentUserPermissionContextValue = {
  currentTenantId: undefined,
  isLoadingPermissions: false,
  permissionsError: null,
  permissionActions: EMPTY_PERMISSIONS,
  permissionGrants: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  hasGrant: () => false,
  hasPermissionForTarget: () => false,
  hasAnyPermissionForTarget: () => false,
  hasTicketPermission: () => false,
  hasTenantPermission: () => false,
  hasShopPermission: () => false,
  hasAnyShopPermission: () => false,
  getDisabledReason: (can, label) => (can ? undefined : label),
}

const CurrentUserPermissionContext =
  createContext<CurrentUserPermissionContextValue>(defaultContextValue)

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
const MAX_PERMISSION_PAGE_SIZE = 1000

function isUuid(value: string | undefined): value is string {
  return Boolean(value && UUID_REGEX.test(value))
}

async function fetchCurrentUserPermissions(userId: string): Promise<PermissionGrant[]> {
  const permissions: PermissionGrant[] = []
  const maxPages = 20

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await httpClient.requestList<PermissionGrant>(
      `/user/permissions?${toRaQueryString({
        pagination: { page, perPage: MAX_PERMISSION_PAGE_SIZE },
        sort: { field: 'id', order: 'ASC' },
        filter: { 'userId.eq': userId },
      })}`,
    )
    permissions.push(...result.data)

    const reachedTotal = result.total > 0 && permissions.length >= result.total
    const reachedLastPage = result.data.length < MAX_PERMISSION_PAGE_SIZE
    if (reachedTotal || reachedLastPage) {
      break
    }
  }

  return permissions
}

export function CurrentUserPermissionsProvider({ children }: { children: React.ReactNode }) {
  const { status, isAuthenticated, userId, tenantId } = useAuth()
  const resolvedUserId = isUuid(userId) ? userId : undefined
  const resolvedTenantId = isUuid(tenantId) ? tenantId : undefined

  const query = useQuery({
    queryKey: [
      ...queryKeys.tenant.permissions,
      'me',
      resolvedTenantId ?? 'tenantless',
      resolvedUserId ?? 'anonymous',
    ],
    enabled: Boolean(isAuthenticated && resolvedUserId),
    staleTime: 60_000,
    queryFn: () => fetchCurrentUserPermissions(resolvedUserId!),
  })

  const evaluator = useMemo(() => createPermissionEvaluator(query.data ?? []), [query.data])
  const permissionActions = evaluator.permissionActions

  function hasPermission(action: PermissionAction): boolean {
    return evaluator.hasAction(action)
  }

  function hasAnyPermission(actions: readonly PermissionAction[]): boolean {
    return evaluator.hasAnyAction(actions)
  }

  function hasAllPermissions(actions: readonly PermissionAction[]): boolean {
    return evaluator.hasAllActions(actions)
  }

  function hasTenantPermission(action: PermissionAction): boolean {
    return evaluator.hasPermissionForTarget(action, {
      targetType: 'TENANT',
      targetId: resolvedTenantId,
      tenantId: resolvedTenantId,
    })
  }

  function hasShopPermission(action: PermissionAction, shopId?: string | null): boolean {
    return evaluator.hasPermissionForTarget(action, {
      targetType: 'SHOP',
      targetId: shopId,
      tenantId: resolvedTenantId,
      parentTargets: resolvedTenantId
        ? [{ targetType: 'TENANT', targetId: resolvedTenantId }]
        : undefined,
    })
  }

  function hasAnyShopPermission(
    actions: readonly PermissionAction[],
    shopId?: string | null,
  ): boolean {
    return actions.some((action) => hasShopPermission(action, shopId))
  }

  function getDisabledReason(can: boolean, label: string): string | undefined {
    return can ? undefined : label
  }

  const contextValue: CurrentUserPermissionContextValue = {
    currentTenantId: resolvedTenantId,
    isLoadingPermissions: status === 'loading' || (status === 'authenticated' && query.isLoading),
    permissionsError: query.error,
    permissionActions,
    permissionGrants: evaluator.permissionGrants,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasGrant: evaluator.hasGrant,
    hasPermissionForTarget: evaluator.hasPermissionForTarget,
    hasAnyPermissionForTarget: evaluator.hasAnyPermissionForTarget,
    hasTicketPermission: evaluator.hasTicketPermission,
    hasTenantPermission,
    hasShopPermission,
    hasAnyShopPermission,
    getDisabledReason,
  }

  return (
    <CurrentUserPermissionContext.Provider value={contextValue}>
      {children}
    </CurrentUserPermissionContext.Provider>
  )
}

export function useCurrentUserPermissions(): CurrentUserPermissionContextValue {
  return useContext(CurrentUserPermissionContext)
}
