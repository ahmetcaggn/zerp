'use client'
import {
  Box, Button, Chip, CircularProgress, Divider,
  IconButton, TextField, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SendIcon from '@mui/icons-material/Send'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { useI18n } from '@/core/i18n/i18n-provider'
import type { ShopTableResponseDto, TableOrderResponseDto } from '../../types/sale'
import type { CartItem } from './pos-view'

interface Props {
  table: ShopTableResponseDto | undefined
  cart: CartItem[]
  existingOrders: TableOrderResponseDto[]
  orderNote: string
  onNoteChange: (v: string) => void
  onUpdateQuantity: (cartKey: string, delta: number) => void
  onRemove: (cartKey: string) => void
  onPlaceOrder: () => void
  onCancelOrder: (orderId: string) => void
  onUpdateOrderItemQty: (order: TableOrderResponseDto, itemId: string, delta: number) => void
  isPending: boolean
}

function QtyControl({
  qty,
  onMinus,
  onPlus,
  disabled,
  size = 'md',
}: {
  qty: number
  onMinus: () => void
  onPlus: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
}) {
  const btnSize = size === 'sm' ? 24 : 28
  const iconSize = size === 'sm' ? 12 : 14
  const fontSize = size === 'sm' ? '0.78rem' : '0.875rem'
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
      <IconButton
        size="small"
        disabled={disabled}
        onClick={onMinus}
        sx={{ width: btnSize, height: btnSize, border: '1.5px solid', borderColor: 'divider', borderRadius: 1.5, p: 0 }}
      >
        <RemoveIcon sx={{ fontSize: iconSize }} />
      </IconButton>
      <Typography fontWeight={700} fontSize={fontSize} sx={{ minWidth: 20, textAlign: 'center' }}>
        {qty}
      </Typography>
      <IconButton
        size="small"
        disabled={disabled}
        onClick={onPlus}
        sx={{ width: btnSize, height: btnSize, border: '1.5px solid', borderColor: 'divider', borderRadius: 1.5, p: 0 }}
      >
        <AddIcon sx={{ fontSize: iconSize }} />
      </IconButton>
    </Box>
  )
}

export function OrderPanel({
  table, cart, existingOrders, orderNote, onNoteChange,
  onUpdateQuantity, onRemove, onPlaceOrder,
  onCancelOrder, onUpdateOrderItemQty, isPending,
}: Props) {
  const { t } = useI18n()
  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0)
  const existingTotal = existingOrders.reduce(
    (s, o) => s + o.items.reduce((is, i) => is + i.unitPrice * i.quantity, 0), 0
  )

  const hasAnything = cart.length > 0 || existingOrders.length > 0

  return (
    <Box
      sx={{
        width: { xs: 280, md: 320, lg: 360 },
        flexShrink: 0,
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant="overline" sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1.5, color: 'text.secondary', lineHeight: 1 }}>
          {t('pos.orderPanelTitle')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="h6" fontWeight={800} lineHeight={1}>
            {table?.name ?? '—'}
          </Typography>
          {existingTotal > 0 && (
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              {t('pos.openTotalLabel')} {existingTotal.toFixed(2)} ₺
            </Typography>
          )}
        </Box>
      </Box>

      {/* Scrollable body */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>

        {/* Existing open orders */}
        {existingOrders.map((order, orderIdx) => {
          const oTotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
          return (
            <Box key={order.id}>
              {orderIdx === 0 && (
                <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
                  <Typography variant="overline" sx={{ fontSize: '0.63rem', fontWeight: 700, letterSpacing: 1.2, color: 'text.secondary' }}>
                    {t('pos.openOrdersSection')}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mx: 1.5, mb: 1.5, border: '1.5px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
                {/* Order header */}
                <Box sx={{ px: 2, py: 1.25, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Chip label={t('pos.openStatus')} color="warning" size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                  <Typography variant="body2" fontWeight={600} sx={{ flex: 1, fontSize: '0.82rem' }}>
                    {t('sale.cashier.itemCount').replace('{n}', String(order.items.length))}
                  </Typography>
                  <Typography variant="body2" fontWeight={800} color="primary.main">
                    {oTotal.toFixed(2)} ₺
                  </Typography>
                </Box>

                {/* Order items */}
                <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
                  {order.items.map(item => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        py: 0.75, borderBottom: '1px solid', borderColor: 'action.hover',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <QtyControl
                        size="sm"
                        qty={item.quantity}
                        disabled={isPending}
                        onMinus={() => onUpdateOrderItemQty(order, item.id, -1)}
                        onPlus={() => onUpdateOrderItemQty(order, item.id, 1)}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" fontWeight={600} noWrap>
                          {item.menuItemName ?? item.menuItemId}
                        </Typography>
                        {item.selectedExtraOptions && item.selectedExtraOptions.length > 0 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                            + {item.selectedExtraOptions.map(option => option.name).join(', ')}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ flexShrink: 0 }}>
                        {(item.unitPrice * item.quantity).toFixed(2)} ₺
                      </Typography>
                      <IconButton
                        size="small"
                        disabled={isPending}
                        onClick={() => onUpdateOrderItemQty(order, item.id, -item.quantity)}
                        sx={{ color: 'error.light', width: 22, height: 22, flexShrink: 0 }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                {/* Cancel order */}
                <Box sx={{ px: 1.5, pb: 1.25 }}>
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    fullWidth
                    disabled={isPending}
                    onClick={() => onCancelOrder(order.id)}
                    sx={{ fontSize: '0.72rem', py: 0.5, borderRadius: 1.5, opacity: 0.75, '&:hover': { opacity: 1 } }}
                  >
                    {t('pos.cancelOrderBtn')}
                  </Button>
                </Box>
              </Box>
            </Box>
          )
        })}

        {/* New cart items */}
        {cart.length > 0 && (
          <Box>
            <Box sx={{ px: 2.5, pt: existingOrders.length > 0 ? 0.5 : 2, pb: 0.5 }}>
              <Typography variant="overline" sx={{ fontSize: '0.63rem', fontWeight: 700, letterSpacing: 1.2, color: 'primary.main' }}>
                {t('pos.newItemsSection')}
              </Typography>
            </Box>
            <Box sx={{ mx: 1.5, mb: 1, border: '1.5px solid', borderColor: 'primary.light', borderRadius: 2.5, overflow: 'hidden', bgcolor: 'primary.50' }}>
              <Box sx={{ px: 1.5, py: 0.75 }}>
                {cart.map(item => (
                  <Box
                    key={item.cartKey}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1,
                      py: 0.75, borderBottom: '1px solid', borderColor: 'action.hover',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <QtyControl
                      qty={item.quantity}
                      onMinus={() => onUpdateQuantity(item.cartKey, -1)}
                      onPlus={() => onUpdateQuantity(item.cartKey, 1)}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.84rem' }} noWrap>
                        {item.name}
                      </Typography>
                      {item.selectedExtraOptions.length > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                          + {item.selectedExtraOptions.map(option => option.name).join(', ')}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ flexShrink: 0 }}>
                      {(item.price * item.quantity).toFixed(2)} ₺
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onRemove(item.cartKey)}
                      sx={{ color: 'error.light', width: 26, height: 26, flexShrink: 0 }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Note field */}
              <Box sx={{ px: 1.5, pb: 1.5 }}>
                <TextField
                  placeholder={t('pos.orderNotePlaceholder')}
                  size="small"
                  value={orderNote}
                  onChange={e => onNoteChange(e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  sx={{
                    mt: 0.5,
                    '& .MuiOutlinedInput-root': { fontSize: '0.82rem', bgcolor: 'background.paper' },
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Empty state */}
        {!hasAnything && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, gap: 1.5, color: 'text.disabled' }}>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 48, opacity: 0.25 }} />
            <Typography variant="body2" textAlign="center" fontSize="0.84rem">
              {t('pos.addFromMenuHint')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2, flexShrink: 0, bgcolor: 'background.paper' }}>
        {cart.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">{t('pos.cartTotalLabel')}</Typography>
              <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                {cartTotal.toFixed(2)} ₺
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={isPending ? undefined : <SendIcon />}
              onClick={onPlaceOrder}
              disabled={isPending || !table}
              sx={{ fontWeight: 700, py: 1.5, fontSize: '1rem', borderRadius: 2.5, boxShadow: 2 }}
            >
              {isPending ? <CircularProgress size={22} color="inherit" /> : t('pos.placeOrderBtn')}
            </Button>
          </>
        )}
        {!hasAnything && (
          <Typography variant="caption" color="text.disabled" textAlign="center" display="block">
            {t('sale.tableOrder.emptyState')}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
