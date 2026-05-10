'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

import type { AppRole } from '@/core/types/common'

export function useAuth() {
  const { data: session, status } = useSession()

  const roles = useMemo<AppRole[]>(() => {
    return session?.user?.roles ?? []
  }, [session?.user?.roles])
  const userId = session?.user?.userId

  return {
    status,
    session,
    roles,
    userId,
    isAuthenticated: status === 'authenticated',
    hasRole: (requiredRoles: AppRole[]) => requiredRoles.some((role) => roles.includes(role)),
  }
}
