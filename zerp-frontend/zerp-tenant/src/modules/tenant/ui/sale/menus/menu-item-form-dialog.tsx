'use client'
import {
  Box,
  Button,
  IconButton,
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
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useCreateMenuItem, useUpdateMenuItem } from '../../../hooks/use-menu-items'
import { useMenuCategories } from '../../../hooks/use-menu-categories'
import { useProducts } from '../../../hooks/use-products'
import type { MenuItemProductItemCreateDto, MenuItemResponseDto } from '../../../types/sale'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  menuItem?: MenuItemResponseDto | null
  preselectedCategoryId?: string
  onClose: () => void
}

function buildInitialProductItems(menuItem?: MenuItemResponseDto | null): MenuItemProductItemCreateDto[] {
  if (menuItem?.productItems && menuItem.productItems.length > 0) {
    return menuItem.productItems
      .filter((item) => Boolean(item.productId))
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      }))
  }

  if (menuItem?.productIds && menuItem.productIds.length > 0) {
    const counts = new Map<string, number>()
    for (const productId of menuItem.productIds) {
      if (!productId) continue
      counts.set(productId, (counts.get(productId) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([productId, quantity]) => ({ productId, quantity }))
  }

  return []
}

export function MenuItemFormDialog({ open, mode, menuItem, preselectedCategoryId, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [name, setName] = useState(menuItem?.name ?? '')
  const [description, setDescription] = useState(menuItem?.description ?? '')
  const [price, setPrice] = useState(String(menuItem?.price ?? ''))
  const [imageId, setImageId] = useState(menuItem?.imageId ?? '')
  const [categoryId, setCategoryId] = useState(menuItem?.categoryId ?? preselectedCategoryId ?? '')
  const [productItems, setProductItems] = useState<MenuItemProductItemCreateDto[]>(() => buildInitialProductItems(menuItem))

  const { data: categoriesResult } = useMenuCategories({
    pagination: { page: 1, perPage: 200 },
    ...(selectedShopId ? { filter: { 'menu.shop.id': selectedShopId } } : {}),
  })
  const categories = categoriesResult?.data ?? []

  const { data: productsResult } = useProducts({
    pagination: { page: 1, perPage: 1000 },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const products = productsResult?.data ?? []

  const { mutate: createMenuItem, isPending: isCreating } = useCreateMenuItem()
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem()
  const isPending = isCreating || isUpdating

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) return

    const normalizedProductItems = productItems
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId,
        quantity: !Number.isFinite(item.quantity) || item.quantity < 1 ? 1 : Math.floor(item.quantity),
      }))
    const expandedProductIds = normalizedProductItems.flatMap((item) => Array.from({ length: item.quantity }, () => item.productId))

    if (mode === 'create') {
      createMenuItem(
        {
          name: name.trim(),
          ...(description.trim() && { description: description.trim() }),
          price: Number(price),
          ...(imageId.trim() && { imageId: imageId.trim() }),
          categoryId,
          productItems: normalizedProductItems,
          productIds: expandedProductIds,
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
            productItems: normalizedProductItems,
            productIds: expandedProductIds,
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {productItems.map((line, index) => (
                <Box key={`${line.productId || 'new'}-${index}`} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel>{t('sale.menuItem.form.productIds')}</InputLabel>
                    <Select
                      value={line.productId}
                      label={t('sale.menuItem.form.productIds')}
                      onChange={(e) => {
                        const next = [...productItems]
                        next[index] = { ...next[index], productId: e.target.value }
                        setProductItems(next)
                      }}
                    >
                      {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    type="number"
                    label={t('sale.menuItem.form.productQuantity')}
                    value={line.quantity}
                    onChange={(e) => {
                      const quantity = Number(e.target.value)
                      const next = [...productItems]
                      next[index] = { ...next[index], quantity: Number.isFinite(quantity) ? quantity : 1 }
                      setProductItems(next)
                    }}
                    inputProps={{ min: 1, step: 1 }}
                    sx={{ width: 120 }}
                  />
                  <IconButton
                    aria-label={t('common.delete')}
                    onClick={() => setProductItems((prev) => prev.filter((_, lineIndex) => lineIndex !== index))}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setProductItems((prev) => [...prev, { productId: '', quantity: 1 }])}
              >
                {t('sale.menuItem.form.addProductLine')}
              </Button>
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
