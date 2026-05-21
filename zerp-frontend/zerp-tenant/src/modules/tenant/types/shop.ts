export type MenuLanguage = 'TR' | 'EN'

export interface ShopResponseDto {
  id: string
  name: string
  description?: string
  defaultMenuLanguage: MenuLanguage
  tenantId: string
}

export type ShopListResponseDto = ShopResponseDto

export interface UpdateShopDefaultMenuLanguageRequestDto {
  defaultMenuLanguage: MenuLanguage
}

export type ShopScope =
  | { mode: 'GLOBAL' }
  | { mode: 'SHOP'; shopId: string; shopName: string }
