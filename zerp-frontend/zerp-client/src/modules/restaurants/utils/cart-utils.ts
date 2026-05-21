import type { CreatePublicCartOrderRequest } from '../types'

export interface CartItemState {
  menuItemId: string
  name: string
  unitPrice: number
  quantity: number
  notes: string
}

export function addItemToCart(items: CartItemState[], product: {
  id: string
  name: string
  price: number
}): CartItemState[] {
  const existingIndex = items.findIndex((item) => item.menuItemId === product.id)
  if (existingIndex < 0) {
    return [
      ...items,
      {
        menuItemId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: 1,
        notes: '',
      },
    ]
  }

  return items.map((item, index) =>
    index === existingIndex
      ? { ...item, quantity: item.quantity + 1 }
      : item,
  )
}

export function updateCartItemQuantity(
  items: CartItemState[],
  menuItemId: string,
  quantity: number,
): CartItemState[] {
  if (quantity <= 0) {
    return items.filter((item) => item.menuItemId !== menuItemId)
  }

  return items.map((item) =>
    item.menuItemId === menuItemId ? { ...item, quantity } : item,
  )
}

export function updateCartItemNotes(
  items: CartItemState[],
  menuItemId: string,
  notes: string,
): CartItemState[] {
  return items.map((item) =>
    item.menuItemId === menuItemId ? { ...item, notes } : item,
  )
}

export function buildCartOrderPayload(
  items: CartItemState[],
  note: string,
): CreatePublicCartOrderRequest {
  return {
    note: note.trim() ? note.trim() : undefined,
    items: items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes.trim() ? item.notes.trim() : undefined,
    })),
  }
}
