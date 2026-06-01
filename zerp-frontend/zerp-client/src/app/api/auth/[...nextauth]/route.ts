import { NextResponse } from 'next/server'

// Auth/SSO disabled temporarily. Re-enable this route by restoring NextAuth.
// import NextAuth from 'next-auth'
// import { authOptions } from '@/core/auth/server/auth-options'

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }

export function GET() {
  return NextResponse.json({ error: 'Authentication is disabled' }, { status: 404 })
}

export function POST() {
  return NextResponse.json({ error: 'Authentication is disabled' }, { status: 404 })
}
