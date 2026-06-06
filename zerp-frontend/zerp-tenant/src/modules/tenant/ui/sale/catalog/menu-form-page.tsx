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
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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

import { useCreateMenu, useMenu, useUpdateMenu } from '../../../hooks/use-menus'
import { shopParents, targetWithParents } from '../../../permissions/permission-targets'
import type { MenuLanguage, MenuResponseDto } from '../../../types/sale'

interface Props {
  mode: 'create' | 'edit'
  menuId?: string
}

type MenuFormValue = {
  name: string
  description: string
  language: MenuLanguage
  active: boolean
}

function MenuFormCard({
  title,
  initial,
  isPending,
  disabled,
  disabledReason,
  onCancel,
  onSubmit,
}: {
  title: string
  initial: MenuFormValue
  isPending: boolean
  disabled: boolean
  disabledReason?: string
  onCancel: () => void
  onSubmit: (value: MenuFormValue) => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [language, setLanguage] = useState<MenuLanguage>(initial.language)
  const [active, setActive] = useState(initial.active)

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {title}
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (disabled) return
            if (!name.trim()) return
            onSubmit({ name: name.trim(), description, language, active })
          }}
        >
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label={t('sale.menu.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              disabled={disabled}
            />
            <TextField
              label={t('sale.menu.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              disabled={disabled}
            />
            <FormControl fullWidth disabled={disabled}>
              <InputLabel>{t('sale.menu.form.language')}</InputLabel>
              <Select
                value={language}
                label={t('sale.menu.form.language')}
                onChange={(e) => setLanguage(e.target.value as MenuLanguage)}
              >
                <MenuItem value="TR">{t('sale.menu.language.tr')}</MenuItem>
                <MenuItem value="EN">{t('sale.menu.language.en')}</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={active}
                  disabled={disabled}
                  onChange={(e) => setActive(e.target.checked)}
                />
              }
              label={t('sale.menu.form.isActive')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              <Button onClick={onCancel} disabled={isPending}>
                {t('common.cancel')}
              </Button>
              <Tooltip title={disabledReason ?? ''}>
                <span>
                  <Button type="submit" variant="contained" disabled={isPending || disabled}>
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

export function MenuFormPage({ mode, menuId }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { currentTenantId, hasShopPermission, hasPermissionForTarget } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')

  const canCreateMenu = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.CREATE_MENU, selectedShopId),
  )
  const canReadMenu =
    mode === 'edit'
      ? hasPermissionForTarget(
          PermissionActions.READ_MENU,
          targetWithParents(
            'MENU',
            menuId,
            currentTenantId,
            shopParents(selectedShopId, currentTenantId),
          ),
        )
      : true

  const { data: menu, isLoading: isLoadingMenu } = useMenu(mode === 'edit' ? menuId : undefined, {
    enabled: canReadMenu,
  })

  const { mutate: createMenu, isPending: isCreating } = useCreateMenu()
  const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu()
  const isPending = isCreating || isUpdating

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleCreate(value: MenuFormValue) {
    if (scope.mode !== 'SHOP') {
      showToast(t('sale.catalog.selectShopWarning'), { severity: 'warning' })
      return
    }
    if (!canCreateMenu) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    createMenu(
      {
        name: value.name,
        ...(value.description.trim() && { description: value.description.trim() }),
        active: value.active,
        language: value.language,
        shopId: scope.shopId,
      },
      {
        onSuccess: (created) => {
          showToast(t('sale.menu.createdToast'))
          goTo(`${ROUTES.catalog}/menus/${created.id}`)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUpdate(currentMenu: MenuResponseDto, value: MenuFormValue) {
    const canUpdateMenu = hasPermissionForTarget(
      PermissionActions.UPDATE_MENU,
      targetWithParents(
        'MENU',
        currentMenu.id,
        currentTenantId,
        shopParents(currentMenu.shopId, currentTenantId),
      ),
    )
    if (!canUpdateMenu) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    updateMenu(
      {
        id: currentMenu.id,
        data: {
          name: value.name,
          ...(value.description.trim() && { description: value.description.trim() }),
          language: value.language,
          active: value.active,
        },
      },
      {
        onSuccess: () => {
          showToast(t('sale.menu.updatedToast'))
          goTo(`${ROUTES.catalog}/menus/${currentMenu.id}`)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  if (mode === 'edit') {
    if (!canReadMenu) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert severity="warning">{unauthorizedReason}</Alert>
        </Box>
      )
    }

    if (isLoadingMenu) {
      return (
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
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

    const canUpdateMenu = hasPermissionForTarget(
      PermissionActions.UPDATE_MENU,
      targetWithParents(
        'MENU',
        menu.id,
        currentTenantId,
        shopParents(menu.shopId, currentTenantId),
      ),
    )

    return (
      <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)}>
            {t('common.back')}
          </Button>
        </Box>
        <MenuFormCard
          key={menu.id}
          title={t('sale.catalog.menuEditTitle')}
          initial={{
            name: menu.name,
            description: menu.description ?? '',
            language: menu.language ?? 'TR',
            active: menu.active,
          }}
          isPending={isPending}
          disabled={!canUpdateMenu}
          disabledReason={unauthorizedReason}
          onCancel={() => goTo(`${ROUTES.catalog}/menus/${menu.id}`)}
          onSubmit={(value) => handleUpdate(menu, value)}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)}>
          {t('common.back')}
        </Button>
      </Box>
      <MenuFormCard
        key="create-menu"
        title={t('sale.catalog.menuCreateTitle')}
        initial={{ name: '', description: '', language: 'TR', active: false }}
        isPending={isPending}
        disabled={!selectedShopId || !canCreateMenu}
        disabledReason={!selectedShopId ? t('sale.catalog.selectShopWarning') : unauthorizedReason}
        onCancel={() => goTo(ROUTES.catalog)}
        onSubmit={handleCreate}
      />
    </Box>
  )
}
