'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo } from 'react'

import { httpClient } from '@/core/api/http-client'
import { queryKeys } from '@/core/api/query-keys'
import { toRaQueryString } from '@/core/api/resource-types'
import { useAuth } from '@/core/auth/client/use-auth'

export const PermissionActions = {
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

interface PermissionResponse {
  id?: number
  userId?: string
  targetType?: string
  targetId?: string
  action?: string
}

interface CurrentUserPermissionContextValue {
  isLoadingPermissions: boolean
  permissionsError: unknown
  permissionActions: ReadonlySet<string>
  hasPermission: (action: PermissionAction) => boolean
  hasAnyPermission: (actions: readonly PermissionAction[]) => boolean
  hasAllPermissions: (actions: readonly PermissionAction[]) => boolean
}

const EMPTY_PERMISSIONS = new Set<string>()

const defaultContextValue: CurrentUserPermissionContextValue = {
  isLoadingPermissions: false,
  permissionsError: null,
  permissionActions: EMPTY_PERMISSIONS,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
}

const CurrentUserPermissionContext =
  createContext<CurrentUserPermissionContextValue>(defaultContextValue)

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
const MAX_PERMISSION_PAGE_SIZE = 1000

function isUuid(value: string | undefined): value is string {
  return Boolean(value && UUID_REGEX.test(value))
}

async function fetchCurrentUserPermissionActions(userId: string): Promise<string[]> {
  const permissions: PermissionResponse[] = []
  const maxPages = 20

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await httpClient.requestList<PermissionResponse>(
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
    .map((permission) => permission.action)
    .filter((action): action is string => typeof action === 'string' && action.length > 0)
}

export function CurrentUserPermissionsProvider({ children }: { children: React.ReactNode }) {
  const { status, isAuthenticated, userId } = useAuth()
  const resolvedUserId = isUuid(userId) ? userId : undefined

  const query = useQuery({
    queryKey: [...queryKeys.tenant.permissions, 'me', resolvedUserId ?? 'anonymous'],
    enabled: Boolean(isAuthenticated && resolvedUserId),
    staleTime: 60_000,
    queryFn: () => fetchCurrentUserPermissionActions(resolvedUserId!),
  })

  const permissionActions = useMemo<Set<string>>(() => new Set(query.data ?? []), [query.data])

  function hasPermission(action: PermissionAction): boolean {
    return permissionActions.has(action)
  }

  function hasAnyPermission(actions: readonly PermissionAction[]): boolean {
    return actions.some((action) => hasPermission(action))
  }

  function hasAllPermissions(actions: readonly PermissionAction[]): boolean {
    return actions.every((action) => hasPermission(action))
  }

  const contextValue: CurrentUserPermissionContextValue = {
    isLoadingPermissions: status === 'loading' || (status === 'authenticated' && query.isLoading),
    permissionsError: query.error,
    permissionActions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
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
