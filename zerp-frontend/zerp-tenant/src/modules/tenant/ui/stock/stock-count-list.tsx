'use client'
import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'

import { useApproveStockCount, useStockCounts } from '../../hooks/use-stock-counts'
import { shopParents, targetWithParents } from '../../permissions/permission-targets'
import type { StockCountResponseDto } from '../../types/stock'
import { StockCountEntryDialog } from './stock-count-entry-dialog'
import { StockCountFormDialog } from './stock-count-form-dialog'

export function StockCountList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { currentTenantId, hasShopPermission, hasPermissionForTarget } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')
  const canReadCounts = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_STOCK_COUNT, selectedShopId),
  )
  const canCreateCount = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.CREATE_STOCK_COUNT, selectedShopId),
  )

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [entryOpen, setEntryOpen] = useState(false)
  const [selectedCount, setSelectedCount] = useState<StockCountResponseDto | null>(null)
  const approveMutation = useApproveStockCount()

  const { data, isLoading } = useStockCounts(
    {
      pagination: { page: page + 1, perPage: rowsPerPage },
      ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadCounts },
  )

  const handleApprove = async (countId: string) => {
    const count = data?.data?.find((item) => item.id === countId)
    if (!count || !canApproveCount(count)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    try {
      await approveMutation.mutateAsync(countId)
      showToast('Count approved successfully', { severity: 'success' })
    } catch (err: any) {
      showToast(err?.message ?? 'Count approval failed', { severity: 'error' })
    }
  }

  const handleOpenEntry = (count: StockCountResponseDto) => {
    if (!canUpdateCount(count)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    setSelectedCount(count)
    setEntryOpen(true)
  }

  function countTarget(count: StockCountResponseDto) {
    return targetWithParents(
      'STOCK_COUNT',
      count.id,
      currentTenantId,
      shopParents(count.shopId, currentTenantId),
    )
  }

  function canUpdateCount(count: StockCountResponseDto): boolean {
    return hasPermissionForTarget(PermissionActions.UPDATE_STOCK_COUNT, countTarget(count))
  }

  function canApproveCount(count: StockCountResponseDto): boolean {
    return hasPermissionForTarget(PermissionActions.APPROVE_STOCK_COUNT, countTarget(count))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('stock.tabs.counts')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!canCreateCount}
          onClick={() => setFormOpen(true)}
        >
          {t('stock.count.createButton')}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : !canReadCounts ? (
        <Alert severity="warning">{unauthorizedReason}</Alert>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('stock.count.countDate')}</TableCell>
                <TableCell>{t('stock.count.status')}</TableCell>
                <TableCell>{t('stock.count.notes')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('stock.count.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((count) => (
                  <TableRow key={count.id}>
                    <TableCell>{count.countDate}</TableCell>
                    <TableCell>
                      {t(`stock.count.statuses.${count.status}` as any) || count.status}
                    </TableCell>
                    <TableCell>{count.notes}</TableCell>
                    <TableCell align="right">
                      {count.status !== 'COMPLETED' && count.status !== 'CANCELLED' && (
                        <Button
                          size="small"
                          variant="text"
                          disabled={!canUpdateCount(count)}
                          onClick={() => handleOpenEntry(count)}
                          sx={{ mr: 1 }}
                        >
                          Enter Count
                        </Button>
                      )}
                      {count.status === 'COMPLETED' ? (
                        <Chip
                          size="small"
                          label={t('stock.count.statuses.COMPLETED')}
                          color="success"
                        />
                      ) : count.status === 'CANCELLED' ? (
                        <Chip
                          size="small"
                          label={t('stock.count.statuses.CANCELLED')}
                          color="default"
                        />
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={
                            approveMutation.isPending ||
                            count.status !== 'READY_FOR_APPROVAL' ||
                            !canApproveCount(count)
                          }
                          onClick={() => handleApprove(count.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.total || 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </Box>
      )}

      {formOpen && <StockCountFormDialog open={formOpen} onClose={() => setFormOpen(false)} />}

      {entryOpen && (
        <StockCountEntryDialog
          open={entryOpen}
          count={selectedCount}
          onClose={() => {
            setEntryOpen(false)
            setSelectedCount(null)
          }}
        />
      )}
    </Box>
  )
}
