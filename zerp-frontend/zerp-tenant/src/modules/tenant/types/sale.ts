// Sale module TypeScript types — mirrors zerp-backend sale DTOs

export type UnitType = 'PIECE' | 'GRAM' | 'KILOGRAM' | 'MILLILITER' | 'LITER'

// TODO: Replace with real shop ID from shop selector
export const MOCK_SHOP_ID = '00000000-0000-0000-0000-000000000000'

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ProductResponseDto {
  id: string
  name: string
  description?: string
  imageId?: string
  shopId: string
  shopName?: string
  typeId?: string
  typeName?: string
  metricId?: string
  metricName?: string
  menuItemId?: string
  price: number
  preparationTime?: number
  isActive: boolean
  tenantId: string
}

export type ProductListResponseDto = ProductResponseDto

export interface CreateProductRequestDto {
  name: string
  description?: string
  imageId?: string
  shopId: string
  typeId?: string
  metricId?: string
  menuItemId?: string
  price: number
  preparationTime?: number
  isActive?: boolean
}

export interface UpdateProductRequestDto {
  name?: string
  description?: string
  imageId?: string
  typeId?: string
  metricId?: string
  menuItemId?: string
  price?: number
  preparationTime?: number
  isActive?: boolean
}

// ─── Product Recipe ───────────────────────────────────────────────────────────

export interface ProductRecipeItemCreateDto {
  stockResourceId: string
  quantity: number
  unitType: UnitType
  notes?: string
}

export interface ProductRecipeItemDto {
  id: string
  stockResourceId: string
  stockResourceName?: string
  quantity: number
  unitType: UnitType
  notes?: string
}

export interface ProductRecipeResponseDto {
  id: string
  productId: string
  productName?: string
  name: string
  isDefault: boolean
  description?: string
  items: ProductRecipeItemDto[]
  tenantId: string
}

export type ProductRecipeListResponseDto = ProductRecipeResponseDto

export interface CreateProductRecipeRequestDto {
  productId: string
  name: string
  isDefault?: boolean
  description?: string
  items?: ProductRecipeItemCreateDto[]
}

export interface UpdateProductRecipeRequestDto {
  name?: string
  isDefault?: boolean
  description?: string
  items?: ProductRecipeItemCreateDto[]
}

// ─── Product Extra Option ─────────────────────────────────────────────────────

export interface ProductExtraOptionItemCreateDto {
  stockResourceId: string
  quantity: number
  unitType: UnitType
}

export interface ProductExtraOptionItemDto {
  id: string
  stockResourceId: string
  stockResourceName?: string
  quantity: number
  unitType: UnitType
}

export interface ProductExtraOptionResponseDto {
  id: string
  productId: string
  productName?: string
  name: string
  description?: string
  price: number
  isActive: boolean
  items: ProductExtraOptionItemDto[]
  tenantId: string
}

export type ProductExtraOptionListResponseDto = ProductExtraOptionResponseDto

export interface CreateProductExtraOptionRequestDto {
  productId: string
  name: string
  description?: string
  price?: number
  isActive?: boolean
  items?: ProductExtraOptionItemCreateDto[]
}

export interface UpdateProductExtraOptionRequestDto {
  name?: string
  description?: string
  price?: number
  isActive?: boolean
  items?: ProductExtraOptionItemCreateDto[]
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuResponseDto {
  id: string
  name: string
  description?: string
  shopId: string
  shopName?: string
  tenantId: string
}

export type MenuListResponseDto = MenuResponseDto

export interface CreateMenuRequestDto {
  name: string
  description?: string
  shopId: string
}

export interface UpdateMenuRequestDto {
  name?: string
  description?: string
}

// ─── Menu Category ────────────────────────────────────────────────────────────

export interface MenuCategoryResponseDto {
  id: string
  name: string
  description?: string
  menuId: string
  menuName?: string
  tenantId: string
}

export type MenuCategoryListResponseDto = MenuCategoryResponseDto

export interface CreateMenuCategoryRequestDto {
  name: string
  description?: string
  menuId: string
}

export interface UpdateMenuCategoryRequestDto {
  name?: string
  description?: string
}

// ─── Menu Item ────────────────────────────────────────────────────────────────

export interface MenuItemResponseDto {
  id: string
  name: string
  description?: string
  price: number
  imageId?: string
  categoryId: string
  categoryName?: string
  productIds?: string[]
  tenantId: string
}

export type MenuItemListResponseDto = MenuItemResponseDto

export interface CreateMenuItemRequestDto {
  name: string
  description?: string
  price: number
  imageId?: string
  categoryId: string
  productIds?: string[]
}

export interface UpdateMenuItemRequestDto {
  name?: string
  description?: string
  price?: number
  imageId?: string
  productIds?: string[]
}
