import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/[locale]/(public)/page'

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('Not found')
  },
}))

describe('HomePage', () => {
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
    expect(screen.getByRole('link', { name: 'Kayıt Ol' })).toHaveAttribute('href', '/tr/register')
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
    expect(screen.getByRole('link', { name: 'Create Account' })).toHaveAttribute('href', '/en/register')
    expect(screen.getByText('ZERP Tenant Operations Panel')).toBeInTheDocument()
  })
})
