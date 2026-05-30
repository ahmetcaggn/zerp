'use client'
import { useState, useMemo } from 'react'
import {
  Accordion, AccordionDetails, AccordionSummary,
  Box, Button, Card, CardActionArea,
  Chip, CircularProgress, Divider,
  IconButton, InputAdornment, Paper, TextField, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PaymentIcon from '@mui/icons-material/Payment'
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useShopTables } from '../../hooks/use-shop-tables'
import { useTableOrders, usePatchTableOrder, useUpdateTableOrder } from '../../hooks/use-table-orders'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import type { ShopTableResponseDto, ShopTableStatus, TableOrderResponseDto, TableOrderItemDto } from '../../types/sale'
import { getBaseUnitPrice } from '../sale/shared/order-pricing'

const POLL_INTERVAL = 8000

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = 'CASH' | 'CARD'
type Stage = 'SELECT' | 'PAYMENT'

interface SplitEntry {
  id: string
  amount: number
}

// itemId → how many units selected for payment
type SelectedQtys = Map<string, number>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useStatusConfig(t: (k: string) => string) {
  return {
    AVAILABLE:    { label: t('pos.statusAvailable'),    bg: 'rgba(22,163,74,0.07)',    border: '#16a34a', chip: 'success'  as const },
    OCCUPIED:     { label: t('pos.statusOccupied'),     bg: 'rgba(220,38,38,0.07)',    border: '#dc2626', chip: 'error'    as const },
    RESERVED:     { label: t('pos.statusReserved'),     bg: 'rgba(217,119,6,0.07)',    border: '#d97706', chip: 'warning'  as const },
    OUT_OF_ORDER: { label: t('pos.statusOutOfOrder'),   bg: 'rgba(107,114,128,0.07)', border: '#9ca3af', chip: 'default'  as const },
  } satisfies Record<ShopTableStatus, { label: string; bg: string; border: string; chip: 'success' | 'error' | 'warning' | 'default' }>
}

function itemTotal(item: TableOrderItemDto, qty?: number) {
  return item.unitPrice * (qty ?? item.quantity)
}

// ─── Item Qty Stepper ─────────────────────────────────────────────────────────

function ItemQtyStepper({
  max,
  value,
  onChange,
}: {
  max: number
  value: number
  onChange: (v: number) => void
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      <IconButton
        size="small"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        sx={{ p: 0.25, width: 24, height: 24 }}
      >
        <RemoveIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ minWidth: 32, textAlign: 'center', color: value > 0 ? 'primary.main' : 'text.disabled' }}
      >
        {value}/{max}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value === max}
        sx={{ p: 0.25, width: 24, height: 24 }}
      >
        <AddIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  )
}

// ─── Selection Stage ──────────────────────────────────────────────────────────

function SelectionStage({
  orders,
  selectedQtys,
  onQtyChange,
  onSelectAll,
  onClearAll,
  onProceed,
}: {
  orders: TableOrderResponseDto[]
  selectedQtys: SelectedQtys
  onQtyChange: (itemId: string, qty: number) => void
  onSelectAll: () => void
  onClearAll: () => void
  onProceed: () => void
}) {
  const { t } = useI18n()

  const allItems = useMemo(() => orders.flatMap(o => o.items), [orders])

  const selectedTotal = useMemo(() =>
    allItems.reduce((s, item) => {
      const qty = selectedQtys.get(item.id) ?? 0
      return s + itemTotal(item, qty)
    }, 0),
    [allItems, selectedQtys]
  )

  const totalSelectedQty = useMemo(() =>
    Array.from(selectedQtys.values()).reduce((s, q) => s + q, 0),
    [selectedQtys]
  )

  const isAllSelected = useMemo(() =>
    allItems.every(item => (selectedQtys.get(item.id) ?? 0) === item.quantity),
    [allItems, selectedQtys]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {orders.map((order, idx) => {
          const oTotal = order.items.reduce((s, i) => s + itemTotal(i), 0)
          return (
            <Accordion
              key={order.id}
              defaultExpanded
              disableGutters
              elevation={0}
              sx={{
                mb: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '10px !important',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { boxShadow: 1 },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pr: 1 }}>
                  <Chip
                    label={`Sipariş ${idx + 1}`}
                    color="warning"
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                    {t('sale.cashier.itemCount').replace('{n}', String(order.items.length))}
                  </Typography>
                  <Typography variant="body2" fontWeight={800} color="text.secondary">
                    {oTotal.toFixed(2)} ₺
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, px: 2, pb: 1.5 }}>
                {order.note && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: 1 }}>
                    {order.note}
                  </Typography>
                )}
                {order.items.map(item => {
                  const baseUnitPrice = getBaseUnitPrice(item.unitPrice, item.selectedExtraOptions)
                  const lineTotal = itemTotal(item)
                  const extras = item.selectedExtraOptions ?? []
                  const isSimpleLine = item.quantity === 1 && extras.length === 0
                  return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 0.75,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ItemQtyStepper
                      max={item.quantity}
                      value={selectedQtys.get(item.id) ?? 0}
                      onChange={qty => onQtyChange(item.id, qty)}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {item.quantity}× {item.menuItemName ?? item.menuItemId}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: 'nowrap' }}>
                          {baseUnitPrice.toFixed(2)} ₺
                        </Typography>
                      </Box>
                      {extras.length > 0 && (
                        <Box sx={{ mt: 0.25, pl: 1.25 }}>
                          {extras.map(option => (
                            <Box key={option.extraOptionId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                + {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                {option.price.toFixed(2)} ₺
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      {!isSimpleLine && (
                        <Box
                          sx={{
                            mt: 0.4,
                            pt: 0.4,
                            borderTop: '1px dashed',
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Toplam
                          </Typography>
                          <Typography variant="body2" fontWeight={800}>
                            {lineTotal.toFixed(2)} ₺
                          </Typography>
                        </Box>
                      )}
                      {item.notes && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {item.notes}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  )
                })}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Box>

      {/* Sticky footer */}
      <Paper
        elevation={4}
        sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: 'background.paper', flexShrink: 0 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Seçili: <strong>{totalSelectedQty} ürün</strong>
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={isAllSelected ? onClearAll : onSelectAll}
              sx={{ fontSize: '0.7rem', py: 0, px: 0.75, minWidth: 0, fontWeight: 700 }}
            >
              {isAllSelected ? 'Temizle' : 'Tümünü Seç'}
            </Button>
          </Box>
          <Typography variant="h6" fontWeight={800} color="primary.main">
            {selectedTotal.toFixed(2)} ₺
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          endIcon={<ShoppingCartCheckoutIcon />}
          onClick={onProceed}
          disabled={totalSelectedQty === 0}
          sx={{ fontWeight: 700, py: 1.25, borderRadius: 2 }}
        >
          Ödemeye Geç
        </Button>
      </Paper>
    </Box>
  )
}

// ─── Payment Stage ────────────────────────────────────────────────────────────

function PaymentStage({
  orders,
  selectedQtys,
  onBack,
  onSuccess,
}: {
  orders: TableOrderResponseDto[]
  selectedQtys: SelectedQtys
  onBack: () => void
  onSuccess: () => void
}) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { mutate: patchOrder, isPending: isPatchPending } = usePatchTableOrder()
  const { mutate: updateOrder, isPending: isUpdatePending } = useUpdateTableOrder()
  const isPending = isPatchPending || isUpdatePending

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [splitPayments, setSplitPayments] = useState<SplitEntry[]>([])
  const [splitInput, setSplitInput] = useState('')
  const [splitMode, setSplitMode] = useState(false)

  // Build per-order payment plan
  const paymentPlan = useMemo(() =>
    orders.map(order => {
      const selectedItems = order.items
        .map(item => ({ item, selectedQty: selectedQtys.get(item.id) ?? 0 }))
        .filter(({ selectedQty }) => selectedQty > 0)

      const paidTotal = selectedItems.reduce((s, { item, selectedQty }) =>
        s + itemTotal(item, selectedQty), 0)

      const remainingItems = order.items.flatMap(item => {
        const selectedQty = selectedQtys.get(item.id) ?? 0
        const leftQty = item.quantity - selectedQty
        if (leftQty <= 0) return []
        return [{
          menuItemId: item.menuItemId,
          quantity: leftQty,
          notes: item.notes,
          selectedExtraOptionIds: item.selectedExtraOptions?.map(option => option.extraOptionId),
        }]
      })

      const isFullOrder = remainingItems.length === 0

      return { order, selectedItems, paidTotal, remainingItems, isFullOrder }
    }).filter(p => p.selectedItems.length > 0),
    [orders, selectedQtys]
  )

  const grandTotal = paymentPlan.reduce((s, p) => s + p.paidTotal, 0)
  const paidSoFar = splitPayments.reduce((s, p) => s + p.amount, 0)
  const remaining = Math.max(0, grandTotal - paidSoFar)

  function executePayment() {
    let completed = 0
    const total = paymentPlan.length

    paymentPlan.forEach(({ order, isFullOrder, remainingItems }) => {
      if (isFullOrder) {
        patchOrder(
          { id: order.id, fields: { status: 'PAID' } },
          {
            onSuccess: () => {
              completed++
              if (completed === total) {
                showToast(t('sale.cashier.paymentReceivedToast'))
                onSuccess()
              }
            },
            onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
          }
        )
      } else {
        updateOrder(
          { id: order.id, data: { items: remainingItems } },
          {
            onSuccess: () => {
              completed++
              if (completed === total) {
                showToast(t('sale.cashier.partialItemsUpdatedToast'))
                onSuccess()
              }
            },
            onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
          }
        )
      }
    })
  }

  function handleRecordSplit() {
    const amount = parseFloat(splitInput)
    if (isNaN(amount) || amount <= 0) return
    const newPayments = [...splitPayments, { id: Math.random().toString(36).slice(2), amount }]
    setSplitPayments(newPayments)
    setSplitInput('')
    if (newPayments.reduce((s, p) => s + p.amount, 0) >= grandTotal - 0.001) {
      executePayment()
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>Ödeme</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Selected items summary grouped by order */}
        {paymentPlan.map(({ order, selectedItems }, idx) => (
          <Box key={order.id} sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', letterSpacing: 1 }}>
              Sipariş {idx + 1}
              {!paymentPlan[idx].isFullOrder && (
                <Chip label="Kısmi" size="small" sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} />
              )}
            </Typography>
            {selectedItems.map(({ item, selectedQty }) => {
              const baseUnitPrice = getBaseUnitPrice(item.unitPrice, item.selectedExtraOptions)
              const lineTotal = itemTotal(item, selectedQty)
              const extras = item.selectedExtraOptions ?? []
              const isSimpleLine = selectedQty === 1 && extras.length === 0
              return (
              <Box
                key={item.id}
                sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid', borderColor: 'divider', gap: 1 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="body2">
                      {selectedQty}× {item.menuItemName ?? item.menuItemId}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: 'nowrap' }}>
                      {baseUnitPrice.toFixed(2)} ₺
                    </Typography>
                  </Box>
                  {extras.length > 0 && (
                    <Box sx={{ mt: 0.25, pl: 1.25 }}>
                      {extras.map(option => (
                        <Box key={option.extraOptionId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            + {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            {option.price.toFixed(2)} ₺
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {!isSimpleLine && (
                    <Box
                      sx={{
                        mt: 0.4,
                        pt: 0.4,
                        borderTop: '1px dashed',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Toplam
                      </Typography>
                      <Typography variant="body2" fontWeight={800}>
                        {lineTotal.toFixed(2)} ₺
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              )
            })}
          </Box>
        ))}

        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>Toplam</Typography>
          <Typography variant="h6" fontWeight={800} color="primary.main">
            {grandTotal.toFixed(2)} ₺
          </Typography>
        </Box>

        {/* Payment method */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
          <Button
            variant={paymentMethod === 'CASH' ? 'contained' : 'outlined'}
            color="success"
            startIcon={<LocalAtmIcon />}
            onClick={() => { setPaymentMethod('CASH'); setSplitMode(false) }}
            sx={{ flex: 1, fontWeight: 700, py: 1 }}
          >
            {t('sale.cashier.paymentMethodCash')}
          </Button>
          <Tooltip title={t('sale.cashier.paymentMethodCardSoon')} placement="top">
            <span style={{ flex: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CreditCardIcon />}
                disabled
                fullWidth
                sx={{ fontWeight: 700, py: 1 }}
              >
                {t('sale.cashier.paymentMethodCard')}
              </Button>
            </span>
          </Tooltip>
        </Box>

        {/* Split amount toggle */}
        <Button
          variant={splitMode ? 'contained' : 'outlined'}
          size="small"
          onClick={() => { setSplitMode(p => !p); setSplitPayments([]); setSplitInput('') }}
          sx={{ mb: 1.5, fontWeight: 600 }}
        >
          {t('sale.cashier.payModeAmount')}
        </Button>

        {/* Split mode panel */}
        {splitMode && (
          <Box sx={{ mb: 2 }}>
            {splitPayments.length > 0 && (
              <Box sx={{ mb: 1 }}>
                {splitPayments.map(entry => (
                  <Box key={entry.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.25 }}>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      + {entry.amount.toFixed(2)} ₺
                    </Typography>
                    <IconButton size="small" onClick={() => setSplitPayments(prev => prev.filter(p => p.id !== entry.id))} sx={{ p: 0.25 }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Divider sx={{ my: 0.75 }} />
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('sale.cashier.paidSoFar')}: <strong>{paidSoFar.toFixed(2)} ₺</strong>
              </Typography>
              <Typography variant="body2" color={remaining > 0 ? 'error.main' : 'success.main'} fontWeight={700}>
                {t('sale.cashier.remaining')}: {remaining.toFixed(2)} ₺
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                type="number"
                value={splitInput}
                onChange={e => setSplitInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRecordSplit() }}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ endAdornment: <InputAdornment position="end">₺</InputAdornment> }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleRecordSplit}
                disabled={!splitInput || isPending}
                sx={{ fontWeight: 700, minWidth: 80 }}
              >
                {t('sale.cashier.recordPayment')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Pay button */}
      <Paper elevation={4} sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: 'background.paper', flexShrink: 0 }}>
        {(!splitMode || remaining <= 0.001) && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            startIcon={isPending ? undefined : <PaymentIcon />}
            onClick={executePayment}
            disabled={isPending || (splitMode && remaining > 0.001)}
            sx={{ fontWeight: 700, py: 1.5, borderRadius: 2, fontSize: '1rem' }}
          >
            {isPending
              ? <CircularProgress size={22} color="inherit" />
              : splitMode
                ? t('sale.cashier.completePayment')
                : `${t('sale.cashier.payBtn')} ${grandTotal.toFixed(2)} ₺`}
          </Button>
        )}
      </Paper>
    </Box>
  )
}

// ─── TableOrderDetails ────────────────────────────────────────────────────────

function TableOrderDetails({ table }: { table: ShopTableResponseDto }) {
  const { t } = useI18n()

  const [stage, setStage] = useState<Stage>('SELECT')
  const [selectedQtys, setSelectedQtys] = useState<SelectedQtys>(new Map())

  const { data: ordersData, isLoading } = useTableOrders(
    {
      filter: {
        shopId: table.shopId,
        'shop.id': table.shopId,
        'shopTable.id': table.id,
        status: 'OPEN',
      },
      pagination: { page: 1, perPage: 20 },
    },
    { refetchInterval: POLL_INTERVAL, refetchOnWindowFocus: true }
  )

  const orders: TableOrderResponseDto[] = ordersData?.data ?? []

  function handleQtyChange(itemId: string, qty: number) {
    setSelectedQtys(prev => {
      const next = new Map(prev)
      if (qty === 0) next.delete(itemId)
      else next.set(itemId, qty)
      return next
    })
  }

  function handleSelectAll() {
    const next = new Map<string, number>()
    orders.forEach(order => order.items.forEach(item => next.set(item.id, item.quantity)))
    setSelectedQtys(next)
  }

  function handleClearAll() {
    setSelectedQtys(new Map())
  }

  function handleProceed() {
    setStage('PAYMENT')
  }

  function handleBack() {
    setStage('SELECT')
  }

  function handlePaymentSuccess() {
    setStage('SELECT')
    setSelectedQtys(new Map())
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 1.5, color: 'text.secondary' }}>
        <CheckCircleIcon sx={{ fontSize: 52, color: 'success.light' }} />
        <Typography variant="body1" fontWeight={600}>{t('sale.cashier.noOpenOrders')}</Typography>
        <Typography variant="body2">{t('sale.cashier.noOpenOrdersHint')}</Typography>
      </Box>
    )
  }

  if (stage === 'PAYMENT') {
    return (
      <PaymentStage
        orders={orders}
        selectedQtys={selectedQtys}
        onBack={handleBack}
        onSuccess={handlePaymentSuccess}
      />
    )
  }

  return (
    <SelectionStage
      orders={orders}
      selectedQtys={selectedQtys}
      onQtyChange={handleQtyChange}
      onSelectAll={handleSelectAll}
      onClearAll={handleClearAll}
      onProceed={handleProceed}
    />
  )
}

// ─── CashierPaymentView ───────────────────────────────────────────────────────

export function CashierPaymentView() {
  const { t } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const [selectedTable, setSelectedTable] = useState<ShopTableResponseDto | null>(null)

  const { data: tablesData, isLoading } = useShopTables(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { shopId: selectedShopId, 'shop.id': selectedShopId } } : {}),
    },
    { refetchInterval: POLL_INTERVAL, refetchOnWindowFocus: true }
  )

  const STATUS_CONFIG = useStatusConfig(t)
  const tables = tablesData?.data ?? []
  const activeTables = tables.filter(tbl => tbl.status === 'OCCUPIED' || tbl.status === 'RESERVED')

  function isSelectable(status: ShopTableStatus) {
    return status === 'OCCUPIED' || status === 'RESERVED'
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* Left: All tables */}
      <Box
        sx={{
          width: { xs: 200, md: 240 },
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ px: 2, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="overline" sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: 1.2, color: 'text.secondary' }}>
            {t('sale.cashier.tablesHeader')}
          </Typography>
          <Typography variant="h6" fontWeight={700} lineHeight={1.1}>
            {isLoading ? '—' : t('sale.cashier.activeTables').replace('{n}', String(activeTables.length))}
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, flex: 1 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : tables.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 6, gap: 1.5, color: 'text.secondary' }}>
              <TableRestaurantIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body2" textAlign="center">{t('sale.cashier.noActiveTables')}</Typography>
            </Box>
          ) : (
            tables.map(table => {
              const cfg = STATUS_CONFIG[table.status]
              const selectable = isSelectable(table.status)
              const isSelected = selectedTable?.id === table.id
              return (
                <Card
                  key={table.id}
                  elevation={0}
                  sx={{
                    mb: 1,
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : cfg.border,
                    bgcolor: isSelected ? 'rgba(15,118,110,0.08)' : cfg.bg,
                    borderRadius: 2.5,
                    transition: 'all 0.12s',
                    opacity: selectable ? 1 : 0.45,
                    '&:hover': selectable ? { boxShadow: 3 } : {},
                  }}
                >
                  <CardActionArea
                    onClick={() => selectable && setSelectedTable(table)}
                    disabled={!selectable}
                    sx={{ p: 1.5, cursor: selectable ? 'pointer' : 'default' }}
                  >
                    <Typography variant="body1" fontWeight={700} lineHeight={1.2}>
                      {table.name}
                    </Typography>
                    <Chip
                      label={cfg.label}
                      color={isSelected ? 'primary' : cfg.chip}
                      size="small"
                      sx={{ mt: 0.75, height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                    />
                  </CardActionArea>
                </Card>
              )
            })
          )}
        </Box>
      </Box>

      {/* Right: Order details */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 3, bgcolor: 'grey.50' }}>
        {!selectedTable ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, color: 'text.secondary' }}>
            <ReceiptLongIcon sx={{ fontSize: 72, opacity: 0.25 }} />
            <Typography variant="h6">{t('sale.cashier.selectTable')}</Typography>
            <Typography variant="body2">{t('sale.cashier.selectTableHint')}</Typography>
          </Box>
        ) : (
          <Box sx={{ maxWidth: 560, mx: 'auto', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexShrink: 0 }}>
              <Typography variant="h5" fontWeight={800}>{selectedTable.name}</Typography>
              <Chip
                label={STATUS_CONFIG[selectedTable.status]?.label ?? selectedTable.status}
                color={STATUS_CONFIG[selectedTable.status]?.chip ?? 'default'}
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <TableOrderDetails table={selectedTable} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
