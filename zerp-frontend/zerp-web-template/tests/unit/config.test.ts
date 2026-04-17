import { afterEach, describe, expect, it, vi } from 'vitest'

describe('getClientEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('uses defaults when env is missing', async () => {
    const { getClientEnv } = await import('@/core/config/env.client')
    const env = getClientEnv()
    expect(env.defaultLocale).toBe('tr')
    expect(env.supportedLocales).toEqual(['tr', 'en'])
  })

  it('parses explicit env values', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEFAULT_LOCALE', 'en')
    vi.stubEnv('NEXT_PUBLIC_SUPPORTED_LOCALES', 'en,tr')

    const { getClientEnv } = await import('@/core/config/env.client')
    const env = getClientEnv()

    expect(env.defaultLocale).toBe('en')
    expect(env.supportedLocales).toEqual(['en', 'tr'])
  })
})
