'use client'
import {
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
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useCreateProduct, useUpdateProduct } from '../../../hooks/use-products'
import type { ProductResponseDto } from '../../../types/sale'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  product?: ProductResponseDto | null
  onClose: () => void
}

export function ProductFormDialog({ open, mode, product, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [preparationTime, setPreparationTime] = useState(
    product?.preparationTime != null ? String(product.preparationTime) : '',
  )
  const [isActive, setIsActive] = useState(product?.isActive ?? true)

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()
  const isPending = isCreating || isUpdating

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      showToast(t('common.save') + ' — zorunlu alanlar eksik', { severity: 'warning' })
      return
    }

    const shared = {
      name: name.trim(),
      ...(description.trim() && { description: description.trim() }),
      ...(preparationTime && { preparationTime: Number(preparationTime) }),
      isActive,
    }

    if (mode === 'create') {
      if (scope.mode !== 'SHOP') {
        showToast('Bu işlem için önce bir mağaza seçin.', { severity: 'warning' })
        return
      }

      createProduct(
        { ...shared, shopId: scope.shopId },
        {
          onSuccess: () => {
            showToast(t('sale.product.createdToast'))
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    } else if (product) {
      updateProduct(
        { id: product.id, data: shared },
        {
          onSuccess: () => {
            showToast(t('sale.product.updatedToast'))
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'create' ? t('sale.product.createButton') : t('sale.product.editButton')}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('sale.product.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t('sale.product.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('sale.product.form.preparationTime')}
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Box>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
