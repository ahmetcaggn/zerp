import { signOut } from 'next-auth/react'

import type { Locale } from '@/core/types/common'

type LandingPath = `/${Locale}`
type NavigateToLanding = (path: LandingPath) => void

export function getLandingPath(locale: Locale): LandingPath {
  return `/${locale}`
}

export async function logoutToLanding(
  locale: Locale,
  navigate?: NavigateToLanding,
): Promise<void> {
  const landingPath = getLandingPath(locale)

  try {
    await signOut({ redirect: false })
  } finally {
    if (navigate) {
      navigate(landingPath)
      return
    }

    if (typeof window !== 'undefined') {
      window.location.assign(landingPath)
    }
  }
}
