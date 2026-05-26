'use client'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { useCreateStockAdjustment } from '../../hooks/use-stock-operations'
import { useStockResources } from '../../hooks/use-stock-resources'
import type { StockAdjustmentCreateRequestDto, StockAdjustmentItemCreateDto } from '../../types/stock'

interface StockAdjustmentFormDialogProps {
  open: boolean
  onClose: () => void
  shopId?: string
}

interface StockAdjustmentItemFormState {
  stockResourceId: string
  quantityInput: string
  direction: StockAdjustmentItemCreateDto['direction']
  reason: string
  notes?: string
}

function createEmptyItem(): StockAdjustmentItemFormState {
  return {
    stockResourceId: '',
    quantityInput: '',
    direction: 'DECREASE',
    reason: '',
    notes: '',
  }
}

function parseQuantityInput(value: string): number {
  const normalized = value.replace(',', '.').trim()
  if (!normalized) return Number.NaN
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function normalizeQuantityForPayload(value: string): number {
  const parsed = parseQuantityInput(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return 0
  return Math.round(parsed * 1_000_000) / 1_000_000
}

export function StockAdjustmentFormDialog({ open, onClose, shopId }: StockAdjustmentFormDialogProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const createMutation = useCreateStockAdjustment()
  const { data: resourcesData } = useStockResources({
    pagination: { page: 1, perPage: 300 },
    sort: { field: 'name', order: 'ASC' },
    ...(shopId ? { filter: { 'shop.id': shopId } } : {}),
  })

  const [referenceNo, setReferenceNo] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<StockAdjustmentItemFormState[]>([createEmptyItem()])

  const resources = resourcesData?.data ?? []
  const isPending = createMutation.isPending
  const canSubmit = useMemo(
    () =>
      Boolean(shopId) &&
      items.length > 0 &&
      items.every(
        (item) =>
          item.stockResourceId &&
          normalizeQuantityForPayload(item.quantityInput) > 0 &&
          item.reason.trim().length > 0,
      ),
    [items, shopId],
  )

  const setItem = (index: number, patch: Partial<StockAdjustmentItemFormState>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const addItem = () => setItems((prev) => [...prev, createEmptyItem()])
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index))

  const resetForm = () => {
    setReferenceNo('')
    setNotes('')
    setItems([createEmptyItem()])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shopId) {
      showToast(t('stock.operation.shopRequired'), { severity: 'warning' })
      return
    }
    if (!canSubmit) {
      showToast(t('stock.operation.invalidItems'), { severity: 'warning' })
      return
    }

    const payloadItems: StockAdjustmentCreateRequestDto['items'] = items
      .map((item) => {
        const quantity = normalizeQuantityForPayload(item.quantityInput)
        if (!item.stockResourceId || quantity <= 0 || item.reason.trim().length === 0) return null
        return {
          stockResourceId: item.stockResourceId,
          quantity,
          direction: item.direction,
          reason: item.reason.trim(),
          notes: item.notes || undefined,
        }
      })
      .filter(Boolean) as StockAdjustmentCreateRequestDto['items']

    try {
      await createMutation.mutateAsync({
        shopId,
        referenceNo: referenceNo || undefined,
        notes: notes || undefined,
        items: payloadItems,
      })
      showToast(t('stock.operation.adjustmentCreated'), { severity: 'success' })
      resetForm()
      onClose()
    } catch (err: any) {
      showToast(err?.message || t('stock.operation.operationError'), { severity: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('stock.operation.adjustmentButton')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('stock.operation.referenceNoOperation')}
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                helperText={t('stock.operation.referenceNoOperationHelp')}
                fullWidth
              />
              <TextField
                label={t('stock.operation.notes')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t('stock.operation.referenceNoGuide')}
            </Typography>

            {items.map((item, index) => {
              return (
              <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                  <TextField
                    select
                    label={t('stock.tabs.resources')}
                    value={item.stockResourceId}
                    onChange={(e) => setItem(index, { stockResourceId: e.target.value })}
                    sx={{ minWidth: 220 }}
                    required
                  >
                    {resources.map((resource) => (
                      <MenuItem key={resource.id} value={resource.id}>
                        {resource.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label={t('stock.operation.direction')}
                    value={item.direction}
                    onChange={(e) => setItem(index, { direction: e.target.value as StockAdjustmentItemCreateDto['direction'] })}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="INCREASE">{t('stock.operation.directions.INCREASE')}</MenuItem>
                    <MenuItem value="DECREASE">{t('stock.operation.directions.DECREASE')}</MenuItem>
                  </TextField>
                  <TextField
                    label={t('stock.operation.quantity')}
                    type="text"
                    value={item.quantityInput}
                    onChange={(e) => setItem(index, { quantityInput: e.target.value })}
                    inputProps={{ inputMode: 'decimal' }}
                    sx={{ minWidth: 140 }}
                    required
                  />
                  <TextField
                    label={t('stock.operation.reason')}
                    value={item.reason}
                    onChange={(e) => setItem(index, { reason: e.target.value })}
                    sx={{ minWidth: 220, flex: 1 }}
                    required
                  />
                  <TextField
                    label={t('stock.operation.notes')}
                    value={item.notes ?? ''}
                    onChange={(e) => setItem(index, { notes: e.target.value })}
                    sx={{ minWidth: 180, flex: 1 }}
                  />
                  <IconButton
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    size="small"
                    color="error"
                    aria-label={t('stock.operation.removeItem')}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              )
            })}

            <Button variant="outlined" startIcon={<AddIcon />} onClick={addItem}>
              {t('stock.operation.addItem')}
            </Button>

            {!shopId && (
              <Typography variant="caption" color="error.main">
                {t('stock.operation.shopRequired')}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained" disabled={isPending || !canSubmit}>
            {isPending ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
