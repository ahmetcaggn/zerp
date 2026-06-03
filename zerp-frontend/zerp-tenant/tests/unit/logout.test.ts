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

  it('clears the NextAuth session without using a server redirect and navigates locally', async () => {
    const navigate = vi.fn()

    await logoutToLanding('tr', navigate)

    expect(signOut).toHaveBeenCalledTimes(1)
    expect(signOut).toHaveBeenCalledWith({ redirect: false })
    expect(navigate).toHaveBeenCalledWith('/tr')
  })
})
