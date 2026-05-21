'use client'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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
  useCreateProductExtraOption,
  useDeleteProductExtraOption,
  useProductExtraOptions,
  useUpdateProductExtraOption,
} from '../../../hooks/use-product-extra-options'
import { useStockResources } from '../../../hooks/use-stock-resources'
import type {
  ProductExtraOptionItemCreateDto,
  ProductExtraOptionResponseDto,
  UnitType,
} from '../../../types/sale'

const UNIT_TYPES: UnitType[] = ['PIECE', 'GRAM', 'KILOGRAM', 'MILLILITER', 'LITER']

const EMPTY_ITEM = (): ProductExtraOptionItemCreateDto => ({
  stockResourceId: '',
  quantity: 1,
  unitType: 'PIECE',
})

type OptionFormState = {
  name: string
  description: string
  price: string
  isActive: boolean
  items: ProductExtraOptionItemCreateDto[]
}

const EMPTY_FORM = (): OptionFormState => ({
  name: '',
  description: '',
  price: '0',
  isActive: true,
  items: [EMPTY_ITEM()],
})

interface Props {
  productId: string
  productName: string
}

export function ProductExtraOptionManager({ productId, productName }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const { data: optionsResult, isLoading } = useProductExtraOptions({
    filter: { productId },
  })
  const options = optionsResult?.data ?? []

  const { data: resourcesResult } = useStockResources({
    pagination: { page: 1, perPage: 200 },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const stockResources = resourcesResult?.data ?? []

  const { mutate: createOption, isPending: isCreating } = useCreateProductExtraOption()
  const { mutate: updateOption, isPending: isUpdating } = useUpdateProductExtraOption()
  const { mutate: deleteOption } = useDeleteProductExtraOption()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<OptionFormState>(EMPTY_FORM())

  const isPending = isCreating || isUpdating

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM())
    setShowForm(true)
  }

  function openEdit(option: ProductExtraOptionResponseDto) {
    setEditingId(option.id)
    setForm({
      name: option.name,
      description: option.description ?? '',
      price: String(option.price),
      isActive: option.isActive,
      items:
        option.items.length > 0
          ? option.items.map((item) => ({
              stockResourceId: item.stockResourceId,
              quantity: item.quantity,
              unitType: item.unitType,
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

  function updateItem(index: number, field: keyof ProductExtraOptionItemCreateDto, value: unknown) {
    setForm((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return

    const validItems = form.items.filter((item) => item.stockResourceId && item.quantity > 0)

    const payload = {
      name: form.name.trim(),
      ...(form.description.trim() && { description: form.description.trim() }),
      price: Number(form.price),
      isActive: form.isActive,
      items: validItems,
    }

    if (editingId) {
      updateOption(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            showToast(t('sale.extraOption.updatedToast'))
            cancelForm()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
      return
    }

    createOption(
      { productId, ...payload },
      {
        onSuccess: () => {
          showToast(t('sale.extraOption.createdToast'))
          cancelForm()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleDelete(id: string) {
    deleteOption(id, {
      onSuccess: () => showToast(t('sale.extraOption.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('sale.extraOption.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {productName}
            </Typography>
          </Box>
          {!showForm && (
            <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
              {t('sale.extraOption.createButton')}
            </Button>
          )}
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : options.length === 0 && !showForm ? (
          <Typography color="text.secondary">{t('sale.extraOption.emptyState')}</Typography>
        ) : (
          <Box sx={{ mb: 2 }}>
            {options.map((option) => (
              <Box
                key={option.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography fontWeight={600}>{option.name}</Typography>
                    <Chip label={`₺${option.price}`} size="small" variant="outlined" />
                    {!option.isActive && (
                      <Chip
                        label={locale === 'tr' ? 'Pasif' : 'Inactive'}
                        size="small"
                        color="default"
                      />
                    )}
                  </Box>
                  <Box>
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => openEdit(option)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(option.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {option.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {option.description}
                  </Typography>
                )}

                {option.items.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {option.items.map((item) => (
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
              {editingId ? t('common.edit') : t('sale.extraOption.createButton')}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    label={t('sale.extraOption.form.name')}
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    fullWidth
                  />

                  <TextField
                    label={t('sale.extraOption.form.price')}
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    sx={{ width: 140 }}
                    inputProps={{ min: 0, step: '0.01' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.isActive}
                        onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      />
                    }
                    label={t('sale.extraOption.form.isActive')}
                  />
                </Box>

                <TextField
                  label={t('sale.extraOption.form.description')}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                  fullWidth
                />

                <Typography variant="subtitle2">{t('sale.extraOption.form.addItem')}</Typography>
                {form.items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 180, flex: 2 }}>
                      <InputLabel>{t('sale.extraOption.form.stockResource')}</InputLabel>
                      <Select
                        value={item.stockResourceId}
                        label={t('sale.extraOption.form.stockResource')}
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
                      label={t('sale.extraOption.form.quantity')}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      size="small"
                      sx={{ width: 100 }}
                      inputProps={{ min: 0, step: '0.001' }}
                    />

                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>{t('sale.extraOption.form.unitType')}</InputLabel>
                      <Select
                        value={item.unitType}
                        label={t('sale.extraOption.form.unitType')}
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

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, items: prev.items.filter((_, current) => current !== index) }))
                      }}
                      disabled={form.items.length === 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setForm((prev) => ({ ...prev, items: [...prev.items, EMPTY_ITEM()] }))}
                  size="small"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {t('sale.extraOption.form.addItem')}
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
