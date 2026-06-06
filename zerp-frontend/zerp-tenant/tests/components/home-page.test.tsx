import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('renders the Turkish restaurant ERP landing page with demo and Play Store CTAs', async () => {
    const ui = await HomePage({ params: Promise.resolve({ locale: 'tr' }) })

    render(ui)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Kafe ve restoran operasyonunu tek ekranda yönetin',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Demo Talebi' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: "Play Store'dan Eriş" })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=org.zerp.tenant',
    )
    expect(
      screen.getByRole('img', { name: 'ZERP restoran ERP ürün arayüzü örneği' }),
    ).toBeInTheDocument()
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
    expect(screen.getByRole('button', { name: 'Request a Demo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open on Play Store' })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=org.zerp.tenant',
    )
    expect(
      screen.getByRole('img', { name: 'Example ZERP restaurant ERP product interface' }),
    ).toBeInTheDocument()
  })

  it('redirects authenticated users to the localized dashboard', async () => {
    getAuthSession.mockResolvedValue({ user: { email: 'user@example.com' } })

    await HomePage({ params: Promise.resolve({ locale: 'tr' }) })

    expect(redirect).toHaveBeenCalledWith('/tr/dashboard')
  })

  it('opens Gmail compose with Turkish demo request form values', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const ui = await HomePage({ params: Promise.resolve({ locale: 'tr' }) })

    render(ui)

    await user.click(screen.getByRole('button', { name: 'Demo Talebi' }))
    expect(screen.getByRole('dialog', { name: 'Demo talebi' })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Ad soyad/), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/E-posta adresi/), 'ada@example.com')
    await user.type(screen.getByLabelText(/Firma adı/), 'Analytical Cafe')
    await user.type(screen.getByLabelText(/Firma hizmet alanı/), 'Kahve ve restoran')
    await user.type(screen.getByLabelText(/Ek not/), '2 subeli isletme')
    await user.click(screen.getByRole('button', { name: 'Talepte Bulun' }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    const [composeUrl, target] = openSpy.mock.calls[0]
    const url = new URL(String(composeUrl))

    expect(target).toBe('_blank')
    expect(url.origin).toBe('https://mail.google.com')
    expect(url.searchParams.get('view')).toBe('cm')
    expect(url.searchParams.get('fs')).toBe('1')
    expect(url.searchParams.get('to')).toBe('pomocra@gmail.com')
    expect(url.searchParams.get('su')).toBe('ZERP demo talebi')
    expect(url.searchParams.get('body')).toContain('Ad soyad: Ada Lovelace')
    expect(url.searchParams.get('body')).toContain('E-posta: ada@example.com')
    expect(url.searchParams.get('body')).toContain('Firma adı: Analytical Cafe')
    expect(url.searchParams.get('body')).toContain('Hizmet alanı: Kahve ve restoran')
    expect(url.searchParams.get('body')).toContain('Ek not: 2 subeli isletme')

    openSpy.mockRestore()
  })
})
