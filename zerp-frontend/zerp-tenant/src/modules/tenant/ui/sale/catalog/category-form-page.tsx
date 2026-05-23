'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useCreateMenuCategory,
  useMenuCategory,
  useUpdateMenuCategory,
} from '../../../hooks/use-menu-categories'
import { useMenus } from '../../../hooks/use-menus'
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
  subtitle,
  initial,
  menus,
  disableMenuSelection,
  selectedMenuLabel,
  isPending,
  onCancel,
  onSubmit,
}: {
  title: string
  subtitle: string
  initial: CategoryFormValue
  menus: MenuResponseDto[]
  disableMenuSelection: boolean
  selectedMenuLabel?: string
  isPending: boolean
  onCancel: (menuId: string) => void
  onSubmit: (value: CategoryFormValue) => void
}) {
  const { t } = useI18n()
  const theme = useTheme()
  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [menuId, setMenuId] = useState(initial.menuId)

  const accentMain = '#2563eb'
  const accentDeep = '#163c8f'
  const softBorder = alpha(accentMain, theme.palette.mode === 'dark' ? 0.24 : 0.16)
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.56 : 0.82),
      transition: 'box-shadow .18s ease, border-color .18s ease, transform .18s ease',
      '&:hover': {
        boxShadow: `0 10px 24px ${alpha(accentMain, 0.08)}`,
      },
      '&.Mui-focused': {
        boxShadow: `0 14px 30px ${alpha(accentMain, 0.12)}`,
      },
    },
  } as const

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: 'hidden',
        borderRadius: 6,
        borderColor: softBorder,
        background: theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 26%), linear-gradient(145deg, rgba(15,23,42,0.98), rgba(17,24,39,0.92))'
          : 'radial-gradient(circle at top left, rgba(37,99,235,0.12), transparent 26%), linear-gradient(145deg, rgba(255,255,255,0.98), rgba(247,250,252,0.94))',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 24px 60px rgba(2, 6, 23, 0.34)'
          : '0 24px 56px rgba(15, 23, 42, 0.08)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Avatar
              sx={{
                width: 58,
                height: 58,
                bgcolor: alpha(accentMain, 0.12),
                color: accentDeep,
                boxShadow: `0 0 0 10px ${alpha(accentMain, 0.06)}`,
              }}
            >
              <CategoryRoundedIcon />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 0.5 }}>
                {title}
              </Typography>
              <Typography color="text.secondary">{subtitle}</Typography>
            </Box>
          </Stack>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!name.trim() || !menuId) return
              onSubmit({ name: name.trim(), description, menuId })
            }}
          >
            <Stack spacing={2.25}>
              <TextField
                label={t('sale.category.form.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                sx={fieldSx}
              />

              <TextField
                label={t('sale.category.form.description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={fieldSx}
              />

              <FormControl fullWidth required sx={fieldSx}>
                <InputLabel>{t('sale.category.form.menuId')}</InputLabel>
                <Select
                  value={menuId}
                  label={t('sale.category.form.menuId')}
                  onChange={(e) => setMenuId(e.target.value)}
                  disabled={disableMenuSelection}
                >
                  {menus.map((menu) => (
                    <MenuItem key={menu.id} value={menu.id}>
                      {menu.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {disableMenuSelection && selectedMenuLabel && (
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    borderColor: alpha(theme.palette.text.primary, 0.08),
                    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.52 : 0.74),
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('sale.catalog.selectedMenuLabel')}: {selectedMenuLabel}
                  </Typography>
                </Paper>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1.25,
                  pt: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  onClick={() => onCancel(menuId)}
                  disabled={isPending}
                  sx={{
                    borderRadius: 999,
                    px: 2.4,
                    py: 1.05,
                    color: 'text.secondary',
                    backgroundColor: alpha(theme.palette.text.primary, 0.04),
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isPending}
                  startIcon={<AutoAwesomeRoundedIcon />}
                  sx={{
                    borderRadius: 999,
                    px: 2.8,
                    py: 1.1,
                    boxShadow: `0 14px 30px ${alpha(theme.palette.primary.main, 0.28)}`,
                  }}
                >
                  {isPending ? t('common.loading') : t('common.save')}
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
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

  const { data: category, isLoading: isLoadingCategory } = useMenuCategory(
    mode === 'edit' ? categoryId : undefined,
  )

  const { data: menusResult, isLoading: isLoadingMenus } = useMenus({
    pagination: { page: 1, perPage: 200 },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const menus = menusResult?.data ?? []

  const { mutate: createCategory, isPending: isCreating } = useCreateMenuCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateMenuCategory()
  const isPending = isCreating || isUpdating

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleCreate(value: CategoryFormValue) {
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
      <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => goTo(ROUTES.catalog)}
          sx={{ alignSelf: 'flex-start', borderRadius: 999, px: 1.6, py: 0.85 }}
        >
          {t('common.back')}
        </Button>

        <CategoryFormCard
          key={category.id}
          title={t('sale.catalog.categoryEditTitle')}
          subtitle="Kategori bilgilerini premium bir yuzeyde duzenleyin ve menu hiyerarsisini dengeli tutun."
          initial={{
            name: category.name,
            description: category.description ?? '',
            menuId: category.menuId,
          }}
          menus={menus}
          disableMenuSelection
          selectedMenuLabel={menus.find((menu) => menu.id === category.menuId)?.name}
          isPending={isPending}
          onCancel={() => goTo(`${ROUTES.catalog}/menus/${category.menuId}`)}
          onSubmit={(value) => handleUpdate(category, value)}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => goTo(ROUTES.catalog)}
        sx={{ alignSelf: 'flex-start', borderRadius: 999, px: 1.6, py: 0.85 }}
      >
        {t('common.back')}
      </Button>

      <CategoryFormCard
        key={`create-category-${initialMenuId ?? 'no-menu'}`}
        title={t('sale.catalog.categoryCreateTitle')}
        subtitle="Yeni bir kategori tanimlayin, dogru menuye baglayin ve katalog akisina zarif bir bolum ekleyin."
        initial={{
          name: '',
          description: '',
          menuId: initialMenuId ?? '',
        }}
        menus={menus}
        disableMenuSelection={false}
        isPending={isPending}
        onCancel={(menuId) => goTo(menuId ? `${ROUTES.catalog}/menus/${menuId}` : ROUTES.catalog)}
        onSubmit={handleCreate}
      />
    </Box>
  )
}
