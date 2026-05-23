'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
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

import { useCreateProduct, useProduct, useUpdateProduct } from '../../../hooks/use-products'
import type { ProductResponseDto } from '../../../types/sale'
import { ProductExtraOptionManager } from './product-extra-option-manager'
import { ProductRecipeManager } from './product-recipe-manager'

interface Props {
  mode: 'create' | 'edit'
  productId?: string
}

type ProductFormValue = {
  name: string
  description: string
  preparationTime: string
  isActive: boolean
}

function ProductFormCard({
  title,
  subtitle,
  initial,
  isPending,
  onCancel,
  onSubmit,
}: {
  title: string
  subtitle: string
  initial: ProductFormValue
  isPending: boolean
  onCancel: () => void
  onSubmit: (value: ProductFormValue) => void
}) {
  const { t } = useI18n()
  const theme = useTheme()

  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [preparationTime, setPreparationTime] = useState(initial.preparationTime)
  const [isActive, setIsActive] = useState(initial.isActive)

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
              <Inventory2RoundedIcon />
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
              if (!name.trim()) return
              onSubmit({ name: name.trim(), description, preparationTime, isActive })
            }}
          >
            <Stack spacing={2.25}>
              <TextField
                label={t('sale.product.form.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                sx={fieldSx}
              />

              <TextField
                label={t('sale.product.form.description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={fieldSx}
              />

              <TextField
                label={t('sale.product.form.preparationTime')}
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
                sx={fieldSx}
              />

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
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>{t('sale.product.form.isActive')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Urunu katalogta gorunur ve servis edilebilir durumda tutar.
                    </Typography>
                  </Box>
                  <FormControlLabel
                    sx={{ m: 0 }}
                    control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                    label=""
                  />
                </Stack>
              </Paper>

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
                  onClick={onCancel}
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

export function ProductEditorPage({ mode, productId }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope } = useShopScope()

  const { data: product, isLoading: isLoadingProduct } = useProduct(
    mode === 'edit' ? productId : undefined,
  )

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()
  const isPending = isCreating || isUpdating

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function mapFormToPayload(value: ProductFormValue) {
    return {
      name: value.name,
      ...(value.description.trim() && { description: value.description.trim() }),
      ...(value.preparationTime && { preparationTime: Number(value.preparationTime) }),
      isActive: value.isActive,
    }
  }

  function handleCreate(value: ProductFormValue) {
    if (scope.mode !== 'SHOP') {
      showToast(t('sale.catalog.selectShopWarning'), { severity: 'warning' })
      return
    }

    createProduct(
      { ...mapFormToPayload(value), shopId: scope.shopId },
      {
        onSuccess: (created) => {
          showToast(t('sale.product.createdToast'))
          goTo(`${ROUTES.catalog}/products/${created.id}`)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUpdate(currentProduct: ProductResponseDto, value: ProductFormValue) {
    updateProduct(
      { id: currentProduct.id, data: mapFormToPayload(value) },
      {
        onSuccess: () => showToast(t('sale.product.updatedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  if (mode === 'edit') {
    if (isLoadingProduct) {
      return (
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )
    }

    if (!product) {
      return (
        <Box sx={{ p: 4 }}>
          <Typography color="text.secondary">{t('sale.product.emptyState')}</Typography>
        </Box>
      )
    }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => goTo(ROUTES.catalog)}
        sx={{
          alignSelf: 'flex-start',
          borderRadius: 999,
          px: 1.6,
          py: 0.85,
        }}
      >
        {t('common.back')}
      </Button>

      <ProductFormCard
        key={product.id}
        title={t('sale.catalog.productDetailTitle')}
        subtitle="Urun bilgilerini modern bir yuzeyde duzenleyin ve servis detaylarini hizlica guncelleyin."
        initial={{
          name: product.name,
          description: product.description ?? '',
            preparationTime: product.preparationTime != null ? String(product.preparationTime) : '',
            isActive: product.isActive,
          }}
          isPending={isPending}
          onCancel={() => goTo(ROUTES.catalog)}
          onSubmit={(value) => handleUpdate(product, value)}
        />

        <ProductRecipeManager productId={product.id} productName={product.name} />
        <ProductExtraOptionManager productId={product.id} productName={product.name} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => goTo(ROUTES.catalog)}
        sx={{
          alignSelf: 'flex-start',
          borderRadius: 999,
          px: 1.6,
          py: 0.85,
        }}
      >
        {t('common.back')}
      </Button>

      <ProductFormCard
        key="create-product"
        title={t('sale.catalog.productCreateTitle')}
        subtitle="Yeni bir urun tanimlayin, temel operasyon bilgilerini girin ve katalog yapisina hizlica ekleyin."
        initial={{
          name: '',
          description: '',
          preparationTime: '',
          isActive: true,
        }}
        isPending={isPending}
        onCancel={() => goTo(ROUTES.catalog)}
        onSubmit={handleCreate}
      />
    </Box>
  )
}
