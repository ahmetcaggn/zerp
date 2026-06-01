import { describe, expect, it } from 'vitest'

import { getPathWithoutLocale, isAuthPath, isProtectedPath } from '@/core/utils/route-helpers'

describe('route helpers', () => {
  it('strips locale prefix', () => {
    expect(getPathWithoutLocale('/tr/dashboard', 'tr')).toBe('/dashboard')
    expect(getPathWithoutLocale('/tr', 'tr')).toBe('/')
  })

  it('detects protected paths', () => {
    expect(isProtectedPath('/dashboard')).toBe(false)
    expect(isProtectedPath('/dashboard/orders')).toBe(false)
    expect(isProtectedPath('/login')).toBe(false)
  })

  it('detects auth paths', () => {
    expect(isAuthPath('/login')).toBe(false)
    expect(isAuthPath('/register')).toBe(false)
    expect(isAuthPath('/dashboard')).toBe(false)
  })
})
