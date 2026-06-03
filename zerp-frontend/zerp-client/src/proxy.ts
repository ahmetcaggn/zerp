import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { DEFAULT_LOCALE, isLocale } from '@/core/constants/locales'

// Auth/SSO disabled temporarily. Re-enable these imports with the auth blocks below.
// import { getToken } from 'next-auth/jwt'
// import { decryptTokens } from '@/core/auth/server/token-crypto'
// import { isAuthPath, isProtectedPath } from '@/core/utils/route-helpers'

const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? 'http://gateway:8080'
// const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET
// const NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? ''
// const SESSION_COOKIE_DOMAIN = process.env.SESSION_COOKIE_DOMAIN

// Stale default NextAuth cookie names that should be cleaned up
// const STALE_NEXTAUTH_COOKIES = [
//   '__Secure-next-auth.session-token',
//   'next-auth.session-token',
// ]

// function getAuthCookieName(): string {
//   const isHttps = NEXTAUTH_URL.startsWith('https://')
//   const isProduction = process.env.NODE_ENV === 'production'
//
//   const variant = 'client'
//   return isHttps || isProduction ? `__Secure-zerp.session-token.${variant}` : `zerp.session-token.${variant}`
// }

function extractLocale(pathname: string): string | null {
  const normalizedPath = pathname.replace(/\/+/g, '/')
  const firstSegment = normalizedPath.split('/')[1]
  return firstSegment && isLocale(firstSegment) ? firstSegment : null
}

// function stripLocale(pathname: string, locale: string): string {
//   if (pathname === `/${locale}`) {
//     return '/'
//   }
//
//   const prefix = `/${locale}`
//   return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || '/' : pathname
// }

// function deleteStaleAuthCookies(response: NextResponse): void {
//   for (const name of STALE_NEXTAUTH_COOKIES) {
//     response.cookies.delete(name)
//   }
// }

async function proxyApiRequest(req: NextRequest, accessToken?: string): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl
  const backendPath = pathname.replace(/^\/api/, '')
  const backendUrl = `${INTERNAL_API_URL}${backendPath}${search}`

  const headers = new Headers(req.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  } else {
    headers.delete('Authorization')
  }
  headers.delete('cookie')

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  let requestBody: BodyInit | undefined

  if (hasBody) {
    try {
      requestBody = await req.arrayBuffer()
    } catch {
      requestBody = undefined
    }
  }

  const fetchOptions: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers,
    body: requestBody,
    ...(hasBody && { duplex: 'half' as const }),
  }

  const response = await fetch(backendUrl, fetchOptions).catch((err: unknown) => {
    console.error('[proxy] backend unavailable', {
      url: backendUrl,
      method: req.method,
      error: err instanceof Error ? err.message : String(err),
    })

    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Auth/SSO disabled temporarily.
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.json({ error: 'Authentication is disabled' }, { status: 404 })
  }

  if (pathname === '/api/sso-logout') {
    return new NextResponse(null, { status: 204 })
  }

  // Global SSO logout disabled temporarily.
  // if (!pathname.startsWith('/api') && req.cookies.has('zerp.global-logout')) {
  //   const authCookieName = getAuthCookieName()
  //   const isSecure = NEXTAUTH_URL.startsWith('https://')
  //   const domain = SESSION_COOKIE_DOMAIN
  //   if (req.cookies.has(authCookieName)) {
  //     const locale = extractLocale(pathname) ?? DEFAULT_LOCALE
  //     const redirectUrl = req.nextUrl.clone()
  //     redirectUrl.pathname = `/${locale}/login`
  //     redirectUrl.search = ''
  //     const response = NextResponse.redirect(redirectUrl)
  //     // Must include domain to match original cookie and actually delete it in the browser
  //     response.cookies.set(authCookieName, '', { maxAge: 0, path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, domain })
  //     response.cookies.set('zerp.global-logout', '', { maxAge: 0, path: '/', httpOnly: true, sameSite: 'lax', domain })
  //     return response
  //   }
  //   // No session but has logout signal — clear the signal
  //   const response = NextResponse.next()
  //   response.cookies.set('zerp.global-logout', '', { maxAge: 0, path: '/', httpOnly: true, sameSite: 'lax', domain })
  //   return response
  // }

  // API proxy — public while Auth/SSO is disabled.
  if (pathname.startsWith('/api')) {
    return proxyApiRequest(req)

    // Auth/SSO disabled temporarily.
    // if (pathname.startsWith('/api/sale/public')) {
    //   return proxyApiRequest(req)
    // }
    //
    // const token = await getToken({
    //   req,
    //   secret: NEXTAUTH_SECRET,
    //   cookieName: getAuthCookieName(),
    // }).catch(() => null)
    //
    // if (!token || token.error === 'RefreshAccessTokenError') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    //
    // const encryptedTokens = token.encryptedTokens
    // if (typeof encryptedTokens !== 'string') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    //
    // try {
    //   const decrypted = await decryptTokens(encryptedTokens)
    //   return proxyApiRequest(req, decrypted.accessToken)
    // } catch {
    //   console.error('[proxy] token decryption failed', { pathname })
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
  }

  // Locale redirect — prepend default locale if missing
  const locale = extractLocale(pathname)
  if (!locale) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`
    return NextResponse.redirect(redirectUrl)
  }

  // Auth/SSO disabled temporarily. All localized pages are public.
  // const pathWithoutLocale = stripLocale(pathname, locale)
  //
  // // Public paths that are neither auth nor protected — pass through
  // if (!isAuthPath(pathWithoutLocale) && !isProtectedPath(pathWithoutLocale)) {
  //   return NextResponse.next()
  // }
  //
  // const token = await getToken({
  //   req,
  //   secret: NEXTAUTH_SECRET,
  //   cookieName: getAuthCookieName(),
  // }).catch(() => null)
  //
  // const isAuthenticated = !!token && token.error !== 'RefreshAccessTokenError'
  //
  // // Already logged in — redirect away from auth pages and clear stale cookies
  // if (isAuthPath(pathWithoutLocale) && isAuthenticated) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = `/${locale}/dashboard`
  //   const response = NextResponse.redirect(redirectUrl)
  //   deleteStaleAuthCookies(response)
  //   return response
  // }
  //
  // // Not logged in — redirect to login with callbackUrl
  // if (isProtectedPath(pathWithoutLocale) && !isAuthenticated) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = `/${locale}/login`
  //   redirectUrl.search = `?callbackUrl=${encodeURIComponent(`/${locale}${pathWithoutLocale}`)}${search}`
  //   return NextResponse.redirect(redirectUrl)
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sitemap.xml|robots.txt|zerp_icon_.*\\.svg).*)',
  ],
}
