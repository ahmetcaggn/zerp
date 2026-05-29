export interface TenantResponse {
  id?: string
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
}

export interface CreateTenantRequest {
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

export interface UpdateTenantRequest {
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

export interface TenantImageUploadResponse {
  imageId: string
  contentType: string
  originalFileName: string
}
