import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RestaurantCard } from '@/modules/restaurants/ui/restaurant-card'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('@/core/i18n/i18n-provider', () => ({
  useI18n: () => ({
    locale: 'tr',
    t: (key: string) =>
      (
        {
          'restaurants.open': 'Açık',
          'restaurants.closed': 'Kapalı',
          'restaurants.openMenu': 'Menüyü Aç',
        } as const
      )[key] ?? key,
  }),
}))

describe('RestaurantCard', () => {
  it('renders the same field structure for every restaurant card', () => {
    render(
      <RestaurantCard
        restaurant={{
          id: 'shop-1',
          name: 'North Cafe',
          tenantName: 'North Group',
          locationLabel: 'İstanbul / Kadıköy',
          description: 'Third wave coffee and breakfast.',
          imageUrl: undefined,
          rating: 0,
          isOpen: true,
          categories: [],
        }}
      />,
    )

    expect(screen.getByText('North Group')).toBeInTheDocument()
    expect(screen.getByText('North Cafe')).toBeInTheDocument()
    expect(screen.getByText('İstanbul / Kadıköy')).toBeInTheDocument()
    expect(screen.getByText('Third wave coffee and breakfast.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Menüyü Aç/i })).toBeInTheDocument()
    expect(screen.queryByText(/Google Maps/i)).not.toBeInTheDocument()
  })
})
