'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { adminTenantClient } from '@/modules/admin/api/tenant-client'

export function useTenants() {
  return useQuery({
    queryKey: queryKeys.admin.tenants,
    queryFn: adminTenantClient.listTenants,
  })
}
