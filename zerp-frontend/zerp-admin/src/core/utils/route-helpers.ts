import { AUTH_PATHS, PROTECTED_PATHS, ROUTES, withLocale } from '@/core/constants/routes'
import type { Locale } from '@/core/types/common'

export function getPathWithoutLocale(pathname: string, locale: Locale): string {
  if (pathname === `/${locale}`) {
    return ROUTES.root
  }

  const localizedPrefix = `/${locale}`
  return pathname.startsWith(localizedPrefix)
    ? pathname.slice(localizedPrefix.length) || ROUTES.root
    : pathname
}

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function toLocalizedPath(locale: Locale, path: string): string {
  return withLocale(locale, path)
}
