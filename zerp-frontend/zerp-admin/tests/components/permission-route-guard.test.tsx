import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PermissionRouteGuard } from '@/core/permissions/permission-route-guard'
import { ApiError } from '@/core/types/api'

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  canAccessRoute: false,
  permissionsError: null as unknown,
  forceLogout: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/tr/tenants',
  useRouter: () => ({ replace: mocks.replace }),
}))

vi.mock('@/core/auth/session-manager', () => ({
  sessionManager: {
    forceLogout: mocks.forceLogout,
  },
}))

vi.mock('@/core/i18n/i18n-provider', () => ({
  useI18n: () => ({
    t: (key: string) => ({ 'common.loading': 'Loading...' })[key] ?? key,
  }),
}))

vi.mock('@/core/permissions/route-permissions', () => ({
  removeLocalePrefix: () => '/tenants',
  canAccessProtectedRoute: () => mocks.canAccessRoute,
}))

vi.mock('@/core/permissions/use-permissions', () => ({
  useCurrentUserPermissions: () => ({
    hasAnyPermission: vi.fn(),
    hasAnyPermissionForTarget: vi.fn(),
    isLoadingPermissions: false,
    permissionsError: mocks.permissionsError,
  }),
}))

describe('PermissionRouteGuard', () => {
  beforeEach(() => {
    mocks.replace.mockReset()
    mocks.forceLogout.mockReset()
    mocks.canAccessRoute = false
    mocks.permissionsError = null
  })

  it('redirects to unauthorized when permissions loaded and route is denied', async () => {
    render(
      <PermissionRouteGuard locale="tr">
        <div>protected child</div>
      </PermissionRouteGuard>,
    )

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/tr/unauthorized'))
  })

  it('does not redirect to unauthorized when permission bootstrap returns 403', async () => {
    mocks.permissionsError = new ApiError('Forbidden', 403)

    render(
      <PermissionRouteGuard locale="tr">
        <div>protected child</div>
      </PermissionRouteGuard>,
    )

    expect(await screen.findByText(/Yetki bilgileri yuklenemedi/i)).toBeInTheDocument()
    expect(mocks.replace).not.toHaveBeenCalled()
  })

  it('forces logout instead of unauthorized redirect when permission bootstrap returns 401', async () => {
    mocks.permissionsError = new ApiError('Unauthorized', 401)

    render(
      <PermissionRouteGuard locale="tr">
        <div>protected child</div>
      </PermissionRouteGuard>,
    )

    await waitFor(() => expect(mocks.forceLogout).toHaveBeenCalled())
    expect(mocks.replace).not.toHaveBeenCalled()
  })
})
