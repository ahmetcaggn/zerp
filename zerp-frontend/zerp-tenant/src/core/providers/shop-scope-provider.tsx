'use client'

import { useSession } from 'next-auth/react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useShops } from '@/modules/tenant/hooks/use-shops'
import type { ShopResponseDto, ShopScope } from '@/modules/tenant/types/shop'

const STORAGE_KEY = 'tenant.shop.scope.v1'

interface ShopScopeContextValue {
  scope: ShopScope
  shops: ShopResponseDto[]
  isLoading: boolean
  refreshShops: () => Promise<unknown>
  setGlobalScope: () => void
  setShopScope: (shop: ShopResponseDto) => void
}

const ShopScopeContext = createContext<ShopScopeContextValue | null>(null)

function tryReadPersistedShopId(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

function persistShopId(shopId: string | null): void {
  if (typeof window === 'undefined') return
  if (shopId) {
    window.localStorage.setItem(STORAGE_KEY, shopId)
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export function ShopScopeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const [scope, setScope] = useState<ShopScope>({ mode: 'GLOBAL' })
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null)
  const isAuthenticated = status === 'authenticated'
  const { data, isLoading, refetch } = useShops(
    {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'name', order: 'ASC' },
    },
    isAuthenticated,
  )

  const shops = useMemo(() => (isAuthenticated ? (data?.data ?? []) : []), [isAuthenticated, data?.data])

  useEffect(() => {
    setPersistedShopId(tryReadPersistedShopId())
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setScope((prevScope) => (prevScope.mode === 'GLOBAL' ? prevScope : { mode: 'GLOBAL' }))
      return
    }

    if (!persistedShopId || shops.length === 0) return
    const matchingShop = shops.find((shop) => shop.id === persistedShopId)
    if (matchingShop) {
      setScope((prevScope) => {
        if (
          prevScope.mode === 'SHOP' &&
          prevScope.shopId === matchingShop.id &&
          prevScope.shopName === matchingShop.name
        ) {
          return prevScope
        }
        return { mode: 'SHOP', shopId: matchingShop.id, shopName: matchingShop.name }
      })
      return
    }

    setScope((prevScope) => (prevScope.mode === 'GLOBAL' ? prevScope : { mode: 'GLOBAL' }))
    persistShopId(null)
  }, [isAuthenticated, persistedShopId, shops])

  const value = useMemo<ShopScopeContextValue>(
    () => ({
      scope,
      shops,
      isLoading,
      refreshShops: () => refetch(),
      setGlobalScope: () => {
        setScope({ mode: 'GLOBAL' })
        persistShopId(null)
      },
      setShopScope: (shop) => {
        setScope({ mode: 'SHOP', shopId: shop.id, shopName: shop.name })
        persistShopId(shop.id)
      },
    }),
    [scope, shops, isLoading, refetch],
  )

  return <ShopScopeContext.Provider value={value}>{children}</ShopScopeContext.Provider>
}

export function useShopScope(): ShopScopeContextValue {
  const context = useContext(ShopScopeContext)
  if (!context) {
    throw new Error('useShopScope must be used inside ShopScopeProvider')
  }
  return context
}
