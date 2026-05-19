'use client'

import { Fragment } from 'react'

import { useShopScope } from '@/core/providers/shop-scope-provider'

export function ShopScopeResetBoundary({ children }: { children: React.ReactNode }) {
  const { scopeVersion } = useShopScope()
  return <Fragment key={scopeVersion}>{children}</Fragment>
}
