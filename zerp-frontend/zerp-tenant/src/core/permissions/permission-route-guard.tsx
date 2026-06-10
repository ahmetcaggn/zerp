'use client'

import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { sessionManager } from '@/core/auth/session-manager'
import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { ApiError } from '@/core/types/api'
import type { Locale } from '@/core/types/common'

import {
  canAccessProtectedRoute,
  getFirstAccessibleProtectedRoute,
  removeLocalePrefix,
} from './route-permissions'
import { useCurrentUserPermissions } from './use-permissions'

function getApiErrorStatus(error: unknown): number | undefined {
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
  const { scope, isScopeReady, isScopeSwitching, scopeError } = useShopScope()
  const {
    hasAnyPermission,
    hasTenantPermission,
    hasShopPermission,
    hasAnyShopPermission,
    isLoadingPermissions,
    permissionsError,
  } = useCurrentUserPermissions()
  const permissionErrorStatus = getApiErrorStatus(permissionsError)
  const scopeErrorStatus = getApiErrorStatus(scopeError)
  const isSessionError = permissionErrorStatus === 401 || scopeErrorStatus === 401
  const hasBootstrapError = Boolean(permissionsError || scopeError)

  const routePath = useMemo(() => removeLocalePrefix(pathname, locale), [locale, pathname])
  const currentShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const isLoading = isLoadingPermissions || !isScopeReady || isScopeSwitching
  const routePermissionChecks = useMemo(
    () => ({
      currentShopId,
      hasAnyPermission,
      hasTenantPermission,
      hasShopPermission,
      hasAnyShopPermission,
    }),
    [
      currentShopId,
      hasAnyPermission,
      hasAnyShopPermission,
      hasShopPermission,
      hasTenantPermission,
    ],
  )
  const canAccessRoute = useMemo(
    () => canAccessProtectedRoute(routePath, routePermissionChecks),
    [routePath, routePermissionChecks],
  )

  useEffect(() => {
    if (isSessionError) {
      sessionManager.forceLogout()
    }
  }, [isSessionError])

  useEffect(() => {
    if (isLoading || canAccessRoute || hasBootstrapError) {
      return
    }

    const fallbackRoute =
      routePath === ROUTES.dashboard
        ? getFirstAccessibleProtectedRoute(routePermissionChecks, routePath)
        : undefined

    router.replace(withLocale(locale, fallbackRoute ?? ROUTES.unauthorized) as Route)
  }, [canAccessRoute, hasBootstrapError, isLoading, locale, routePath, routePermissionChecks, router])

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

  if (hasBootstrapError) {
    const message =
      locale === 'tr'
        ? 'Yetki veya sube bilgileri yuklenemedi. Sayfayi yenileyin veya tekrar giris yapin.'
        : 'Permissions or branch scope could not be loaded. Refresh the page or sign in again.'

    return (
      <Box sx={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="warning" sx={{ maxWidth: 560 }}>
          {message}
        </Alert>
      </Box>
    )
  }

  if (isLoading || !canAccessRoute) {
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
