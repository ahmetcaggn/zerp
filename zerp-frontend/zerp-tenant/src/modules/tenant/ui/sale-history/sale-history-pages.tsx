'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { formatCurrency } from '@/core/utils/currency-formatter'

import { useShopTables } from '../../hooks/use-shop-tables'
import { useTableOrder, useTableOrders } from '../../hooks/use-table-orders'
import type {
  TableOrderItemDto,
  TableOrderPaymentDto,
  TableOrderPaymentItemDto,
  TableOrderPaymentMethod,
  TableOrderResponseDto,
  TableOrderStatus,
} from '../../types/sale'

function orderTotal(order: TableOrderResponseDto): number {
  return order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

function paymentItemsTotal(items: TableOrderPaymentItemDto[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

function saleTotal(order: TableOrderResponseDto): number {
  const paidItems = (order.payments ?? []).flatMap((payment) => payment.items ?? [])
  const currentOrderTotal = orderTotal(order)
  if (paidItems.length === 0) {
    return currentOrderTotal
  }
  if (order.status === 'PAID') {
    return paymentItemsTotal(paidItems)
  }
  return paymentItemsTotal(paidItems) + currentOrderTotal
}

function paymentTotal(payments?: TableOrderPaymentDto[]): number {
  return (payments ?? []).reduce((sum, payment) => sum + payment.amount, 0)
}

function itemCount(items: TableOrderItemDto[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

function paymentMethodLabel(method: TableOrderPaymentMethod, t: (key: string) => string): string {
  return method === 'CASH' ? t('sale.saleHistory.cash') : method
}

function paymentMethodsLabel(
  payments: TableOrderPaymentDto[] | undefined,
  t: (key: string) => string,
): string {
  const methods = Array.from(new Set((payments ?? []).map((payment) => payment.method)))
  if (methods.length === 0) return t('sale.saleHistory.noPaymentRecords')
  return methods.map((method) => paymentMethodLabel(method, t)).join(', ')
}

function formatDateTime(value: string | undefined, locale: string): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function statusColor(status: TableOrderResponseDto['status']) {
  if (status === 'PAID') return 'success'
  if (status === 'CANCELLED') return 'default'
  return 'warning'
}

function ScopeOrPermissionMessage() {
  const { t } = useI18n()
  return (
    <Box sx={{ p: 4 }}>
      <Typography color="text.secondary">{t('common.unauthorized')}</Typography>
    </Box>
  )
}

export function SaleHistoryListPage() {
  const { scope } = useShopScope()
  const { hasPermission } = useCurrentUserPermissions()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const canReadSaleHistory = hasPermission(PermissionActions.READ_SALE_HISTORY)

  if (!selectedShopId || !canReadSaleHistory) {
    return <ScopeOrPermissionMessage />
  }

  return <SaleHistoryListContent key={selectedShopId} selectedShopId={selectedShopId} />
}

function SaleHistoryListContent({ selectedShopId }: { selectedShopId: string }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [draftTableId, setDraftTableId] = useState('')
  const [draftStatus, setDraftStatus] = useState<TableOrderStatus | ''>('')
  const [draftDateFrom, setDraftDateFrom] = useState('')
  const [draftDateTo, setDraftDateTo] = useState('')
  const [appliedTableId, setAppliedTableId] = useState('')
  const [appliedStatus, setAppliedStatus] = useState<TableOrderStatus | ''>('')
  const [appliedDateFrom, setAppliedDateFrom] = useState('')
  const [appliedDateTo, setAppliedDateTo] = useState('')
  const { data: shopTablesData, isLoading: isShopTablesLoading } = useShopTables(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'name', order: 'ASC' },
      filter: { shopId: selectedShopId, 'shop.id': selectedShopId },
    },
    {
      enabled: true,
    },
  )
  const filters = useMemo(() => {
    const nextFilters: Record<string, string> = selectedShopId ? { 'shop.id': selectedShopId } : {}

    if (appliedTableId) {
      nextFilters['shopTable.id'] = appliedTableId
    }
    if (appliedStatus) {
      nextFilters.status = appliedStatus
    }
    if (appliedDateFrom) {
      nextFilters['createdAt.gte'] = `${appliedDateFrom}T00:00:00`
    }
    if (appliedDateTo) {
      nextFilters['createdAt.lte'] = `${appliedDateTo}T23:59:59.999999999`
    }

    return nextFilters
  }, [appliedDateFrom, appliedDateTo, appliedStatus, appliedTableId, selectedShopId])

  const { data, isLoading } = useTableOrders(
    {
      pagination: { page: page + 1, perPage: rowsPerPage },
      sort: { field: 'createdAt', order: 'DESC' },
      filter: filters,
    },
    {
      enabled: true,
    },
  )

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function applyFilters() {
    setAppliedTableId(draftTableId)
    setAppliedStatus(draftStatus)
    setAppliedDateFrom(draftDateFrom)
    setAppliedDateTo(draftDateTo)
    setPage(0)
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  const orders = data?.data ?? []
  const shopTables = shopTablesData?.data ?? []

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t('sale.saleHistory.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('sale.saleHistory.subtitle')}
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <TextField
              select
              size="small"
              label={t('sale.saleHistory.filterTable')}
              value={draftTableId}
              onChange={(event) => {
                setDraftTableId(event.target.value)
              }}
              disabled={isShopTablesLoading}
              sx={{ minWidth: { xs: '100%', sm: 220 } }}
            >
              <MenuItem value="">{t('sale.saleHistory.allTables')}</MenuItem>
              {shopTables.map((table) => (
                <MenuItem key={table.id} value={table.id}>
                  {table.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label={t('sale.saleHistory.filterStatus')}
              value={draftStatus}
              onChange={(event) => {
                setDraftStatus(event.target.value as TableOrderStatus | '')
              }}
              sx={{ minWidth: { xs: '100%', sm: 180 } }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {(['OPEN', 'PAID', 'CANCELLED'] as const).map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`sale.tableOrder.status.${status}`)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              type="date"
              label={t('sale.saleHistory.filterDateFrom')}
              value={draftDateFrom}
              onChange={(event) => {
                setDraftDateFrom(event.target.value)
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: { xs: '100%', sm: 170 } }}
            />
            <TextField
              size="small"
              type="date"
              label={t('sale.saleHistory.filterDateTo')}
              value={draftDateTo}
              onChange={(event) => {
                setDraftDateTo(event.target.value)
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: { xs: '100%', sm: 170 } }}
            />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={applyFilters}>
              {t('sale.saleHistory.searchButton')}
            </Button>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('sale.saleHistory.table')}</TableCell>
                  <TableCell>{t('sale.saleHistory.status')}</TableCell>
                  <TableCell align="right">{t('sale.saleHistory.orderTotal')}</TableCell>
                  <TableCell align="right">{t('sale.saleHistory.paidTotal')}</TableCell>
                  <TableCell>{t('sale.saleHistory.paymentMethods')}</TableCell>
                  <TableCell align="right">{t('sale.saleHistory.itemCount')}</TableCell>
                  <TableCell>{t('sale.saleHistory.createdAt')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {t('sale.saleHistory.emptyState')}
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => goTo(`${ROUTES.saleHistory}/${order.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={600}>
                          {order.shopTableName ?? order.shopTableId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.shopName ?? order.shopId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={statusColor(order.status)}
                          label={t(`sale.tableOrder.status.${order.status}`)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(saleTotal(order), locale)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(paymentTotal(order.payments), locale)}
                      </TableCell>
                      <TableCell>{paymentMethodsLabel(order.payments, t)}</TableCell>
                      <TableCell align="right">{itemCount(order.items)}</TableCell>
                      <TableCell>{formatDateTime(order.createdAt, locale)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={data?.total ?? 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10))
              setPage(0)
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

function PaymentItemsTable({ items }: { items: TableOrderPaymentItemDto[] }) {
  const { t, locale } = useI18n()

  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('sale.saleHistory.noPaymentRecords')}
      </Typography>
    )
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('sale.tableOrder.form.menuItem')}</TableCell>
            <TableCell align="right">{t('sale.saleHistory.quantity')}</TableCell>
            <TableCell align="right">{t('sale.saleHistory.unitPrice')}</TableCell>
            <TableCell align="right">{t('sale.saleHistory.lineTotal')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Typography fontWeight={600}>{item.menuItemName ?? item.menuItemId}</Typography>
                {item.notes && (
                  <Typography variant="caption" color="text.secondary">
                    {t('sale.saleHistory.notes')}: {item.notes}
                  </Typography>
                )}
                {(item.selectedExtraOptions ?? []).map((option) => (
                  <Typography
                    key={option.extraOptionId}
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    + {option.name} ({formatCurrency(option.price, locale)})
                  </Typography>
                ))}
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{formatCurrency(item.unitPrice, locale)}</TableCell>
              <TableCell align="right">
                {formatCurrency(item.unitPrice * item.quantity, locale)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

function OrderItemsTable({ items }: { items: TableOrderItemDto[] }) {
  const { t, locale } = useI18n()

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('sale.tableOrder.form.menuItem')}</TableCell>
            <TableCell align="right">{t('sale.saleHistory.quantity')}</TableCell>
            <TableCell align="right">{t('sale.saleHistory.unitPrice')}</TableCell>
            <TableCell align="right">{t('sale.saleHistory.lineTotal')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Typography fontWeight={600}>{item.menuItemName ?? item.menuItemId}</Typography>
                {item.notes && (
                  <Typography variant="caption" color="text.secondary">
                    {t('sale.saleHistory.notes')}: {item.notes}
                  </Typography>
                )}
                {(item.selectedExtraOptions ?? []).map((option) => (
                  <Typography
                    key={option.extraOptionId}
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    + {option.name} ({formatCurrency(option.price, locale)})
                  </Typography>
                ))}
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{formatCurrency(item.unitPrice, locale)}</TableCell>
              <TableCell align="right">
                {formatCurrency(item.unitPrice * item.quantity, locale)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export function SaleHistoryDetailPage({ tableOrderId }: { tableOrderId: string }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { scope } = useShopScope()
  const { hasPermission } = useCurrentUserPermissions()
  const canReadSaleHistory = hasPermission(PermissionActions.READ_SALE_HISTORY)
  const { data: order, isLoading } = useTableOrder(
    scope.mode === 'SHOP' && canReadSaleHistory ? tableOrderId : undefined,
  )

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  if (scope.mode !== 'SHOP' || !canReadSaleHistory) {
    return <ScopeOrPermissionMessage />
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="text.secondary">{t('sale.saleHistory.emptyState')}</Typography>
      </Box>
    )
  }

  const payments = order.payments ?? []
  const paidItems = payments.flatMap((payment) => payment.items ?? [])
  const pendingItems = order.status === 'PAID' ? [] : order.items
  const totalPaidAmount = paymentTotal(payments)

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.saleHistory)}>
          {t('sale.saleHistory.backToHistory')}
        </Button>
        <Chip
          icon={<ReceiptLongIcon />}
          color={statusColor(order.status)}
          label={t(`sale.tableOrder.status.${order.status}`)}
        />
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t('sale.saleHistory.detailTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {order.shopTableName ?? order.shopTableId} · {order.shopName ?? order.shopId}
          </Typography>
          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('sale.saleHistory.orderTotal')}
              </Typography>
              <Typography fontWeight={800}>{formatCurrency(saleTotal(order), locale)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('sale.saleHistory.paidTotal')}
              </Typography>
              <Typography fontWeight={800}>{formatCurrency(totalPaidAmount, locale)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('sale.saleHistory.paymentMethods')}
              </Typography>
              <Typography fontWeight={700}>{paymentMethodsLabel(payments, t)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('sale.saleHistory.createdAt')}
              </Typography>
              <Typography fontWeight={700}>{formatDateTime(order.createdAt, locale)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {t('sale.saleHistory.payments')}
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('sale.saleHistory.paymentMethod')}</TableCell>
                  <TableCell align="right">{t('sale.saleHistory.paidTotal')}</TableCell>
                  <TableCell>{t('sale.saleHistory.paymentDate')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      {t('sale.saleHistory.noPaymentRecords')}
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{paymentMethodLabel(payment.method, t)}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.amount, locale)}</TableCell>
                      <TableCell>{formatDateTime(payment.paidAt, locale)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {payments.length > 0 && (
                <TableFooter>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        fontSize: '1rem',
                        py: 2,
                        borderTop: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {t('sale.cashier.total')}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 800,
                        fontSize: '1rem',
                        py: 2,
                        borderTop: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {formatCurrency(totalPaidAmount, locale)}
                    </TableCell>
                    <TableCell sx={{ borderTop: '2px solid', borderColor: 'divider' }} />
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </Box>
        </CardContent>
      </Card>

      {payments.length > 0 ? (
        <>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t('sale.saleHistory.paidItems')}
              </Typography>
              <PaymentItemsTable items={paidItems} />
            </CardContent>
          </Card>

          {pendingItems.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {t('sale.saleHistory.pendingItems')}
                </Typography>
                <OrderItemsTable items={pendingItems} />
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t('sale.saleHistory.orderItems')}
            </Typography>
            <OrderItemsTable items={order.items} />
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
