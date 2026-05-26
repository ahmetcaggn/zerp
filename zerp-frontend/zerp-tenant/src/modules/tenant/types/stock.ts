export type UnitType = 'PIECE' | 'GRAM' | 'KILOGRAM' | 'MILLILITER' | 'LITER'

export type StockMovementType =
  | 'PURCHASE'
  | 'SALE'
  | 'WASTE'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'RETURN'
  | 'STOCK_COUNT_CORRECTION'
export type StockMovementDirection = 'IN' | 'OUT'

export type StockCountStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'
  | 'READY_FOR_APPROVAL'
  | 'CANCELLED'

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
  lastCountId?: string
  lastCountedAt?: string
  lastCountedBy?: string
  lastCountQuantity?: number
  lastExpectedQuantity?: number
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
  direction?: StockMovementDirection
  quantity: number
  previousQuantity: number
  newQuantity: number
  referenceType?: string
  referenceId?: string
  notes?: string
  createdAt?: string
  tenantId: string
}

export type StockMovementListResponseDto = StockMovementResponseDto

export interface CreateStockMovementRequestDto {
  stockResourceId: string
  type: StockMovementType
  direction?: StockMovementDirection
  quantity: number
  referenceType?: string
  referenceId?: string
  notes?: string
}

export interface UpdateStockMovementRequestDto extends Partial<CreateStockMovementRequestDto> {}

export type StockMovementTimelineBucket = 'DAY' | 'WEEK' | 'MONTH'

export interface StockMovementTimelineBucketResponseDto {
  bucketStart: string
  bucketEnd: string
  movementDelta: number
  previousQuantity: number
  currentQuantity: number
  movementCount: number
}

export interface StockMovementTimelineResponseDto {
  from: string
  to: string
  bucket: StockMovementTimelineBucket
  baselineQuantity: number
  buckets: StockMovementTimelineBucketResponseDto[]
}

// --- STOCK COUNT ---
export interface StockCountItemResponseDto {
  id: string
  stockResourceId: string
  stockResourceName?: string
  unitTypeAbbreviation?: string
  theoreticalQuantity: number
  previousQuantity?: number
  movementDelta?: number
  expectedQuantity?: number
  actualQuantity: number
  discrepancy: number
  notes?: string
  countedBy?: string
  countedAt?: string
}

export interface StockCountItemCreateDto {
  stockResourceId: string
  actualQuantity?: number
  notes?: string
}

export interface StockCountItemUpdateDto {
  stockCountItemId: string
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
  approvedAt?: string
  approvedBy?: string
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
  items?: StockCountItemUpdateDto[]
}

export interface StockOverviewResponseDto {
  stockResourceId: string
  stockResourceName: string
  unitType: UnitType
  realQuantity: number
  expectedQuantity: number
  variance: number
  reorderThreshold?: number
  lastCountId?: string
  lastCountedAt?: string
  lastCountedBy?: string
  lastCountQuantity?: number
  lastExpectedQuantity?: number
  saleDelta: number
  wasteDelta: number
  purchaseDelta: number
  returnDelta: number
  adjustmentDelta: number
  transferDelta: number
}

export type StockOperationType = 'ENTRY' | 'ADJUSTMENT'
export type StockOperationStatus = 'DRAFT' | 'POSTED' | 'CANCELLED'
export type StockOperationItemDirection = 'INCREASE' | 'DECREASE'

export interface StockOperationResponseDto {
  id: string
  shopId: string
  shopName?: string
  operationType: StockOperationType
  status: StockOperationStatus
  referenceNo?: string
  notes?: string
  itemCount: number
  createdAt?: string
  tenantId: string
  items?: StockOperationItemResponseDto[]
}

export interface StockOperationItemResponseDto {
  id: string
  stockResourceId: string
  stockResourceName: string
  unitType?: UnitType
  quantity: number
  direction: StockOperationItemDirection
  unitCost?: number
  reason?: string
  referenceNo?: string
  notes?: string
  stockMovementId?: string
}

export interface StockEntryItemCreateDto {
  stockResourceId: string
  quantity: number
  referenceNo?: string
  notes?: string
}

export interface StockEntryCreateRequestDto {
  shopId: string
  referenceNo?: string
  notes?: string
  items: StockEntryItemCreateDto[]
}

export interface StockAdjustmentItemCreateDto {
  stockResourceId: string
  quantity: number
  direction: StockOperationItemDirection
  reason: string
  notes?: string
}

export interface StockAdjustmentCreateRequestDto {
  shopId: string
  referenceNo?: string
  notes?: string
  items: StockAdjustmentItemCreateDto[]
}
