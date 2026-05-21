'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Chip, CircularProgress, Fab, Stack, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'
import type { Route } from 'next'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useShopTables, useDeleteShopTable, usePatchShopTable } from '../../hooks/use-shop-tables'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { TableCard } from './table-card'
import { ShopTableFormDialog } from '../sale/tables/shop-table-form-dialog'
import type { ShopTableResponseDto, ShopTableStatus } from '../../types/sale'

type StatusFilter = 'ALL' | ShopTableStatus

export function FloorView() {
  const { locale, t } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const FILTERS: { label: string; value: StatusFilter; color: 'default' | 'success' | 'error' | 'warning' }[] = [
    { label: t('pos.filterAll'),          value: 'ALL',          color: 'default' },
    { label: t('pos.statusAvailable'),    value: 'AVAILABLE',    color: 'success' },
    { label: t('pos.statusOccupied'),     value: 'OCCUPIED',     color: 'error'   },
    { label: t('pos.statusReserved'),     value: 'RESERVED',     color: 'warning' },
    { label: t('pos.statusOutOfOrder'),   value: 'OUT_OF_ORDER', color: 'default' },
  ]
  const router = useRouter()
  const { showToast } = useToast()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [formOpen, setFormOpen] = useState(false)
  const [editTable, setEditTable] = useState<ShopTableResponseDto | null>(null)

  const { data, isLoading } = useShopTables({
    pagination: { page: 1, perPage: 200 },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const { mutate: deleteTable } = useDeleteShopTable()
  const { mutate: patchTable } = usePatchShopTable()

  const all = data?.data ?? []
  const filtered = statusFilter === 'ALL' ? all : all.filter(t => t.status === statusFilter)

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
    router.push(`/${locale}/tables?tableId=${id}` as Route)
  }

  function handleEdit(table: ShopTableResponseDto) {
    setEditTable(table)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteTable(id, {
      onSuccess: () => showToast(t('pos.tableDeletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleChangeStatus(table: ShopTableResponseDto, status: ShopTableStatus) {
    if (table.status === status) return
    patchTable(
      { id: table.id, fields: { status } },
      {
        onSuccess: () => showToast(t('pos.tableStatusUpdatedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Status filter bar */}
      <Box
        sx={{
          px: 2.5, py: 1.5,
          borderBottom: 1, borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
          {FILTERS.map(f => {
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
      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
            <CircularProgress size={48} thickness={3} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50%', gap: 2 }}>
            <TableRestaurantIcon sx={{ fontSize: 80, color: 'action.disabled' }} />
            <Typography variant="h6" color="text.secondary">
              {all.length === 0 ? t('pos.noTablesYet') : t('pos.noTablesForFilter')}
            </Typography>
          </Box>
        ) : isMultiFloor ? (
          floors.map(floor => (
            <Box key={floor} sx={{ mb: 4 }}>
              <Typography
                variant="overline"
                sx={{ display: 'block', mb: 1.5, fontWeight: 700, color: 'text.secondary', letterSpacing: 1.5 }}
              >
                {floor === 0 ? t('pos.groundFloor') : t('pos.floorLabel').replace('{n}', String(floor))}
                <Box component="span" sx={{ ml: 1, fontWeight: 400, opacity: 0.7 }}>
                  ({byFloor[floor].length})
                </Box>
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 2 }}>
                {byFloor[floor].map(t => (
                  <TableCard
                    key={t.id}
                    table={t}
                    onTap={handleTap}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 2 }}>
            {filtered.map(t => (
              <TableCard
                key={t.id}
                table={t}
                onTap={handleTap}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChangeStatus={handleChangeStatus}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* FAB — add table */}
      <Fab
        color="primary"
        aria-label={t('sale.table.createButton')}
        onClick={() => { setEditTable(null); setFormOpen(true) }}
        sx={{ position: 'fixed', bottom: 32, right: 32, width: 60, height: 60, boxShadow: 8 }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>

      {formOpen && (
        <ShopTableFormDialog
          open
          mode={editTable ? 'edit' : 'create'}
          table={editTable}
          onClose={() => { setFormOpen(false); setEditTable(null) }}
        />
      )}
    </Box>
  )
}
