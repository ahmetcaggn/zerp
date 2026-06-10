'use client'

import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { sessionManager } from '@/core/auth/session-manager'
import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { ApiError } from '@/core/types/api'
import type { Locale } from '@/core/types/common'

import { canAccessProtectedRoute, removeLocalePrefix } from './route-permissions'
import { useCurrentUserPermissions } from './use-permissions'

function getPermissionLoadErrorStatus(error: unknown): number | undefined {
  return error instanceof ApiError ? error.statusCode : undefined
}

export function PermissionRouteGuard({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useI18n()
  const { hasAnyPermission, hasAnyPermissionForTarget, isLoadingPermissions, permissionsError } =
    useCurrentUserPermissions()
  const permissionErrorStatus = getPermissionLoadErrorStatus(permissionsError)
  const isSessionError = permissionErrorStatus === 401
  const hasPermissionLoadError = Boolean(permissionsError)

  const routePath = useMemo(() => removeLocalePrefix(pathname, locale), [locale, pathname])
  const canAccessRoute = useMemo(
    () =>
      canAccessProtectedRoute(routePath, {
        hasAnyPermission,
        hasAnyPermissionForTarget,
      }),
    [hasAnyPermission, hasAnyPermissionForTarget, routePath],
  )

  useEffect(() => {
    if (isSessionError) {
      sessionManager.forceLogout()
    }
  }, [isSessionError])

  useEffect(() => {
    if (isLoadingPermissions || canAccessRoute || hasPermissionLoadError) {
      return
    }

    router.replace(withLocale(locale, ROUTES.unauthorized) as Route)
  }, [canAccessRoute, hasPermissionLoadError, isLoadingPermissions, locale, router])

  if (isSessionError) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <CircularProgress size={28} />
        <Typography color="text.secondary">{t('common.loading')}</Typography>
      </Box>
    )
  }

  if (hasPermissionLoadError) {
    const message =
      locale === 'tr'
        ? 'Yetki bilgileri yuklenemedi. Sayfayi yenileyin veya tekrar giris yapin.'
        : 'Permissions could not be loaded. Refresh the page or sign in again.'

    return (
      <Box sx={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="warning" sx={{ maxWidth: 520 }}>
          {message}
        </Alert>
      </Box>
    )
  }

  if (isLoadingPermissions || !canAccessRoute) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <CircularProgress size={28} />
        <Typography color="text.secondary">{t('common.loading')}</Typography>
      </Box>
    )
  }

  return children
}
