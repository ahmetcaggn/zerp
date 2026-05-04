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
import { useToast } from '@/core/providers/toast-provider'
import { useCreateStockResource, useUpdateStockResource, useStockResources } from '../../hooks/use-stock-resources'
import type { StockResourceResponseDto, CreateStockResourceRequestDto, UnitType } from '../../types/stock'

interface StockResourceFormDialogProps {
  open: boolean
  onClose: () => void
  initialData?: StockResourceResponseDto | null
}

const UNIT_TYPES: UnitType[] = ['PIECE', 'GRAM', 'KILOGRAM', 'MILLILITER', 'LITER']

export function StockResourceFormDialog({ open, onClose, initialData }: StockResourceFormDialogProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  
  const createMutation = useCreateStockResource()
  const updateMutation = useUpdateStockResource()
  const { refetch } = useStockResources()

  const [formData, setFormData] = useState<CreateStockResourceRequestDto>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    shopId: initialData?.shopId || '00000000-0000-0000-0000-000000000000', // Mock shop ID for now
    unitType: initialData?.unitType || 'PIECE',
    quantity: initialData?.quantity || 0,
    reorderThreshold: initialData?.reorderThreshold || 0,
    costPerUnit: initialData?.costPerUnit || 0,
  })

  const handleChange = (field: keyof CreateStockResourceRequestDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: formData })
        showToast('success', 'Stock updated successfully')
      } else {
        await createMutation.mutateAsync(formData)
        showToast('success', 'Stock created successfully')
      }
      refetch()
      onClose()
    } catch (err: any) {
      showToast('error', err?.message || 'Error saving stock')
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
            <TextField
              label={t('stock.resource.form.quantity')}
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', Number(e.target.value))}
              required
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('stock.resource.form.reorderThreshold')}
                type="number"
                value={formData.reorderThreshold}
                onChange={(e) => handleChange('reorderThreshold', Number(e.target.value))}
                fullWidth
              />
              <TextField
                label={t('stock.resource.form.costPerUnit')}
                type="number"
                value={formData.costPerUnit}
                onChange={(e) => handleChange('costPerUnit', Number(e.target.value))}
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
