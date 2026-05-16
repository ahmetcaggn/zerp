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
} from '@mui/material'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useCreateMenuCategory, useUpdateMenuCategory } from '../../../hooks/use-menu-categories'
import { useMenus } from '../../../hooks/use-menus'
import type { MenuCategoryResponseDto } from '../../../types/sale'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  category?: MenuCategoryResponseDto | null
  preselectedMenuId?: string
  onClose: () => void
}

export function MenuCategoryFormDialog({ open, mode, category, preselectedMenuId, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [menuId, setMenuId] = useState(category?.menuId ?? preselectedMenuId ?? '')

  const { data: menusResult } = useMenus({
    pagination: { page: 1, perPage: 200 },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const menus = menusResult?.data ?? []

  const { mutate: createCategory, isPending: isCreating } = useCreateMenuCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateMenuCategory()
  const isPending = isCreating || isUpdating

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !menuId) return

    const payload = {
      name: name.trim(),
      ...(description.trim() && { description: description.trim() }),
      menuId,
    }

    if (mode === 'create') {
      createCategory(payload, {
        onSuccess: () => {
          showToast(t('sale.category.createdToast'))
          onClose()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      })
    } else if (category) {
      updateCategory(
        { id: category.id, data: { name: payload.name, description: payload.description } },
        {
          onSuccess: () => {
            showToast(t('sale.category.updatedToast'))
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
          {mode === 'create' ? t('sale.category.createButton') : t('sale.category.editButton')}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('sale.category.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t('sale.category.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>{t('sale.category.form.menuId')}</InputLabel>
              <Select
                value={menuId}
                label={t('sale.category.form.menuId')}
                onChange={(e) => setMenuId(e.target.value)}
                disabled={mode === 'edit'}
              >
                {menus.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
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
