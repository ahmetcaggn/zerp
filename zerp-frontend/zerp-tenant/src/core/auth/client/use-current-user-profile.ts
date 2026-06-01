'use client'

import { useQuery } from '@tanstack/react-query'

import { currentUserClient } from '@/core/api/current-user-client'

import { useAuth } from './use-auth'

export function useCurrentUserProfile() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['tenant', 'current-user-profile'] as const,
    queryFn: () => currentUserClient.getProfile(),
    enabled: isAuthenticated,
    staleTime: 60_000,
    retry: false,
  })
}
