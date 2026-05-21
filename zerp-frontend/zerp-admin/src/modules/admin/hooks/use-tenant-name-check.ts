'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'

import { tenantClient } from '../api/tenant-client'

export type TenantNameCheckStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export function useTenantNameCheck(name: string, debounceMs = 400) {
  const [status, setStatus] = useState<TenantNameCheckStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const trimmed = name.trim()
    if (trimmed.length < 3) {
      setStatus('idle')
      return
    }

    setStatus('checking')

    timerRef.current = setTimeout(async () => {
      try {
        const result = await tenantClient.checkName(trimmed)
        setStatus(result.available ? 'available' : 'unavailable')
      } catch {
        setStatus('error')
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [name, debounceMs])

  return status
}
