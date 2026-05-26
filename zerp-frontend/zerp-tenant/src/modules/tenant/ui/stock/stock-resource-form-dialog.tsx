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
import { useEffect, useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { useCreateStockResource, useUpdateStockResource, useStockResources } from '../../hooks/use-stock-resources'
import type { StockResourceResponseDto, CreateStockResourceRequestDto, UnitType } from '../../types/stock'

interface StockResourceFormDialogProps {
  open: boolean
  onClose: () => void
  initialData?: StockResourceResponseDto | null
}

const UNIT_TYPES: UnitType[] = ['PIECE', 'GRAM', 'KILOGRAM', 'MILLILITER', 'LITER']

function parseDecimalInput(value: string): number {
  const normalized = value.replace(',', '.').trim()
  if (!normalized) return Number.NaN
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function normalizeDecimal(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000
}

function formatDecimalInput(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return ''
  return String(value)
}

export function StockResourceFormDialog({ open, onClose, initialData }: StockResourceFormDialogProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : ''
  
  const createMutation = useCreateStockResource()
  const updateMutation = useUpdateStockResource()
  const { refetch } = useStockResources()

  const [formData, setFormData] = useState<CreateStockResourceRequestDto>({
    name: '',
    description: '',
    shopId: selectedShopId,
    unitType: 'PIECE',
    quantity: 0,
    reorderThreshold: 0,
    costPerUnit: 0,
  })
  const [quantityInput, setQuantityInput] = useState('0')
  const [reorderThresholdInput, setReorderThresholdInput] = useState('0')
  const [costPerUnitInput, setCostPerUnitInput] = useState('0')

  useEffect(() => {
    const baseData: CreateStockResourceRequestDto = {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      shopId: initialData?.shopId ?? selectedShopId,
      unitType: initialData?.unitType ?? 'PIECE',
      quantity: initialData?.quantity ?? 0,
      reorderThreshold: initialData?.reorderThreshold ?? 0,
      costPerUnit: initialData?.costPerUnit ?? 0,
    }
    setFormData(baseData)
    setQuantityInput(formatDecimalInput(baseData.quantity))
    setReorderThresholdInput(formatDecimalInput(baseData.reorderThreshold))
    setCostPerUnitInput(formatDecimalInput(baseData.costPerUnit))
  }, [initialData, selectedShopId, open])

  const handleChange = (field: keyof CreateStockResourceRequestDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!initialData && scope.mode !== 'SHOP') {
      showToast('Bu işlem için önce bir mağaza seçin.', { severity: 'warning' })
      return
    }

    const parsedReorderThreshold =
      reorderThresholdInput.trim() === '' ? 0 : parseDecimalInput(reorderThresholdInput)
    const parsedCostPerUnit =
      costPerUnitInput.trim() === '' ? 0 : parseDecimalInput(costPerUnitInput)

    if (!Number.isFinite(parsedReorderThreshold) || parsedReorderThreshold < 0) {
      showToast('Reorder threshold must be a valid number greater than or equal to 0.', { severity: 'warning' })
      return
    }
    if (!Number.isFinite(parsedCostPerUnit) || parsedCostPerUnit < 0) {
      showToast('Cost per unit must be a valid number greater than or equal to 0.', { severity: 'warning' })
      return
    }

    const payloadBase: CreateStockResourceRequestDto = {
      ...formData,
      reorderThreshold: normalizeDecimal(parsedReorderThreshold),
      costPerUnit: normalizeDecimal(parsedCostPerUnit),
    }

    try {
      if (initialData) {
        const { quantity: _quantity, ...updateData } = payloadBase
        await updateMutation.mutateAsync({ id: initialData.id, data: updateData })
        showToast('Stock updated successfully', { severity: 'success' })
      } else {
        const parsedQuantity = parseDecimalInput(quantityInput)
        if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
          showToast('Quantity must be a valid number greater than or equal to 0.', { severity: 'warning' })
          return
        }
        await createMutation.mutateAsync({
          ...payloadBase,
          quantity: normalizeDecimal(parsedQuantity),
          shopId: selectedShopId,
        })
        showToast('Stock created successfully', { severity: 'success' })
      }
      refetch()
      onClose()
    } catch (err: any) {
      showToast(err?.message || 'Error saving stock', { severity: 'error' })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialData ? t('stock.resource.editButton') : t('stock.resource.createButton')}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('stock.resource.form.name')}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t('stock.resource.form.description')}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>{t('stock.resource.form.unitType')}</InputLabel>
              <Select
                value={formData.unitType}
                label={t('stock.resource.form.unitType')}
                onChange={(e) => handleChange('unitType', e.target.value)}
              >
                {UNIT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!initialData && (
              <TextField
                label={t('stock.resource.form.quantity')}
                type="text"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                inputProps={{ inputMode: 'decimal' }}
                required
                fullWidth
              />
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('stock.resource.form.reorderThreshold')}
                type="text"
                value={reorderThresholdInput}
                onChange={(e) => setReorderThresholdInput(e.target.value)}
                inputProps={{ inputMode: 'decimal' }}
                fullWidth
              />
              <TextField
                label={t('stock.resource.form.costPerUnit')}
                type="text"
                value={costPerUnitInput}
                onChange={(e) => setCostPerUnitInput(e.target.value)}
                inputProps={{ inputMode: 'decimal' }}
                fullWidth
              />
            </Box>
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
