interface PricedExtraOption {
  name: string
  price: number
}

export function getExtraOptionsUnitTotal(selectedExtraOptions?: PricedExtraOption[]) {
  return (selectedExtraOptions ?? []).reduce((sum, option) => sum + option.price, 0)
}

export function getBaseUnitPrice(unitPrice: number, selectedExtraOptions?: PricedExtraOption[]) {
  return Math.max(0, unitPrice - getExtraOptionsUnitTotal(selectedExtraOptions))
}

export function getBaseLineTotal(unitPrice: number, quantity: number, selectedExtraOptions?: PricedExtraOption[]) {
  return getBaseUnitPrice(unitPrice, selectedExtraOptions) * quantity
}
