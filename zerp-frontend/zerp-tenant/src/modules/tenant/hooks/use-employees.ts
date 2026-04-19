'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import type { RaListParams } from '@/core/api/resource-types'
import { employeeClient } from '../api/employee-client'

const {
  useList: useEmployees,
  useOne: useEmployee,
  useCreate: useCreateEmployee,
  useUpdate: useUpdateEmployee,
  usePatch: usePatchEmployee,
  useDelete: useDeleteEmployee,
  useDeleteMany: useDeleteManyEmployees,
} = createResourceHooks(queryKeys.tenant.employees, employeeClient)

export {
  useEmployees,
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  usePatchEmployee,
  useDeleteEmployee,
  useDeleteManyEmployees,
}

export function useEmployeeSearch(keyword: string, params: RaListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.tenant.employees, 'search', keyword, params],
    queryFn: () => employeeClient.search(keyword, params),
    enabled: keyword.trim().length >= 2,
  })
}

export function useDeletedEmployees(params: RaListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.tenant.employees, 'deleted', params],
    queryFn: () => employeeClient.deletedPaginated(params),
  })
}
