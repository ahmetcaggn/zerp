import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppTopbar } from '@/core/ui/feedback/app-topbar'

const push = vi.fn()
const signOut = vi.fn()
const mediaQueryMock = vi.fn()

let pathname = '/tr'
let sessionStatus: 'authenticated' | 'unauthenticated' | 'loading' = 'unauthenticated'

vi.mock('@mui/material/useMediaQuery', () => ({
  default: (...args: unknown[]) => mediaQueryMock(...args),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}))

vi.mock('next-auth/react', () => ({
  signOut: (options: unknown) => signOut(options),
  useSession: () => ({
    data: null,
    status: sessionStatus,
  }),
}))

vi.mock('@/core/i18n/i18n-provider', () => ({
  useI18n: () => ({
    t: (key: string) =>
      (
        {
          'nav.dashboard': 'Dashboard',
          'nav.login': 'Login',
          'nav.logout': 'Logout',
        } as const
      )[key] ?? key,
  }),
}))

vi.mock('@/core/ui/feedback/locale-switcher', () => ({
  LocaleSwitcher: () => <button type="button">Locale</button>,
}))

vi.mock('@/core/ui/feedback/theme-toggle', () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}))

describe('AppTopbar', () => {
  beforeEach(() => {
    pathname = '/tr'
    sessionStatus = 'unauthenticated'
    push.mockReset()
    signOut.mockReset()
    mediaQueryMock.mockReset()
    mediaQueryMock.mockReturnValue(false)
  })

  it('renders inline desktop actions and hides menu toggle on desktop', () => {
    pathname = '/tr/dashboard'

    render(<AppTopbar locale="tr" />)

    expect(screen.queryByLabelText(/open menu/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })

  it('opens and closes the mobile drawer menu', async () => {
    mediaQueryMock.mockReturnValue(true)

    render(<AppTopbar locale="tr" />)

    fireEvent.click(screen.getByLabelText(/open menu/i))

    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(/close menu/i))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument()
    })
  })

  it('shows logout in authenticated mobile menu and calls signOut', () => {
    sessionStatus = 'authenticated'
    mediaQueryMock.mockReturnValue(true)

    render(<AppTopbar locale="tr" />)

    fireEvent.click(screen.getByLabelText(/open menu/i))
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }))

    expect(signOut).toHaveBeenCalledTimes(1)
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/tr/login' })
  })
})
