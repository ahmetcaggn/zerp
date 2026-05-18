'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import { permissionClient } from '../api/permission-client'
import { permittableClient } from '../api/permittable-client'
import type {
  PermissionActionHierarchyMap,
  PermissionCreateRequestDto,
  PermissionResponseDto,
  PermissionTargetType,
} from '../types/permission'

const MAX_PERMISSION_PAGE_SIZE = 200
const MAX_PERMISSION_PAGE_FETCH = 20

async function fetchAllPermissionsByUserId(userId: string): Promise<PermissionResponseDto[]> {
  const permissions: PermissionResponseDto[] = []

  for (let page = 1; page <= MAX_PERMISSION_PAGE_FETCH; page += 1) {
    const result = await permissionClient.listByUserId(userId, {
      pagination: { page, perPage: MAX_PERMISSION_PAGE_SIZE },
      sort: { field: 'id', order: 'ASC' },
    })

    permissions.push(...result.data)

    const reachedTotal = result.total > 0 && permissions.length >= result.total
    const reachedLastPage = result.data.length < MAX_PERMISSION_PAGE_SIZE
    if (reachedTotal || reachedLastPage) {
      break
    }
  }

  return permissions
}

export function usePermissionActionHierarchy(enabled = true) {
  return useQuery<PermissionActionHierarchyMap>({
    queryKey: [...queryKeys.admin.permissions, 'actions-assignable'],
    queryFn: permissionClient.getAssignableActions,
    enabled,
    staleTime: 60_000,
  })
}

export function useMemberPermissions(userId: string | undefined, enabled = true) {
  return useQuery<PermissionResponseDto[]>({
    queryKey: [...queryKeys.admin.permissions, 'member', userId ?? ''],
    queryFn: () => fetchAllPermissionsByUserId(userId!),
    enabled: enabled && Boolean(userId),
  })
}

export function useCreatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PermissionCreateRequestDto) => permissionClient.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.permissions, 'member', variables.userId],
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.permissions })
    },
  })
}

export function useDeletePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, memberUserId }: { id: number; memberUserId?: string }) =>
      permissionClient.delete(id),
    onSuccess: (_, variables) => {
      if (variables.memberUserId) {
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.admin.permissions, 'member', variables.memberUserId],
        })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.permissions })
    },
  })
}

export function usePermittables(
  targetType: PermissionTargetType | undefined,
  parentId: string | undefined,
  keyword: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      ...queryKeys.admin.permissions,
      'permittables',
      targetType ?? '',
      parentId ?? '',
      keyword,
    ],
    queryFn: () => permittableClient.list({ targetType: targetType!, parentId, keyword }),
    enabled: enabled && Boolean(targetType),
    staleTime: 30_000,
  })
}
