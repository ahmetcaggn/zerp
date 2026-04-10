'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { adminSystemClient } from '@/modules/admin/api/system-client'

export function useSystemHealth() {
  return useQuery({
    queryKey: queryKeys.admin.health,
    queryFn: adminSystemClient.getHealth,
  })
}
