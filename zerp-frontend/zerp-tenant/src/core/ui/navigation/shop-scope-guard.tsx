'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { Route } from 'next'
import { ROUTES, withLocale } from '@/core/constants/routes'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import type { Locale } from '@/core/types/common'
import { getPathWithoutLocale } from '@/core/utils/route-helpers'
import { isGlobalOnlyPath, isShopOnlyPath } from '@/core/utils/shop-scope-routes'

export function ShopScopeGuard({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const { scope } = useShopScope()

  useEffect(() => {
    const pathWithoutLocale = getPathWithoutLocale(pathname, locale)
    const isGlobalMode = scope.mode === 'GLOBAL'

    if (isGlobalMode && isShopOnlyPath(pathWithoutLocale)) {
      router.replace(withLocale(locale, ROUTES.dashboard) as Route)
      return
    }

    if (!isGlobalMode && isGlobalOnlyPath(pathWithoutLocale)) {
      router.replace(withLocale(locale, ROUTES.dashboard) as Route)
    }
  }, [pathname, router, scope, locale])

  return null
}
