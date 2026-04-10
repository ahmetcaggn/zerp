import { getServerSession } from 'next-auth'

import { authOptions } from '@/core/auth/server/auth-options'

export function getAuthSession() {
  return getServerSession(authOptions)
}
