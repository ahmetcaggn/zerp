import { redirect } from 'next/navigation'

import { getAuthSession } from '@/core/auth/server/session'
import { withLocale } from '@/core/constants/routes'
import { hasAnyRole } from '@/core/guards/role-utils'
import type { AppRole, Locale } from '@/core/types/common'

export async function requireRole(options: {
  locale: Locale
  requiredRoles: AppRole[]
  callbackPath: string
}) {
  const { locale, requiredRoles, callbackPath } = options
  const session = await getAuthSession()

  if (!session) {
    const loginPath = withLocale(locale, '/login')
    const callbackUrl = encodeURIComponent(withLocale(locale, callbackPath))
    redirect(`${loginPath}?callbackUrl=${callbackUrl}`)
  }

  const userRoles = session?.user?.roles ?? []
  if (!hasAnyRole(userRoles, requiredRoles)) {
    redirect(withLocale(locale, '/unauthorized'))
  }

  return session
}
