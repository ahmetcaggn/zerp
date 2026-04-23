import type { Locale } from '@/core/types/common'

export const ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  unauthorized: '/unauthorized',
  employees: '/employees',
  tickets: '/tickets',
  teams: '/teams',
  notifications: '/notifications',
} as const

export const PUBLIC_PATHS = [ROUTES.root, ROUTES.login, ROUTES.register] as const
export const AUTH_PATHS = [ROUTES.login, ROUTES.register] as const
export const PROTECTED_PATHS = [ROUTES.dashboard] as const

export function withLocale(locale: Locale, path: string): string {
  if (!path.startsWith('/')) {
    return `/${locale}/${path}`
  }

  if (path === '/') {
    return `/${locale}`
  }

  return `/${locale}${path}`
}
