import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import KeycloakProvider from 'next-auth/providers/keycloak'

import { getServerEnv } from '@/core/config/env.server'
import { DEFAULT_LOCALE } from '@/core/constants/locales'
import type { AppRole } from '@/core/types/common'

import { decryptTokens, encryptTokens } from './token-crypto'

const activeRefreshPromises = new Map<string, Promise<JWT>>()

function getAuthCookieName(): string {
  const { nextAuthUrl } = getServerEnv()
  const isHttps = nextAuthUrl.startsWith('https://')
  const isProduction = process.env.NODE_ENV === 'production'

  const variant = 'tenant'
  return isHttps || isProduction ? `__Secure-zerp.session-token.${variant}` : `zerp.session-token.${variant}`
}

type TokenPayload = {
  realm_access?: { roles?: string[] }
  resource_access?: Record<string, { roles?: string[] }>
  sub?: unknown
  userId?: unknown
  user_id?: unknown
  tenantId?: unknown
  tenant_id?: unknown
  tenant?: unknown
}

function parseJwtPayload(jwtToken?: string): TokenPayload | null {
  if (!jwtToken) {
    return null
  }

  try {
    const [, payloadPart] = jwtToken.split('.')
    if (!payloadPart) {
      return null
    }

    const payloadJson = Buffer.from(payloadPart, 'base64url').toString('utf-8')
    return JSON.parse(payloadJson) as TokenPayload
  } catch {
    return null
  }
}

function parseRolesFromIdToken(idToken?: string): AppRole[] {
  const payload = parseJwtPayload(idToken)
  if (!payload) {
    return []
  }

  try {
    const roleSet = new Set<string>()
    payload.realm_access?.roles?.forEach((role) => roleSet.add(role))
    Object.values(payload.resource_access ?? {}).forEach((resource) => {
      resource.roles?.forEach((role) => roleSet.add(role))
    })

    return Array.from(roleSet).filter(isAppRole)
  } catch {
    return []
  }
}

function asUuid(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const normalized = value.trim()
  if (!normalized) {
    return undefined
  }
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(normalized) ? normalized : undefined
}

function parseTenantIdFromTokens(idToken?: string, accessToken?: string): string | undefined {
  const idPayload = parseJwtPayload(idToken)
  const accessPayload = parseJwtPayload(accessToken)

  return (
    asUuid(idPayload?.tenantId) ??
    asUuid(idPayload?.tenant_id) ??
    asUuid(idPayload?.tenant) ??
    asUuid(accessPayload?.tenantId) ??
    asUuid(accessPayload?.tenant_id) ??
    asUuid(accessPayload?.tenant)
  )
}

function parseUserIdFromTokens(
  idToken?: string,
  accessToken?: string,
  fallbackSub?: string,
): string | undefined {
  const idPayload = parseJwtPayload(idToken)
  const accessPayload = parseJwtPayload(accessToken)

  return (
    asUuid(idPayload?.sub) ??
    asUuid(idPayload?.userId) ??
    asUuid(idPayload?.user_id) ??
    asUuid(accessPayload?.sub) ??
    asUuid(accessPayload?.userId) ??
    asUuid(accessPayload?.user_id) ??
    asUuid(fallbackSub)
  )
}

function isAppRole(value: string): value is AppRole {
  return (
    value === 'tenant_owner' ||
    value === 'tenant_employee' ||
    value === 'client_user' ||
    value === 'admin_super' ||
    value === 'admin_operator'
  )
}

function defaultRoleByVariant(): AppRole[] {
  return ['tenant_owner']
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { keycloakIssuer, keycloakClientId, keycloakClientSecret } = getServerEnv()
    const encrypted = token.encryptedTokens as string
    const tokens = await decryptTokens(encrypted)

    const endpoint = `${keycloakIssuer}/protocol/openid-connect/token`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: keycloakClientId,
        client_secret: keycloakClientSecret,
        refresh_token: tokens.refreshToken,
      }),
    })

    const refreshed = await response.json()

    if (!response.ok) {
      return { ...token, error: 'RefreshAccessTokenError' }
    }

    const updatedEncryptedTokens = await encryptTokens({
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? tokens.refreshToken,
      idToken: refreshed.id_token ?? tokens.idToken,
    })

    const parsedRoles = parseRolesFromIdToken(refreshed.id_token ?? tokens.idToken)
    const tenantId = parseTenantIdFromTokens(
      refreshed.id_token ?? tokens.idToken,
      refreshed.access_token ?? tokens.accessToken,
    )
    const userId = parseUserIdFromTokens(
      refreshed.id_token ?? tokens.idToken,
      refreshed.access_token ?? tokens.accessToken,
      token.sub,
    )

    return {
      ...token,
      encryptedTokens: updatedEncryptedTokens,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      roles: parsedRoles.length ? parsedRoles : (token.roles as AppRole[]),
      userId: userId ?? (token.userId as string | undefined),
      tenantId: tenantId ?? token.tenantId,
      error: undefined,
    }
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export const authOptions: NextAuthOptions = {
  secret: getServerEnv().nextAuthSecret,
  providers: [
    KeycloakProvider({
      issuer: getServerEnv().keycloakIssuer,
      clientId: getServerEnv().keycloakClientId,
      clientSecret: getServerEnv().keycloakClientSecret,
      client: {
        token_endpoint_auth_method: 'none',
      },
      checks: ['pkce', 'state'],
      authorization: { params: { scope: 'openid profile email' } },
    }),
  ],
  pages: {
    signIn: `/${DEFAULT_LOCALE}/login`,
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        const encryptedTokens = await encryptTokens({
          accessToken: account.access_token ?? '',
          refreshToken: account.refresh_token ?? '',
          idToken: account.id_token ?? '',
        })

        const parsedRoles = parseRolesFromIdToken(account.id_token)
        const tenantId = parseTenantIdFromTokens(account.id_token, account.access_token)
        const userId = parseUserIdFromTokens(
          account.id_token,
          account.access_token,
          account.providerAccountId,
        )

        return {
          ...token,
          encryptedTokens,
          accessTokenExpires: (account.expires_at ?? 0) * 1000,
          idToken: account.id_token,
          roles: parsedRoles.length ? parsedRoles : defaultRoleByVariant(),
          userId,
          tenantId,
          error: undefined,
        }
      }

      const expiresAt = Number(token.accessTokenExpires ?? 0)
      if (Date.now() < expiresAt - 30_000) {
        return token
      }

      const tokenSub = token.sub
      if (!tokenSub) {
        return refreshAccessToken(token)
      }

      if (activeRefreshPromises.has(tokenSub)) {
        return activeRefreshPromises.get(tokenSub)!
      }

      const refreshPromise = refreshAccessToken(token).finally(() => {
        activeRefreshPromises.delete(tokenSub)
      })

      activeRefreshPromises.set(tokenSub, refreshPromise)
      return refreshPromise
    },
    async session({ session, token }) {
      session.error = token.error as string | undefined
      session.user = {
        ...session.user,
        roles: (token.roles as AppRole[]) ?? defaultRoleByVariant(),
        userId: token.userId as string | undefined,
        tenantId: token.tenantId as string | undefined,
      }
      return session
    },
  },
  events: {
    async signOut({ token }) {
      const idToken = (token as JWT | undefined)?.idToken as string | undefined
      if (!idToken) {
        return
      }

      const { keycloakIssuer } = getServerEnv()
      const logoutUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/logout`)
      logoutUrl.searchParams.set('id_token_hint', idToken)

      await fetch(logoutUrl.toString(), { method: 'GET' }).catch(() => undefined)
    },
  },
  cookies: {
    sessionToken: {
      name: getAuthCookieName(),
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: getServerEnv().nextAuthUrl.startsWith('https://'),
        domain: getServerEnv().sessionCookieDomain || undefined,
      },
    },
  },
}

export { getAuthCookieName }
