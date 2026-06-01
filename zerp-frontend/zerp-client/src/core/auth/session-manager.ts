class SessionManager {
  get isSessionExpired(): boolean {
    return false
  }

  reset(): void {}

  forceLogout(): void {}
}

export const sessionManager = new SessionManager()

/*
Auth/SSO disabled temporarily. Restore this block when NextAuth comes back.

import { signOut } from 'next-auth/react'

import { getClientEnv } from '@/core/config/env.client'

class SessionManager {
  private isLoggingOut = false
  private sessionExpired = false

  get isSessionExpired(): boolean {
    return this.sessionExpired
  }

  reset(): void {
    this.sessionExpired = false
    this.isLoggingOut = false
  }

  forceLogout(): void {
    if (this.isLoggingOut) {
      return
    }

    this.isLoggingOut = true
    this.sessionExpired = true

    if (typeof window !== 'undefined') {
      const { defaultLocale } = getClientEnv()
      void signOut({ callbackUrl: `/${defaultLocale}/login` })
    }
  }
}

export const sessionManager = new SessionManager()
*/
