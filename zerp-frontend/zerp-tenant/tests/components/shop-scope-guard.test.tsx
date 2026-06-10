import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/core/types/api'
import { ShopScopeGuard } from '@/core/ui/navigation/shop-scope-guard'

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  completeScopeSwitch: vi.fn(),
  scopeError: null as unknown,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/tr/dashboard',
  useRouter: () => ({ replace: mocks.replace }),
}))

vi.mock('@/core/permissions/route-permissions', () => ({
  getFirstAccessibleProtectedRoute: () => '/dashboard',
}))

vi.mock('@/core/permissions/use-permissions', () => ({
  useCurrentUserPermissions: () => ({
    hasAnyPermission: vi.fn(),
    hasTenantPermission: vi.fn(),
    hasShopPermission: vi.fn(),
    hasAnyShopPermission: vi.fn(),
  }),
}))

vi.mock('@/core/providers/shop-scope-provider', () => ({
  useShopScope: () => ({
    scope: { mode: 'GLOBAL' },
    isScopeReady: true,
    isScopeSwitching: true,
    scopeSwitchTransaction: { id: 1, isCommitted: true },
    completeScopeSwitch: mocks.completeScopeSwitch,
    scopeError: mocks.scopeError,
  }),
}))

describe('ShopScopeGuard', () => {
  beforeEach(() => {
    mocks.replace.mockReset()
    mocks.completeScopeSwitch.mockReset()
    mocks.scopeError = null
  })

  it('completes scope switch without redirect when shop scope bootstrap fails', async () => {
    mocks.scopeError = new ApiError('Forbidden', 403)

    render(<ShopScopeGuard locale="tr" />)

    await waitFor(() => expect(mocks.completeScopeSwitch).toHaveBeenCalled())
    expect(mocks.replace).not.toHaveBeenCalled()
  })
})
