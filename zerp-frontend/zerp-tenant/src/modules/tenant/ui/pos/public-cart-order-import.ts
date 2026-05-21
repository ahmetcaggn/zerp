import type { PublicCartOrderPreviewDto } from '../../types/sale'
import type { CartItem, CartSelectedExtraOption } from './pos-view'

const PUBLIC_CART_ORDER_CODE_PATTERN = /\b[A-Z0-9]{6}\b/i
const NOTE_SEPARATOR = ' / '

export function extractPublicCartOrderCode(value: string) {
  return value.trim().match(PUBLIC_CART_ORDER_CODE_PATTERN)?.[0]?.toUpperCase() ?? null
}

export function mergeNotes(current?: string, incoming?: string) {
  const cleanCurrent = current?.trim()
  const cleanIncoming = incoming?.trim()
  if (!cleanCurrent) return cleanIncoming
  if (!cleanIncoming || cleanCurrent.includes(cleanIncoming)) return cleanCurrent
  return `${cleanCurrent}${NOTE_SEPARATOR}${cleanIncoming}`
}

function toCartKey(menuItemId: string, selectedExtraOptions: CartSelectedExtraOption[]) {
  const sortedExtraIds = [...selectedExtraOptions]
    .map(option => option.extraOptionId)
    .sort()
  return `${menuItemId}::${sortedExtraIds.join(',')}`
}

export function mergePublicCartOrderIntoCart(
  cart: CartItem[],
  preview: PublicCartOrderPreviewDto,
): CartItem[] {
  const next = [...cart]
  for (const item of preview.items) {
    const cartKey = toCartKey(item.menuItemId, [])
    const idx = next.findIndex(cartItem => cartItem.cartKey === cartKey)
    if (idx !== -1) {
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + item.quantity,
        notes: mergeNotes(next[idx].notes, item.notes),
      }
      continue
    }

    next.push({
      cartKey,
      menuItemId: item.menuItemId,
      name: item.menuItemName ?? item.menuItemId,
      price: item.unitPrice,
      quantity: item.quantity,
      notes: item.notes,
      selectedExtraOptions: [],
    })
  }
  return next
}
