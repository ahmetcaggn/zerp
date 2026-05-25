'use client'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
} from '@mui/material'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { useCreateStockMovement, useStockMovements } from '../../hooks/use-stock-movements'
import { useStockResources } from '../../hooks/use-stock-resources'
import type { CreateStockMovementRequestDto, StockMovementType } from '../../types/stock'

interface StockMovementFormDialogProps {
  open: boolean
  onClose: () => void
  preselectedResourceId?: string
  preselectedType?: StockMovementType
}

const MOVEMENT_TYPES: StockMovementType[] = [
  'SALE', 'WASTE', 'RETURN',
]

function parseQuantityInput(value: string): number {
  const normalized = value.replace(',', '.').trim()
  if (!normalized) return Number.NaN
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function normalizeQuantityForPayload(value: string): number {
  const parsed = parseQuantityInput(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return 0
  return Math.round(parsed * 1_000_000) / 1_000_000
}

export function StockMovementFormDialog({ open, onClose, preselectedResourceId, preselectedType }: StockMovementFormDialogProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  
  const createMutation = useCreateStockMovement()
  const { refetch: refetchMovements } = useStockMovements()
  const { data: resourcesResponse, refetch: refetchResources } = useStockResources({
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const initialType = preselectedType && MOVEMENT_TYPES.includes(preselectedType)
    ? preselectedType
    : 'WASTE'

  const [formData, setFormData] = useState<{
    stockResourceId: string
    type: StockMovementType
    quantityInput: string
    notes: string
  }>({
    stockResourceId: preselectedResourceId || '',
    type: initialType,
    quantityInput: '',
    notes: '',
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const quantity = normalizeQuantityForPayload(formData.quantityInput)
    if (!formData.stockResourceId || quantity <= 0) {
      showToast(t('stock.operation.invalidItems'), { severity: 'warning' })
      return
    }

    const payload: CreateStockMovementRequestDto = {
      stockResourceId: formData.stockResourceId,
      type: formData.type,
      quantity,
      notes: formData.notes || undefined,
    }

    try {
      await createMutation.mutateAsync(payload)
      showToast('Movement saved successfully', { severity: 'success' })
      refetchMovements()
      refetchResources()
      onClose()
    } catch (err: any) {
      showToast(err?.message || 'Error saving movement', { severity: 'error' })
    }
  }

  const isPending = createMutation.isPending

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('stock.movement.createButton')}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth required disabled={!!preselectedResourceId}>
              <InputLabel>{t('stock.tabs.resources')}</InputLabel>
              <Select
                value={formData.stockResourceId}
                label={t('stock.tabs.resources')}
                onChange={(e) => handleChange('stockResourceId', e.target.value)}
              >
                {resourcesResponse?.data?.map((resource) => (
                  <MenuItem key={resource.id} value={resource.id}>
                    {resource.name} ({resource.quantity} {resource.unitType})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>{t('stock.movement.type')}</InputLabel>
              <Select
                value={formData.type}
                label={t('stock.movement.type')}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {MOVEMENT_TYPES.map((type) => (
                  // Using English fallback here or translation mapping if needed
                  <MenuItem key={type} value={type}>
                    {t(`stock.movement.types.${type}` as any) || type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('stock.movement.quantity')}
              type="text"
              value={formData.quantityInput}
              onChange={(e) => handleChange('quantityInput', e.target.value)}
              inputProps={{ inputMode: 'decimal' }}
              required
              fullWidth
            />
            
            <TextField
              label={t('stock.movement.notes')}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
