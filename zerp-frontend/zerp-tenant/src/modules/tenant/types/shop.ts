import type { CuisineCategory } from '../data/cuisine-categories'

export type MenuLanguage = 'TR' | 'EN'

export interface ShopResponseDto {
  id: string
  name: string
  description?: string
  imageId?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
  email?: string
  website?: string
  latitude?: number
  longitude?: number
  cuisineCategories?: CuisineCategory[]
  defaultMenuLanguage: MenuLanguage
  tenantId: string
}

export type ShopListResponseDto = ShopResponseDto

export interface UpdateShopDefaultMenuLanguageRequestDto {
  defaultMenuLanguage: MenuLanguage
}

export interface PatchShopRequestDto {
  name?: string
  description?: string | null
  imageId?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  latitude?: number | null
  longitude?: number | null
  cuisineCategories?: CuisineCategory[]
  defaultMenuLanguage?: MenuLanguage
}

export interface ShopImageUploadResponseDto {
  imageId: string
  contentType: string
  originalFileName: string
}

export type ShopScope =
  | { mode: 'GLOBAL' }
  | { mode: 'SHOP'; shopId: string; shopName: string }
