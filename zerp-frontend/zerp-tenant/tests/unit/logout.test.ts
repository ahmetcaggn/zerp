import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getLandingPath, logoutToLanding } from '@/core/auth/client/logout'

const { signOut } = vi.hoisted(() => ({
  signOut: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
  signOut: (options: unknown) => signOut(options),
}))

describe('logoutToLanding', () => {
  beforeEach(() => {
    signOut.mockReset()
    signOut.mockResolvedValue(undefined)
  })

  it('builds a localized landing path', () => {
    expect(getLandingPath('tr')).toBe('/tr')
  })

  it('clears the NextAuth session and redirects through NextAuth callbackUrl', async () => {
    await logoutToLanding('tr')

    expect(signOut).toHaveBeenCalledTimes(1)
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/tr', redirect: true })
  })
})
