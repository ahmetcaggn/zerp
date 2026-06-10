import { signOut } from 'next-auth/react'

import type { Locale } from '@/core/types/common'

type LandingPath = `/${Locale}`

export function getLandingPath(locale: Locale): LandingPath {
  return `/${locale}`
}

export async function logoutToLanding(locale: Locale): Promise<void> {
  const landingPath = getLandingPath(locale)

  await signOut({ callbackUrl: landingPath, redirect: true })
}
