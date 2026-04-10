import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { decryptTokens } from '@/core/auth/server/token-crypto'
import { DEFAULT_LOCALE, isLocale } from '@/core/constants/locales'
import { isAuthPath, isProtectedPath } from '@/core/utils/route-helpers'

const INTERNAL_API_URL = process.env.INTERNAL_API_URL || 'http://gateway:8080'

function getAuthCookieName(): string {
  const nextAuthUrl = process.env.NEXTAUTH_URL || ''
  const isHttps = nextAuthUrl.startsWith('https://')
  const isProduction = process.env.NODE_ENV === 'production'

  return isHttps || isProduction ? '__Secure-zerp.session-token' : 'zerp.session-token'
}

function extractLocale(pathname: string): string | null {
  const firstSegment = pathname.split('/')[1]
  return isLocale(firstSegment) ? firstSegment : null
}

function stripLocale(pathname: string, locale: string): string {
  if (pathname === `/${locale}`) {
    return '/'
  }

  const prefix = `/${locale}`
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || '/' : pathname
}

async function proxyApiRequest(req: NextRequest, accessToken: string): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl
  const backendPath = pathname.replace(/^\/api/, '')
  const backendUrl = `${INTERNAL_API_URL}${backendPath}${search}`

  const headers = new Headers(req.headers)
  headers.set('Authorization', `Bearer ${accessToken}`)
  headers.delete('cookie')

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  const requestBody = hasBody ? await req.arrayBuffer() : undefined

  const response = await fetch(backendUrl, {
    method: req.method,
    headers,
    body: requestBody,
  }).catch(() => {
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

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: getAuthCookieName(),
    })

    if (!token || token.error === 'RefreshAccessTokenError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const encryptedTokens = token.encryptedTokens as string | undefined
    if (!encryptedTokens) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decrypted = await decryptTokens(encryptedTokens)
      return proxyApiRequest(req, decrypted.accessToken)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const locale = extractLocale(pathname)
  if (!locale) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`
    return NextResponse.redirect(redirectUrl)
  }

  const pathWithoutLocale = stripLocale(pathname, locale)

  if (!isAuthPath(pathWithoutLocale) && !isProtectedPath(pathWithoutLocale)) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: getAuthCookieName(),
  })

  const isAuthenticated = !!token && token.error !== 'RefreshAccessTokenError'

  if (isAuthPath(pathWithoutLocale) && isAuthenticated) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(redirectUrl)
  }

  if (isProtectedPath(pathWithoutLocale) && !isAuthenticated) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/login`
    redirectUrl.search = `?callbackUrl=${encodeURIComponent(`/${locale}${pathWithoutLocale}`)}${search}`
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
