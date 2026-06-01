import type { Locale } from '@/core/types/common'

export const ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  tenants: '/tenants',
  shops: '/shops',
  teams: '/teams',
  teamTickets: '/team-tickets',
  assignedTickets: '/assigned-tickets',
  profile: '/profile',
  unauthorized: '/unauthorized',
} as const

export const PUBLIC_PATHS = [ROUTES.root, ROUTES.login, ROUTES.register] as const
export const AUTH_PATHS = [ROUTES.login, ROUTES.register] as const
export const PROTECTED_PATHS = [
  ROUTES.dashboard,
  ROUTES.tenants,
  ROUTES.shops,
  ROUTES.teams,
  ROUTES.teamTickets,
  ROUTES.assignedTickets,
  ROUTES.profile,
] as const

export function withLocale(locale: Locale, path: string): string {
  if (!path.startsWith('/')) {
    return `/${locale}/${path}`
  }

  if (path === '/') {
    return `/${locale}`
  }

  return `/${locale}${path}`
}
