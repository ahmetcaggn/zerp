'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useCreateMenuCategory,
  useMenuCategory,
  useUpdateMenuCategory,
} from '../../../hooks/use-menu-categories'
import { useMenus } from '../../../hooks/use-menus'
import {
  menuParents,
  shopParents,
  targetWithParents,
} from '../../../permissions/permission-targets'
import type { MenuCategoryResponseDto, MenuResponseDto } from '../../../types/sale'

interface Props {
  mode: 'create' | 'edit'
  categoryId?: string
  initialMenuId?: string
}

type CategoryFormValue = {
  name: string
  description: string
  menuId: string
}

function CategoryFormCard({
  title,
  initial,
  menus,
  disableMenuSelection,
  selectedMenuLabel,
  isPending,
  disabled,
  disabledReason,
  canSubmitValue,
  onCancel,
  onSubmit,
}: {
  title: string
  initial: CategoryFormValue
  menus: MenuResponseDto[]
  disableMenuSelection: boolean
  selectedMenuLabel?: string
  isPending: boolean
  disabled: boolean
  disabledReason?: string
  canSubmitValue: (value: CategoryFormValue) => boolean
  onCancel: (menuId: string) => void
  onSubmit: (value: CategoryFormValue) => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [menuId, setMenuId] = useState(initial.menuId)
  const currentValue = { name: name.trim(), description, menuId }
  const canSubmit = !disabled && canSubmitValue(currentValue)

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {title}
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!canSubmit) return
            if (!name.trim() || !menuId) return
            onSubmit({ name: name.trim(), description, menuId })
          }}
        >
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label={t('sale.category.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              disabled={disabled}
            />

            <TextField
              label={t('sale.category.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              disabled={disabled}
            />

            <FormControl fullWidth required disabled={disabled}>
              <InputLabel>{t('sale.category.form.menuId')}</InputLabel>
              <Select
                value={menuId}
                label={t('sale.category.form.menuId')}
                onChange={(e) => setMenuId(e.target.value)}
                disabled={disabled || disableMenuSelection}
              >
                {menus.map((menu) => (
                  <MenuItem key={menu.id} value={menu.id}>
                    {menu.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {disableMenuSelection && selectedMenuLabel && (
              <Typography variant="body2" color="text.secondary">
                {t('sale.catalog.selectedMenuLabel')}: {selectedMenuLabel}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              <Button onClick={() => onCancel(menuId)} disabled={isPending}>
                {t('common.cancel')}
              </Button>
              <Tooltip title={!canSubmit ? (disabledReason ?? '') : ''}>
                <span>
                  <Button type="submit" variant="contained" disabled={isPending || !canSubmit}>
                    {isPending ? t('common.loading') : t('common.save')}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export function CategoryFormPage({ mode, categoryId, initialMenuId }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { currentTenantId, hasShopPermission, hasPermissionForTarget } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')

  const canReadCategory =
    mode === 'edit'
      ? hasPermissionForTarget(
          PermissionActions.READ_MENU_CATEGORY,
          targetWithParents(
            'MENU_CATEGORY',
            categoryId,
            currentTenantId,
            shopParents(selectedShopId, currentTenantId),
          ),
        )
      : true
  const canReadMenus = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_MENU, selectedShopId),
  )

  const { data: category, isLoading: isLoadingCategory } = useMenuCategory(
    mode === 'edit' ? categoryId : undefined,
    { enabled: canReadCategory },
  )

  const { data: menusResult, isLoading: isLoadingMenus } = useMenus(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadMenus },
  )

  const menus = menusResult?.data ?? []

  const { mutate: createCategory, isPending: isCreating } = useCreateMenuCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateMenuCategory()
  const isPending = isCreating || isUpdating

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleCreate(value: CategoryFormValue) {
    if (!canCreateCategory(value.menuId)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    createCategory(
      {
        name: value.name,
        ...(value.description.trim() && { description: value.description.trim() }),
        menuId: value.menuId,
      },
      {
        onSuccess: () => {
          showToast(t('sale.category.createdToast'))
          goTo(`${ROUTES.catalog}/menus/${value.menuId}`)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUpdate(currentCategory: MenuCategoryResponseDto, value: CategoryFormValue) {
    if (!canUpdateCategory(currentCategory)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    updateCategory(
      {
        id: currentCategory.id,
        data: {
          name: value.name,
          ...(value.description.trim() && { description: value.description.trim() }),
        },
      },
      {
        onSuccess: () => {
          showToast(t('sale.category.updatedToast'))
          goTo(`${ROUTES.catalog}/menus/${currentCategory.menuId}`)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function canCreateCategory(menuId: string): boolean {
    const menu = menus.find((item) => item.id === menuId)
    return hasPermissionForTarget(
      PermissionActions.CREATE_MENU_CATEGORY,
      targetWithParents(
        'MENU',
        menuId,
        currentTenantId,
        shopParents(menu?.shopId ?? selectedShopId, currentTenantId),
      ),
    )
  }

  function canUpdateCategory(currentCategory: MenuCategoryResponseDto): boolean {
    const menu = menus.find((item) => item.id === currentCategory.menuId)
    return hasPermissionForTarget(
      PermissionActions.UPDATE_MENU_CATEGORY,
      targetWithParents(
        'MENU_CATEGORY',
        currentCategory.id,
        currentTenantId,
        menuParents(currentCategory.menuId, menu?.shopId ?? selectedShopId, currentTenantId),
      ),
    )
  }

  if (mode === 'edit' && !canReadCategory) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">{unauthorizedReason}</Alert>
      </Box>
    )
  }

  if ((mode === 'edit' && isLoadingCategory) || isLoadingMenus) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (mode === 'edit') {
    if (!category) {
      return (
        <Box sx={{ p: 4 }}>
          <Typography color="text.secondary">{t('sale.category.emptyState')}</Typography>
        </Box>
      )
    }

    return (
      <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)} sx={{ mb: 2 }}>
          {t('common.back')}
        </Button>

        <CategoryFormCard
          key={category.id}
          title={t('sale.catalog.categoryEditTitle')}
          initial={{
            name: category.name,
            description: category.description ?? '',
            menuId: category.menuId,
          }}
          menus={menus}
          disableMenuSelection
          selectedMenuLabel={menus.find((menu) => menu.id === category.menuId)?.name}
          isPending={isPending}
          disabled={!canUpdateCategory(category)}
          disabledReason={unauthorizedReason}
          canSubmitValue={() => canUpdateCategory(category)}
          onCancel={() => goTo(`${ROUTES.catalog}/menus/${category.menuId}`)}
          onSubmit={(value) => handleUpdate(category, value)}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)} sx={{ mb: 2 }}>
        {t('common.back')}
      </Button>

      <CategoryFormCard
        key={`create-category-${initialMenuId ?? 'no-menu'}`}
        title={t('sale.catalog.categoryCreateTitle')}
        initial={{
          name: '',
          description: '',
          menuId: initialMenuId ?? '',
        }}
        menus={menus}
        disableMenuSelection={false}
        isPending={isPending}
        disabled={false}
        disabledReason={unauthorizedReason}
        canSubmitValue={(value) => canCreateCategory(value.menuId)}
        onCancel={(menuId) => goTo(menuId ? `${ROUTES.catalog}/menus/${menuId}` : ROUTES.catalog)}
        onSubmit={handleCreate}
      />
    </Box>
  )
}
