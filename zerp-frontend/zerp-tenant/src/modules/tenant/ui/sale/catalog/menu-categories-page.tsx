'use client'

import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LaunchIcon from '@mui/icons-material/Launch'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteMenuCategory, useMenuCategories } from '../../../hooks/use-menu-categories'
import { useMenu } from '../../../hooks/use-menus'

interface Props {
  menuId: string
}

export function MenuCategoriesPage({ menuId }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()

  const { data: menu, isLoading: isLoadingMenu } = useMenu(menuId)
  const { data: categoriesResult, isLoading: isLoadingCategories } = useMenuCategories({
    pagination: { page: 1, perPage: 200 },
    sort: { field: 'name', order: 'ASC' },
    filter: { 'menu.id': menuId },
  })

  const categories = categoriesResult?.data ?? []

  const { mutate: deleteCategory } = useDeleteMenuCategory()

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleDelete(id: string) {
    deleteCategory(id, {
      onSuccess: () => showToast(t('sale.category.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  if (isLoadingMenu || isLoadingCategories) {
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)}>
          {t('sale.catalog.backToCatalog')}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => goTo(`${ROUTES.catalog}/menus/${menuId}/edit`)}>
            {t('sale.menu.editButton')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => goTo(`${ROUTES.catalog}/categories/new?menuId=${menuId}`)}
          >
            {t('sale.category.createButton')}
          </Button>
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
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid key={category.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ display: 'grid', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>
                        {category.description || t('sale.catalog.noDescription')}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                        <Button
                          size="small"
                          endIcon={<LaunchIcon fontSize="small" />}
                          onClick={() => goTo(`${ROUTES.catalog}/categories/${category.id}`)}
                        >
                          {t('sale.catalog.openMenuItemsButton')}
                        </Button>

                        <Box>
                          <Tooltip title={t('common.edit')}>
                            <IconButton
                              size="small"
                              onClick={() => goTo(`${ROUTES.catalog}/categories/${category.id}/edit`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete')}>
                            <IconButton size="small" color="error" onClick={() => handleDelete(category.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
