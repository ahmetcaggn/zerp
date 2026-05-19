import { describe, expect, it } from 'vitest'

import type { PublicCartOrderPreviewDto } from '../../types/sale'
import type { CartItem } from './pos-view'
import {
  extractPublicCartOrderCode,
  mergeNotes,
  mergePublicCartOrderIntoCart,
} from './public-cart-order-import'

const ORDER_ID = '123e4567-e89b-12d3-a456-426614174000'
const ORDER_CODE = 'A1B2C3'

describe('public cart order import helpers', () => {
  it('extracts an uppercase public cart order code from raw QR text', () => {
    expect(extractPublicCartOrderCode(ORDER_CODE)).toBe(ORDER_CODE)
    expect(extractPublicCartOrderCode(`zerp:${ORDER_CODE.toLowerCase()}`)).toBe(ORDER_CODE)
    expect(extractPublicCartOrderCode('not-a-code')).toBeNull()
  })

  it('merges imported items into the existing cart by menu item', () => {
    const cart: CartItem[] = [
      {
        cartKey: 'menu-1::',
        menuItemId: 'menu-1',
        name: 'Coffee',
        price: 40,
        quantity: 1,
        notes: 'az seker',
        selectedExtraOptions: [],
      },
    ]
    const preview: PublicCartOrderPreviewDto = {
      id: ORDER_ID,
      code: ORDER_CODE,
      shopId: 'shop-1',
      note: 'masa notu',
      items: [
        {
          menuItemId: 'menu-1',
          menuItemName: 'Coffee',
          quantity: 2,
          unitPrice: 40,
          notes: 'sicak',
        },
        {
          menuItemId: 'menu-2',
          menuItemName: 'Tea',
          quantity: 1,
          unitPrice: 25,
        },
      ],
    }

    const next = mergePublicCartOrderIntoCart(cart, preview)

    expect(next).toHaveLength(2)
    expect(next[0]).toMatchObject({
      menuItemId: 'menu-1',
      quantity: 3,
      notes: 'az seker / sicak',
    })
    expect(next[1]).toMatchObject({
      cartKey: 'menu-2::',
      name: 'Tea',
      quantity: 1,
      price: 25,
    })
  })

  it('merges order notes without duplicating the same note', () => {
    expect(mergeNotes('', 'foo')).toBe('foo')
    expect(mergeNotes('foo', 'bar')).toBe('foo / bar')
    expect(mergeNotes('foo', 'foo')).toBe('foo')
  })
})
