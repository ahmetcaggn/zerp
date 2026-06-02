import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppTopbar } from '@/core/ui/feedback/app-topbar'

const push = vi.fn()
const mediaQueryMock = vi.fn()

vi.mock('@mui/material/useMediaQuery', () => ({
  default: (...args: unknown[]) => mediaQueryMock(...args),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('@/core/ui/feedback/locale-switcher', () => ({
  LocaleSwitcher: () => <button type="button">Locale</button>,
}))

vi.mock('@/core/ui/feedback/theme-toggle', () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}))

describe('AppTopbar', () => {
  beforeEach(() => {
    push.mockReset()
    mediaQueryMock.mockReset()
    mediaQueryMock.mockReturnValue(false)
  })

  it('renders desktop controls without navigation actions', () => {
    render(<AppTopbar locale="tr" />)

    expect(screen.queryByLabelText(/open menu/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Locale' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument()
  })

  it('renders mobile controls without a burger menu or panel button', () => {
    mediaQueryMock.mockReturnValue(true)

    render(<AppTopbar locale="tr" />)

    expect(screen.queryByLabelText(/open menu/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/close menu/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
  })

  it('does not render logout while auth is disabled', () => {
    mediaQueryMock.mockReturnValue(true)

    render(<AppTopbar locale="tr" />)

    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })
})
