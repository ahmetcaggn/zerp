export function getAuthSession() {
  return null
}

/*
Auth/SSO disabled temporarily. Restore this block when NextAuth comes back.

import { getServerSession } from 'next-auth'

import { authOptions } from '@/core/auth/server/auth-options'

export function getAuthSession() {
  return getServerSession(authOptions)
}
*/
