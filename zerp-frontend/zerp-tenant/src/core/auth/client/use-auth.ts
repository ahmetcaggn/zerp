'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

import type { AppRole } from '@/core/types/common'

export function useAuth() {
  const { data: session, status } = useSession()

  const roles = useMemo<AppRole[]>(() => {
    return session?.user?.roles ?? []
  }, [session?.user?.roles])

  const tenantId = session?.user?.tenantId

  return {
    status,
    session,
    roles,
    tenantId,
    isAuthenticated: status === 'authenticated',
    hasRole: (requiredRoles: AppRole[]) => requiredRoles.some((role) => roles.includes(role)),
  }
}
