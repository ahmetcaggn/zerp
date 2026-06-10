'use client'

import { useQuery } from '@tanstack/react-query'

import { httpClient } from '@/core/api/http-client'

export interface TenantResponse {
  id?: string
  name?: string
  description?: string
  imageId?: string
}

export function useTenant(tenantId?: string) {
  return useQuery({
    queryKey: ['tenant', 'detail', tenantId] as const,
    queryFn: () => httpClient.get<TenantResponse>(`/user/tenants/${tenantId}`),
    enabled: Boolean(tenantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
