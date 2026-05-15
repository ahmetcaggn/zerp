import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import UnauthorizedPage from '@/app/[locale]/unauthorized/page'

describe('UnauthorizedPage', () => {
  it('renders unauthorized heading', () => {
    render(<UnauthorizedPage params={Promise.resolve({ locale: 'en' })} />)

    expect(screen.getByText('Unauthorized')).toBeInTheDocument()
  })
})
