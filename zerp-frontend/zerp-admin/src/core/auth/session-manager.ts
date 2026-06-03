import { logoutToLogin } from '@/core/auth/client/logout'
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
      void logoutToLogin(defaultLocale)
    }
  }
}

export const sessionManager = new SessionManager()
