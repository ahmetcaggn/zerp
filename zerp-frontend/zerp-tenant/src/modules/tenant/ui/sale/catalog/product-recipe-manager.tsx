'use client'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useCreateProductRecipe,
  useDeleteProductRecipe,
  useProductRecipes,
  useUpdateProductRecipe,
} from '../../../hooks/use-product-recipes'
import { useStockResources } from '../../../hooks/use-stock-resources'
import type { ProductRecipeItemCreateDto, ProductRecipeResponseDto, UnitType } from '../../../types/sale'

const UNIT_TYPES: UnitType[] = ['PIECE', 'GRAM', 'KILOGRAM', 'MILLILITER', 'LITER']

const EMPTY_ITEM = (): ProductRecipeItemCreateDto => ({
  stockResourceId: '',
  quantity: 1,
  unitType: 'PIECE',
  notes: '',
})

type RecipeFormState = {
  name: string
  isDefault: boolean
  description: string
  items: ProductRecipeItemCreateDto[]
}

const EMPTY_FORM = (): RecipeFormState => ({
  name: '',
  isDefault: false,
  description: '',
  items: [EMPTY_ITEM()],
})

interface Props {
  productId: string
  productName: string
}

export function ProductRecipeManager({ productId, productName }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const { data: recipesResult, isLoading } = useProductRecipes({
    filter: { productId },
  })
  const recipes = recipesResult?.data ?? []

  const { data: resourcesResult } = useStockResources({
    pagination: { page: 1, perPage: 200 },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const stockResources = resourcesResult?.data ?? []

  const { mutate: createRecipe, isPending: isCreating } = useCreateProductRecipe()
  const { mutate: updateRecipe, isPending: isUpdating } = useUpdateProductRecipe()
  const { mutate: deleteRecipe } = useDeleteProductRecipe()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<RecipeFormState>(EMPTY_FORM())

  const isPending = isCreating || isUpdating

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM())
    setShowForm(true)
  }

  function openEdit(recipe: ProductRecipeResponseDto) {
    setEditingId(recipe.id)
    setForm({
      name: recipe.name,
      isDefault: recipe.isDefault,
      description: recipe.description ?? '',
      items:
        recipe.items.length > 0
          ? recipe.items.map((item) => ({
              stockResourceId: item.stockResourceId,
              quantity: item.quantity,
              unitType: item.unitType,
              notes: item.notes ?? '',
            }))
          : [EMPTY_ITEM()],
    })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM())
  }

  function updateItem(index: number, field: keyof ProductRecipeItemCreateDto, value: unknown) {
    setForm((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, EMPTY_ITEM()] }))
  }

  function removeItem(index: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, current) => current !== index) }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return

    const validItems = form.items.filter((item) => item.stockResourceId && item.quantity > 0)

    if (editingId) {
      updateRecipe(
        {
          id: editingId,
          data: {
            name: form.name.trim(),
            isDefault: form.isDefault,
            ...(form.description.trim() && { description: form.description.trim() }),
            items: validItems,
          },
        },
        {
          onSuccess: () => {
            showToast(t('sale.recipe.updatedToast'))
            cancelForm()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
      return
    }

    createRecipe(
      {
        productId,
        name: form.name.trim(),
        isDefault: form.isDefault,
        ...(form.description.trim() && { description: form.description.trim() }),
        items: validItems,
      },
      {
        onSuccess: () => {
          showToast(t('sale.recipe.createdToast'))
          cancelForm()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleDelete(id: string) {
    deleteRecipe(id, {
      onSuccess: () => showToast(t('sale.recipe.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('sale.recipe.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {productName}
            </Typography>
          </Box>
          {!showForm && (
            <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
              {t('sale.recipe.createButton')}
            </Button>
          )}
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : recipes.length === 0 && !showForm ? (
          <Typography color="text.secondary">{t('sale.recipe.emptyState')}</Typography>
        ) : (
          <Box sx={{ mb: 2 }}>
            {recipes.map((recipe) => (
              <Box
                key={recipe.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={600}>{recipe.name}</Typography>
                    {recipe.isDefault && <Chip label={t('sale.recipe.form.isDefault')} size="small" color="primary" />}
                  </Box>
                  <Box>
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => openEdit(recipe)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(recipe.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {recipe.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {recipe.description}
                  </Typography>
                )}

                {recipe.items.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {recipe.items.map((item) => (
                      <Chip
                        key={item.id}
                        label={`${item.stockResourceName ?? item.stockResourceId} × ${item.quantity} ${item.unitType}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {showForm && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {editingId ? t('common.edit') : t('sale.recipe.createButton')}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    label={t('sale.recipe.form.name')}
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.isDefault}
                        onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      />
                    }
                    label={t('sale.recipe.form.isDefault')}
                  />
                </Box>

                <TextField
                  label={t('sale.recipe.form.description')}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                  fullWidth
                />

                <Typography variant="subtitle2">{t('sale.recipe.form.addItem')}</Typography>
                {form.items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 180, flex: 2 }}>
                      <InputLabel>{t('sale.recipe.form.stockResource')}</InputLabel>
                      <Select
                        value={item.stockResourceId}
                        label={t('sale.recipe.form.stockResource')}
                        onChange={(e) => updateItem(index, 'stockResourceId', e.target.value)}
                        size="small"
                      >
                        {stockResources.map((resource) => (
                          <MenuItem key={resource.id} value={resource.id}>
                            {resource.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label={t('sale.recipe.form.quantity')}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      size="small"
                      sx={{ width: 110 }}
                      inputProps={{ min: 0, step: '0.001' }}
                    />

                    <FormControl sx={{ minWidth: 130 }}>
                      <InputLabel>{t('sale.recipe.form.unitType')}</InputLabel>
                      <Select
                        value={item.unitType}
                        label={t('sale.recipe.form.unitType')}
                        onChange={(e) => updateItem(index, 'unitType', e.target.value)}
                        size="small"
                      >
                        {UNIT_TYPES.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label={t('sale.recipe.form.notes')}
                      value={item.notes}
                      onChange={(e) => updateItem(index, 'notes', e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />

                    <IconButton size="small" color="error" onClick={() => removeItem(index)} disabled={form.items.length === 1}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                <Button startIcon={<AddIcon />} onClick={addItem} size="small" sx={{ alignSelf: 'flex-start' }}>
                  {t('sale.recipe.form.addItem')}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button onClick={cancelForm} disabled={isPending}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant="contained" disabled={isPending}>
                    {isPending ? t('common.loading') : t('common.save')}
                  </Button>
                </Box>
              </Box>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
