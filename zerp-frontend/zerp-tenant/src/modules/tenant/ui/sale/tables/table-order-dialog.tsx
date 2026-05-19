'use client'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem as MuiMenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useTableOrders, useCreateTableOrder, usePatchTableOrder } from '../../../hooks/use-table-orders'
import { useMenuItems } from '../../../hooks/use-menu-items'
import type {
  ShopTableResponseDto,
  TableOrderItemCreateDto,
  TableOrderItemDto,
  TableOrderResponseDto,
} from '../../../types/sale'

interface Props {
  open: boolean
  table: ShopTableResponseDto
  onClose: () => void
}

export function TableOrderDialog({ open, table, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [newItems, setNewItems] = useState<TableOrderItemCreateDto[]>([])
  const [newNote, setNewNote] = useState('')
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('')
  const [selectedQty, setSelectedQty] = useState('1')
  const [itemNote, setItemNote] = useState('')

  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editQty, setEditQty] = useState('1')
  const [editNotes, setEditNotes] = useState('')

  const { data: ordersData, isLoading: isOrdersLoading } = useTableOrders({
    filter: { 'shopTable.id': table.id, status: 'OPEN' },
    pagination: { page: 1, perPage: 20 },
  })

  const { data: menuItemsData } = useMenuItems({
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
  })

  const { mutate: createOrder, isPending: isCreating } = useCreateTableOrder()
  const { mutate: patchOrder, isPending: isPatching } = usePatchTableOrder()
  const isPending = isCreating || isPatching

  const openOrders = ordersData?.data ?? []

  function addItemToList() {
    if (!selectedMenuItemId || parseInt(selectedQty, 10) < 1) return
    setNewItems((prev) => [
      ...prev,
      { menuItemId: selectedMenuItemId, quantity: parseInt(selectedQty, 10), notes: itemNote || undefined },
    ])
    setSelectedMenuItemId('')
    setSelectedQty('1')
    setItemNote('')
  }

  function removeItemFromList(index: number) {
    setNewItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleCreateOrder() {
    if (newItems.length === 0) return
    createOrder(
      { tableId: table.id, note: newNote || undefined, items: newItems },
      {
        onSuccess: () => {
          showToast(t('sale.tableOrder.createdToast'))
          setNewItems([])
          setNewNote('')
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleCancelOrder(order: TableOrderResponseDto) {
    patchOrder(
      { id: order.id, fields: { status: 'CANCELLED' } },
      {
        onSuccess: () => showToast(t('sale.tableOrder.cancelledToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function startEdit(item: TableOrderItemDto) {
    setEditingItemId(item.id)
    setEditQty(String(item.quantity))
    setEditNotes(item.notes ?? '')
  }

  function cancelEdit() {
    setEditingItemId(null)
  }

  function saveEdit(order: TableOrderResponseDto) {
    const qty = parseInt(editQty, 10)
    if (!qty || qty < 1) return
    const updatedItems = order.items.map((item) =>
      item.id === editingItemId
        ? {
          menuItemId: item.menuItemId,
          quantity: qty,
          notes: editNotes || undefined,
          selectedExtraOptionIds: item.selectedExtraOptions?.map(option => option.extraOptionId),
        }
        : {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes || undefined,
          selectedExtraOptionIds: item.selectedExtraOptions?.map(option => option.extraOptionId),
        },
    )
    patchOrder(
      { id: order.id, fields: { items: updatedItems } },
      {
        onSuccess: () => {
          showToast(t('sale.tableOrder.updatedToast'))
          setEditingItemId(null)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function deleteItem(order: TableOrderResponseDto, itemId: string) {
    const updatedItems = order.items
      .filter((item) => item.id !== itemId)
      .map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes || undefined,
        selectedExtraOptionIds: item.selectedExtraOptions?.map(option => option.extraOptionId),
      }))
    patchOrder(
      { id: order.id, fields: { items: updatedItems } },
      {
        onSuccess: () => showToast(t('sale.tableOrder.updatedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  const menuItems = menuItemsData?.data ?? []

  function getMenuItemName(id: string) {
    return menuItems.find((m) => m.id === id)?.name ?? id
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {t('sale.tableOrder.title')} — {table.name}
      </DialogTitle>
      <DialogContent dividers>
        {/* Mevcut açık siparişler */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {t('sale.tableOrder.openOrders')}
        </Typography>

        {isOrdersLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : openOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('sale.tableOrder.emptyState')}
          </Typography>
        ) : (
          openOrders.map((order) => (
            <Box key={order.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={t(`sale.tableOrder.status.${order.status}`)} color="primary" size="small" />
                  {order.note && (
                    <Typography variant="body2" color="text.secondary">
                      {order.note}
                    </Typography>
                  )}
                </Box>
                <Button size="small" variant="outlined" color="error" disabled={isPending} onClick={() => handleCancelOrder(order)}>
                  {t('sale.tableOrder.cancelButton')}
                </Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('sale.tableOrder.form.menuItem')}</TableCell>
                    <TableCell>{t('sale.tableOrder.form.quantity')}</TableCell>
                    <TableCell>{t('sale.cashier.unitPrice')}</TableCell>
                    <TableCell>{t('sale.tableOrder.form.notes')}</TableCell>
                    <TableCell sx={{ width: 80 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) =>
                    editingItemId === item.id ? (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {item.menuItemName ?? item.menuItemId}
                          </Typography>
                          {item.selectedExtraOptions && item.selectedExtraOptions.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              + {item.selectedExtraOptions.map(option => option.name).join(', ')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            inputProps={{ min: 1 }}
                            sx={{ width: 70 }}
                          />
                        </TableCell>
                        <TableCell>{item.unitPrice} ₺</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={t('common.save')}>
                            <IconButton size="small" color="primary" disabled={isPending} onClick={() => saveEdit(order)}>
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.cancel')}>
                            <IconButton size="small" onClick={cancelEdit}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {item.menuItemName ?? item.menuItemId}
                          </Typography>
                          {item.selectedExtraOptions && item.selectedExtraOptions.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              + {item.selectedExtraOptions.map(option => option.name).join(', ')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice} ₺</TableCell>
                        <TableCell>{item.notes ?? '—'}</TableCell>
                        <TableCell>
                          <Tooltip title={t('common.edit')}>
                            <IconButton size="small" onClick={() => startEdit(item)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete')}>
                            <IconButton size="small" color="error" disabled={isPending} onClick={() => deleteItem(order, item.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </Box>
          ))
        )}

        <Divider sx={{ my: 2 }} />

        {/* Yeni sipariş oluştur */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          {t('sale.tableOrder.newOrderButton')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>{t('sale.tableOrder.form.menuItem')}</InputLabel>
            <Select
              value={selectedMenuItemId}
              label={t('sale.tableOrder.form.menuItem')}
              onChange={(e) => setSelectedMenuItemId(e.target.value)}
            >
              {menuItems.map((item) => (
                <MuiMenuItem key={item.id} value={item.id}>
                  {item.name} {item.price != null ? `— ${item.price} ₺` : ''}
                </MuiMenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('sale.tableOrder.form.quantity')}
            type="number"
            size="small"
            value={selectedQty}
            onChange={(e) => setSelectedQty(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{ width: 100 }}
          />
          <TextField
            label={t('sale.tableOrder.form.notes')}
            size="small"
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addItemToList} disabled={!selectedMenuItemId}>
            {t('sale.tableOrder.form.addItem')}
          </Button>
        </Box>

        {newItems.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('sale.tableOrder.form.menuItem')}</TableCell>
                  <TableCell>{t('sale.tableOrder.form.quantity')}</TableCell>
                  <TableCell>{t('sale.tableOrder.form.notes')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {newItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{getMenuItemName(item.menuItemId)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.notes ?? '—'}</TableCell>
                    <TableCell>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => removeItemFromList(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TextField
              label={t('sale.tableOrder.form.note')}
              size="small"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          disabled={newItems.length === 0 || isPending}
          onClick={handleCreateOrder}
        >
          {isPending ? t('common.loading') : t('sale.tableOrder.newOrderButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
