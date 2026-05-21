'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'

import { employeeClient } from '../api/employee-client'

export type UsernameCheckStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export function useUsernameCheck(username: string, debounceMs = 400) {
  const [status, setStatus] = useState<UsernameCheckStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const trimmed = username.trim()
    if (trimmed.length < 3) {
      setStatus('idle')
      return
    }

    setStatus('checking')

    timerRef.current = setTimeout(async () => {
      try {
        const result = await employeeClient.checkUsername(trimmed)
        setStatus(result.available ? 'available' : 'unavailable')
      } catch {
        setStatus('error')
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [username, debounceMs])

  return status
}
