export interface ShopResponseDto {
  id: string
  name: string
  description?: string
  tenantId: string
}

export type ShopListResponseDto = ShopResponseDto

export type ShopScope =
  | { mode: 'GLOBAL' }
  | { mode: 'SHOP'; shopId: string; shopName: string }
