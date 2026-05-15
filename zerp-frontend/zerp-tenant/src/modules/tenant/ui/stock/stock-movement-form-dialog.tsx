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
  'PURCHASE', 'SALE', 'WASTE', 'ADJUSTMENT', 'TRANSFER', 'RETURN', 'STOCK_COUNT_CORRECTION',
]

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

  const [formData, setFormData] = useState<CreateStockMovementRequestDto>({
    stockResourceId: preselectedResourceId || '',
    type: preselectedType || 'ADJUSTMENT',
    quantity: 0,
    notes: '',
  })

  const handleChange = (field: keyof CreateStockMovementRequestDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync(formData)
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
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', Number(e.target.value))}
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
