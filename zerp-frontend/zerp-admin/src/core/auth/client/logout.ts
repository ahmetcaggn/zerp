import { signOut } from 'next-auth/react'

import type { Locale } from '@/core/types/common'

type LoginPath = `/${Locale}/login`
type NavigateToLogin = (path: LoginPath) => void

export function getLoginPath(locale: Locale): LoginPath {
  return `/${locale}/login`
}

export async function logoutToLogin(
  locale: Locale,
  navigate?: NavigateToLogin,
): Promise<void> {
  const loginPath = getLoginPath(locale)

  try {
    await signOut({ redirect: false })
  } finally {
    if (navigate) {
      navigate(loginPath)
      return
    }

    if (typeof window !== 'undefined') {
      window.location.assign(loginPath)
    }
  }
}
