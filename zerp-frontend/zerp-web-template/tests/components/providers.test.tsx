import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: any }) => children,
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))

import { getMessages } from '@/core/i18n/messages'
import { AppProviders } from '@/core/providers/app-providers'

describe('AppProviders', () => {
  it('renders children under provider composition', () => {
    render(
      <AppProviders locale="en" messages={getMessages('en')}>
        <div>provider-child</div>
      </AppProviders>,
    )

    expect(screen.getByText('provider-child')).toBeInTheDocument()
  })
})
