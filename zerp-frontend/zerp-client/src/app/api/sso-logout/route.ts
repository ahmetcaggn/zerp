import { NextResponse } from 'next/server'

// Auth/SSO disabled temporarily. Re-enable these imports with the logout signal below.
// import { type NextRequest, NextResponse } from 'next/server'
// import { getServerEnv } from '@/core/config/env.server'
// import { DEFAULT_LOCALE } from '@/core/constants/locales'

// This route is called by NextAuth as a callbackUrl after it has already
// cleared the session cookie. Our only job here is to set the global-logout
// signal so the other apps pick it up on their next request.
export async function GET() {
  return new NextResponse(null, { status: 204 })

  // Auth/SSO disabled temporarily.
  // const { sessionCookieDomain } = getServerEnv()
  // const domain = sessionCookieDomain || undefined
  // const isSecure = req.url.startsWith('https://')
  //
  // const loginUrl = new URL(`/${DEFAULT_LOCALE}/login`, req.url)
  // const response = NextResponse.redirect(loginUrl)
  //
  // response.cookies.set('zerp.global-logout', '1', {
  //   path: '/',
  //   httpOnly: true,
  //   sameSite: 'lax',
  //   maxAge: 60,
  //   secure: isSecure,
  //   domain,
  // })
  //
  // return response
}
