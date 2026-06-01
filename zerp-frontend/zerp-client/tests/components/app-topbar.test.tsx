import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppTopbar } from '@/core/ui/feedback/app-topbar'

const push = vi.fn()
const mediaQueryMock = vi.fn()

let pathname = '/tr'

vi.mock('@mui/material/useMediaQuery', () => ({
  default: (...args: unknown[]) => mediaQueryMock(...args),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
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
    push.mockReset()
    mediaQueryMock.mockReset()
    mediaQueryMock.mockReturnValue(false)
  })

  it('renders inline desktop actions and hides menu toggle on desktop', () => {
    pathname = '/tr/dashboard'

    render(<AppTopbar locale="tr" />)

    expect(screen.queryByLabelText(/open menu/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })

  it('opens and closes the mobile drawer menu', async () => {
    mediaQueryMock.mockReturnValue(true)

    render(<AppTopbar locale="tr" />)

    fireEvent.click(screen.getByLabelText(/open menu/i))

    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(/close menu/i))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument()
    })
  })

  it('does not render logout while auth is disabled', () => {
    mediaQueryMock.mockReturnValue(true)

    render(<AppTopbar locale="tr" />)

    fireEvent.click(screen.getByLabelText(/open menu/i))

    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })
})
