'use client'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { formatDate } from '@/core/utils/date-formatter'

import { useStockOperationHistory } from '../../hooks/use-stock-operations'
import { useStockOverview, useStockResources } from '../../hooks/use-stock-resources'
import { shopParents, targetWithParents } from '../../permissions/permission-targets'
import type {
  StockOperationResponseDto,
  StockOperationType,
  StockResourceResponseDto,
} from '../../types/stock'
import { StockAdjustmentFormDialog } from './stock-adjustment-form-dialog'
import { StockEntryFormDialog } from './stock-entry-form-dialog'
import { StockOperationDetailDialog } from './stock-operation-detail-dialog'
import { StockResourceFormDialog } from './stock-resource-form-dialog'

function formatDateTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function toApiDateTime(value?: string): string | undefined {
  if (!value) return undefined
  return value.length === 16 ? `${value}:00` : value
}

export function StockResourceList() {
  const { t, locale } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { currentTenantId, hasAnyPermission, hasShopPermission, hasPermissionForTarget } =
    useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')
  const canReadResources = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_STOCK_RESOURCE, selectedShopId),
  )
  const canCreateResource = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.CREATE_STOCK_RESOURCE, selectedShopId),
  )
  const canCreateEntry = Boolean(
    selectedShopId &&
    (hasShopPermission(PermissionActions.CREATE_STOCK_ENTRY, selectedShopId) ||
      hasAnyPermission([PermissionActions.CREATE_STOCK_ENTRY])),
  )
  const canCreateAdjustment = Boolean(
    selectedShopId &&
    (hasShopPermission(PermissionActions.CREATE_STOCK_ADJUSTMENT, selectedShopId) ||
      hasAnyPermission([PermissionActions.CREATE_STOCK_ADJUSTMENT])),
  )
  const canReadMovements = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_STOCK_MOVEMENT, selectedShopId),
  )
  const canAccessResources = canReadResources || canCreateEntry || canCreateAdjustment

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<StockResourceResponseDto | null>(null)
  const [entryFormOpen, setEntryFormOpen] = useState(false)
  const [adjustmentFormOpen, setAdjustmentFormOpen] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<StockOperationResponseDto | null>(null)
  const [operationTypeFilter, setOperationTypeFilter] = useState<'ALL' | StockOperationType>('ALL')
  const [referenceNoFilter, setReferenceNoFilter] = useState('')
  const [fromFilter, setFromFilter] = useState('')
  const [toFilter, setToFilter] = useState('')

  const { data, isLoading } = useStockResources(
    {
      pagination: { page: page + 1, perPage: rowsPerPage },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canAccessResources },
  )
  const { data: overviewData } = useStockOverview(selectedShopId, { enabled: canReadResources })
  const { data: operationHistory } = useStockOperationHistory({
    shopId: canReadMovements ? selectedShopId : undefined,
    limit: 100,
    operationType: operationTypeFilter === 'ALL' ? undefined : operationTypeFilter,
    from: toApiDateTime(fromFilter),
    to: toApiDateTime(toFilter),
    referenceNo: referenceNoFilter.trim() || undefined,
  })
  const overviewById = new Map((overviewData ?? []).map((item) => [item.stockResourceId, item]))

  const handleEdit = (resource: StockResourceResponseDto) => {
    if (!canUpdateResource(resource)) {
      return
    }
    setSelectedResource(resource)
    setFormOpen(true)
  }

  function canUpdateResource(resource: StockResourceResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.UPDATE_STOCK_RESOURCE,
      targetWithParents(
        'STOCK_RESOURCE',
        resource.id,
        currentTenantId,
        shopParents(resource.shopId, currentTenantId),
      ),
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('stock.tabs.resources')}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setEntryFormOpen(true)}
            disabled={!selectedShopId || !canCreateEntry}
          >
            {t('stock.operation.entryButton')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setAdjustmentFormOpen(true)}
            disabled={!selectedShopId || !canCreateAdjustment}
          >
            {t('stock.operation.adjustmentButton')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!canCreateResource}
            onClick={() => {
              setSelectedResource(null)
              setFormOpen(true)
            }}
          >
            {t('stock.resource.defineButton')}
          </Button>
        </Box>
      </Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        {t('stock.resource.varianceInfo')}
      </Alert>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : !canAccessResources ? (
        <Alert severity="warning">{unauthorizedReason}</Alert>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('stock.resource.form.name')}</TableCell>
                <TableCell>{t('stock.resource.table.realStock')}</TableCell>
                <TableCell>{t('stock.resource.table.expectedStock')}</TableCell>
                <TableCell>{t('stock.resource.form.unitType')}</TableCell>
                <TableCell>{t('stock.resource.form.reorderThreshold')}</TableCell>
                <TableCell>{t('stock.resource.table.lastCountStock')}</TableCell>
                <TableCell>{t('stock.resource.table.varianceFromLastCount')}</TableCell>
                <TableCell>{t('stock.resource.table.lastExpectedStock')}</TableCell>
                <TableCell>{t('stock.resource.table.lastCountDate')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {t('stock.resource.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((resource) => {
                  const overview = overviewById.get(resource.id)
                  const real = overview?.realQuantity ?? resource.quantity
                  const expected = overview?.expectedQuantity ?? resource.quantity
                  const lastCountStock = overview?.lastCountQuantity
                  const variance = overview?.variance ?? 0
                  const lastExpectedStock = overview?.lastExpectedQuantity
                  const isVarianceNegative = Number(variance) < 0
                  const varianceColor =
                    variance === 0
                      ? 'text.primary'
                      : isVarianceNegative
                        ? 'error.main'
                        : 'success.main'

                  return (
                    <TableRow key={resource.id}>
                      <TableCell>{resource.name}</TableCell>
                      <TableCell>{real}</TableCell>
                      <TableCell>{expected}</TableCell>
                      <TableCell>{resource.unitType}</TableCell>
                      <TableCell>
                        {overview?.reorderThreshold ?? resource.reorderThreshold}
                      </TableCell>
                      <TableCell>{lastCountStock ?? '-'}</TableCell>
                      <TableCell sx={{ color: varianceColor, fontWeight: 600 }}>
                        {variance}
                      </TableCell>
                      <TableCell>{lastExpectedStock ?? '-'}</TableCell>
                      <TableCell>
                        {overview?.lastCountedAt ? formatDate(overview.lastCountedAt, locale) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          disabled={!canUpdateResource(resource)}
                          onClick={() => handleEdit(resource)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
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

      {selectedShopId && canReadMovements && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {t('stock.operation.historyTitle')}
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>{t('stock.operation.filters.type')}</InputLabel>
              <Select
                label={t('stock.operation.filters.type')}
                value={operationTypeFilter}
                onChange={(e) =>
                  setOperationTypeFilter(e.target.value as 'ALL' | StockOperationType)
                }
              >
                <MenuItem value="ALL">{t('stock.operation.filters.allTypes')}</MenuItem>
                <MenuItem value="ENTRY">{t('stock.operation.types.ENTRY')}</MenuItem>
                <MenuItem value="ADJUSTMENT">{t('stock.operation.types.ADJUSTMENT')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label={t('stock.operation.filters.referenceNo')}
              value={referenceNoFilter}
              onChange={(e) => setReferenceNoFilter(e.target.value)}
            />
            <TextField
              size="small"
              label={t('stock.operation.filters.from')}
              type="datetime-local"
              value={fromFilter}
              onChange={(e) => setFromFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              label={t('stock.operation.filters.to')}
              type="datetime-local"
              value={toFilter}
              onChange={(e) => setToFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="text"
              onClick={() => {
                setOperationTypeFilter('ALL')
                setReferenceNoFilter('')
                setFromFilter('')
                setToFilter('')
              }}
            >
              {t('stock.operation.filters.clear')}
            </Button>
          </Stack>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('stock.movement.date')}</TableCell>
                  <TableCell>{t('stock.operation.type')}</TableCell>
                  <TableCell align="right">{t('stock.operation.itemCount')}</TableCell>
                  <TableCell>{t('stock.operation.referenceNo')}</TableCell>
                  <TableCell>{t('stock.operation.status')}</TableCell>
                  <TableCell>{t('stock.operation.notes')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!operationHistory?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {t('stock.operation.emptyState')}
                    </TableCell>
                  </TableRow>
                ) : (
                  operationHistory.map((operation) => (
                    <TableRow
                      key={operation.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setSelectedOperation(operation)}
                    >
                      <TableCell>
                        {operation.createdAt ? formatDateTime(operation.createdAt, locale) : '-'}
                      </TableCell>
                      <TableCell>
                        {t(`stock.operation.types.${operation.operationType}` as any) ||
                          operation.operationType}
                      </TableCell>
                      <TableCell align="right">{operation.itemCount}</TableCell>
                      <TableCell>{operation.referenceNo || '-'}</TableCell>
                      <TableCell>
                        {t(`stock.operation.statuses.${operation.status}` as any) ||
                          operation.status}
                      </TableCell>
                      <TableCell>{operation.notes || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {formOpen && (
        <StockResourceFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={selectedResource}
        />
      )}

      {entryFormOpen && selectedShopId && (
        <StockEntryFormDialog
          open={entryFormOpen}
          onClose={() => setEntryFormOpen(false)}
          shopId={selectedShopId}
        />
      )}

      {adjustmentFormOpen && selectedShopId && (
        <StockAdjustmentFormDialog
          open={adjustmentFormOpen}
          onClose={() => setAdjustmentFormOpen(false)}
          shopId={selectedShopId}
        />
      )}

      <StockOperationDetailDialog
        open={Boolean(selectedOperation)}
        onClose={() => setSelectedOperation(null)}
        operation={selectedOperation}
      />
    </Box>
  )
}
