import type { DefaultSession } from 'next-auth'

import type { AppRole } from '@/core/types/common'

declare module 'next-auth' {
  interface Session {
    error?: string
    user: DefaultSession['user'] & {
      roles: AppRole[]
      tenantId?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    encryptedTokens?: string
    accessTokenExpires?: number
    roles?: AppRole[]
    tenantId?: string
    idToken?: string
    error?: string
  }
}
