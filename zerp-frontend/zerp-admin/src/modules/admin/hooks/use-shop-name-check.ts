'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'

import { shopClient } from '../api/shop-client'

export type ShopNameCheckStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export function useShopNameCheck(tenantId: string, name: string, shopId?: string, debounceMs = 400) {
  const [status, setStatus] = useState<ShopNameCheckStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const normalizedTenantId = tenantId.trim()
    const trimmedName = name.trim()

    if (!normalizedTenantId || trimmedName.length < 3) {
      setStatus('idle')
      return
    }

    setStatus('checking')

    timerRef.current = setTimeout(async () => {
      try {
        const result = await shopClient.checkName(normalizedTenantId, trimmedName, shopId)
        setStatus(result.available ? 'available' : 'unavailable')
      } catch {
        setStatus('error')
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [debounceMs, name, shopId, tenantId])

  return status
}
