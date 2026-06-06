'use client'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import { getCountryLabel } from '@/core/data/countries'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteShop, useShops } from '../hooks/use-shops'
import type { ShopResponse } from '../types/shop'
import { ShopFormDialog } from './shop-form-dialog'
import { TenantAutocomplete } from './tenant-autocomplete'

type ShopSortField = 'tenantId' | 'name' | 'city' | 'country'

interface ShopListProps {
  fixedTenantId?: string
  fixedTenantName?: string
}

export function ShopList({ fixedTenantId, fixedTenantName }: ShopListProps = {}) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const scopedTenantId = fixedTenantId?.trim() ?? ''
  const hasTenantScope = Boolean(scopedTenantId)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState<ShopSortField>('name')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [searchInput, setSearchInput] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const [tenantFilter, setTenantFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedShop, setSelectedShop] = useState<ShopResponse | undefined>(undefined)

  const { hasPermission, hasAnyPermission, hasPermissionForTarget, isLoadingPermissions } =
    useCurrentUserPermissions()
  const canReadShop = hasAnyPermission([
    PermissionActions.READ_SHOP,
    PermissionActions.READ_TENANT,
    PermissionActions.UPDATE_TENANT,
    PermissionActions.ADMIN,
  ])
  const canCreateShop = hasAnyPermission([PermissionActions.UPDATE_TENANT, PermissionActions.ADMIN])
  const canReadTenantsForFilter =
    !hasTenantScope &&
    hasAnyPermission([
      PermissionActions.READ_TENANT,
      PermissionActions.UPDATE_TENANT,
      PermissionActions.ADMIN,
    ])

  const effectiveTenantFilter = scopedTenantId || tenantFilter

  const filter: Record<string, string> = {}
  if (searchQ) filter['name.like'] = searchQ
  if (effectiveTenantFilter) filter['tenantId.eq'] = effectiveTenantFilter

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: sortField, order: sortOrder },
    filter,
  }

  const { data, isLoading, error } = useShops(params, {
    enabled: canReadShop && !isLoadingPermissions,
  })
  const { mutate: deleteShop } = useDeleteShop()

  useEffect(() => {
    if (!error || !canReadShop) {
      return
    }
    showToast(getUserFriendlyError(error), { severity: 'error' })
  }, [canReadShop, error, showToast])

  const rows = data?.data ?? []
  const total = data?.total ?? 0
  const hasActiveFilters = searchQ || (!hasTenantScope && tenantFilter)
  const sortDir = sortOrder === 'ASC' ? 'asc' : 'desc'
  const showTenantColumn = !hasTenantScope
  const canCreateShopForScope = hasTenantScope
    ? hasPermissionForTarget(PermissionActions.UPDATE_TENANT, {
        targetType: 'TENANT',
        targetId: scopedTenantId,
        tenantId: scopedTenantId,
      })
    : canCreateShop
  const unauthorizedReason = t('common.unauthorized')

  const handleSearch = useCallback(() => {
    setSearchQ(searchInput.trim())
    setPage(0)
  }, [searchInput, setPage, setSearchQ])

  function handleSort(field: ShopSortField) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSortField(field)
      setSortOrder('ASC')
    }
    setPage(0)
  }

  function clearFilters() {
    setSearchInput('')
    setSearchQ('')
    if (!hasTenantScope) {
      setTenantFilter('')
    }
    setPage(0)
  }

  function openCreateDialog() {
    setDialogMode('create')
    setSelectedShop(undefined)
    setDialogOpen(true)
  }

  function openEditDialog(shop: ShopResponse) {
    setDialogMode('edit')
    setSelectedShop(shop)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setSelectedShop(undefined)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('shops.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          disabled={isLoadingPermissions || !canCreateShopForScope}
        >
          {t('shops.createButton')}
        </Button>
      </Box>

      {canReadShop && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder={t('shops.searchPlaceholder')}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
            sx={{ width: 260 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchInput ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchInput('')
                        setSearchQ('')
                        setPage(0)
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <Button variant="outlined" size="small" onClick={handleSearch}>
            {t('shops.searchButton')}
          </Button>

          {canReadTenantsForFilter && (
            <Box sx={{ minWidth: 260 }}>
              <TenantAutocomplete
                value={tenantFilter || null}
                onChange={(tenantId) => {
                  setTenantFilter(tenantId ?? '')
                  setPage(0)
                }}
                label={t('shops.tenantLabel')}
                enabled={canReadTenantsForFilter && canReadShop && !isLoadingPermissions}
              />
            </Box>
          )}

          {hasActiveFilters && (
            <Button size="small" color="inherit" onClick={clearFilters}>
              {t('shops.clearFiltersButton')}
            </Button>
          )}
        </Box>
      )}

      {isLoadingPermissions ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : !canReadShop ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('shops.unauthorized')}
        </Typography>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('shops.emptyState')}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              {showTenantColumn && (
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'tenantId'}
                    direction={sortField === 'tenantId' ? sortDir : 'asc'}
                    onClick={() => handleSort('tenantId')}
                  >
                    {t('shops.tenantLabel')}
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDir : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  {t('shops.nameLabel')}
                </TableSortLabel>
              </TableCell>
              <TableCell>{t('shops.emailLabel')}</TableCell>
              <TableCell>{t('shops.phoneLabel')}</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'city'}
                  direction={sortField === 'city' ? sortDir : 'asc'}
                  onClick={() => handleSort('city')}
                >
                  {t('shops.cityLabel')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'country'}
                  direction={sortField === 'country' ? sortDir : 'asc'}
                  onClick={() => handleSort('country')}
                >
                  {t('shops.countryLabel')}
                </TableSortLabel>
              </TableCell>
              <TableCell>{t('shops.websiteLabel')}</TableCell>
              <TableCell align="right">Islemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((shop, index) => {
              const shopTarget = {
                targetType: 'SHOP',
                targetId: shop.id,
                tenantId: shop.tenantId,
                parentTargets: shop.tenantId
                  ? [{ targetType: 'TENANT', targetId: shop.tenantId }]
                  : [],
              }
              const canUpdateThisShop = Boolean(
                shop.id &&
                shop.tenantId &&
                hasPermissionForTarget(PermissionActions.UPDATE_TENANT, shopTarget),
              )
              const canDeleteThisShop = Boolean(
                shop.id &&
                shop.tenantId &&
                hasPermissionForTarget(PermissionActions.ADMIN, shopTarget),
              )

              return (
                <TableRow key={shop.id ?? `shop-${index}`} hover>
                  {showTenantColumn && <TableCell>{shop.tenantName ?? '—'}</TableCell>}
                  <TableCell>{shop.name ?? '—'}</TableCell>
                  <TableCell>{shop.email ?? '—'}</TableCell>
                  <TableCell>{shop.phone ?? '—'}</TableCell>
                  <TableCell>{shop.city ?? '—'}</TableCell>
                  <TableCell>{getCountryLabel(locale, shop.country) || '—'}</TableCell>
                  <TableCell>{shop.website ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={canUpdateThisShop ? t('shops.editButton') : unauthorizedReason}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canUpdateThisShop}
                          onClick={() => {
                            if (!canUpdateThisShop) return
                            openEditDialog(shop)
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={canDeleteThisShop ? t('shops.deleteButton') : unauthorizedReason}
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={!canDeleteThisShop}
                          onClick={() => {
                            if (!shop.id || !canDeleteThisShop) return
                            deleteShop(shop.id, {
                              onSuccess: () =>
                                showToast(t('shops.deletedToast'), { severity: 'success' }),
                              onError: (err) =>
                                showToast(getUserFriendlyError(err), { severity: 'error' }),
                            })
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      {canReadShop && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      )}

      <ShopFormDialog
        open={dialogOpen}
        mode={dialogMode}
        shop={selectedShop}
        onClose={closeDialog}
        defaultTenantId={hasTenantScope ? scopedTenantId : undefined}
        defaultTenantName={hasTenantScope ? fixedTenantName : undefined}
        lockTenantOnCreate={hasTenantScope}
      />
    </Box>
  )
}
