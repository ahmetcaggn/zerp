import { describe, expect, it } from 'vitest'

import {
  addItemToCart,
  buildCartOrderPayload,
  updateCartItemNotes,
  updateCartItemQuantity,
} from '@/modules/restaurants/utils/cart-utils'

describe('cart utils', () => {
  it('adds product and increments quantity when added again', () => {
    const once = addItemToCart([], { id: 'p1', name: 'Burger', price: 250 })
    const twice = addItemToCart(once, { id: 'p1', name: 'Burger', price: 250 })

    expect(twice).toHaveLength(1)
    expect(twice[0].quantity).toBe(2)
  })

  it('updates item notes', () => {
    const items = addItemToCart([], { id: 'p1', name: 'Burger', price: 250 })
    const updated = updateCartItemNotes(items, 'p1', 'Sossuz')

    expect(updated[0].notes).toBe('Sossuz')
  })

  it('removes item when quantity drops to zero', () => {
    const items = addItemToCart([], { id: 'p1', name: 'Burger', price: 250 })
    const updated = updateCartItemQuantity(items, 'p1', 0)

    expect(updated).toHaveLength(0)
  })

  it('builds API payload with trimmed optional notes', () => {
    const items = updateCartItemNotes(
      addItemToCart([], { id: 'p1', name: 'Burger', price: 250 }),
      'p1',
      '  Acisiz  ',
    )
    const payload = buildCartOrderPayload(items, '  Masa 5  ')

    expect(payload).toEqual({
      note: 'Masa 5',
      items: [
        {
          menuItemId: 'p1',
          quantity: 1,
          notes: 'Acisiz',
        },
      ],
    })
  })
})
