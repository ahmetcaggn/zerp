'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
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
  initial,
  isPending,
  onCancel,
  onSubmit,
}: {
  title: string
  initial: ProductFormValue
  isPending: boolean
  onCancel: () => void
  onSubmit: (value: ProductFormValue) => void
}) {
  const { t } = useI18n()

  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [preparationTime, setPreparationTime] = useState(initial.preparationTime)
  const [isActive, setIsActive] = useState(initial.isActive)

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {title}
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            onSubmit({ name: name.trim(), description, preparationTime, isActive })
          }}
        >
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label={t('sale.product.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label={t('sale.product.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr' }, gap: 2 }}>
              <TextField
                label={t('sale.product.form.preparationTime')}
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Box>

            <FormControlLabel
              control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
              label={t('sale.product.form.isActive')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={onCancel} disabled={isPending}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="contained" disabled={isPending}>
                {isPending ? t('common.loading') : t('common.save')}
              </Button>
            </Box>
          </Box>
        </form>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)}>
            {t('common.back')}
          </Button>
        </Box>

        <ProductFormCard
          key={product.id}
          title={t('sale.catalog.productDetailTitle')}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => goTo(ROUTES.catalog)}>
          {t('common.back')}
        </Button>
      </Box>

      <ProductFormCard
        key="create-product"
        title={t('sale.catalog.productCreateTitle')}
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
