import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/[locale]/(public)/page'

const getAuthSession = vi.fn()
const redirect = vi.fn()

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('Not found')
  },
  redirect: (path: string) => redirect(path),
}))

vi.mock('@/core/auth/server/session', () => ({
  getAuthSession: () => getAuthSession(),
}))

describe('HomePage', () => {
  beforeEach(() => {
    getAuthSession.mockResolvedValue(null)
    redirect.mockReset()
  })

  it('renders the Turkish restaurant ERP landing page with demo and register CTAs', async () => {
    const ui = await HomePage({ params: Promise.resolve({ locale: 'tr' }) })

    render(ui)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Kafe ve restoran operasyonunu tek ekranda yönetin',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Demo Talebi' })).toHaveAttribute('href', '#demo')
    expect(screen.getByRole('link', { name: 'Kayıt Akışına Geç' })).toHaveAttribute(
      'href',
      '/tr/register',
    )
    expect(screen.getByText('ZERP Tenant Operasyon Paneli')).toBeInTheDocument()
  })

  it('renders the English landing page with localized CTAs', async () => {
    const ui = await HomePage({ params: Promise.resolve({ locale: 'en' }) })

    render(ui)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Run cafe and restaurant operations from one clear workspace',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Request a Demo' })).toHaveAttribute('href', '#demo')
    expect(screen.getByRole('link', { name: 'Continue to Registration' })).toHaveAttribute(
      'href',
      '/en/register',
    )
    expect(screen.getByText('ZERP Tenant Operations Panel')).toBeInTheDocument()
  })

  it('redirects authenticated users to the localized dashboard', async () => {
    getAuthSession.mockResolvedValue({ user: { email: 'user@example.com' } })

    await HomePage({ params: Promise.resolve({ locale: 'tr' }) })

    expect(redirect).toHaveBeenCalledWith('/tr/dashboard')
  })
})
