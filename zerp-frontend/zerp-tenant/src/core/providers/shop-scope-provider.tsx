'use client'

import { useSession } from 'next-auth/react'
import { createContext, useContext, useMemo, useState } from 'react'

import { shopDashboardMockShops } from '@/modules/tenant/api/mock-shop-dashboard-data'
import { useShops } from '@/modules/tenant/hooks/use-shops'
import type { ShopResponseDto, ShopScope } from '@/modules/tenant/types/shop'

const STORAGE_KEY = 'tenant.shop.scope.v1'

interface ShopScopeContextValue {
  scope: ShopScope
  shops: ShopResponseDto[]
  isLoading: boolean
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
  const [selectedShopId, setSelectedShopId] = useState<string | null>(() => tryReadPersistedShopId())
  const isAuthenticated = status === 'authenticated'
  const { data, isLoading } = useShops(
    {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'name', order: 'ASC' },
    },
    isAuthenticated,
  )

  const actualShops = useMemo(
    () => (isAuthenticated ? (data?.data ?? []) : []),
    [isAuthenticated, data?.data],
  )

  const shops = useMemo(() => {
    if (!isAuthenticated) {
      return []
    }

    if (actualShops.length > 0) {
      return actualShops
    }

    if (isLoading) {
      return []
    }

    return shopDashboardMockShops
  }, [actualShops, isAuthenticated, isLoading])

  const scope = useMemo<ShopScope>(() => {
    if (!isAuthenticated || !selectedShopId || shops.length === 0) {
      return { mode: 'GLOBAL' }
    }

    const matchingShop = shops.find((shop) => shop.id === selectedShopId)
    if (!matchingShop) {
      return { mode: 'GLOBAL' }
    }

    return { mode: 'SHOP', shopId: matchingShop.id, shopName: matchingShop.name }
  }, [isAuthenticated, selectedShopId, shops])

  const value = useMemo<ShopScopeContextValue>(
    () => ({
      scope,
      shops,
      isLoading,
      setGlobalScope: () => {
        setSelectedShopId(null)
        persistShopId(null)
      },
      setShopScope: (shop) => {
        setSelectedShopId(shop.id)
        persistShopId(shop.id)
      },
    }),
    [scope, shops, isLoading],
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
