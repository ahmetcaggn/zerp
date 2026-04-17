import { z } from 'zod'

import type { Locale } from '@/core/types/common'

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['tr', 'en']).default('tr'),
  NEXT_PUBLIC_SUPPORTED_LOCALES: z.string().default('tr,en'),
  NEXT_PUBLIC_SESSION_POOLING_INTERVAL: z.coerce.number().int().positive().default(120),
})

export interface ClientEnv {
  baseUrl: string
  defaultLocale: Locale
  supportedLocales: Locale[]
  sessionPoolingInterval: number
}

let cachedClientEnv: ClientEnv | null = null

export function getClientEnv(): ClientEnv {
  if (cachedClientEnv) {
    return cachedClientEnv
  }

  const parsed = clientEnvSchema.parse({
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
    NEXT_PUBLIC_SESSION_POOLING_INTERVAL: process.env.NEXT_PUBLIC_SESSION_POOLING_INTERVAL,
  })

  const supportedLocales = parsed.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',')
    .map((item) => item.trim())
    .filter((item): item is Locale => item === 'tr' || item === 'en')

  cachedClientEnv = {
    baseUrl: parsed.NEXT_PUBLIC_BASE_URL,
    defaultLocale: parsed.NEXT_PUBLIC_DEFAULT_LOCALE,
    supportedLocales: supportedLocales.length ? supportedLocales : ['tr', 'en'],
    sessionPoolingInterval: parsed.NEXT_PUBLIC_SESSION_POOLING_INTERVAL,
  }

  return cachedClientEnv
}
