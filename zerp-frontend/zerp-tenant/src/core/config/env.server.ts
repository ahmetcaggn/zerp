import { z } from 'zod'

const serverEnvSchema = z.object({
  INTERNAL_API_URL: z.url().default('http://localhost:8080'),
  NEXTAUTH_URL: z.url(),
  NEXTAUTH_SECRET: z.string().min(32),
  KEYCLOAK_ISSUER: z.url(),
  KEYCLOAK_CLIENT_ID: z.string().min(1),
  KEYCLOAK_CLIENT_SECRET: z.string().optional().default(''),
  JWE_SECRET: z.string().min(32),
})

export interface ServerEnv {
  internalApiUrl: string
  nextAuthUrl: string
  nextAuthSecret: string
  keycloakIssuer: string
  keycloakClientId: string
  keycloakClientSecret: string
  jweSecret: string
}

let cachedServerEnv: ServerEnv | null = null

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv
  }

  const parsed = serverEnvSchema.parse({
    INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    JWE_SECRET: process.env.JWE_SECRET,
  })

  cachedServerEnv = {
    internalApiUrl: parsed.INTERNAL_API_URL,
    nextAuthUrl: parsed.NEXTAUTH_URL,
    nextAuthSecret: parsed.NEXTAUTH_SECRET,
    keycloakIssuer: parsed.KEYCLOAK_ISSUER,
    keycloakClientId: parsed.KEYCLOAK_CLIENT_ID,
    keycloakClientSecret: parsed.KEYCLOAK_CLIENT_SECRET,
    jweSecret: parsed.JWE_SECRET,
  }

  return cachedServerEnv
}
