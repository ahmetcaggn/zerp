import { describe, expect, it } from 'vitest'

import { hasAnyRole } from '@/core/guards/role-utils'

describe('hasAnyRole', () => {
  it('returns true when at least one role matches', () => {
    expect(hasAnyRole(['tenant_owner'], ['tenant_employee', 'tenant_owner'])).toBe(true)
  })

  it('returns false when no role matches', () => {
    expect(hasAnyRole(['client_user'], ['admin_super'])).toBe(false)
  })

  it('returns true when required roles are empty', () => {
    expect(hasAnyRole(['client_user'], [])).toBe(true)
  })
})
