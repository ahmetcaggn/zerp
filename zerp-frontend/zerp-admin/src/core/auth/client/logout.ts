import { signOut } from 'next-auth/react'

import type { Locale } from '@/core/types/common'

type LoginPath = `/${Locale}/login`

export function getLoginPath(locale: Locale): LoginPath {
  return `/${locale}/login`
}

export async function logoutToLogin(locale: Locale): Promise<void> {
  const loginPath = getLoginPath(locale)

  await signOut({ callbackUrl: loginPath, redirect: true })
}
