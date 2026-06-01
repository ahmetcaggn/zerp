export {}

/*
Auth/SSO disabled temporarily. Restore this block when NextAuth comes back.

import type { DefaultSession } from 'next-auth'

import type { AppRole } from '@/core/types/common'

declare module 'next-auth' {
  interface Session {
    error?: string
    user: DefaultSession['user'] & {
      roles: AppRole[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    encryptedTokens?: string
    accessTokenExpires?: number
    roles?: AppRole[]
    idToken?: string
    error?: string
  }
}
*/
