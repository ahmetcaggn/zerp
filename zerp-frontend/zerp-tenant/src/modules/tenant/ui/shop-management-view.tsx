'use client'

import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

import { getCountryLabel, getCountryOptions, resolveCountryCode } from '@/core/data/countries'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { buildShopImageUrl } from '../api/shop-client'
import {
  CUISINE_CATEGORIES,
  type CuisineCategory,
  cuisineCategoryLabelKey,
} from '../data/cuisine-categories'
import { getDistrictOptions, resolveCityName, resolveDistrictName, TURKEY_CITY_OPTIONS } from '../data/tr-city-district-data'
import { useShop, useShops, useUpdateShop, useUploadShopImage } from '../hooks/use-shops'
import type { MenuLanguage, PatchShopRequestDto, ShopResponseDto } from '../types/shop'

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

interface ShopFormState {
  name: string
  description: string
  defaultMenuLanguage: MenuLanguage
  cuisineCategories: CuisineCategory[]
  imageId: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
}

function toFormState(shop: ShopResponseDto): ShopFormState {
  const resolvedCity = resolveCityName(shop.city) ?? (shop.city?.trim() ?? '')
  const resolvedDistrict = resolveDistrictName(resolvedCity, shop.state) ?? (shop.state?.trim() ?? '')

  return {
    name: shop.name ?? '',
    description: shop.description ?? '',
    defaultMenuLanguage: shop.defaultMenuLanguage ?? 'TR',
    cuisineCategories: shop.cuisineCategories ?? [],
    imageId: shop.imageId ?? '',
    email: shop.email ?? '',
    phone: shop.phone ?? '',
    website: shop.website ?? '',
    address: shop.address ?? '',
    city: resolvedCity,
    state: resolvedDistrict,
    country: resolveCountryCode('tr', shop.country),
    postalCode: shop.postalCode ?? '',
    latitude: shop.latitude != null ? String(shop.latitude) : '',
    longitude: shop.longitude != null ? String(shop.longitude) : '',
  }
}

function normalizeOptional(value: string): string | null {
  const normalized = value.trim()
  return normalized ? normalized : null
}

function parseOptionalCoordinate(value: string, field: 'latitude' | 'longitude'): number | null {
  const normalized = value.trim()
  if (!normalized) {
    return null
  }

  const parsed = Number(normalized)
  if (!Number.isFinite(parsed)) {
    throw new Error(field)
  }

  if (field === 'latitude' && (parsed < -90 || parsed > 90)) {
    throw new Error(field)
  }
  if (field === 'longitude' && (parsed < -180 || parsed > 180)) {
    throw new Error(field)
  }

  return parsed
}

export function ShopManagementView() {
  const { t, locale } = useI18n()
  const { scope } = useShopScope()
  const { showToast } = useToast()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedShopId, setSelectedShopId] = useState('')
  const [draftsByShopId, setDraftsByShopId] = useState<Record<string, ShopFormState>>({})
  const [previewByShopId, setPreviewByShopId] = useState<Record<string, string>>({})
  const [imageFailedByShopId, setImageFailedByShopId] = useState<Record<string, boolean>>({})
  const [imageCacheBuster, setImageCacheBuster] = useState<Record<string, number>>({})
  const [isResolvingLocation, setIsResolvingLocation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewByShopIdRef = useRef<Record<string, string>>({})

  const selectedScopeShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const params = useMemo(() => {
    const filter: Record<string, string> = {}
    if (selectedScopeShopId) {
      filter['id.eq'] = selectedScopeShopId
    }
    if (searchQuery) {
      filter['name.like'] = searchQuery
    }

    return {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'name', order: 'ASC' as const },
      ...(Object.keys(filter).length > 0 ? { filter } : {}),
    }
  }, [searchQuery, selectedScopeShopId])

  const { data, isLoading, error } = useShops(params)
  const { mutateAsync: updateShop, isPending: isSaving } = useUpdateShop()
  const { mutateAsync: uploadShopImage, isPending: isUploadingImage } = useUploadShopImage()

  const shops = useMemo(() => data?.data ?? [], [data?.data])
  const countryOptions = useMemo(() => getCountryOptions(locale), [locale])

  const resolvedSelectedShopId = useMemo(() => {
    if (shops.length === 0) {
      return ''
    }
    if (selectedScopeShopId) {
      return shops.some((shop) => shop.id === selectedScopeShopId) ? selectedScopeShopId : shops[0].id
    }
    if (selectedShopId && shops.some((shop) => shop.id === selectedShopId)) {
      return selectedShopId
    }
    return shops[0].id
  }, [selectedScopeShopId, selectedShopId, shops])

  const { data: selectedShopDetail, error: selectedShopDetailError } = useShop(resolvedSelectedShopId)

  const selectedShop = useMemo(
    () => selectedShopDetail ?? shops.find((shop) => shop.id === resolvedSelectedShopId),
    [resolvedSelectedShopId, selectedShopDetail, shops],
  )

  const form = useMemo(() => {
    if (!selectedShop) {
      return null
    }
    return draftsByShopId[selectedShop.id] ?? toFormState(selectedShop)
  }, [draftsByShopId, selectedShop])

  const cityOptions = useMemo(() => {
    const currentCity = form?.city?.trim()
    if (!currentCity) {
      return TURKEY_CITY_OPTIONS
    }
    return TURKEY_CITY_OPTIONS.some((city) => city.localeCompare(currentCity, 'tr-TR', { sensitivity: 'base' }) === 0)
      ? TURKEY_CITY_OPTIONS
      : [currentCity, ...TURKEY_CITY_OPTIONS]
  }, [form?.city])

  const districtOptions = useMemo(() => {
    const baseOptions = getDistrictOptions(form?.city)
    const currentDistrict = form?.state?.trim()
    if (!currentDistrict) {
      return baseOptions
    }
    return baseOptions.some((district) =>
      district.localeCompare(currentDistrict, 'tr-TR', { sensitivity: 'base' }) === 0,
    )
      ? baseOptions
      : [currentDistrict, ...baseOptions]
  }, [form?.city, form?.state])

  const previewSrc = useMemo(() => {
    if (!resolvedSelectedShopId || !form) {
      return null
    }

    const localPreview = previewByShopId[resolvedSelectedShopId]
    if (localPreview) {
      return localPreview
    }
    if (!form.imageId) {
      return null
    }

    const version = imageCacheBuster[resolvedSelectedShopId] ?? 0
    return `${buildShopImageUrl(resolvedSelectedShopId, 'MEDIUM')}&v=${version}`
  }, [form, imageCacheBuster, previewByShopId, resolvedSelectedShopId])

  useEffect(() => {
    if (!error) {
      return
    }
    showToast(getUserFriendlyError(error), { severity: 'error' })
  }, [error, showToast])

  useEffect(() => {
    if (!selectedShopDetailError) {
      return
    }
    showToast(getUserFriendlyError(selectedShopDetailError), { severity: 'error' })
  }, [selectedShopDetailError, showToast])

  useEffect(() => {
    previewByShopIdRef.current = previewByShopId
  }, [previewByShopId])

  useEffect(() => {
    return () => {
      for (const previewUrl of Object.values(previewByShopIdRef.current)) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [])

  function handleSearch() {
    setSearchQuery(searchInput.trim())
  }

  function handleClearSearch() {
    setSearchInput('')
    setSearchQuery('')
  }

  function updateCurrentForm(updater: (current: ShopFormState) => ShopFormState) {
    if (!resolvedSelectedShopId) {
      return
    }

    setDraftsByShopId((prev) => {
      const targetShop = selectedShop ?? shops.find((shop) => shop.id === resolvedSelectedShopId)
      const base = prev[resolvedSelectedShopId] ?? (targetShop ? toFormState(targetShop) : null)
      if (!base) {
        return prev
      }

      return {
        ...prev,
        [resolvedSelectedShopId]: updater(base),
      }
    })
  }

  async function handleSave() {
    if (!resolvedSelectedShopId || !form) {
      return
    }

    if (!form.name.trim()) {
      showToast(t('shops.requiredName'), { severity: 'warning' })
      return
    }

    let latitude: number | null
    let longitude: number | null
    try {
      latitude = parseOptionalCoordinate(form.latitude, 'latitude')
      longitude = parseOptionalCoordinate(form.longitude, 'longitude')
    } catch (err) {
      if (err instanceof Error && err.message === 'latitude') {
        showToast(t('shops.latitudeValidation'), { severity: 'warning' })
      } else {
        showToast(t('shops.longitudeValidation'), { severity: 'warning' })
      }
      return
    }

    const payload: PatchShopRequestDto = {
      name: form.name.trim(),
      description: normalizeOptional(form.description),
      defaultMenuLanguage: form.defaultMenuLanguage,
      imageId: normalizeOptional(form.imageId),
      email: normalizeOptional(form.email),
      phone: normalizeOptional(form.phone),
      website: normalizeOptional(form.website),
      address: normalizeOptional(form.address),
      city: normalizeOptional(form.city),
      state: normalizeOptional(form.state),
      country: normalizeOptional(form.country),
      postalCode: normalizeOptional(form.postalCode),
      latitude,
      longitude,
      cuisineCategories: form.cuisineCategories,
    }

    try {
      const updated = await updateShop({
        shopId: resolvedSelectedShopId,
        data: payload,
      })

      setDraftsByShopId((prev) => ({
        ...prev,
        [resolvedSelectedShopId]: toFormState(updated),
      }))
      showToast(t('shops.updatedToast'), { severity: 'success' })
    } catch (err) {
      showToast(getUserFriendlyError(err), { severity: 'error' })
    }
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !resolvedSelectedShopId) {
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      showToast(t('shops.unsupportedImageType'), { severity: 'warning' })
      return
    }

    if (file.size > MAX_IMAGE_BYTES) {
      showToast(t('shops.maxImageSizeHint'), { severity: 'warning' })
      return
    }

    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewByShopId((prev) => {
      const currentPreview = prev[resolvedSelectedShopId]
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview)
      }
      return { ...prev, [resolvedSelectedShopId]: localPreviewUrl }
    })
    setImageFailedByShopId((prev) => ({ ...prev, [resolvedSelectedShopId]: false }))

    try {
      const response = await uploadShopImage({ shopId: resolvedSelectedShopId, file })

      setDraftsByShopId((prev) => {
        const targetShop = shops.find((shop) => shop.id === resolvedSelectedShopId)
        const base = prev[resolvedSelectedShopId] ?? (targetShop ? toFormState(targetShop) : null)
        if (!base) {
          return prev
        }

        return {
          ...prev,
          [resolvedSelectedShopId]: {
            ...base,
            imageId: response.imageId,
          },
        }
      })
      setImageCacheBuster((prev) => ({
        ...prev,
        [resolvedSelectedShopId]: (prev[resolvedSelectedShopId] ?? 0) + 1,
      }))
      showToast(t('shops.imageUploadedToast'), { severity: 'success' })
    } catch (err) {
      showToast(getUserFriendlyError(err) || t('shops.imageUploadError'), { severity: 'error' })
    }
  }

  function markImageFailed() {
    if (!resolvedSelectedShopId) {
      return
    }
    setImageFailedByShopId((prev) => ({ ...prev, [resolvedSelectedShopId]: true }))
  }

  function resolveCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 30_000,
      })
    })
  }

  function getGeolocationErrorMessage(error: unknown): string {
    if (
      typeof error === 'object'
      && error !== null
      && 'code' in error
      && (error as { code?: number }).code === 1
    ) {
      return t('shops.locationPermissionDenied')
    }
    return t('shops.locationFetchFailed')
  }

  async function handleUseCurrentLocation() {
    const targetShopId = resolvedSelectedShopId
    if (!targetShopId) {
      return
    }

    if (!navigator.geolocation) {
      showToast(t('shops.locationNotSupported'), { severity: 'warning' })
      return
    }

    setIsResolvingLocation(true)
    try {
      const position = await resolveCurrentPosition()
      const latitude = position.coords.latitude.toFixed(6)
      const longitude = position.coords.longitude.toFixed(6)

      setDraftsByShopId((prev) => {
        const targetShop = shops.find((shop) => shop.id === targetShopId)
        const base = prev[targetShopId] ?? (targetShop ? toFormState(targetShop) : null)
        if (!base) {
          return prev
        }

        return {
          ...prev,
          [targetShopId]: {
            ...base,
            latitude,
            longitude,
          },
        }
      })
      showToast(t('shops.locationAppliedToast'), { severity: 'success' })
    } catch (error) {
      showToast(getGeolocationErrorMessage(error), { severity: 'warning' })
    } finally {
      setIsResolvingLocation(false)
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={800}>
          {t('shops.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {t('shops.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 4, borderColor: 'rgba(148, 163, 184, 0.24)', height: '100%' }}>
            <CardContent sx={{ display: 'grid', gap: 2.25 }}>
              <Typography variant="h6" fontWeight={700}>
                {t('shops.selectShopLabel')}
              </Typography>

              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  value={searchInput}
                  placeholder={t('shops.searchPlaceholder')}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button variant="outlined" onClick={handleSearch}>
                  {t('shops.searchButton')}
                </Button>
              </Stack>

              {searchQuery ? (
                <Button variant="text" size="small" onClick={handleClearSearch} sx={{ justifySelf: 'start' }}>
                  {t('shops.clearButton')}
                </Button>
              ) : null}

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : shops.length === 0 ? (
                <Typography color="text.secondary">{t('shops.emptyState')}</Typography>
              ) : (
                <List dense sx={{ py: 0 }}>
                  {shops.map((shop) => (
                    <ListItemButton
                      key={shop.id}
                      selected={shop.id === resolvedSelectedShopId}
                      onClick={() => setSelectedShopId(shop.id)}
                      sx={{ borderRadius: 2.5, mb: 0.5 }}
                    >
                      <ListItemText
                        primary={shop.name}
                        secondary={
                          [shop.city, getCountryLabel(locale, shop.country)].filter(Boolean).join(' / ') || '—'
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 4, borderColor: 'rgba(148, 163, 184, 0.24)' }}>
            <CardContent sx={{ display: 'grid', gap: 2.25 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {t('shops.detailsTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('shops.detailsSubtitle')}
                </Typography>
              </Box>

              {!form || !resolvedSelectedShopId ? (
                <Alert severity="info">{t('shops.selectShopWarning')}</Alert>
              ) : (
                <>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: '1px dashed',
                      borderColor: 'divider',
                      display: 'grid',
                      gap: 1.5,
                    }}
                  >
                    <Typography fontWeight={700}>{t('shops.imageSectionTitle')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('shops.imageSectionSubtitle')}
                    </Typography>

                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 420,
                        height: 210,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        backgroundColor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {previewSrc && !imageFailedByShopId[resolvedSelectedShopId] ? (
                        <Box
                          component="img"
                          src={previewSrc}
                          alt={form.name || t('shops.imagePlaceholder')}
                          onError={markImageFailed}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Stack spacing={1} alignItems="center" color="text.secondary">
                          <StorefrontRoundedIcon />
                          <Typography variant="caption">{t('shops.imagePlaceholder')}</Typography>
                        </Stack>
                      )}
                    </Box>

                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileSelected}
                    />
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadRoundedIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        {isUploadingImage ? t('shops.uploading') : t('shops.uploadButton')}
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        {t('shops.imageGuideline')} {t('shops.maxImageSizeHint')}
                      </Typography>
                    </Stack>

                    {form.imageId ? (
                      <Typography variant="caption" color="text.secondary">
                        {t('shops.imageReadyLabel')}: {form.imageId}
                      </Typography>
                    ) : null}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label={t('shops.nameLabel')}
                        fullWidth
                        size="small"
                        value={form.name}
                        onChange={(event) => updateCurrentForm((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t('shops.menuLanguageLabel')}</InputLabel>
                        <Select
                          label={t('shops.menuLanguageLabel')}
                          value={form.defaultMenuLanguage}
                          onChange={(event) =>
                            updateCurrentForm((current) => ({
                              ...current,
                              defaultMenuLanguage: event.target.value as MenuLanguage,
                            }))
                          }
                        >
                          <MenuItem value="TR">{t('shops.menuLanguageTr')}</MenuItem>
                          <MenuItem value="EN">{t('shops.menuLanguageEn')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={CUISINE_CATEGORIES}
                        value={form.cuisineCategories}
                        getOptionLabel={(category) => t(cuisineCategoryLabelKey(category))}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(_, value) =>
                          updateCurrentForm((current) => ({
                            ...current,
                            cuisineCategories: value as CuisineCategory[],
                          }))
                        }
                        renderTags={(value, getTagProps) =>
                          value.map((category, index) => {
                            const { key, ...tagProps } = getTagProps({ index })
                            return (
                              <Chip
                                key={key}
                                {...tagProps}
                                label={t(cuisineCategoryLabelKey(category))}
                                size="small"
                              />
                            )
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('shops.cuisineCategoriesLabel')}
                            placeholder={form.cuisineCategories.length === 0 ? t('shops.noCuisineCategories') : ''}
                            size="small"
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label={t('shops.descriptionLabel')}
                        fullWidth
                        size="small"
                        multiline
                        minRows={3}
                        value={form.description}
                        onChange={(event) =>
                          updateCurrentForm((current) => ({ ...current, description: event.target.value }))
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label={t('shops.emailLabel')}
                        fullWidth
                        size="small"
                        value={form.email}
                        onChange={(event) => updateCurrentForm((current) => ({ ...current, email: event.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label={t('shops.phoneLabel')}
                        fullWidth
                        size="small"
                        value={form.phone}
                        onChange={(event) => updateCurrentForm((current) => ({ ...current, phone: event.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label={t('shops.websiteLabel')}
                        fullWidth
                        size="small"
                        value={form.website}
                        onChange={(event) =>
                          updateCurrentForm((current) => ({ ...current, website: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label={t('shops.addressLabel')}
                        fullWidth
                        size="small"
                        value={form.address}
                        onChange={(event) =>
                          updateCurrentForm((current) => ({ ...current, address: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t('shops.cityLabel')}</InputLabel>
                        <Select
                          label={t('shops.cityLabel')}
                          value={form.city}
                          onChange={(event) => {
                            const nextCity = event.target.value
                            updateCurrentForm((current) => {
                              const nextDistrictOptions = getDistrictOptions(nextCity)
                              const keepCurrentDistrict = nextDistrictOptions.includes(current.state)
                              return {
                                ...current,
                                city: nextCity,
                                state: keepCurrentDistrict ? current.state : '',
                              }
                            })
                          }}
                        >
                          <MenuItem value="">
                            <em>{t('shops.notSelected')}</em>
                          </MenuItem>
                          {cityOptions.map((city) => (
                            <MenuItem key={city} value={city}>
                              {city}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t('shops.stateLabel')}</InputLabel>
                        <Select
                          label={t('shops.stateLabel')}
                          value={form.state}
                          onChange={(event) =>
                            updateCurrentForm((current) => ({ ...current, state: event.target.value }))
                          }
                          disabled={!form.city}
                        >
                          <MenuItem value="">
                            <em>{t('shops.notSelected')}</em>
                          </MenuItem>
                          {districtOptions.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t('shops.countryLabel')}</InputLabel>
                        <Select
                          label={t('shops.countryLabel')}
                          value={form.country}
                          onChange={(event) =>
                            updateCurrentForm((current) => ({ ...current, country: String(event.target.value) }))
                          }
                        >
                          <MenuItem value="">
                            <em>{t('shops.notSelected')}</em>
                          </MenuItem>
                          {countryOptions.map((country) => (
                            <MenuItem key={country.code} value={country.code}>
                              {country.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label={t('shops.postalCodeLabel')}
                        fullWidth
                        size="small"
                        value={form.postalCode}
                        onChange={(event) =>
                          updateCurrentForm((current) => ({ ...current, postalCode: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label={t('shops.latitudeLabel')}
                        fullWidth
                        size="small"
                        type="number"
                        value={form.latitude}
                        onChange={(event) =>
                          updateCurrentForm((current) => ({ ...current, latitude: event.target.value }))
                        }
                        slotProps={{ htmlInput: { step: 'any' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label={t('shops.longitudeLabel')}
                        fullWidth
                        size="small"
                        type="number"
                        value={form.longitude}
                        onChange={(event) =>
                          updateCurrentForm((current) => ({ ...current, longitude: event.target.value }))
                        }
                        slotProps={{ htmlInput: { step: 'any' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => void handleUseCurrentLocation()}
                          disabled={isResolvingLocation}
                          startIcon={
                            isResolvingLocation ? <CircularProgress size={14} color="inherit" /> : <MyLocationRoundedIcon />
                          }
                        >
                          {isResolvingLocation ? t('shops.locating') : t('shops.useCurrentLocationButton')}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={() => void handleSave()}
                      disabled={isSaving || isUploadingImage}
                    >
                      {isSaving ? <CircularProgress size={20} color="inherit" /> : t('shops.saveButton')}
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}
