import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getLoginPath, logoutToLogin } from '@/core/auth/client/logout'

const { signOut } = vi.hoisted(() => ({
  signOut: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
  signOut: (options: unknown) => signOut(options),
}))

describe('logoutToLogin', () => {
  beforeEach(() => {
    signOut.mockReset()
    signOut.mockResolvedValue(undefined)
  })

  it('builds a localized login path', () => {
    expect(getLoginPath('tr')).toBe('/tr/login')
  })

  it('clears the NextAuth session and redirects through NextAuth callbackUrl', async () => {
    await logoutToLogin('tr')

    expect(signOut).toHaveBeenCalledTimes(1)
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/tr/login', redirect: true })
  })
})
