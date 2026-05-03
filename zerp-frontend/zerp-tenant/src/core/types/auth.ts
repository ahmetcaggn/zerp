import type { AppRole } from '@/core/types/common'

export interface AuthSession {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    roles: AppRole[]
    tenantId?: string
  }
  expires?: string
  error?: string
}

export interface GuardResult {
  allowed: boolean
  reason?: 'UNAUTHENTICATED' | 'UNAUTHORIZED'
}
