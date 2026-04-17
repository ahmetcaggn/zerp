'use client'

import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

import { useAuth } from '@/core/auth/client/use-auth'
import type { AppRole } from '@/core/types/common'

export function RoleGuard({
  requiredRoles,
  fallback,
  children,
}: {
  requiredRoles: AppRole[]
  fallback?: ReactNode
  children: ReactNode
}) {
  const { isAuthenticated, hasRole } = useAuth()

  if (!isAuthenticated || !hasRole(requiredRoles)) {
    return (
      fallback ?? (
        <Typography color="error" variant="body2">
          You are not authorized to see this content.
        </Typography>
      )
    )
  }

  return <>{children}</>
}
