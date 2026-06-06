'use client'
import AddIcon from '@mui/icons-material/Add'
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'
import { Alert, Box, Chip, CircularProgress, Fab, Stack, Tooltip, Typography } from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteShopTable, usePatchShopTable, useShopTables } from '../../hooks/use-shop-tables'
import { shopParents, targetWithParents } from '../../permissions/permission-targets'
import type { ShopTableResponseDto, ShopTableStatus } from '../../types/sale'
import { ShopTableFormDialog } from '../sale/tables/shop-table-form-dialog'
import { TableCard } from './table-card'

type StatusFilter = 'ALL' | ShopTableStatus

export function FloorView() {
  const { locale, t } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const {
    currentTenantId,
    hasAnyPermission,
    hasShopPermission,
    hasPermissionForTarget,
    hasAnyPermissionForTarget,
  } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')
  const canReadTables = Boolean(
    selectedShopId &&
    (hasShopPermission(PermissionActions.READ_SHOP_TABLE, selectedShopId) ||
      hasAnyPermission([PermissionActions.READ_SHOP_TABLE])),
  )
  const canCreateTable = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.CREATE_SHOP_TABLE, selectedShopId),
  )

  const FILTERS: {
    label: string
    value: StatusFilter
    color: 'default' | 'success' | 'error' | 'warning'
  }[] = [
    { label: t('pos.filterAll'), value: 'ALL', color: 'default' },
    { label: t('pos.statusAvailable'), value: 'AVAILABLE', color: 'success' },
    { label: t('pos.statusOccupied'), value: 'OCCUPIED', color: 'error' },
    { label: t('pos.statusReserved'), value: 'RESERVED', color: 'warning' },
    { label: t('pos.statusOutOfOrder'), value: 'OUT_OF_ORDER', color: 'default' },
  ]
  const router = useRouter()
  const { showToast } = useToast()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [formOpen, setFormOpen] = useState(false)
  const [editTable, setEditTable] = useState<ShopTableResponseDto | null>(null)

  const { data, isLoading } = useShopTables(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { shopId: selectedShopId, 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadTables },
  )
  const { mutate: deleteTable } = useDeleteShopTable()
  const { mutate: patchTable } = usePatchShopTable()

  const all = data?.data ?? []
  const filtered = statusFilter === 'ALL' ? all : all.filter((t) => t.status === statusFilter)

  const counts = all.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1
    return acc
  }, {})

  const byFloor = filtered.reduce<Record<number, ShopTableResponseDto[]>>((acc, t) => {
    const f = t.floor ?? 0
    if (!acc[f]) acc[f] = []
    acc[f].push(t)
    return acc
  }, {})
  const floors = Object.keys(byFloor).map(Number).sort()
  const isMultiFloor = floors.length > 1

  function handleTap(id: string) {
    const table = all.find((item) => item.id === id)
    if (table && !canOpenTable(table)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    router.push(`/${locale}/tables?tableId=${id}` as Route)
  }

  function handleEdit(table: ShopTableResponseDto) {
    if (!canUpdateTable(table)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    setEditTable(table)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    const table = all.find((item) => item.id === id)
    if (table && !canDeleteTable(table)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    deleteTable(id, {
      onSuccess: () => showToast(t('pos.tableDeletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleChangeStatus(table: ShopTableResponseDto, status: ShopTableStatus) {
    if (table.status === status) return
    if (!canUpdateTable(table)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    patchTable(
      { id: table.id, fields: { status } },
      {
        onSuccess: () => showToast(t('pos.tableStatusUpdatedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function tableTarget(table: ShopTableResponseDto) {
    return targetWithParents(
      'SHOP_TABLE',
      table.id,
      currentTenantId,
      shopParents(table.shopId, currentTenantId),
    )
  }

  function canOpenTable(table: ShopTableResponseDto): boolean {
    return hasAnyPermissionForTarget(
      [
        PermissionActions.READ_TABLE_ORDER,
        PermissionActions.CREATE_TABLE_ORDER,
        PermissionActions.UPDATE_TABLE_ORDER,
      ],
      tableTarget(table),
    )
  }

  function canUpdateTable(table: ShopTableResponseDto): boolean {
    return hasPermissionForTarget(PermissionActions.UPDATE_SHOP_TABLE, tableTarget(table))
  }

  function canDeleteTable(table: ShopTableResponseDto): boolean {
    return hasPermissionForTarget(PermissionActions.DELETE_SHOP_TABLE, tableTarget(table))
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Status filter bar */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
          {FILTERS.map((f) => {
            const count = f.value === 'ALL' ? all.length : (counts[f.value] ?? 0)
            const active = statusFilter === f.value
            return (
              <Chip
                key={f.value}
                label={count > 0 ? `${f.label}  ${count}` : f.label}
                color={active ? f.color : 'default'}
                variant={active ? 'filled' : 'outlined'}
                onClick={() => setStatusFilter(f.value)}
                sx={{
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  height: 34,
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              />
            )
          })}
        </Stack>
      </Box>

      {/* Table grid */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 3 }, bgcolor: 'background.default' }}>
        {isLoading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}
          >
            <CircularProgress size={48} thickness={3} />
          </Box>
        ) : !canReadTables ? (
          <Alert severity="warning">{unauthorizedReason}</Alert>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50%',
              gap: 2,
            }}
          >
            <TableRestaurantIcon sx={{ fontSize: 80, color: 'action.disabled' }} />
            <Typography variant="h6" color="text.secondary">
              {all.length === 0 ? t('pos.noTablesYet') : t('pos.noTablesForFilter')}
            </Typography>
          </Box>
        ) : isMultiFloor ? (
          floors.map((floor) => (
            <Box key={floor} sx={{ mb: 4 }}>
              <Typography
                variant="overline"
                sx={{
                  display: 'block',
                  mb: 1.5,
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: 1.5,
                }}
              >
                {floor === 0
                  ? t('pos.groundFloor')
                  : t('pos.floorLabel').replace('{n}', String(floor))}
                <Box component="span" sx={{ ml: 1, fontWeight: 400, opacity: 0.7 }}>
                  ({byFloor[floor].length})
                </Box>
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
                  gap: 2,
                }}
              >
                {byFloor[floor].map((t) => (
                  <TableCard
                    key={t.id}
                    table={t}
                    onTap={handleTap}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChangeStatus={handleChangeStatus}
                    canOpen={canOpenTable(t)}
                    canEdit={canUpdateTable(t)}
                    canDelete={canDeleteTable(t)}
                    canUpdateStatus={canUpdateTable(t)}
                  />
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
              gap: 2,
            }}
          >
            {filtered.map((t) => (
              <TableCard
                key={t.id}
                table={t}
                onTap={handleTap}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChangeStatus={handleChangeStatus}
                canOpen={canOpenTable(t)}
                canEdit={canUpdateTable(t)}
                canDelete={canDeleteTable(t)}
                canUpdateStatus={canUpdateTable(t)}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* FAB — add table */}
      <Tooltip title={canCreateTable ? '' : unauthorizedReason}>
        <span style={{ position: 'fixed', bottom: 32, right: 32 }}>
          <Fab
            color="primary"
            aria-label={t('sale.table.createButton')}
            disabled={!canCreateTable}
            onClick={() => {
              setEditTable(null)
              setFormOpen(true)
            }}
            sx={{ position: 'fixed', bottom: 32, right: 32, width: 60, height: 60, boxShadow: 8 }}
          >
            <AddIcon sx={{ fontSize: 28 }} />
          </Fab>
        </span>
      </Tooltip>

      {formOpen && (
        <ShopTableFormDialog
          open
          mode={editTable ? 'edit' : 'create'}
          table={editTable}
          onClose={() => {
            setFormOpen(false)
            setEditTable(null)
          }}
        />
      )}
    </Box>
  )
}
