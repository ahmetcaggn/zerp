'use client'

import { Box, CircularProgress, Typography } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import type { Locale } from '@/core/types/common'

import { canAccessProtectedRoute, removeLocalePrefix } from './route-permissions'
import { useCurrentUserPermissions } from './use-permissions'

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
  const { scope, isScopeReady, isScopeSwitching } = useShopScope()
  const { hasAnyPermission, hasTenantPermission, hasAnyShopPermission, isLoadingPermissions } =
    useCurrentUserPermissions()

  const routePath = useMemo(() => removeLocalePrefix(pathname, locale), [locale, pathname])
  const currentShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const isLoading = isLoadingPermissions || !isScopeReady || isScopeSwitching
  const canAccessRoute = useMemo(
    () =>
      canAccessProtectedRoute(routePath, {
        currentShopId,
        hasAnyPermission,
        hasTenantPermission,
        hasAnyShopPermission,
      }),
    [currentShopId, hasAnyPermission, hasAnyShopPermission, hasTenantPermission, routePath],
  )

  useEffect(() => {
    if (isLoading || canAccessRoute) {
      return
    }

    router.replace(withLocale(locale, ROUTES.unauthorized) as Route)
  }, [canAccessRoute, isLoading, locale, router])

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
