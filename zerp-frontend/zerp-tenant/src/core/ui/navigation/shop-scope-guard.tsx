'use client'

import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import type { Locale } from '@/core/types/common'

export function ShopScopeGuard({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isScopeReady, isScopeSwitching, scopeSwitchTransaction, completeScopeSwitch } = useShopScope()
  const shopSwitchingLabel = locale === 'tr' ? 'Şube değiştiriliyor...' : 'Switching branch...'

  useEffect(() => {
    if (!isScopeReady || !scopeSwitchTransaction?.isCommitted) return

    const dashboardPath = withLocale(locale, ROUTES.dashboard)
    if (pathname !== dashboardPath) {
      router.replace(dashboardPath as Route)
      return
    }

    const finishTimer = window.setTimeout(() => {
      completeScopeSwitch()
    }, 140)

    return () => window.clearTimeout(finishTimer)
  }, [isScopeReady, scopeSwitchTransaction, locale, pathname, router, completeScopeSwitch])

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
