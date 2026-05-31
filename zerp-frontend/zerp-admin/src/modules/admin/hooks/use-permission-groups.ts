'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import { permissionGroupClient } from '../api/permission-group-client'
import type {
  PermissionGroupAssignRequest,
  PermissionGroupCreateRequest,
  PermissionGroupPatchRequest,
  PermissionGroupUpdateRequest,
  PredefinedPermissionGroupCode,
} from '../types/permission-group'

export function usePredefinedPermissionGroups(tenantId: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'predefined'] as const,
    queryFn: () => permissionGroupClient.listPredefined(tenantId),
    enabled: enabled && Boolean(tenantId),
    staleTime: 60_000,
  })
}

export function usePredefinedPermissionGroup(
  tenantId: string,
  code: PredefinedPermissionGroupCode | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'predefined', code ?? ''] as const,
    queryFn: () => permissionGroupClient.getPredefined(tenantId, code!),
    enabled: enabled && Boolean(tenantId) && Boolean(code),
    staleTime: 60_000,
  })
}

export function useCustomPermissionGroups(tenantId: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'custom'] as const,
    queryFn: () => permissionGroupClient.listCustom(tenantId),
    enabled: enabled && Boolean(tenantId),
  })
}

export function useCustomPermissionGroup(tenantId: string, id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'custom', id ?? ''] as const,
    queryFn: () => permissionGroupClient.getCustom(tenantId, id!),
    enabled: enabled && Boolean(tenantId) && Boolean(id),
  })
}

export function useCreatePermissionGroup(tenantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PermissionGroupCreateRequest) => permissionGroupClient.create(tenantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.permissionGroups, tenantId] })
    },
  })
}

export function useUpdatePermissionGroup(tenantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PermissionGroupUpdateRequest }) =>
      permissionGroupClient.update(tenantId, id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.permissionGroups, tenantId] })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'custom', variables.id],
      })
    },
  })
}

export function usePatchPermissionGroup(tenantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PermissionGroupPatchRequest }) =>
      permissionGroupClient.patch(tenantId, id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.permissionGroups, tenantId] })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'custom', variables.id],
      })
    },
  })
}

export function useDeletePermissionGroup(tenantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => permissionGroupClient.delete(tenantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.permissionGroups, tenantId] })
    },
  })
}

export function useAssignPermissionGroup(tenantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PermissionGroupAssignRequest) => permissionGroupClient.assign(tenantId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.permissionGroups, tenantId] })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.permissions, 'member', variables.userId],
      })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'assignments', variables.userId],
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.permissions })
    },
  })
}

export function usePermissionGroupAssignments(
  tenantId: string,
  userId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'assignments', userId ?? ''] as const,
    queryFn: () => permissionGroupClient.listAssignmentsByUser(tenantId, userId!),
    enabled: enabled && Boolean(tenantId) && Boolean(userId),
  })
}

export function useRevokePermissionGroupAssignment(tenantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assignmentId }: { assignmentId: string; userId?: string }) =>
      permissionGroupClient.revokeAssignment(tenantId, assignmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.permissionGroups, tenantId] })
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.admin.permissionGroups, tenantId, 'assignments', variables.userId],
        })
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.admin.permissions, 'member', variables.userId],
        })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.permissions })
    },
  })
}
