export interface Product {
  id: string
  name: string
  description?: string
  price: number
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
  description: string
  imageUrl?: string
  rating: number
  address?: string
  isOpen: boolean
  categories: string[] // e.g., 'Cafe', 'Restaurant', 'Fast Food'
}

export interface PublicShopDto {
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
}

export interface PublicActiveMenuDto {
  id: string
  name: string
  description?: string
  isActive: boolean
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

export interface PublicProductDto {
  id: string
  name: string
  description?: string
  price: number
  imageId?: string
  menuItemId?: string
  preparationTime?: number
  isAvailable: boolean
}

export interface PublicCategoryProductsParams {
  shopId: string
  categoryId: string
  start: number
  end: number
  sort?: string
  order?: 'ASC' | 'DESC'
}
