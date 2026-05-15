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
import { useCreateShopTable, useUpdateShopTable } from '../../../hooks/use-shop-tables'
import type { ShopTableResponseDto, ShopTableStatus } from '../../../types/sale'

const TABLE_STATUSES: ShopTableStatus[] = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'OUT_OF_ORDER']

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  table?: ShopTableResponseDto | null
  onClose: () => void
}

export function ShopTableFormDialog({ open, mode, table, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()

  const [name, setName] = useState(table?.name ?? '')
  const [description, setDescription] = useState(table?.description ?? '')
  const [capacity, setCapacity] = useState(String(table?.capacity ?? 4))
  const [floor, setFloor] = useState(String(table?.floor ?? 0))
  const [status, setStatus] = useState<ShopTableStatus>(table?.status ?? 'AVAILABLE')

  const { mutate: createTable, isPending: isCreating } = useCreateShopTable()
  const { mutate: updateTable, isPending: isUpdating } = useUpdateShopTable()
  const isPending = isCreating || isUpdating

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    if (mode === 'create') {
      if (scope.mode !== 'SHOP') {
        showToast('Bu işlem için önce bir mağaza seçin.', { severity: 'warning' })
        return
      }

      createTable(
        {
          name: name.trim(),
          ...(description.trim() && { description: description.trim() }),
          capacity: parseInt(capacity, 10),
          floor: parseInt(floor, 10),
          status,
          shopId: scope.shopId,
        },
        {
          onSuccess: () => {
            showToast(t('sale.table.createdToast'))
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    } else if (table) {
      updateTable(
        {
          id: table.id,
          data: {
            name: name.trim(),
            ...(description.trim() && { description: description.trim() }),
            capacity: parseInt(capacity, 10),
            floor: parseInt(floor, 10),
            status,
          },
        },
        {
          onSuccess: () => {
            showToast(t('sale.table.updatedToast'))
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
          {mode === 'create' ? t('sale.table.createButton') : t('sale.table.editButton')}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('sale.table.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t('sale.table.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('sale.table.form.capacity')}
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                fullWidth
                inputProps={{ min: 1 }}
              />
              <TextField
                label={t('sale.table.form.floor')}
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
                fullWidth
              />
            </Box>
            <FormControl fullWidth required>
              <InputLabel>{t('sale.table.form.status')}</InputLabel>
              <Select
                value={status}
                label={t('sale.table.form.status')}
                onChange={(e) => setStatus(e.target.value as ShopTableStatus)}
              >
                {TABLE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`sale.table.status.${s}`)}
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
