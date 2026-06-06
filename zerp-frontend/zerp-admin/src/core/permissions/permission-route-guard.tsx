'use client'

import { Box, CircularProgress, Typography } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
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
  const { hasAnyPermission, hasAnyPermissionForTarget, isLoadingPermissions } =
    useCurrentUserPermissions()

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
    if (isLoadingPermissions || canAccessRoute) {
      return
    }

    router.replace(withLocale(locale, ROUTES.unauthorized) as Route)
  }, [canAccessRoute, isLoadingPermissions, locale, router])

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
