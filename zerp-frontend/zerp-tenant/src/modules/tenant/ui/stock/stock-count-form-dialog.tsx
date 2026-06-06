'use client'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'

import { useCreateStockCount } from '../../hooks/use-stock-counts'
import type { CreateStockCountRequestDto } from '../../types/stock'

interface StockCountFormDialogProps {
  open: boolean
  onClose: () => void
}

export function StockCountFormDialog({ open, onClose }: StockCountFormDialogProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { hasShopPermission } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')

  const createMutation = useCreateStockCount()
  const canCreateCount = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.CREATE_STOCK_COUNT, selectedShopId),
  )

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
    if (!canCreateCount) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    try {
      await createMutation.mutateAsync({ ...formData, shopId: scope.shopId })
      showToast('Count session created successfully', { severity: 'success' })
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
            {!canCreateCount && <Alert severity="warning">{unauthorizedReason}</Alert>}
            <TextField
              label={t('stock.count.countDate')}
              type="date"
              value={formData.countDate}
              onChange={(e) => handleChange('countDate', e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!canCreateCount}
            />

            <TextField
              label={t('stock.count.notes')}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              multiline
              rows={3}
              fullWidth
              disabled={!canCreateCount}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isPending || !canCreateCount}>
            {isPending ? t('common.loading') : t('common.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
