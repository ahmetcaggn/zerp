'use client'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopTables } from '../../../hooks/use-shop-tables'
import { useTableOrders } from '../../../hooks/use-table-orders'
import type { ShopTableResponseDto, TableOrderResponseDto } from '../../../types/sale'

function TableOrderSummary({ table }: { table: ShopTableResponseDto }) {
  const { t } = useI18n()

  const { data: ordersData, isLoading } = useTableOrders({
    filter: { 'shopTable.id': table.id, status: 'OPEN' },
    pagination: { page: 1, perPage: 50 },
  })

  const orders: TableOrderResponseDto[] = ordersData?.data ?? []
  const allItems = orders.flatMap((o) => o.items)
  const subtotal = allItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const total = subtotal

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (orders.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('sale.tableOrder.emptyState')}
      </Typography>
    )
  }

  return (
    <>
      {orders.map((order) => (
        <Box key={order.id} sx={{ mb: 3 }}>
          {order.note && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {order.note}
            </Typography>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('sale.tableOrder.form.menuItem')}</TableCell>
                <TableCell align="center">{t('sale.tableOrder.form.quantity')}</TableCell>
                <TableCell align="right">{t('sale.cashier.unitPrice')}</TableCell>
                <TableCell align="right">{t('sale.cashier.lineTotal')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.menuItemName ?? item.menuItemId}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{item.unitPrice.toFixed(2)} ₺</TableCell>
                  <TableCell align="right">{(item.unitPrice * item.quantity).toFixed(2)} ₺</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ maxWidth: 320, ml: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {t('sale.cashier.subtotal')}
          </Typography>
          <Typography variant="body2">{subtotal.toFixed(2)} ₺</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('sale.cashier.total')}
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="primary">
            {total.toFixed(2)} ₺
          </Typography>
        </Box>
      </Box>
    </>
  )
}

function getStatusColor(status: string): 'default' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'AVAILABLE':
      return 'success'
    case 'OCCUPIED':
      return 'error'
    case 'RESERVED':
      return 'warning'
    default:
      return 'default'
  }
}

export function CashierView() {
  const { t } = useI18n()
  const [selectedTable, setSelectedTable] = useState<ShopTableResponseDto | null>(null)

  const { data: tablesData, isLoading: isTablesLoading } = useShopTables({
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
  })

  const tables = tablesData?.data ?? []

  return (
    <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 260px)', minHeight: 500 }}>
      {/* Table list panel */}
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
          overflowY: 'auto',
          borderRight: 1,
          borderColor: 'divider',
          pr: 2,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
          {t('sale.cashier.tables')}
        </Typography>
        {isTablesLoading ? (
          <CircularProgress size={20} />
        ) : tables.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('sale.table.emptyState')}
          </Typography>
        ) : (
          tables.map((table) => (
            <Card
              key={table.id}
              variant="outlined"
              sx={{
                mb: 1,
                borderColor: selectedTable?.id === table.id ? 'primary.main' : 'divider',
                bgcolor: selectedTable?.id === table.id ? 'action.selected' : 'background.paper',
              }}
            >
              <CardActionArea onClick={() => setSelectedTable(table)}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="body2" fontWeight={600}>
                    {table.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={t(`sale.table.status.${table.status}`)}
                      color={getStatusColor(table.status)}
                      size="small"
                      sx={{ height: 18, fontSize: '0.65rem' }}
                    />
                    {table.floor > 0 && (
                      <Chip
                        label={`${table.floor}. Kat`}
                        size="small"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        )}
      </Box>

      {/* Order details panel */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {!selectedTable ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              {t('sale.cashier.selectTable')}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {selectedTable.name}
              </Typography>
              <Chip
                label={t(`sale.table.status.${selectedTable.status}`)}
                color={getStatusColor(selectedTable.status)}
                size="small"
              />
            </Box>
            <TableOrderSummary table={selectedTable} />
          </>
        )}
      </Box>
    </Box>
  )
}
