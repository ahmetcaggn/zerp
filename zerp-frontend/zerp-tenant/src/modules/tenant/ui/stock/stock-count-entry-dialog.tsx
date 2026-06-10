'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'

import { useUpdateStockCount } from '../../hooks/use-stock-counts'
import { shopParents, targetWithParents } from '../../permissions/permission-targets'
import type { StockCountResponseDto } from '../../types/stock'

interface StockCountEntryDialogProps {
  open: boolean
  count: StockCountResponseDto | null
  onClose: () => void
}

type FormItem = {
  stockCountItemId: string
  stockResourceName?: string
  unitTypeAbbreviation?: string
  previousQuantity: number
  expectedQuantity: number
  actualQuantityInput: string
  notes?: string
}

function parseDecimalInput(value: string): number {
  const normalized = value.replace(',', '.').trim()
  if (!normalized) return Number.NaN
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function roundDecimal(value: number, precision = 3): number {
  if (!Number.isFinite(value)) return 0
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function formatDecimal(value: number, precision = 3): string {
  const rounded = roundDecimal(value, precision)
  return rounded.toFixed(precision).replace(/\.?0+$/, '')
}

export function StockCountEntryDialog({ open, count, onClose }: StockCountEntryDialogProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { currentTenantId, hasPermissionForTarget } = useCurrentUserPermissions()
  const updateMutation = useUpdateStockCount()

  const [items, setItems] = useState<FormItem[]>([])

  useEffect(() => {
    if (!count) {
      setItems([])
      return
    }

    setItems(
      count.items.map((item) => ({
        stockCountItemId: item.id,
        stockResourceName: item.stockResourceName,
        unitTypeAbbreviation: item.unitTypeAbbreviation,
        previousQuantity: Number(item.previousQuantity ?? 0),
        expectedQuantity: Number(item.expectedQuantity ?? item.theoreticalQuantity ?? 0),
        actualQuantityInput: item.actualQuantity != null ? String(item.actualQuantity) : '',
        notes: item.notes ?? '',
      })),
    )
  }, [count])

  const setItem = (id: string, patch: Partial<FormItem>) => {
    setItems((prev) => prev.map((it) => (it.stockCountItemId === id ? { ...it, ...patch } : it)))
  }

  const handleSave = async () => {
    if (!count) return
    if (!canUpdateCount) {
      showToast(t('common.unauthorized'), { severity: 'warning' })
      return
    }
    const hasMissingActual = items.some(
      (it) => !Number.isFinite(parseDecimalInput(it.actualQuantityInput)),
    )
    if (hasMissingActual) {
      showToast(t('stock.count.validationFillAll'), { severity: 'warning' })
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: count.id,
        data: {
          status: 'READY_FOR_APPROVAL',
          items: items.map((it) => ({
            stockCountItemId: it.stockCountItemId,
            actualQuantity: roundDecimal(parseDecimalInput(it.actualQuantityInput), 3),
            notes: it.notes,
          })),
        },
      })
      showToast(t('stock.count.saveSuccess'), { severity: 'success' })
      onClose()
    } catch (err: any) {
      showToast(err?.message ?? t('stock.count.saveFailed'), { severity: 'error' })
    }
  }

  const isPending = updateMutation.isPending
  const canUpdateCount = Boolean(
    count &&
    hasPermissionForTarget(
      PermissionActions.UPDATE_STOCK_COUNT,
      targetWithParents(
        'STOCK_COUNT',
        count.id,
        currentTenantId,
        shopParents(count.shopId, currentTenantId),
      ),
    ),
  )

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {t('stock.count.createButton')} - {count?.countDate}
      </DialogTitle>
      <DialogContent dividers>
        {!canUpdateCount && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('common.unauthorized')}
          </Alert>
        )}
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('stock.resource.form.name')}</TableCell>
                <TableCell align="right">{t('stock.count.previousActual')}</TableCell>
                <TableCell align="right">{t('stock.count.expected')}</TableCell>
                <TableCell align="right">{t('stock.count.actual')}</TableCell>
                <TableCell align="right">{t('stock.count.difference')}</TableCell>
                <TableCell>{t('stock.count.notes')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const actual = parseDecimalInput(item.actualQuantityInput)
                const hasActual = Number.isFinite(actual)
                const diff = hasActual ? roundDecimal(actual - item.expectedQuantity, 3) : 0

                return (
                  <TableRow key={item.stockCountItemId}>
                    <TableCell>{item.stockResourceName ?? item.stockCountItemId}</TableCell>
                    <TableCell align="right">
                      {formatDecimal(item.previousQuantity)} {item.unitTypeAbbreviation ?? ''}
                    </TableCell>
                    <TableCell align="right">
                      {formatDecimal(item.expectedQuantity)} {item.unitTypeAbbreviation ?? ''}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="text"
                        value={item.actualQuantityInput}
                        onChange={(e) => {
                          setItem(item.stockCountItemId, {
                            actualQuantityInput: e.target.value,
                          })
                        }}
                        inputProps={{ inputMode: 'decimal' }}
                        disabled={!canUpdateCount}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: diff < 0 ? 'error.main' : diff > 0 ? 'success.main' : 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {hasActual ? formatDecimal(diff) : '-'}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={item.notes ?? ''}
                        onChange={(e) => setItem(item.stockCountItemId, { notes: e.target.value })}
                        fullWidth
                        disabled={!canUpdateCount}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isPending || !canUpdateCount}>
          {isPending ? t('common.loading') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
