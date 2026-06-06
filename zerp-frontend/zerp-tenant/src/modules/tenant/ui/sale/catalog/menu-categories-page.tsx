'use client'

import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LaunchIcon from '@mui/icons-material/Launch'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useDeleteMenuCategory,
  useMenuCategories,
  usePatchMenuCategory,
} from '../../../hooks/use-menu-categories'
import { useMenu } from '../../../hooks/use-menus'
import {
  menuParents,
  shopParents,
  targetWithParents,
} from '../../../permissions/permission-targets'
import type { MenuCategoryResponseDto, MenuResponseDto } from '../../../types/sale'

interface Props {
  menuId: string
}

export function MenuCategoriesPage({ menuId }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { currentTenantId, hasPermissionForTarget } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')

  const canReadMenu = hasPermissionForTarget(
    PermissionActions.READ_MENU,
    targetWithParents(
      'MENU',
      menuId,
      currentTenantId,
      shopParents(selectedShopId, currentTenantId),
    ),
  )
  const canReadCategories = hasPermissionForTarget(
    PermissionActions.READ_MENU_CATEGORY,
    targetWithParents(
      'MENU',
      menuId,
      currentTenantId,
      shopParents(selectedShopId, currentTenantId),
    ),
  )

  const { data: menu, isLoading: isLoadingMenu } = useMenu(menuId, { enabled: canReadMenu })
  const { data: categoriesResult, isLoading: isLoadingCategories } = useMenuCategories(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'displayOrder', order: 'ASC' },
      filter: { 'menu.id': menuId },
    },
    { enabled: canReadCategories },
  )

  const categories = categoriesResult?.data ?? []

  const { mutate: deleteCategory } = useDeleteMenuCategory()
  const { mutateAsync: patchCategory, isPending: isReorderPending } = usePatchMenuCategory()

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function menuShopId(currentMenu?: MenuResponseDto | null): string | undefined {
    return currentMenu?.shopId ?? selectedShopId
  }

  function canUpdateMenu(currentMenu: MenuResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.UPDATE_MENU,
      targetWithParents(
        'MENU',
        currentMenu.id,
        currentTenantId,
        shopParents(menuShopId(currentMenu), currentTenantId),
      ),
    )
  }

  function canCreateCategory(currentMenu: MenuResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.CREATE_MENU_CATEGORY,
      targetWithParents(
        'MENU',
        currentMenu.id,
        currentTenantId,
        shopParents(menuShopId(currentMenu), currentTenantId),
      ),
    )
  }

  function canReadMenuItems(category: MenuCategoryResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.READ_MENU_ITEM,
      targetWithParents(
        'MENU_CATEGORY',
        category.id,
        currentTenantId,
        menuParents(category.menuId, menuShopId(menu), currentTenantId),
      ),
    )
  }

  function canUpdateCategory(category: MenuCategoryResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.UPDATE_MENU_CATEGORY,
      targetWithParents(
        'MENU_CATEGORY',
        category.id,
        currentTenantId,
        menuParents(category.menuId, menuShopId(menu), currentTenantId),
      ),
    )
  }

  function canDeleteCategory(category: MenuCategoryResponseDto): boolean {
    return hasPermissionForTarget(
      PermissionActions.DELETE_MENU_CATEGORY,
      targetWithParents(
        'MENU_CATEGORY',
        category.id,
        currentTenantId,
        menuParents(category.menuId, menuShopId(menu), currentTenantId),
      ),
    )
  }

  function handleDelete(category: MenuCategoryResponseDto) {
    if (!canDeleteCategory(category)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    deleteCategory(category.id, {
      onSuccess: () => showToast(t('sale.category.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const currentCategory = categories[index]
    const targetCategory = categories[targetIndex]
    if (!canUpdateCategory(currentCategory) || !canUpdateCategory(targetCategory)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    const currentDisplayOrder = currentCategory.displayOrder ?? index + 1
    const targetDisplayOrder = targetCategory.displayOrder ?? targetIndex + 1

    try {
      await patchCategory({ id: currentCategory.id, fields: { displayOrder: targetDisplayOrder } })
      await patchCategory({ id: targetCategory.id, fields: { displayOrder: currentDisplayOrder } })
      showToast(t('sale.category.reorderedToast'))
    } catch (err) {
      showToast(getUserFriendlyError(err), { severity: 'error' })
    }
  }

  if (isLoadingMenu || isLoadingCategories) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!canReadMenu || !canReadCategories) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">{unauthorizedReason}</Alert>
      </Box>
    )
  }

  if (!menu) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="text.secondary">{t('sale.menu.emptyState')}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)}>
          {t('sale.catalog.backToCatalog')}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={canUpdateMenu(menu) ? '' : unauthorizedReason}>
            <span>
              <Button
                variant="outlined"
                disabled={!canUpdateMenu(menu)}
                onClick={() => goTo(`${ROUTES.catalog}/menus/${menuId}/edit`)}
              >
                {t('sale.menu.editButton')}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={canCreateCategory(menu) ? '' : unauthorizedReason}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!canCreateCategory(menu)}
                onClick={() => goTo(`${ROUTES.catalog}/categories/new?menuId=${menuId}`)}
              >
                {t('sale.category.createButton')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {menu.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {menu.description || t('sale.catalog.noDescription')}
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {t('sale.catalog.categoriesSectionTitle')}
          </Typography>

          {categories.length === 0 ? (
            <Typography color="text.secondary">{t('sale.category.emptyState')}</Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('sale.category.form.name')}</TableCell>
                    <TableCell>{t('sale.category.form.description')}</TableCell>
                    <TableCell align="right">{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Typography fontWeight={600}>{category.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.description || t('sale.catalog.noDescription')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          endIcon={<LaunchIcon fontSize="small" />}
                          disabled={!canReadMenuItems(category)}
                          onClick={() => goTo(`${ROUTES.catalog}/categories/${category.id}`)}
                          sx={{ mr: 1 }}
                        >
                          {t('sale.catalog.openMenuItemsButton')}
                        </Button>
                        <Tooltip title={t('sale.category.moveUpButton')}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => void handleMove(index, 'up')}
                              disabled={
                                isReorderPending || index === 0 || !canUpdateCategory(category)
                              }
                            >
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={t('sale.category.moveDownButton')}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => void handleMove(index, 'down')}
                              disabled={
                                isReorderPending ||
                                index === categories.length - 1 ||
                                !canUpdateCategory(category)
                              }
                            >
                              <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={
                            canUpdateCategory(category) ? t('common.edit') : unauthorizedReason
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              disabled={!canUpdateCategory(category)}
                              onClick={() =>
                                goTo(`${ROUTES.catalog}/categories/${category.id}/edit`)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={
                            canDeleteCategory(category) ? t('common.delete') : unauthorizedReason
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={!canDeleteCategory(category)}
                              onClick={() => handleDelete(category)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
