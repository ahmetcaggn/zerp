'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import type { Locale } from '@/core/types/common'

export function ShopScopeGuard({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const { isScopeReady } = useShopScope()
  void locale

  useEffect(() => {
    // Keep scope hydration behavior but do not force route changes.
    // This prevents refresh from unexpectedly redirecting users to dashboard.
    if (!isScopeReady) return
  }, [isScopeReady, pathname])

  return null
}
