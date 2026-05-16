'use client'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { useCreateStockCount, useStockCounts } from '../../hooks/use-stock-counts'
import type { CreateStockCountRequestDto } from '../../types/stock'

interface StockCountFormDialogProps {
  open: boolean
  onClose: () => void
}

export function StockCountFormDialog({ open, onClose }: StockCountFormDialogProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  
  const createMutation = useCreateStockCount()
  const { refetch } = useStockCounts()

  const [formData, setFormData] = useState<CreateStockCountRequestDto>({
    shopId: scope.mode === 'SHOP' ? scope.shopId : '',
    countDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const handleChange = (field: keyof CreateStockCountRequestDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (scope.mode !== 'SHOP') {
      showToast('Bu işlem için önce bir mağaza seçin.', { severity: 'warning' })
      return
    }

    try {
      await createMutation.mutateAsync({ ...formData, shopId: scope.shopId })
      showToast('Count session created successfully', { severity: 'success' })
      refetch()
      onClose()
    } catch (err: any) {
      showToast(err?.message || 'Error creating count session', { severity: 'error' })
    }
  }

  const isPending = createMutation.isPending

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('stock.count.createButton')}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('stock.count.countDate')}
              type="date"
              value={formData.countDate}
              onChange={(e) => handleChange('countDate', e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label={t('stock.count.notes')}
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
            {isPending ? t('common.loading') : t('common.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
