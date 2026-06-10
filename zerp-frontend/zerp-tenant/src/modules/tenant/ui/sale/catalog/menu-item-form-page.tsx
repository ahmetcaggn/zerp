'use client'

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import MonitorWeightRoundedIcon from '@mui/icons-material/MonitorWeightRounded'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
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
import {
  menuCategoryParents,
  menuParents,
  shopParents,
  targetWithParents,
} from '../../../permissions/permission-targets'
import type {
  MenuCategoryResponseDto,
  MenuItemProductItemDto,
  MenuItemResponseDto,
  ProductResponseDto,
} from '../../../types/sale'
import { MenuItemProductMultiSelectField } from '../shared/menu-item-product-multi-select-field'
import { ProductImagePlaceholder } from '../shared/product-image-placeholder'

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
  calories: string
  weight: string
  ingredients: string[]
  allergens: string[]
  categoryId: string
  productItems: MenuItemProductItemDto[]
}

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp'
const PREVIEW_IMAGE_FALLBACK = 'https://via.placeholder.com/400x260?text=No+Image'
const CARD_IMAGE_FALLBACK = 'https://via.placeholder.com/150?text=No+Image'
const DETAIL_IMAGE_FALLBACK = 'https://via.placeholder.com/600x400?text=No+Image'

function parseCommaSeparatedList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function stringifyCommaSeparatedList(values?: string[]): string {
  if (!values || values.length === 0) {
    return ''
  }
  return values.join(', ')
}

function buildPublicImageUrl(imageId?: string): string {
  if (!imageId) {
    return PREVIEW_IMAGE_FALLBACK
  }
  return `/api/sale/public/images/${encodeURIComponent(imageId)}?size=ORIGINAL`
}

function MenuItemPreviewCard({
  name,
  description,
  price,
  imageSrc,
  calories,
  weight,
  ingredients,
  allergens,
  selectedProducts,
  isAvailable = true,
}: {
  name: string
  description: string
  price: string
  imageSrc: string
  calories: string
  weight: string
  ingredients: string[]
  allergens: string[]
  selectedProducts: string[]
  isAvailable?: boolean
}) {
  const { t } = useI18n()
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null)
  const [failedDetailImageSrc, setFailedDetailImageSrc] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const hasNoImage = !imageSrc || imageSrc === PREVIEW_IMAGE_FALLBACK || failedImageSrc === imageSrc
  const hasNoDetailImage = !imageSrc || imageSrc === PREVIEW_IMAGE_FALLBACK || failedDetailImageSrc === imageSrc

  const displayName = name.trim() || t('sale.menuItem.form.name')
  const displayDescription = description.trim() || t('sale.menuItem.form.description')
  const numericPrice = Number(price)
  const formattedPrice = Number.isFinite(numericPrice) ? numericPrice.toFixed(2) : '0.00'
  const displayPrice = t('restaurants.price', { price: formattedPrice })

  return (
    <>
      <Card variant="outlined" sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('sale.menuItem.preview.title')}
          </Typography>

          <Card
            elevation={1}
            onClick={() => setIsDetailOpen(true)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              p: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
          >
            {hasNoImage ? (
              <ProductImagePlaceholder
                sx={{
                  width: { xs: 104, sm: 100 },
                  height: { xs: 104, sm: 100 },
                  borderRadius: 2,
                }}
              />
            ) : (
              <Box
                component="img"
                src={imageSrc}
                alt={displayName}
                onError={() => setFailedImageSrc(imageSrc)}
                sx={{
                  width: { xs: 104, sm: 100 },
                  height: { xs: 104, sm: 100 },
                  flexShrink: 0,
                  borderRadius: 2,
                  objectFit: 'contain',
                  bgcolor: 'background.default',
                }}
              />
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minWidth: 0,
                ml: { xs: 1.5, sm: 2 },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  p: 0,
                  '&:last-child': { pb: 0 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 0.5,
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                    {displayName}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary.main"
                    fontWeight="bold"
                    sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {displayPrice}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {displayDescription}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddShoppingCartRoundedIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('restaurants.addToCart')}
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Card>

          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
              {t('sale.menuItem.preview.products')}: {selectedProducts.length}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {selectedProducts.length === 0 ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('sale.menuItem.preview.noProducts')}
                />
              ) : (
                selectedProducts.map((productName) => (
                  <Chip key={productName} size="small" label={productName} />
                ))
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onClose={() => setIsDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 800 }}>
          {t('productDetail.title')}
        </DialogTitle>
        <DialogContent>
          {hasNoDetailImage ? (
            <ProductImagePlaceholder
              sx={{
                width: '100%',
                height: { xs: 220, sm: 280 },
                borderRadius: 1.5,
                mb: 2,
              }}
            />
          ) : (
            <Box
              component="img"
              src={imageSrc}
              alt={displayName}
              onError={() => setFailedDetailImageSrc(imageSrc)}
              sx={{
                width: '100%',
                height: { xs: 220, sm: 280 },
                objectFit: 'contain',
                borderRadius: 1.5,
                mb: 2,
                bgcolor: 'background.default',
              }}
            />
          )}

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Typography variant="h5" fontWeight={800}>
                {displayName}
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={800} sx={{ whiteSpace: 'nowrap' }}>
                {displayPrice}
              </Typography>
            </Box>

            {displayDescription ? (
              <Typography color="text.secondary">
                {displayDescription}
              </Typography>
            ) : null}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<MonitorWeightRoundedIcon fontSize="small" />}
                label={weight || t('productDetail.notAvailable')}
                variant="outlined"
              />
              <Chip
                icon={<LocalFireDepartmentRoundedIcon fontSize="small" />}
                label={calories !== undefined && calories !== null && calories !== ''
                  ? t('productDetail.kcal', { value: calories })
                  : t('productDetail.notAvailable')}
                variant="outlined"
              />
            </Stack>

            <Divider />

            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {t('productDetail.ingredients')}
              </Typography>
              {ingredients && ingredients.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ingredients.map((ingredient) => (
                    <Chip key={ingredient} label={ingredient} size="small" variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('productDetail.notAvailable')}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="error.main" gutterBottom>
                {t('productDetail.allergens')}
              </Typography>
              {allergens && allergens.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allergens.map((allergen) => (
                    <Chip key={allergen} label={allergen} size="small" color="error" variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('productDetail.notAvailable')}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setIsDetailOpen(false)} color="inherit">
            {t('productDetail.close')}
          </Button>
          <Button
            variant="contained"
            disabled={!isAvailable}
          >
            {t('restaurants.addToCart')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
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

  const categoriesPath = categoryId
    ? `${ROUTES.catalog}/categories/${categoryId}`
    : menuId
      ? `${ROUTES.catalogMenus}/${menuId}`
      : ROUTES.catalog

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        mb: 2,
      }}
    >
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
          <Button
            size="small"
            variant="outlined"
            onClick={() => onNavigate(`${ROUTES.catalogMenus}/${menuId}`)}
          >
            {t('sale.catalog.quickMenu')}
          </Button>
        )}
        {categoryId && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onNavigate(`${ROUTES.catalog}/categories/${categoryId}`)}
          >
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
  disabled,
  disabledReason,
  canSubmitValue,
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
  disabled: boolean
  disabledReason?: string
  canSubmitValue: (value: MenuItemFormValue) => boolean
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
  const [calories, setCalories] = useState(initial.calories)
  const [weight, setWeight] = useState(initial.weight)
  const [ingredientsInput, setIngredientsInput] = useState(
    stringifyCommaSeparatedList(initial.ingredients),
  )
  const [allergensInput, setAllergensInput] = useState(
    stringifyCommaSeparatedList(initial.allergens),
  )
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
        .filter((entry): entry is { product: ProductResponseDto; quantity: number } =>
          Boolean(entry),
        ),
    [products, productItems],
  )

  const selectedProductNames = useMemo(
    () => selectedProducts.map((entry) => `${entry.product.name} x${entry.quantity}`),
    [selectedProducts],
  )

  const previewImageSrc = localPreviewUrl ?? buildPublicImageUrl(imageId)
  const currentValue: MenuItemFormValue = {
    name: name.trim(),
    description,
    price,
    imageId,
    calories,
    weight,
    ingredients: parseCommaSeparatedList(ingredientsInput),
    allergens: parseCommaSeparatedList(allergensInput),
    categoryId,
    productItems,
  }
  const canSubmit = !disabled && canSubmitValue(currentValue)
  const isSubmitDisabled = isPending || isUploadingImage || !canSubmit

  async function handleImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    event.target.value = ''

    if (!selectedFile) {
      return
    }
    if (!canSubmit) {
      showToast(disabledReason ?? t('common.unauthorized'), { severity: 'warning' })
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.25fr) minmax(320px, 0.75fr)' },
        gap: 3,
      }}
    >
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              {title}
            </Typography>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!canSubmit) return
                if (!name.trim() || !price || !categoryId) return
                onSubmit({
                  name: name.trim(),
                  description,
                  price,
                  imageId,
                  calories,
                  weight,
                  ingredients: parseCommaSeparatedList(ingredientsInput),
                  allergens: parseCommaSeparatedList(allergensInput),
                  categoryId,
                  productItems,
                })
              }}
            >
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label={t('sale.menuItem.form.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  disabled={disabled}
                />

                <TextField
                  label={t('sale.menuItem.form.description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  disabled={disabled}
                />

                <TextField
                  label={t('sale.menuItem.form.price')}
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  fullWidth
                  inputProps={{ min: 0, step: '0.01' }}
                  disabled={disabled}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label={t('sale.menuItem.form.calories')}
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    fullWidth
                    inputProps={{ min: 0, step: '1' }}
                    disabled={disabled}
                  />
                  <TextField
                    label={t('sale.menuItem.form.weight')}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    fullWidth
                    disabled={disabled}
                  />
                </Box>

                <TextField
                  label={t('sale.menuItem.form.ingredients')}
                  value={ingredientsInput}
                  onChange={(e) => setIngredientsInput(e.target.value)}
                  fullWidth
                  helperText={t('sale.menuItem.form.listInputHint')}
                  disabled={disabled}
                />

                <TextField
                  label={t('sale.menuItem.form.allergens')}
                  value={allergensInput}
                  onChange={(e) => setAllergensInput(e.target.value)}
                  fullWidth
                  helperText={t('sale.menuItem.form.listInputHint')}
                  disabled={disabled}
                />

                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    disabled={isSubmitDisabled}
                  >
                    {isUploadingImage
                      ? t('sale.menuItem.form.imageUploading')
                      : t('sale.menuItem.form.imageUpload')}
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
                    <Typography variant="subtitle2">
                      {t('sale.menuItem.form.categoryId')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCategoryLabel || t('sale.catalog.selectedCategoryLabel')}
                    </Typography>
                  </Box>
                ) : (
                  <FormControl fullWidth required disabled={disabled}>
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
                  <Tooltip title={!canSubmit ? (disabledReason ?? '') : ''}>
                    <span>
                      <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
                        {isPending || isUploadingImage ? t('common.loading') : t('common.save')}
                      </Button>
                    </span>
                  </Tooltip>
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
                      disabled={disabled}
                      onClick={() => onOpenProduct(item.productId)}
                    >
                      {(products.find((product) => product.id === item.productId)?.name ??
                        item.productId) + ` x${item.quantity}`}
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
        calories={calories}
        weight={weight}
        ingredients={parseCommaSeparatedList(ingredientsInput)}
        allergens={parseCommaSeparatedList(allergensInput)}
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
  const { currentTenantId, hasShopPermission, hasPermissionForTarget } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')

  const canReadMenuItem =
    mode === 'edit'
      ? hasPermissionForTarget(
          PermissionActions.READ_MENU_ITEM,
          targetWithParents(
            'MENU_ITEM',
            menuItemId,
            currentTenantId,
            shopParents(selectedShopId, currentTenantId),
          ),
        )
      : true
  const canReadCategories = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_MENU_CATEGORY, selectedShopId),
  )
  const canReadProducts = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_PRODUCT, selectedShopId),
  )

  const { data: menuItem, isLoading: isLoadingMenuItem } = useMenuItem(
    mode === 'edit' ? menuItemId : undefined,
    { enabled: canReadMenuItem },
  )

  const { data: categoriesResult, isLoading: isLoadingCategories } = useMenuCategories(
    {
      pagination: { page: 1, perPage: 300 },
      sort: { field: 'displayOrder', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'menu.shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadCategories },
  )

  const { data: productsResult, isLoading: isLoadingProducts } = useProducts(
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadProducts },
  )

  const categories = useMemo(() => categoriesResult?.data ?? [], [categoriesResult?.data])
  const products = useMemo(() => productsResult?.data ?? [], [productsResult?.data])
  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )

  const { mutate: createMenuItem, isPending: isCreating } = useCreateMenuItem()
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem()
  const isPending = isCreating || isUpdating

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function canCreateForCategory(categoryIdValue: string): boolean {
    const category = categoriesById.get(categoryIdValue)
    return hasPermissionForTarget(
      PermissionActions.CREATE_MENU_ITEM,
      targetWithParents(
        'MENU_CATEGORY',
        categoryIdValue,
        currentTenantId,
        category
          ? menuParents(category.menuId, selectedShopId, currentTenantId)
          : shopParents(selectedShopId, currentTenantId),
      ),
    )
  }

  function canUpdateItem(item: MenuItemResponseDto, categoryIdValue = item.categoryId): boolean {
    const category = categoriesById.get(categoryIdValue)
    return hasPermissionForTarget(
      PermissionActions.UPDATE_MENU_ITEM,
      targetWithParents(
        'MENU_ITEM',
        item.id,
        currentTenantId,
        menuCategoryParents(categoryIdValue, category?.menuId, selectedShopId, currentTenantId),
      ),
    )
  }

  function handleCreate(value: MenuItemFormValue) {
    if (!canCreateForCategory(value.categoryId)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    createMenuItem(
      {
        name: value.name,
        ...(value.description.trim() && { description: value.description.trim() }),
        price: Number(value.price),
        ...(value.imageId.trim() && { imageId: value.imageId.trim() }),
        ...(value.calories.trim() && { calories: Number(value.calories) }),
        ...(value.weight.trim() && { weight: value.weight.trim() }),
        ingredients: value.ingredients,
        allergens: value.allergens,
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
    if (!canUpdateItem(currentItem, value.categoryId)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    updateMenuItem(
      {
        id: currentItem.id,
        data: {
          name: value.name,
          ...(value.description.trim() && { description: value.description.trim() }),
          price: Number(value.price),
          imageId: value.imageId.trim() || null,
          calories: value.calories.trim() ? Number(value.calories) : null,
          weight: value.weight.trim() || null,
          ingredients: value.ingredients,
          allergens: value.allergens,
          categoryId: value.categoryId,
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
    if (!canReadMenuItem) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert severity="warning">{unauthorizedReason}</Alert>
        </Box>
      )
    }

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
            calories:
              menuItem.calories === null || menuItem.calories === undefined
                ? ''
                : String(menuItem.calories),
            weight: menuItem.weight ?? '',
            ingredients: menuItem.ingredients ?? [],
            allergens: menuItem.allergens ?? [],
            categoryId: menuItem.categoryId,
            productItems: menuItem.productItems ?? [],
          }}
          categories={categories}
          products={products}
          selectedCategoryLabel={categories.find((item) => item.id === menuItem.categoryId)?.name}
          showLinkedProducts={showLinkedProducts}
          isPending={isPending}
          disabled={!canUpdateItem(menuItem)}
          disabledReason={unauthorizedReason}
          canSubmitValue={(value) => canUpdateItem(menuItem, value.categoryId)}
          onOpenProduct={(id) => goTo(`${ROUTES.catalog}/products/${id}`)}
          onCancel={(categoryId) =>
            goTo(categoryId ? `${ROUTES.catalog}/categories/${categoryId}` : ROUTES.catalog)
          }
          onSubmit={(value) => handleUpdate(menuItem, value)}
          lockCategory={false}
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
          calories: '',
          weight: '',
          ingredients: [],
          allergens: [],
          categoryId: initialCategoryId ?? '',
          productItems: [],
        }}
        categories={categories}
        products={products}
        lockCategory={isCategoryLockedInCreate}
        selectedCategoryLabel={initialCategoryLabel}
        showLinkedProducts={false}
        isPending={isPending}
        disabled={false}
        disabledReason={unauthorizedReason}
        canSubmitValue={(value) => canCreateForCategory(value.categoryId)}
        onOpenProduct={(id) => goTo(`${ROUTES.catalog}/products/${id}`)}
        onCancel={(categoryId) =>
          goTo(categoryId ? `${ROUTES.catalog}/categories/${categoryId}` : ROUTES.catalog)
        }
        onSubmit={handleCreate}
      />
    </Box>
  )
}
