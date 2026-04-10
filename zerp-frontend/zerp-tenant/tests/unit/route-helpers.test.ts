import { describe, expect, it } from 'vitest'

import { getPathWithoutLocale, isAuthPath, isProtectedPath } from '@/core/utils/route-helpers'

describe('route helpers', () => {
  it('strips locale prefix', () => {
    expect(getPathWithoutLocale('/tr/dashboard', 'tr')).toBe('/dashboard')
    expect(getPathWithoutLocale('/tr', 'tr')).toBe('/')
  })

  it('detects protected paths', () => {
    expect(isProtectedPath('/dashboard')).toBe(true)
    expect(isProtectedPath('/dashboard/orders')).toBe(true)
    expect(isProtectedPath('/login')).toBe(false)
  })

  it('detects auth paths', () => {
    expect(isAuthPath('/login')).toBe(true)
    expect(isAuthPath('/register')).toBe(true)
    expect(isAuthPath('/dashboard')).toBe(false)
  })
})
