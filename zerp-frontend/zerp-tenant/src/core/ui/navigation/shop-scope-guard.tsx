'use client'

import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { getFirstAccessibleProtectedRoute } from '@/core/permissions/route-permissions'
import { useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import type { Locale } from '@/core/types/common'

export function ShopScopeGuard({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()
  const { scope, isScopeReady, isScopeSwitching, scopeSwitchTransaction, completeScopeSwitch } = useShopScope()
  const {
    hasAnyPermission,
    hasTenantPermission,
    hasShopPermission,
    hasAnyShopPermission,
  } = useCurrentUserPermissions()
  const { t } = useI18n()
  const shopSwitchingLabel = t('common.switchingBranch')

  useEffect(() => {
    if (!isScopeReady || !scopeSwitchTransaction?.isCommitted) return

    const currentShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
    const targetRoute =
      getFirstAccessibleProtectedRoute({
        currentShopId,
        hasAnyPermission,
        hasTenantPermission,
        hasShopPermission,
        hasAnyShopPermission,
      }) ?? ROUTES.unauthorized
    const targetPath = withLocale(locale, targetRoute)

    if (pathname !== targetPath) {
      router.replace(targetPath as Route)
      return
    }

    const finishTimer = window.setTimeout(() => {
      completeScopeSwitch()
    }, 140)

    return () => window.clearTimeout(finishTimer)
  }, [
    completeScopeSwitch,
    hasAnyPermission,
    hasAnyShopPermission,
    hasShopPermission,
    hasTenantPermission,
    isScopeReady,
    locale,
    pathname,
    router,
    scope,
    scopeSwitchTransaction,
  ])

  return (
    <Backdrop
      open={isScopeSwitching}
      transitionDuration={140}
      sx={(theme) => ({ zIndex: theme.zIndex.drawer + 100, color: theme.palette.common.white })}
    >
      <Stack alignItems="center" spacing={1.5}>
        <CircularProgress color="inherit" size={30} />
        <Typography variant="body2">{shopSwitchingLabel}</Typography>
      </Stack>
    </Backdrop>
  )
}

