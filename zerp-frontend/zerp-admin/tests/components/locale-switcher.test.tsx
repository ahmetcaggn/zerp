import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LocaleSwitcher } from '@/core/ui/feedback/locale-switcher'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/tr/dashboard',
}))

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    push.mockReset()
  })

  it('navigates when a locale is selected', () => {
    render(<LocaleSwitcher locale="tr" />)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('EN'))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/en/dashboard')
  })
})
