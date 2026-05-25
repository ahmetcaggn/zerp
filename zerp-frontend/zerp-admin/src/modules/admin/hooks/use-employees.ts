'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import type { RaListParams } from '@/core/api/resource-types'

import { employeeClient } from '../api/employee-client'
import type { CreateEmployeeRequest, UpdateEmployeeRequest } from '../types/employee'

interface QueryOptions {
  enabled?: boolean
}

function toTenantEmployeeListKey(tenantId: string, params: RaListParams) {
  return [...queryKeys.admin.employees, 'list', tenantId, params] as const
}

function toTenantEmployeeDetailKey(tenantId: string, id: string) {
  return [...queryKeys.admin.employees, 'detail', tenantId, id] as const
}

export function useTenantEmployees(
  tenantId: string,
  params: RaListParams = {},
  options: QueryOptions = {},
) {
  const normalizedTenantId = tenantId.trim()

  return useQuery({
    queryKey: toTenantEmployeeListKey(normalizedTenantId, params),
    queryFn: () => employeeClient.getList(normalizedTenantId, params),
    enabled: Boolean(normalizedTenantId) && (options.enabled ?? true),
  })
}

export function useTenantEmployee(id: string | undefined, tenantId: string, options: QueryOptions = {}) {
  const normalizedTenantId = tenantId.trim()
  const normalizedId = id?.trim()

  return useQuery({
    queryKey: toTenantEmployeeDetailKey(normalizedTenantId, normalizedId ?? ''),
    queryFn: () => employeeClient.getOne(normalizedId as string, normalizedTenantId),
    enabled: Boolean(normalizedTenantId && normalizedId) && (options.enabled ?? true),
  })
}

export function useCreateTenantEmployee(tenantId: string) {
  const queryClient = useQueryClient()
  const normalizedTenantId = tenantId.trim()

  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) => employeeClient.createForTenant(data, normalizedTenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.employees, 'list', normalizedTenantId],
      })
    },
  })
}

export function useUpdateTenantEmployee(tenantId: string) {
  const queryClient = useQueryClient()
  const normalizedTenantId = tenantId.trim()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequest }) =>
      employeeClient.update(id, data, normalizedTenantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.employees, 'list', normalizedTenantId],
      })
      queryClient.invalidateQueries({
        queryKey: toTenantEmployeeDetailKey(normalizedTenantId, variables.id),
      })
    },
  })
}

export function useDeleteTenantEmployee(tenantId: string) {
  const queryClient = useQueryClient()
  const normalizedTenantId = tenantId.trim()

  return useMutation({
    mutationFn: (id: string) => employeeClient.delete(id, normalizedTenantId),
    onSuccess: (_, employeeId) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.admin.employees, 'list', normalizedTenantId],
      })
      queryClient.invalidateQueries({
        queryKey: toTenantEmployeeDetailKey(normalizedTenantId, employeeId),
      })
    },
  })
}
