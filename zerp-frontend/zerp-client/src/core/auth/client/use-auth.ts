'use client'

import type { AppRole } from '@/core/types/common'

export function useAuth() {
  const roles: AppRole[] = []

  return {
    status: 'authenticated' as const,
    session: null,
    roles,
    isAuthenticated: true,
    hasRole: (_requiredRoles: AppRole[]) => true,
  }
}

/*
Auth/SSO disabled temporarily. Restore this block when NextAuth comes back.

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

import type { AppRole } from '@/core/types/common'

export function useAuth() {
  const { data: session, status } = useSession()

  const roles = useMemo<AppRole[]>(() => {
    return session?.user?.roles ?? []
  }, [session?.user?.roles])

  return {
    status,
    session,
    roles,
    isAuthenticated: status === 'authenticated',
    hasRole: (requiredRoles: AppRole[]) => requiredRoles.some((role) => roles.includes(role)),
  }
}
*/
