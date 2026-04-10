'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { sessionManager } from '@/core/auth/session-manager'
import { appConfig } from '@/core/config/app-config'

function SessionMonitor({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      sessionManager.forceLogout()
      return
    }

    sessionManager.reset()
  }, [session])

  return <>{children}</>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={appConfig.auth.sessionPoolingInterval}
      refetchOnWindowFocus={true}
    >
      <SessionMonitor>{children}</SessionMonitor>
    </SessionProvider>
  )
}
