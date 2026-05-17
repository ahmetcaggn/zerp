'use client'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useDeleteMenu, useMenus, usePatchMenu } from '../../../hooks/use-menus'
import { useUpdateShopDefaultMenuLanguage } from '../../../hooks/use-shops'
import type { MenuLanguage, MenuResponseDto } from '../../../types/sale'
import { MenuFormDialog } from './menu-form-dialog'

export function MenuList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope, shops, refreshShops } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editMenu, setEditMenu] = useState<MenuResponseDto | null>(null)
  const [activationModalMenu, setActivationModalMenu] = useState<MenuResponseDto | null>(null)
  const [shouldRefresh, setShouldRefresh] = useState(false)
  const [defaultLanguageValue, setDefaultLanguageValue] = useState<MenuLanguage>('TR')

  const selectedShop = useMemo(
    () => shops.find((shop) => shop.id === selectedShopId),
    [selectedShopId, shops],
  )

  const { data, isLoading, refetch } = useMenus({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  useEffect(() => {
    if (!shouldRefresh) return
    void refetch()
    setShouldRefresh(false)
  }, [shouldRefresh, refetch])

  const { mutate: deleteMenu } = useDeleteMenu()
  const { mutate: patchMenu, isPending: isUpdatingMenu } = usePatchMenu()
  const {
    mutateAsync: updateShopDefaultMenuLanguage,
    isPending: isUpdatingDefaultLanguage,
  } = useUpdateShopDefaultMenuLanguage()

  useEffect(() => {
    setDefaultLanguageValue(selectedShop?.defaultMenuLanguage ?? 'TR')
  }, [selectedShop?.defaultMenuLanguage])

  function handleEdit(menu: MenuResponseDto) {
    setEditMenu(menu)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteMenu(id, {
      onSuccess: () => {
        showToast(t('sale.menu.deletedToast'))
        setShouldRefresh(true)
      },
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function applyMenuActiveState(menu: MenuResponseDto, nextActive: boolean) {
    patchMenu(
      {
        id: menu.id,
        fields: { active: nextActive },
      },
      {
        onSuccess: () => {
          showToast(t('sale.menu.updatedToast'))
          setShouldRefresh(true)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleActiveToggle(menu: MenuResponseDto, nextActive: boolean) {
    if (!menu.active && nextActive) {
      setActivationModalMenu(menu)
      return
    }
    applyMenuActiveState(menu, nextActive)
  }

  async function handleChangeDefaultLanguage(language: MenuLanguage) {
    if (!selectedShopId) return
    setDefaultLanguageValue(language)
    try {
      await updateShopDefaultMenuLanguage({
        shopId: selectedShopId,
        data: { defaultMenuLanguage: language },
      })
      await refreshShops()
      showToast(t('sale.menu.defaultLanguage.updatedToast'))
    } catch (err) {
      setDefaultLanguageValue(selectedShop?.defaultMenuLanguage ?? 'TR')
      showToast(getUserFriendlyError(err), { severity: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6">{t('sale.tabs.menus')}</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 240 }} disabled={scope.mode !== 'SHOP' || isUpdatingDefaultLanguage}>
            <InputLabel>{t('sale.menu.defaultLanguage.label')}</InputLabel>
            <Select
              value={defaultLanguageValue}
              label={t('sale.menu.defaultLanguage.label')}
              onChange={(event) => void handleChangeDefaultLanguage(event.target.value as MenuLanguage)}
            >
              <MenuItem value="TR">{t('sale.menu.language.tr')}</MenuItem>
              <MenuItem value="EN">{t('sale.menu.language.en')}</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditMenu(null)
              setFormOpen(true)
            }}
          >
            {t('sale.menu.createButton')}
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('sale.menu.form.name')}</TableCell>
                <TableCell>{t('sale.menu.form.description')}</TableCell>
                <TableCell>{t('sale.menu.form.language')}</TableCell>
                <TableCell>{t('sale.menu.form.isActive')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('sale.menu.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((menu) => (
                  <TableRow key={menu.id}>
                    <TableCell>
                      <Typography fontWeight={500}>{menu.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {menu.description ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {menu.language
                          ? menu.language === 'TR'
                            ? t('sale.menu.language.tr')
                            : t('sale.menu.language.en')
                          : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={menu.active}
                        disabled={isUpdatingMenu}
                        onChange={(e) => handleActiveToggle(menu, e.target.checked)}
                        inputProps={{ 'aria-label': `toggle-menu-active-${menu.id}` }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleEdit(menu)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(menu.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.total ?? 0}
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

      {formOpen && (
        <MenuFormDialog
          open={formOpen}
          mode={editMenu ? 'edit' : 'create'}
          menu={editMenu}
          onClose={() => setFormOpen(false)}
        />
      )}

      <Dialog
        open={!!activationModalMenu}
        onClose={() => setActivationModalMenu(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('sale.menu.activationModal.title')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t('sale.menu.activationModal.description', {
              language:
                activationModalMenu?.language === 'TR'
                  ? t('sale.menu.language.tr')
                  : t('sale.menu.language.en'),
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivationModalMenu(null)}>{t('common.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!activationModalMenu) return
              applyMenuActiveState(activationModalMenu, true)
              setActivationModalMenu(null)
            }}
          >
            {t('sale.menu.activationModal.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
