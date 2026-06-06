'use client'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import PaymentIcon from '@mui/icons-material/Payment'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useShopTables } from '../../hooks/use-shop-tables'
import {
  usePatchTableOrder,
  useTableOrders,
  useUpdateTableOrder,
} from '../../hooks/use-table-orders'
import {
  shopParents,
  shopTableParents,
  targetWithParents,
} from '../../permissions/permission-targets'
import type {
  ShopTableResponseDto,
  ShopTableStatus,
  TableOrderItemDto,
  TableOrderPaymentCreateDto,
  TableOrderResponseDto,
} from '../../types/sale'
import { getBaseUnitPrice } from '../sale/shared/order-pricing'

const POLL_INTERVAL = 8000

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = TableOrderPaymentCreateDto['method']
type Stage = 'SELECT' | 'PAYMENT'

// itemId → how many units selected for payment
type SelectedQtys = Map<string, number>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useStatusConfig(t: (k: string) => string) {
  return {
    AVAILABLE: {
      label: t('pos.statusAvailable'),
      bg: 'rgba(22,163,74,0.07)',
      border: '#16a34a',
      chip: 'success' as const,
    },
    OCCUPIED: {
      label: t('pos.statusOccupied'),
      bg: 'rgba(220,38,38,0.07)',
      border: '#dc2626',
      chip: 'error' as const,
    },
    RESERVED: {
      label: t('pos.statusReserved'),
      bg: 'rgba(217,119,6,0.07)',
      border: '#d97706',
      chip: 'warning' as const,
    },
    OUT_OF_ORDER: {
      label: t('pos.statusOutOfOrder'),
      bg: 'rgba(107,114,128,0.07)',
      border: '#9ca3af',
      chip: 'default' as const,
    },
  } satisfies Record<
    ShopTableStatus,
    { label: string; bg: string; border: string; chip: 'success' | 'error' | 'warning' | 'default' }
  >
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
        sx={{
          minWidth: 32,
          textAlign: 'center',
          color: value > 0 ? 'primary.main' : 'text.disabled',
        }}
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
  canProceed,
}: {
  orders: TableOrderResponseDto[]
  selectedQtys: SelectedQtys
  onQtyChange: (itemId: string, qty: number) => void
  onSelectAll: () => void
  onClearAll: () => void
  onProceed: () => void
  canProceed: boolean
}) {
  const { t } = useI18n()

  const allItems = useMemo(() => orders.flatMap((o) => o.items), [orders])

  const selectedTotal = useMemo(
    () =>
      allItems.reduce((s, item) => {
        const qty = selectedQtys.get(item.id) ?? 0
        return s + itemTotal(item, qty)
      }, 0),
    [allItems, selectedQtys],
  )

  const totalSelectedQty = useMemo(
    () => Array.from(selectedQtys.values()).reduce((s, q) => s + q, 0),
    [selectedQtys],
  )

  const isAllSelected = useMemo(
    () => allItems.every((item) => (selectedQtys.get(item.id) ?? 0) === item.quantity),
    [allItems, selectedQtys],
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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic', display: 'block', mb: 1 }}
                  >
                    {order.note}
                  </Typography>
                )}
                {order.items.map((item) => {
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
                        onChange={(qty) => onQtyChange(item.id, qty)}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight={500}>
                            {item.quantity}× {item.menuItemName ?? item.menuItemId}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {baseUnitPrice.toFixed(2)} ₺
                          </Typography>
                        </Box>
                        {extras.length > 0 && (
                          <Box sx={{ mt: 0.25, pl: 1.25 }}>
                            {extras.map((option) => (
                              <Box
                                key={option.extraOptionId}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'baseline',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  + {option.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ whiteSpace: 'nowrap' }}
                                >
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
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                          >
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
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
        >
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
          disabled={totalSelectedQty === 0 || !canProceed}
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
  canUpdateOrder,
  onBack,
  onSuccess,
}: {
  orders: TableOrderResponseDto[]
  selectedQtys: SelectedQtys
  canUpdateOrder: (order: TableOrderResponseDto) => boolean
  onBack: () => void
  onSuccess: () => void
}) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { mutate: patchOrder, isPending: isPatchPending } = usePatchTableOrder()
  const { mutate: updateOrder, isPending: isUpdatePending } = useUpdateTableOrder()
  const isPending = isPatchPending || isUpdatePending

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [splitInput, setSplitInput] = useState('')
  const [splitMode, setSplitMode] = useState(false)

  // Build per-order payment plan
  const paymentPlan = useMemo(
    () =>
      orders
        .map((order) => {
          const selectedItems = order.items
            .map((item) => ({ item, selectedQty: selectedQtys.get(item.id) ?? 0 }))
            .filter(({ selectedQty }) => selectedQty > 0)

          const paidTotal = selectedItems.reduce(
            (s, { item, selectedQty }) => s + itemTotal(item, selectedQty),
            0,
          )

          const remainingItems = order.items.flatMap((item) => {
            const selectedQty = selectedQtys.get(item.id) ?? 0
            const leftQty = item.quantity - selectedQty
            if (leftQty <= 0) return []
            return [
              {
                menuItemId: item.menuItemId,
                quantity: leftQty,
                notes: item.notes,
                selectedExtraOptionIds: item.selectedExtraOptions?.map(
                  (option) => option.extraOptionId,
                ),
              },
            ]
          })

          const isFullOrder = remainingItems.length === 0

          return { order, selectedItems, paidTotal, remainingItems, isFullOrder }
        })
        .filter((p) => p.selectedItems.length > 0),
    [orders, selectedQtys],
  )

  const grandTotal = paymentPlan.reduce((s, p) => s + p.paidTotal, 0)
  const paidSoFar = paymentPlan.reduce(
    (sum, { order, paidTotal }) => sum + Math.min(paidTotal, amountOnlyPaidForOrder(order)),
    0,
  )
  const remaining = Math.max(0, grandTotal - paidSoFar)
  const splitInputAmount = Number.parseFloat(splitInput)
  const payableSplitAmount =
    Number.isFinite(splitInputAmount) && splitInputAmount > 0
      ? Math.min(splitInputAmount, remaining)
      : 0
  const hasOpenAmountSplit = paidSoFar > 0.001 && remaining > 0.001
  const effectiveSplitMode = splitMode || hasOpenAmountSplit
  const canPay = paymentPlan.every(({ order }) => canUpdateOrder(order))

  function selectedPaymentItems(selectedItems: { item: TableOrderItemDto; selectedQty: number }[]) {
    return selectedItems.map(({ item, selectedQty }) => ({
      tableOrderItemId: item.id,
      quantity: selectedQty,
    }))
  }

  function amountOnlyPaidForOrder(order: TableOrderResponseDto) {
    const payments = [...(order.payments ?? [])].sort((a, b) => {
      const aTime = a.paidAt ? Date.parse(a.paidAt) : 0
      const bTime = b.paidAt ? Date.parse(b.paidAt) : 0
      return aTime - bTime
    })

    return payments.reduce((sum, payment) => {
      const paymentItems = payment.items ?? []
      if (paymentItems.length > 0) return 0
      return sum + payment.amount
    }, 0)
  }

  function buildFullPaymentsByOrder() {
    const paymentsByOrder = new Map<string, TableOrderPaymentCreateDto[]>()

    paymentPlan.forEach(({ order, selectedItems, paidTotal }) => {
      paymentsByOrder.set(order.id, [
        {
          method: paymentMethod,
          amount: paidTotal,
          items: selectedPaymentItems(selectedItems),
        },
      ])
    })

    return paymentsByOrder
  }

  function buildSplitPaymentsByOrder(amount: number, attachItems: boolean) {
    const paymentsByOrder = new Map<string, TableOrderPaymentCreateDto[]>()

    const outstandingPlans = paymentPlan
      .map((plan) => ({
        ...plan,
        orderRemaining: Math.max(0, plan.paidTotal - amountOnlyPaidForOrder(plan.order)),
      }))
      .filter(({ orderRemaining }) => orderRemaining > 0.001)
    const totalOutstanding = outstandingPlans.reduce((sum, plan) => sum + plan.orderRemaining, 0)
    let amountRemainder = Math.min(amount, totalOutstanding)

    outstandingPlans.forEach(({ order, selectedItems, orderRemaining }, index) => {
      if (amountRemainder <= 0.001) return

      const isLastPlan = index === outstandingPlans.length - 1
      const proportionalAmount =
        totalOutstanding > 0 ? (amount * orderRemaining) / totalOutstanding : 0
      const amountForOrder = attachItems
        ? orderRemaining
        : Math.min(orderRemaining, isLastPlan ? amountRemainder : proportionalAmount)
      if (amountForOrder <= 0.001) return

      paymentsByOrder.set(order.id, [
        {
          method: paymentMethod,
          amount: amountForOrder,
          items: attachItems ? selectedPaymentItems(selectedItems) : [],
        },
      ])
      amountRemainder -= amountForOrder
    })

    return paymentsByOrder
  }

  function executeClosingPayment(paymentsByOrder: Map<string, TableOrderPaymentCreateDto[]>) {
    let completed = 0
    const total = paymentPlan.length

    paymentPlan.forEach(({ order, isFullOrder, remainingItems }) => {
      const payments = paymentsByOrder.get(order.id) ?? []
      if (isFullOrder) {
        patchOrder(
          { id: order.id, fields: { status: 'PAID', payments } },
          {
            onSuccess: () => {
              completed++
              if (completed === total) {
                showToast(t('sale.cashier.paymentReceivedToast'))
                onSuccess()
              }
            },
            onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
          },
        )
      } else {
        updateOrder(
          { id: order.id, data: { items: remainingItems, payments } },
          {
            onSuccess: () => {
              completed++
              if (completed === total) {
                showToast(t('sale.cashier.partialItemsUpdatedToast'))
                onSuccess()
              }
            },
            onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
          },
        )
      }
    })
  }

  function executeOpenSplitPayment(paymentsByOrder: Map<string, TableOrderPaymentCreateDto[]>) {
    const entries = Array.from(paymentsByOrder.entries())
    let completed = 0

    entries.forEach(([orderId, payments]) => {
      patchOrder(
        { id: orderId, fields: { payments } },
        {
          onSuccess: () => {
            completed++
            if (completed === entries.length) {
              setSplitInput('')
              showToast(t('sale.cashier.paymentReceivedToast'))
            }
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    })
  }

  function executePayment() {
    if (!canPay) return
    executeClosingPayment(buildFullPaymentsByOrder())
  }

  function handlePaySplitAmount() {
    if (!canPay) return
    if (payableSplitAmount <= 0.001 || remaining <= 0.001) return

    const isFinalSplitPayment = payableSplitAmount >= remaining - 0.001
    const paymentsByOrder = buildSplitPaymentsByOrder(payableSplitAmount, isFinalSplitPayment)
    if (paymentsByOrder.size === 0) return

    if (isFinalSplitPayment) {
      executeClosingPayment(paymentsByOrder)
      return
    }

    executeOpenSplitPayment(paymentsByOrder)
  }

  function handleFillRemainingAmount() {
    if (remaining <= 0.001) return
    setSplitInput(remaining.toFixed(2))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          Ödeme
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Selected items summary grouped by order */}
        {paymentPlan.map(({ order, selectedItems }, idx) => (
          <Box key={order.id} sx={{ mb: 2 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontSize: '0.65rem', letterSpacing: 1 }}
            >
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
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 0.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {selectedQty}× {item.menuItemName ?? item.menuItemId}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: 'nowrap' }}>
                        {baseUnitPrice.toFixed(2)} ₺
                      </Typography>
                    </Box>
                    {extras.length > 0 && (
                      <Box sx={{ mt: 0.25, pl: 1.25 }}>
                        {extras.map((option) => (
                          <Box
                            key={option.extraOptionId}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              gap: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              + {option.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ whiteSpace: 'nowrap' }}
                            >
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
          <Typography variant="subtitle1" fontWeight={700}>
            Toplam
          </Typography>
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
            onClick={() => {
              setPaymentMethod('CASH')
              if (!hasOpenAmountSplit) setSplitMode(false)
            }}
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
          variant={effectiveSplitMode ? 'contained' : 'outlined'}
          size="small"
          onClick={() => {
            if (hasOpenAmountSplit) {
              setSplitMode(true)
              return
            }
            setSplitMode((p) => !p)
            setSplitInput('')
          }}
          sx={{ mb: 1.5, fontWeight: 600 }}
        >
          {t('sale.cashier.payModeAmount')}
        </Button>

        {/* Split mode panel */}
        {effectiveSplitMode && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('sale.cashier.paidSoFar')}: <strong>{paidSoFar.toFixed(2)} ₺</strong>
              </Typography>
              <Typography
                variant="body2"
                color={remaining > 0 ? 'error.main' : 'success.main'}
                fontWeight={700}
              >
                {t('sale.cashier.remaining')}: {remaining.toFixed(2)} ₺
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                type="number"
                value={splitInput}
                onChange={(e) => setSplitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePaySplitAmount()
                }}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ endAdornment: <InputAdornment position="end">₺</InputAdornment> }}
                sx={{ flex: '1 1 160px' }}
              />
              <Button
                variant="outlined"
                onClick={handleFillRemainingAmount}
                disabled={remaining <= 0.001 || isPending}
                sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                {t('sale.cashier.fillRemainingAmount')}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handlePaySplitAmount}
                disabled={payableSplitAmount <= 0.001 || isPending || !canPay}
                sx={{ fontWeight: 700, minWidth: 120 }}
              >
                {payableSplitAmount > 0.001
                  ? `${t('sale.cashier.payBtn')} ${payableSplitAmount.toFixed(2)} ₺`
                  : t('sale.cashier.payBtn')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Pay button */}
      <Paper
        elevation={4}
        sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: 'background.paper', flexShrink: 0 }}
      >
        {!effectiveSplitMode && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            startIcon={isPending ? undefined : <PaymentIcon />}
            onClick={() => executePayment()}
            disabled={isPending || !canPay}
            sx={{ fontWeight: 700, py: 1.5, borderRadius: 2, fontSize: '1rem' }}
          >
            {isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              `${t('sale.cashier.payBtn')} ${grandTotal.toFixed(2)} ₺`
            )}
          </Button>
        )}
      </Paper>
    </Box>
  )
}

// ─── TableOrderDetails ────────────────────────────────────────────────────────

function TableOrderDetails({ table }: { table: ShopTableResponseDto }) {
  const { t } = useI18n()
  const { currentTenantId, hasPermissionForTarget } = useCurrentUserPermissions()

  const [stage, setStage] = useState<Stage>('SELECT')
  const [selectedQtys, setSelectedQtys] = useState<SelectedQtys>(new Map())
  const canReadOrders = hasPermissionForTarget(
    PermissionActions.READ_TABLE_ORDER,
    targetWithParents(
      'SHOP_TABLE',
      table.id,
      currentTenantId,
      shopParents(table.shopId, currentTenantId),
    ),
  )

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
    {
      enabled: canReadOrders,
      refetchInterval: POLL_INTERVAL,
      refetchOnWindowFocus: true,
    },
  )

  const orders: TableOrderResponseDto[] = ordersData?.data ?? []

  function handleQtyChange(itemId: string, qty: number) {
    setSelectedQtys((prev) => {
      const next = new Map(prev)
      if (qty === 0) next.delete(itemId)
      else next.set(itemId, qty)
      return next
    })
  }

  function handleSelectAll() {
    const next = new Map<string, number>()
    orders.forEach((order) => order.items.forEach((item) => next.set(item.id, item.quantity)))
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

  function canUpdateOrder(order: TableOrderResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.UPDATE_TABLE_ORDER,
      targetWithParents(
        'TABLE_ORDER',
        order.id,
        currentTenantId,
        shopTableParents(order.shopTableId, order.shopId, currentTenantId),
      ),
    )
  }

  const canProceedToPayment = orders
    .filter((order) => order.items.some((item) => (selectedQtys.get(item.id) ?? 0) > 0))
    .every(canUpdateOrder)

  if (!canReadOrders) {
    return <Alert severity="warning">{t('common.unauthorized')}</Alert>
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          gap: 1.5,
          color: 'text.secondary',
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 52, color: 'success.light' }} />
        <Typography variant="body1" fontWeight={600}>
          {t('sale.cashier.noOpenOrders')}
        </Typography>
        <Typography variant="body2">{t('sale.cashier.noOpenOrdersHint')}</Typography>
      </Box>
    )
  }

  if (stage === 'PAYMENT') {
    return (
      <PaymentStage
        orders={orders}
        selectedQtys={selectedQtys}
        canUpdateOrder={canUpdateOrder}
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
      canProceed={canProceedToPayment}
    />
  )
}

// ─── CashierPaymentView ───────────────────────────────────────────────────────

export function CashierPaymentView() {
  const { t } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { currentTenantId, hasAnyPermission, hasShopPermission, hasPermissionForTarget } =
    useCurrentUserPermissions()
  const [selectedTable, setSelectedTable] = useState<ShopTableResponseDto | null>(null)
  const canReadTables = Boolean(
    selectedShopId &&
    (hasShopPermission(PermissionActions.READ_SHOP_TABLE, selectedShopId) ||
      hasAnyPermission([PermissionActions.READ_SHOP_TABLE])),
  )

  const { data: tablesData, isLoading } = useShopTables(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { shopId: selectedShopId, 'shop.id': selectedShopId } } : {}),
    },
    {
      enabled: canReadTables,
      refetchInterval: POLL_INTERVAL,
      refetchOnWindowFocus: true,
    },
  )

  const STATUS_CONFIG = useStatusConfig(t)
  const tables = tablesData?.data ?? []
  const activeTables = tables.filter(
    (tbl) => tbl.status === 'OCCUPIED' || tbl.status === 'RESERVED',
  )

  function isSelectable(status: ShopTableStatus) {
    return status === 'OCCUPIED' || status === 'RESERVED'
  }

  function canReadTableOrders(table: ShopTableResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.READ_TABLE_ORDER,
      targetWithParents(
        'SHOP_TABLE',
        table.id,
        currentTenantId,
        shopParents(table.shopId, currentTenantId),
      ),
    )
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
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: 1.2,
              color: 'text.secondary',
            }}
          >
            {t('sale.cashier.tablesHeader')}
          </Typography>
          <Typography variant="h6" fontWeight={700} lineHeight={1.1}>
            {isLoading
              ? '—'
              : t('sale.cashier.activeTables').replace('{n}', String(activeTables.length))}
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, flex: 1 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : !canReadTables ? (
            <Alert severity="warning">{t('common.unauthorized')}</Alert>
          ) : tables.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 6,
                gap: 1.5,
                color: 'text.secondary',
              }}
            >
              <TableRestaurantIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body2" textAlign="center">
                {t('sale.cashier.noActiveTables')}
              </Typography>
            </Box>
          ) : (
            tables.map((table) => {
              const cfg = STATUS_CONFIG[table.status]
              const selectable = isSelectable(table.status) && canReadTableOrders(table)
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
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          bgcolor: 'background.default',
        }}
      >
        {!selectedTable ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 2,
              color: 'text.secondary',
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 72, opacity: 0.25 }} />
            <Typography variant="h6">{t('sale.cashier.selectTable')}</Typography>
            <Typography variant="body2">{t('sale.cashier.selectTableHint')}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxWidth: 560,
              mx: 'auto',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexShrink: 0 }}>
              <Typography variant="h5" fontWeight={800}>
                {selectedTable.name}
              </Typography>
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
