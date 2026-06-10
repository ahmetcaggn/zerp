import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MenuItemDetailModal } from '@/modules/restaurants/ui/menu-item-detail-modal'

vi.mock('@/core/i18n/i18n-provider', () => ({
  useI18n: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      key === 'restaurants.price' ? `${values?.price} ₺` : key,
  }),
}))

describe('MenuItemDetailModal', () => {
  it('uses the large image size for product details', () => {
    render(
      <MenuItemDetailModal
        open
        onClose={vi.fn()}
        menuItem={{
          id: 'menu-item-1',
          name: 'Margherita',
          description: 'Classic pizza',
          price: 250,
          imageId: 'image-1',
          imageUrl: '/api/sale/public/images/image-1?size=SMALL',
          category: 'Pizza',
          isAvailable: true,
        }}
      />,
    )

    expect(screen.getByRole('img', { name: 'Margherita' })).toHaveAttribute(
      'src',
      '/api/sale/public/images/image-1?size=LARGE',
    )
  })
})
