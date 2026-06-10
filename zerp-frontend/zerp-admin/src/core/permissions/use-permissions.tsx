'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo } from 'react'

import { httpClient } from '@/core/api/http-client'
import { queryKeys } from '@/core/api/query-keys'
import { toRaQueryString } from '@/core/api/resource-types'
import { useAuth } from '@/core/auth/client/use-auth'
import { ApiError } from '@/core/types/api'

import {
  createPermissionEvaluator,
  type PermissionCheckTarget,
  type PermissionGrant,
  type PermissionTargetType,
  type TicketPermissionTarget,
} from './permission-evaluator'

export const PermissionActions = {
  READ_TENANT: 'READ_TENANT',
  READ_SHOP: 'READ_SHOP',
  UPDATE_TENANT: 'UPDATE_TENANT',
  ADMIN: 'ADMIN',
  CREATE_EMPLOYEE: 'CREATE_EMPLOYEE',
  CREATE_EMPLOYEE_ANY_TENANT: 'CREATE_EMPLOYEE_ANY_TENANT',
  READ_EMPLOYEE: 'READ_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  READ_PERMISSION: 'READ_PERMISSION',
  READ_SYSTEM_METRICS: 'READ_SYSTEM_METRICS',
  READ_TEAM: 'READ_TEAM',
  CREATE_TEAM: 'CREATE_TEAM',
  UPDATE_TEAM: 'UPDATE_TEAM',
  DELETE_TEAM: 'DELETE_TEAM',
  READ_TEAM_MEMBER: 'READ_TEAM_MEMBER',
  CREATE_TEAM_MEMBER: 'CREATE_TEAM_MEMBER',
  UPDATE_TEAM_MEMBER: 'UPDATE_TEAM_MEMBER',
  DELETE_TEAM_MEMBER: 'DELETE_TEAM_MEMBER',
  READ_USER: 'READ_USER',
  READ_TICKET: 'READ_TICKET',
  CREATE_TICKET: 'CREATE_TICKET',
  UPDATE_TICKET: 'UPDATE_TICKET',
  DELETE_TICKET: 'DELETE_TICKET',
  READ_TICKET_HISTORY: 'READ_TICKET_HISTORY',
  CREATE_TICKET_HISTORY: 'CREATE_TICKET_HISTORY',
  UPDATE_TICKET_HISTORY: 'UPDATE_TICKET_HISTORY',
  DELETE_TICKET_HISTORY: 'DELETE_TICKET_HISTORY',
  READ_TICKET_COMMENT: 'READ_TICKET_COMMENT',
  CREATE_TICKET_COMMENT: 'CREATE_TICKET_COMMENT',
  UPDATE_TICKET_COMMENT: 'UPDATE_TICKET_COMMENT',
  DELETE_TICKET_COMMENT: 'DELETE_TICKET_COMMENT',
  READ_TICKET_ASSIGNMENT: 'READ_TICKET_ASSIGNMENT',
  CREATE_TICKET_ASSIGNMENT: 'CREATE_TICKET_ASSIGNMENT',
  UPDATE_TICKET_ASSIGNMENT: 'UPDATE_TICKET_ASSIGNMENT',
  DELETE_TICKET_ASSIGNMENT: 'DELETE_TICKET_ASSIGNMENT',
  READ_TICKET_ATTACHMENT: 'READ_TICKET_ATTACHMENT',
  CREATE_TICKET_ATTACHMENT: 'CREATE_TICKET_ATTACHMENT',
  UPDATE_TICKET_ATTACHMENT: 'UPDATE_TICKET_ATTACHMENT',
  DELETE_TICKET_ATTACHMENT: 'DELETE_TICKET_ATTACHMENT',
  CREATE_TICKET_SLA_TRACKING: 'CREATE_TICKET_SLA_TRACKING',
  READ_TICKET_SLA_TRACKING: 'READ_TICKET_SLA_TRACKING',
  UPDATE_TICKET_SLA_TRACKING: 'UPDATE_TICKET_SLA_TRACKING',
  DELETE_TICKET_SLA_TRACKING: 'DELETE_TICKET_SLA_TRACKING',
  READ_TICKET_WATCHER: 'READ_TICKET_WATCHER',
  CREATE_TICKET_WATCHER: 'CREATE_TICKET_WATCHER',
  UPDATE_TICKET_WATCHER: 'UPDATE_TICKET_WATCHER',
  DELETE_TICKET_WATCHER: 'DELETE_TICKET_WATCHER',
} as const

export type PermissionAction = (typeof PermissionActions)[keyof typeof PermissionActions]

interface CurrentUserPermissionContextValue {
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
}

const EMPTY_PERMISSIONS = new Set<string>()

const defaultContextValue: CurrentUserPermissionContextValue = {
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
  const { status, isAuthenticated, userId } = useAuth()
  const resolvedUserId = isUuid(userId) ? userId : undefined

  const query = useQuery({
    queryKey: [...queryKeys.admin.permissions, 'me', resolvedUserId ?? 'anonymous'],
    enabled: Boolean(isAuthenticated && resolvedUserId),
    staleTime: 60_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
        return false
      }

      return failureCount < 2
    },
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

  const contextValue: CurrentUserPermissionContextValue = {
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
