'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

import { useShops } from '@/modules/tenant/hooks/use-shops'
import type { ShopResponseDto, ShopScope } from '@/modules/tenant/types/shop'

const STORAGE_KEY = 'tenant.shop.scope.v1'

interface ScopeSwitchTransaction {
  id: number
  isCommitted: boolean
}

interface ShopScopeContextValue {
  scope: ShopScope
  scopeVersion: number
  isScopeSwitching: boolean
  scopeSwitchTransaction: ScopeSwitchTransaction | null
  shops: ShopResponseDto[]
  isLoading: boolean
  isScopeReady: boolean
  refreshShops: () => Promise<unknown>
  completeScopeSwitch: () => void
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

function getScopeKey(scope: ShopScope): string {
  return scope.mode === 'SHOP' ? `SHOP:${scope.shopId}` : 'GLOBAL'
}

function isScopeSensitiveTenantQuery(queryKey: readonly unknown[]): boolean {
  const [domain, resource] = queryKey
  return domain === 'tenant' && resource !== 'shops' && resource !== 'permissions'
}

export function ShopScopeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { status } = useSession()
  const [scopeVersion, setScopeVersion] = useState(0)
  const [scopeSwitchTransaction, setScopeSwitchTransaction] = useState<ScopeSwitchTransaction | null>(null)
  const [persistedShopId, setPersistedShopId] = useState<string | null>(() => tryReadPersistedShopId())
  const nextTransactionIdRef = useRef(0)
  const isAuthenticated = status === 'authenticated'
  const { data, isLoading, refetch } = useShops(
    {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'name', order: 'ASC' },
    },
    isAuthenticated,
  )

  const shops = useMemo(() => (isAuthenticated ? (data?.data ?? []) : []), [isAuthenticated, data?.data])

  const scope = useMemo<ShopScope>(() => {
    if (!isAuthenticated || !persistedShopId) {
      return { mode: 'GLOBAL' }
    }

    const matchingShop = shops.find((shop) => shop.id === persistedShopId)
    if (matchingShop) {
      return { mode: 'SHOP', shopId: matchingShop.id, shopName: matchingShop.name }
    }

    // Prevent GLOBAL flicker on refresh while shop list is still loading.
    if (isLoading) {
      return { mode: 'SHOP', shopId: persistedShopId, shopName: '' }
    }

    return { mode: 'GLOBAL' }
  }, [isAuthenticated, persistedShopId, shops, isLoading])

  const isScopeReady = useMemo(() => {
    if (!isAuthenticated) {
      return true
    }

    if (!persistedShopId) {
      return true
    }

    return !isLoading
  }, [isAuthenticated, isLoading, persistedShopId])

  const resetScopedState = useCallback(() => {
    void queryClient.cancelQueries({
      predicate: (query) => isScopeSensitiveTenantQuery(query.queryKey),
    })
    queryClient.removeQueries({
      predicate: (query) => isScopeSensitiveTenantQuery(query.queryKey),
    })
    setScopeVersion((prev) => prev + 1)
  }, [queryClient])

  const completeScopeSwitch = useCallback(() => {
    setScopeSwitchTransaction(null)
  }, [])

  const startScopeSwitch = useCallback(
    (nextScope: ShopScope) => {
      if (getScopeKey(scope) === getScopeKey(nextScope)) return

      const transactionId = nextTransactionIdRef.current + 1
      nextTransactionIdRef.current = transactionId
      setScopeSwitchTransaction({ id: transactionId, isCommitted: false })

      const commitScopeSwitch = () => {
        const nextPersistedShopId = nextScope.mode === 'SHOP' ? nextScope.shopId : null
        resetScopedState()
        setPersistedShopId(nextPersistedShopId)
        persistShopId(nextPersistedShopId)
        setScopeSwitchTransaction((current) =>
          current?.id === transactionId ? { ...current, isCommitted: true } : current,
        )
      }

      window.requestAnimationFrame(commitScopeSwitch)
    },
    [resetScopedState, scope],
  )

  const value = useMemo<ShopScopeContextValue>(
    () => ({
      scope,
      scopeVersion,
      isScopeSwitching: scopeSwitchTransaction !== null,
      scopeSwitchTransaction,
      shops,
      isLoading,
      isScopeReady,
      refreshShops: () => refetch(),
      completeScopeSwitch,
      setGlobalScope: () => {
        startScopeSwitch({ mode: 'GLOBAL' })
      },
      setShopScope: (shop) => {
        startScopeSwitch({ mode: 'SHOP', shopId: shop.id, shopName: shop.name })
      },
    }),
    [
      scope,
      scopeVersion,
      scopeSwitchTransaction,
      shops,
      isLoading,
      isScopeReady,
      refetch,
      completeScopeSwitch,
      startScopeSwitch,
    ],
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
