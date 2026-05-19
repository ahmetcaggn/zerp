'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useMenuCategories } from '../../../hooks/use-menu-categories'
import {
  useCreateMenuItem,
  useMenuItem,
  useUpdateMenuItem,
  useUploadMenuItemImage,
} from '../../../hooks/use-menu-items'
import { useProducts } from '../../../hooks/use-products'
import type {
  MenuCategoryResponseDto,
  MenuItemProductItemDto,
  MenuItemResponseDto,
  ProductResponseDto,
} from '../../../types/sale'
import { MenuItemProductMultiSelectField } from '../shared/menu-item-product-multi-select-field'

interface Props {
  mode: 'create' | 'edit'
  menuItemId?: string
  initialCategoryId?: string
  showLinkedProducts?: boolean
}

type MenuItemFormValue = {
  name: string
  description: string
  price: string
  imageId: string
  categoryId: string
  productItems: MenuItemProductItemDto[]
}

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp'
const PREVIEW_IMAGE_FALLBACK = 'https://via.placeholder.com/400x260?text=No+Image'

function buildPublicImageUrl(imageId?: string): string {
  if (!imageId) {
    return PREVIEW_IMAGE_FALLBACK
  }
  return `/api/sale/public/images/${encodeURIComponent(imageId)}`
}

function MenuItemPreviewCard({
  name,
  description,
  price,
  imageSrc,
  selectedProducts,
}: {
  name: string
  description: string
  price: string
  imageSrc: string
  selectedProducts: string[]
}) {
  const { t } = useI18n()
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null)

  const resolvedImage = failedImageSrc === imageSrc ? PREVIEW_IMAGE_FALLBACK : imageSrc
  const displayName = name.trim() || t('sale.menuItem.form.name')
  const displayDescription = description.trim() || t('sale.menuItem.form.description')
  const numericPrice = Number(price)
  const displayPrice = Number.isFinite(numericPrice) && numericPrice > 0
    ? `₺${numericPrice.toFixed(2)}`
    : '₺0.00'

  return (
    <Card variant="outlined" sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {t('sale.menuItem.preview.title')}
        </Typography>

        <Card variant="outlined" sx={{ p: 1 }}>
          <Box
            component="img"
            src={resolvedImage}
            alt={displayName}
            onError={() => setFailedImageSrc(imageSrc)}
            sx={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 1 }}
          />

          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'flex-start' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
                {displayName}
              </Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {displayPrice}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1.5 }}>
              {displayDescription}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {t('sale.menuItem.preview.products')}: {selectedProducts.length}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {selectedProducts.length === 0 ? (
                <Chip size="small" variant="outlined" label={t('sale.menuItem.preview.noProducts')} />
              ) : (
                selectedProducts.map((productName) => (
                  <Chip key={productName} size="small" label={productName} />
                ))
              )}
            </Box>
          </Box>
        </Card>
      </CardContent>
    </Card>
  )
}

function MenuItemQuickActions({
  onNavigate,
  menuId,
  categoryId,
}: {
  onNavigate: (path: string) => void
  menuId?: string
  categoryId?: string
}) {
  const { t } = useI18n()

  const categoriesPath = menuId ? `${ROUTES.catalogMenus}/${menuId}` : ROUTES.catalog

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => onNavigate(categoriesPath)}>
        {t('sale.catalog.backToCategories')}
      </Button>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={() => onNavigate(ROUTES.catalog)}>
          {t('sale.catalog.quickCatalog')}
        </Button>
        <Button size="small" variant="outlined" onClick={() => onNavigate(categoriesPath)}>
          {t('sale.catalog.quickCategories')}
        </Button>
        {menuId && (
          <Button size="small" variant="outlined" onClick={() => onNavigate(`${ROUTES.catalogMenus}/${menuId}`)}>
            {t('sale.catalog.quickMenu')}
          </Button>
        )}
        {categoryId && (
          <Button size="small" variant="outlined" onClick={() => onNavigate(`${ROUTES.catalog}/categories/${categoryId}`)}>
            {t('sale.catalog.quickCategory')}
          </Button>
        )}
      </Box>
    </Box>
  )
}

function MenuItemFormCard({
  title,
  initial,
  categories,
  products,
  lockCategory,
  selectedCategoryLabel,
  showLinkedProducts,
  isPending,
  onOpenProduct,
  onCancel,
  onSubmit,
}: {
  title: string
  initial: MenuItemFormValue
  categories: MenuCategoryResponseDto[]
  products: ProductResponseDto[]
  lockCategory: boolean
  selectedCategoryLabel?: string
  showLinkedProducts: boolean
  isPending: boolean
  onOpenProduct: (id: string) => void
  onCancel: (categoryId: string) => void
  onSubmit: (value: MenuItemFormValue) => void
}) {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [price, setPrice] = useState(initial.price)
  const [imageId, setImageId] = useState(initial.imageId)
  const [categoryId, setCategoryId] = useState(initial.categoryId)
  const [productItems, setProductItems] = useState<MenuItemProductItemDto[]>(initial.productItems)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

  const { mutateAsync: uploadMenuItemImage, isPending: isUploadingImage } = useUploadMenuItemImage()

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl)
      }
    }
  }, [localPreviewUrl])

  const selectedProducts = useMemo(
    () =>
      productItems
        .map((item) => {
          const product = products.find((candidate) => candidate.id === item.productId)
          if (!product) {
            return null
          }
          return { product, quantity: item.quantity }
        })
        .filter((entry): entry is { product: ProductResponseDto; quantity: number } => Boolean(entry)),
    [products, productItems],
  )

  const selectedProductNames = useMemo(
    () => selectedProducts.map((entry) => `${entry.product.name} x${entry.quantity}`),
    [selectedProducts],
  )

  const previewImageSrc = localPreviewUrl ?? buildPublicImageUrl(imageId)
  const isSubmitDisabled = isPending || isUploadingImage

  async function handleImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    event.target.value = ''

    if (!selectedFile) {
      return
    }

    if (!categoryId) {
      showToast(t('sale.menuItem.form.selectCategoryBeforeImage'), { severity: 'warning' })
      return
    }

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl)
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setLocalPreviewUrl(objectUrl)

    try {
      const response = await uploadMenuItemImage({ file: selectedFile, categoryId })
      setImageId(response.imageId)
      showToast(t('sale.menuItem.form.imageUploadSuccess'))
    } catch (err) {
      showToast(getUserFriendlyError(err), { severity: 'error' })
    }
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.25fr) minmax(320px, 0.75fr)' }, gap: 3 }}>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              {title}
            </Typography>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!name.trim() || !price || !categoryId) return
                onSubmit({ name: name.trim(), description, price, imageId, categoryId, productItems })
              }}
            >
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label={t('sale.menuItem.form.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  label={t('sale.menuItem.form.description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />

                <TextField
                  label={t('sale.menuItem.form.price')}
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  fullWidth
                  inputProps={{ min: 0, step: '0.01' }}
                />

                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    disabled={isUploadingImage || isPending}
                  >
                    {isUploadingImage ? t('sale.menuItem.form.imageUploading') : t('sale.menuItem.form.imageUpload')}
                    <input
                      hidden
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES}
                      onChange={handleImageSelected}
                    />
                  </Button>
                  <FormHelperText>
                    {imageId
                      ? `${t('sale.menuItem.form.imageReady')}: ${imageId}`
                      : t('sale.menuItem.form.imageHint')}
                  </FormHelperText>
                </Box>

                {lockCategory ? (
                  <Box>
                    <Typography variant="subtitle2">{t('sale.menuItem.form.categoryId')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCategoryLabel || t('sale.catalog.selectedCategoryLabel')}
                    </Typography>
                  </Box>
                ) : (
                  <FormControl fullWidth required>
                    <InputLabel>{t('sale.menuItem.form.categoryId')}</InputLabel>
                    <Select
                      value={categoryId}
                      label={t('sale.menuItem.form.categoryId')}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name} {category.menuName ? `(${category.menuName})` : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <MenuItemProductMultiSelectField
                  products={products}
                  productItems={productItems}
                  onChange={setProductItems}
                  label={t('sale.menuItem.form.productIds')}
                  placeholder={t('sale.menuItem.form.productSearchPlaceholder')}
                  quantityLabel={t('sale.menuItem.form.quantity')}
                  disabled={isSubmitDisabled}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                  <Button onClick={() => onCancel(categoryId)} disabled={isSubmitDisabled}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
                    {isSubmitDisabled ? t('common.loading') : t('common.save')}
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>

        {showLinkedProducts && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {t('sale.catalog.linkedProductsTitle')}
              </Typography>
              {productItems.length === 0 ? (
                <Typography color="text.secondary">{t('sale.catalog.noLinkedProducts')}</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {productItems.map((item) => (
                    <Button
                      key={item.productId}
                      size="small"
                      variant="outlined"
                      onClick={() => onOpenProduct(item.productId)}
                    >
                      {(products.find((product) => product.id === item.productId)?.name ?? item.productId) +
                        ` x${item.quantity}`}
                    </Button>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      <MenuItemPreviewCard
        name={name}
        description={description}
        price={price}
        imageSrc={previewImageSrc}
        selectedProducts={selectedProductNames}
      />
    </Box>
  )
}

export function MenuItemFormPage({
  mode,
  menuItemId,
  initialCategoryId,
  showLinkedProducts = false,
}: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const { data: menuItem, isLoading: isLoadingMenuItem } = useMenuItem(
    mode === 'edit' ? menuItemId : undefined,
  )

  const { data: categoriesResult, isLoading: isLoadingCategories } = useMenuCategories({
    pagination: { page: 1, perPage: 300 },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'menu.shop.id': selectedShopId } } : {}),
  })

  const { data: productsResult, isLoading: isLoadingProducts } = useProducts({
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const categories = useMemo(() => categoriesResult?.data ?? [], [categoriesResult?.data])
  const products = useMemo(() => productsResult?.data ?? [], [productsResult?.data])
  const categoriesById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories])

  const { mutate: createMenuItem, isPending: isCreating } = useCreateMenuItem()
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem()
  const isPending = isCreating || isUpdating

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleCreate(value: MenuItemFormValue) {
    createMenuItem(
      {
        name: value.name,
        ...(value.description.trim() && { description: value.description.trim() }),
        price: Number(value.price),
        ...(value.imageId.trim() && { imageId: value.imageId.trim() }),
        categoryId: value.categoryId,
        productItems: value.productItems,
      },
      {
        onSuccess: (created) => {
          showToast(t('sale.menuItem.createdToast'))
          goTo(`${ROUTES.catalog}/menu-items/${created.id}`)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUpdate(currentItem: MenuItemResponseDto, value: MenuItemFormValue) {
    updateMenuItem(
      {
        id: currentItem.id,
        data: {
          name: value.name,
          ...(value.description.trim() && { description: value.description.trim() }),
          price: Number(value.price),
          ...(value.imageId.trim() && { imageId: value.imageId.trim() }),
          productItems: value.productItems,
        },
      },
      {
        onSuccess: () => {
          showToast(t('sale.menuItem.updatedToast'))
          goTo(`${ROUTES.catalog}/menu-items/${currentItem.id}`)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  if ((mode === 'edit' && isLoadingMenuItem) || isLoadingCategories || isLoadingProducts) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (mode === 'edit') {
    if (!menuItem) {
      return (
        <Box sx={{ p: 4 }}>
          <Typography color="text.secondary">{t('sale.menuItem.emptyState')}</Typography>
        </Box>
      )
    }

    return (
      <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
        <MenuItemQuickActions
          onNavigate={goTo}
          menuId={categoriesById.get(menuItem.categoryId)?.menuId}
          categoryId={menuItem.categoryId}
        />

        <MenuItemFormCard
          key={menuItem.id}
          title={t('sale.catalog.menuItemEditTitle')}
          initial={{
            name: menuItem.name,
            description: menuItem.description ?? '',
            price: String(menuItem.price),
            imageId: menuItem.imageId ?? '',
            categoryId: menuItem.categoryId,
            productItems: menuItem.productItems ?? [],
          }}
          categories={categories}
          products={products}
          lockCategory
          selectedCategoryLabel={categories.find((item) => item.id === menuItem.categoryId)?.name}
          showLinkedProducts={showLinkedProducts}
          isPending={isPending}
          onOpenProduct={(id) => goTo(`${ROUTES.catalog}/products/${id}`)}
          onCancel={() => goTo(`${ROUTES.catalog}/categories/${menuItem.categoryId}`)}
          onSubmit={(value) => handleUpdate(menuItem, value)}
        />
      </Box>
    )
  }

  const isCategoryLockedInCreate = Boolean(initialCategoryId)
  const initialCategoryLabel = initialCategoryId
    ? categories.find((category) => category.id === initialCategoryId)?.name
    : undefined

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      <MenuItemQuickActions
        onNavigate={goTo}
        menuId={initialCategoryId ? categoriesById.get(initialCategoryId)?.menuId : undefined}
        categoryId={initialCategoryId}
      />

      <MenuItemFormCard
        key={`create-menu-item-${initialCategoryId ?? 'no-category'}`}
        title={t('sale.catalog.menuItemCreateTitle')}
        initial={{
          name: '',
          description: '',
          price: '',
          imageId: '',
          categoryId: initialCategoryId ?? '',
          productItems: [],
        }}
        categories={categories}
        products={products}
        lockCategory={isCategoryLockedInCreate}
        selectedCategoryLabel={initialCategoryLabel}
        showLinkedProducts={false}
        isPending={isPending}
        onOpenProduct={(id) => goTo(`${ROUTES.catalog}/products/${id}`)}
        onCancel={(categoryId) =>
          goTo(categoryId ? `${ROUTES.catalog}/categories/${categoryId}` : ROUTES.catalog)
        }
        onSubmit={handleCreate}
      />
    </Box>
  )
}
