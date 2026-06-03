import type { CuisineCategory } from '../data/cuisine-categories'

export type MenuLanguage = 'TR' | 'EN'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageId?: string
  imageUrl?: string
  category: string
  isAvailable: boolean
  ingredients?: string[]
  calories?: number
  weight?: string
  allergens?: string[]
}

export interface Restaurant {
  id: string
  name: string
  tenantName?: string
  locationLabel?: string
  description: string
  imageUrl?: string
  rating: number
  address?: string
  isOpen: boolean
  categories: string[] // e.g., 'Cafe', 'Restaurant', 'Fast Food'
  cuisineCategories?: CuisineCategory[]
  latitude?: number
  longitude?: number
  distanceKm?: number
}

export interface PublicShopDto {
  id: string
  name: string
  tenantName?: string
  tenantId?: string
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
  latitude?: number | null
  longitude?: number | null
  distanceKm?: number | null
  cuisineCategories?: CuisineCategory[]
}

export interface PublicNearbyShopsParams {
  latitude: number
  longitude: number
  start: number
  end: number
}

export type PublicShopFeedMode = 'ALL' | 'NEARBY'
export type PublicShopFeedSortBy = 'NAME' | 'DISTANCE'
export type PublicShopFeedOrder = 'ASC' | 'DESC'

export interface PublicShopsFeedParams {
  mode?: PublicShopFeedMode
  page?: number
  pageSize?: number
  q?: string
  city?: string
  state?: string
  cuisineCategory?: CuisineCategory
  sortBy?: PublicShopFeedSortBy
  order?: PublicShopFeedOrder
  lat?: number
  lng?: number
}

export interface PublicShopsFeedResponse {
  items: PublicShopDto[]
  page: number
  pageSize: number
  nextPage: number | null
  totalPages: number
  hasMore: boolean
  total: number
}

export interface PublicActiveMenuDto {
  id: string
  name: string
  description?: string
  isActive: boolean
  language?: MenuLanguage
}

export interface PublicMenuCategoryDto {
  id: string
  name: string
  description?: string
}

export interface PublicShopMenuResponseDto {
  shopId: string
  activeMenu: PublicActiveMenuDto | null
  categories: PublicMenuCategoryDto[]
  message?: string
}

export interface PublicMenuItemDto {
  id: string
  name: string
  description?: string
  price: number
  imageId?: string
  calories?: number | null
  weight?: string | null
  ingredients?: string[]
  allergens?: string[]
  categoryId?: string
  isAvailable?: boolean
  available?: boolean
}

export interface PublicCategoryMenuItemsParams {
  shopId: string
  categoryId: string
  language: MenuLanguage
  start: number
  end: number
  sort?: string
  order?: 'ASC' | 'DESC'
}

export interface CreatePublicCartOrderItemRequest {
  menuItemId: string
  quantity: number
}

export interface CreatePublicCartOrderRequest {
  note?: string
  items: CreatePublicCartOrderItemRequest[]
}

export interface CreatePublicCartOrderResponse {
  id: string
  code: string
}
