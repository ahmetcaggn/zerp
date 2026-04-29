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
