export type UnitType = 'PIECE' | 'GRAM' | 'KILOGRAM' | 'MILLILITER' | 'LITER'

export type StockMovementType =
  | 'PURCHASE'
  | 'SALE'
  | 'WASTE'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'RETURN'
  | 'STOCK_COUNT_CORRECTION'

export type StockCountStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'

// --- STOCK RESOURCE ---
export interface StockResourceResponseDto {
  id: string
  name: string
  description?: string
  shopId: string
  shopName?: string
  unitType: UnitType
  quantity: number
  reorderThreshold: number
  costPerUnit: number
  tenantId: string
}

export type StockResourceListResponseDto = StockResourceResponseDto

export interface CreateStockResourceRequestDto {
  name: string
  description?: string
  shopId: string
  unitType: UnitType
  quantity: number
  reorderThreshold: number
  costPerUnit: number
}

export interface UpdateStockResourceRequestDto extends Partial<CreateStockResourceRequestDto> {}

// --- STOCK MOVEMENT ---
export interface StockMovementResponseDto {
  id: string
  stockResourceId: string
  stockResourceName?: string
  type: StockMovementType
  quantity: number
  previousQuantity: number
  newQuantity: number
  referenceType?: string
  referenceId?: string
  notes?: string
  tenantId: string
}

export type StockMovementListResponseDto = StockMovementResponseDto

export interface CreateStockMovementRequestDto {
  stockResourceId: string
  type: StockMovementType
  quantity: number
  referenceType?: string
  referenceId?: string
  notes?: string
}

export interface UpdateStockMovementRequestDto extends Partial<CreateStockMovementRequestDto> {}

// --- STOCK COUNT ---
export interface StockCountItemResponseDto {
  id: string
  stockResourceId: string
  stockResourceName?: string
  unitTypeAbbreviation?: string
  theoreticalQuantity: number
  actualQuantity: number
  discrepancy: number
  wasteQuantity: number
  notes?: string
}

export interface StockCountItemCreateDto {
  stockResourceId: string
  actualQuantity?: number
  notes?: string
}

export interface StockCountResponseDto {
  id: string
  shopId: string
  shopName?: string
  status: StockCountStatus
  countDate: string
  notes?: string
  items: StockCountItemResponseDto[]
  tenantId: string
}

export type StockCountListResponseDto = StockCountResponseDto

export interface CreateStockCountRequestDto {
  shopId: string
  countDate: string
  notes?: string
  items?: StockCountItemCreateDto[]
}

export interface UpdateStockCountRequestDto {
  status?: StockCountStatus
  notes?: string
  items?: StockCountItemCreateDto[]
}
