'use client'
import {
  Box,
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
  Checkbox,
  ListItemText,
} from '@mui/material'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useCreateMenuItem, useUpdateMenuItem } from '../../../hooks/use-menu-items'
import { useMenuCategories } from '../../../hooks/use-menu-categories'
import { useProducts } from '../../../hooks/use-products'
import type { MenuItemResponseDto } from '../../../types/sale'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  menuItem?: MenuItemResponseDto | null
  preselectedCategoryId?: string
  onClose: () => void
}

export function MenuItemFormDialog({ open, mode, menuItem, preselectedCategoryId, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [name, setName] = useState(menuItem?.name ?? '')
  const [description, setDescription] = useState(menuItem?.description ?? '')
  const [price, setPrice] = useState(String(menuItem?.price ?? ''))
  const [imageId, setImageId] = useState(menuItem?.imageId ?? '')
  const [categoryId, setCategoryId] = useState(menuItem?.categoryId ?? preselectedCategoryId ?? '')
  const [productIds, setProductIds] = useState<string[]>(menuItem?.productIds ?? [])

  const { data: categoriesResult } = useMenuCategories({ pagination: { page: 1, perPage: 200 } })
  const categories = categoriesResult?.data ?? []

  const { data: productsResult } = useProducts({ pagination: { page: 1, perPage: 1000 } })
  const products = productsResult?.data ?? []

  const { mutate: createMenuItem, isPending: isCreating } = useCreateMenuItem()
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem()
  const isPending = isCreating || isUpdating

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) return

    if (mode === 'create') {
      createMenuItem(
        {
          name: name.trim(),
          ...(description.trim() && { description: description.trim() }),
          price: Number(price),
          ...(imageId.trim() && { imageId: imageId.trim() }),
          categoryId,
          productIds,
        },
        {
          onSuccess: () => {
            showToast(t('sale.menuItem.createdToast'))
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    } else if (menuItem) {
      updateMenuItem(
        {
          id: menuItem.id,
          data: {
            name: name.trim(),
            ...(description.trim() && { description: description.trim() }),
            price: Number(price),
            ...(imageId.trim() && { imageId: imageId.trim() }),
            productIds,
          },
        },
        {
          onSuccess: () => {
            showToast(t('sale.menuItem.updatedToast'))
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
          {mode === 'create' ? t('sale.menuItem.createButton') : t('sale.menuItem.editButton')}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('sale.menuItem.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t('sale.menuItem.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('sale.menuItem.form.price')}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                fullWidth
                inputProps={{ min: 0, step: '0.01' }}
              />
              <TextField
                label={t('sale.menuItem.form.imageId')}
                value={imageId}
                onChange={(e) => setImageId(e.target.value)}
                fullWidth
              />
            </Box>
            <FormControl fullWidth required>
              <InputLabel>{t('sale.menuItem.form.categoryId')}</InputLabel>
              <Select
                value={categoryId}
                label={t('sale.menuItem.form.categoryId')}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={mode === 'edit'}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} {c.menuName ? `(${c.menuName})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('sale.menuItem.form.productIds')}</InputLabel>
              <Select
                multiple
                value={productIds}
                label={t('sale.menuItem.form.productIds')}
                onChange={(e) => {
                  const val = e.target.value
                  setProductIds(typeof val === 'string' ? val.split(',') : val)
                }}
                renderValue={(selected) =>
                  selected
                    .map((id) => products.find((p) => p.id === id)?.name || id)
                    .join(', ')
                }
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    <Checkbox checked={productIds.includes(p.id)} />
                    <ListItemText primary={p.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
