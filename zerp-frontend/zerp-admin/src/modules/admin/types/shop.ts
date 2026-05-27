export interface ShopResponse {
  id?: string
  tenantId?: string
  tenantName?: string
  name?: string
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
}

export interface CreateShopRequest {
  tenantId: string
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
}

export interface UpdateShopRequest {
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
}
