'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import { permissionGroupClient } from '../api/permission-group-client'
import type {
  PermissionGroupAssignRequestDto,
  PermissionGroupCreateRequestDto,
  PermissionGroupPatchRequestDto,
  PermissionGroupUpdateRequestDto,
  PredefinedPermissionGroupCode,
} from '../types/permission-group'

export function usePredefinedPermissionGroups(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.permissionGroups, 'predefined'] as const,
    queryFn: permissionGroupClient.listPredefined,
    enabled,
    staleTime: 60_000,
  })
}

export function usePredefinedPermissionGroup(
  code: PredefinedPermissionGroupCode | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: [...queryKeys.tenant.permissionGroups, 'predefined', code ?? ''] as const,
    queryFn: () => permissionGroupClient.getPredefined(code!),
    enabled: enabled && Boolean(code),
    staleTime: 60_000,
  })
}

export function useCustomPermissionGroups(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.permissionGroups, 'custom'] as const,
    queryFn: permissionGroupClient.listCustom,
    enabled,
  })
}

export function useCustomPermissionGroup(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.permissionGroups, 'custom', id ?? ''] as const,
    queryFn: () => permissionGroupClient.getCustom(id!),
    enabled: enabled && Boolean(id),
  })
}

export function useCreatePermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PermissionGroupCreateRequestDto) => permissionGroupClient.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissionGroups })
    },
  })
}

export function useUpdatePermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PermissionGroupUpdateRequestDto }) =>
      permissionGroupClient.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissionGroups })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.tenant.permissionGroups, 'custom', variables.id],
      })
    },
  })
}

export function usePatchPermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PermissionGroupPatchRequestDto }) =>
      permissionGroupClient.patch(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissionGroups })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.tenant.permissionGroups, 'custom', variables.id],
      })
    },
  })
}

export function useDeletePermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => permissionGroupClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissionGroups })
    },
  })
}

export function useAssignPermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PermissionGroupAssignRequestDto) => permissionGroupClient.assign(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissionGroups })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.tenant.permissions, 'employee', variables.userId],
      })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.tenant.permissionGroups, 'assignments', variables.userId],
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissions })
    },
  })
}

export function usePermissionGroupAssignments(userId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.permissionGroups, 'assignments', userId ?? ''] as const,
    queryFn: () => permissionGroupClient.listAssignmentsByUser(userId!),
    enabled: enabled && Boolean(userId),
  })
}

export function useRevokePermissionGroupAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assignmentId }: { assignmentId: string; userId?: string }) =>
      permissionGroupClient.revokeAssignment(assignmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissionGroups })
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.tenant.permissionGroups, 'assignments', variables.userId],
        })
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.tenant.permissions, 'employee', variables.userId],
        })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.permissions })
    },
  })
}
