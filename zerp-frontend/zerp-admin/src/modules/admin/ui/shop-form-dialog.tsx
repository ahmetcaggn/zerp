'use client'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useShopNameCheck } from '../hooks/use-shop-name-check'
import { useCreateShop, useUpdateShop } from '../hooks/use-shops'
import type { CreateShopRequest, ShopResponse, UpdateShopRequest } from '../types/shop'
import { TenantAutocomplete } from './tenant-autocomplete'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  shop?: ShopResponse
  onClose: () => void
  defaultTenantId?: string
  defaultTenantName?: string
  lockTenantOnCreate?: boolean
}

interface ShopFormState {
  tenantId: string
  name: string
  description: string
  imageId: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  email: string
  website: string
  latitude: string
  longitude: string
}

const EMPTY_FORM_STATE: ShopFormState = {
  tenantId: '',
  name: '',
  description: '',
  imageId: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  phone: '',
  email: '',
  website: '',
  latitude: '',
  longitude: '',
}

export function ShopFormDialog({
  open,
  mode,
  shop,
  onClose,
  defaultTenantId,
  defaultTenantName,
  lockTenantOnCreate = false,
}: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [form, setForm] = useState<ShopFormState>(EMPTY_FORM_STATE)

  const { hasAnyPermission } = useCurrentUserPermissions()
  const canCreateShop = hasAnyPermission([PermissionActions.UPDATE_TENANT, PermissionActions.ADMIN])
  const canUpdateShop = hasAnyPermission([PermissionActions.UPDATE_TENANT, PermissionActions.ADMIN])
  const canSubmit = mode === 'create' ? canCreateShop : canUpdateShop

  const selectedTenantId =
    mode === 'edit'
      ? (shop?.tenantId ?? form.tenantId)
      : lockTenantOnCreate
        ? (defaultTenantId ?? form.tenantId)
        : form.tenantId
  const isTenantFieldLocked = mode === 'edit' || (mode === 'create' && lockTenantOnCreate)
  const lockedTenantLabel =
    mode === 'edit'
      ? (shop?.tenantName ?? shop?.tenantId ?? '')
      : (defaultTenantName ?? defaultTenantId ?? '')
  const shopNameStatus = useShopNameCheck(
    mode === 'create' || mode === 'edit' ? selectedTenantId : '',
    form.name,
    mode === 'edit' ? shop?.id : undefined,
  )

  const { mutate: createShop, isPending: isCreating } = useCreateShop()
  const { mutate: updateShop, isPending: isUpdating } = useUpdateShop()

  const isPending = isCreating || isUpdating
  const isNameAvailable = shopNameStatus === 'available'
  const isNameCheckRelevant = mode === 'create' || mode === 'edit'

  function seedForm() {
    if (mode === 'edit') {
      setForm({
        tenantId: shop?.tenantId ?? '',
        name: shop?.name ?? '',
        description: shop?.description ?? '',
        imageId: shop?.imageId ?? '',
        address: shop?.address ?? '',
        city: shop?.city ?? '',
        state: shop?.state ?? '',
        country: shop?.country ?? '',
        postalCode: shop?.postalCode ?? '',
        phone: shop?.phone ?? '',
        email: shop?.email ?? '',
        website: shop?.website ?? '',
        latitude: shop?.latitude != null ? String(shop.latitude) : '',
        longitude: shop?.longitude != null ? String(shop.longitude) : '',
      })
      return
    }

    setForm({
      ...EMPTY_FORM_STATE,
      tenantId: lockTenantOnCreate ? (defaultTenantId ?? '') : '',
    })
  }

  function handleClose() {
    setForm(EMPTY_FORM_STATE)
    onClose()
  }

  function normalizeOptional(value: string): string | undefined {
    const normalized = value.trim()
    return normalized ? normalized : undefined
  }

  function parseOptionalCoordinate(rawValue: string, field: 'latitude' | 'longitude'): number | undefined {
    const normalized = rawValue.trim()
    if (!normalized) {
      return undefined
    }

    const parsed = Number(normalized)
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
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

  function buildCreatePayload(): CreateShopRequest {
    return {
      tenantId: selectedTenantId.trim(),
      name: form.name.trim(),
      description: normalizeOptional(form.description),
      imageId: normalizeOptional(form.imageId),
      address: normalizeOptional(form.address),
      city: normalizeOptional(form.city),
      state: normalizeOptional(form.state),
      country: normalizeOptional(form.country),
      postalCode: normalizeOptional(form.postalCode),
      phone: normalizeOptional(form.phone),
      email: normalizeOptional(form.email),
      website: normalizeOptional(form.website),
      latitude: parseOptionalCoordinate(form.latitude, 'latitude'),
      longitude: parseOptionalCoordinate(form.longitude, 'longitude'),
    }
  }

  function buildUpdatePayload(): UpdateShopRequest {
    return {
      name: form.name.trim(),
      description: normalizeOptional(form.description),
      imageId: normalizeOptional(form.imageId),
      address: normalizeOptional(form.address),
      city: normalizeOptional(form.city),
      state: normalizeOptional(form.state),
      country: normalizeOptional(form.country),
      postalCode: normalizeOptional(form.postalCode),
      phone: normalizeOptional(form.phone),
      email: normalizeOptional(form.email),
      website: normalizeOptional(form.website),
      latitude: parseOptionalCoordinate(form.latitude, 'latitude'),
      longitude: parseOptionalCoordinate(form.longitude, 'longitude'),
    }
  }

  function validateCommon(): boolean {
    if (!canSubmit) {
      showToast(t('shops.unauthorized'), { severity: 'warning' })
      return false
    }

    if (!form.name.trim()) {
      showToast(t('shops.validationName'), { severity: 'warning' })
      return false
    }

    if (!selectedTenantId.trim()) {
      showToast(t('shops.tenantRequired'), { severity: 'warning' })
      return false
    }

    if (!isNameAvailable) {
      showToast(t('shops.nameUnavailable'), { severity: 'warning' })
      return false
    }

    try {
      parseOptionalCoordinate(form.latitude, 'latitude')
      parseOptionalCoordinate(form.longitude, 'longitude')
    } catch (err) {
      if (err instanceof Error && err.message === 'latitude') {
        showToast(t('shops.latitudeValidation'), { severity: 'warning' })
      } else if (err instanceof Error && err.message === 'longitude') {
        showToast(t('shops.longitudeValidation'), { severity: 'warning' })
      } else {
        showToast(t('shops.coordinateValidation'), { severity: 'warning' })
      }
      return false
    }

    return true
  }

  function handleSubmit() {
    if (!validateCommon()) {
      return
    }

    if (mode === 'create') {
      createShop(buildCreatePayload(), {
        onSuccess: () => {
          showToast(t('shops.createdToast'), { severity: 'success' })
          handleClose()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      })
      return
    }

    if (!shop?.id) {
      return
    }

    updateShop(
      {
        id: shop.id,
        data: buildUpdatePayload(),
      },
      {
        onSuccess: () => {
          showToast(t('shops.updatedToast'), { severity: 'success' })
          handleClose()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  const title = mode === 'create' ? t('shops.createButton') : t('shops.editButton')

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth onTransitionEnter={seedForm}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            pt: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {isTenantFieldLocked ? (
            <TextField
              label={`${t('shops.tenantLabel')} *`}
              value={lockedTenantLabel}
              size="small"
              fullWidth
              disabled
            />
          ) : (
            <TenantAutocomplete
              value={selectedTenantId || null}
              onChange={(tenantId) =>
                setForm((prev) => ({
                  ...prev,
                  tenantId: tenantId ?? '',
                }))
              }
              label={`${t('shops.tenantLabel')} *`}
              required
              enabled={open && canSubmit}
            />
          )}

          <TextField
            label={`${t('shops.nameLabel')} *`}
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            size="small"
            fullWidth
            error={isNameCheckRelevant && (shopNameStatus === 'unavailable' || shopNameStatus === 'error')}
            helperText={
              !isNameCheckRelevant
                ? undefined
                : shopNameStatus === 'idle'
                  ? form.name.trim().length > 0 && form.name.trim().length < 3
                    ? t('shops.nameMinLength')
                    : undefined
                  : shopNameStatus === 'checking'
                    ? t('shops.nameChecking')
                    : shopNameStatus === 'available'
                      ? t('shops.nameAvailable')
                      : shopNameStatus === 'unavailable'
                        ? t('shops.nameUnavailable')
                        : t('shops.nameError')
            }
            FormHelperTextProps={{
              sx: {
                color:
                  shopNameStatus === 'available'
                    ? 'success.main'
                    : shopNameStatus === 'checking'
                      ? 'text.secondary'
                      : undefined,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {shopNameStatus === 'checking' && <CircularProgress size={16} />}
                    {shopNameStatus === 'available' && (
                      <CheckCircleOutlineIcon color="success" fontSize="small" />
                    )}
                    {(shopNameStatus === 'unavailable' || shopNameStatus === 'error') && (
                      <ErrorOutlineIcon color="error" fontSize="small" />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label={t('shops.imageIdLabel')}
            value={form.imageId}
            onChange={(event) => setForm((prev) => ({ ...prev, imageId: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.emailLabel')}
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.phoneLabel')}
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.cityLabel')}
            value={form.city}
            onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.stateLabel')}
            value={form.state}
            onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.countryLabel')}
            value={form.country}
            onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.postalCodeLabel')}
            value={form.postalCode}
            onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.websiteLabel')}
            value={form.website}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.latitudeLabel')}
            value={form.latitude}
            onChange={(event) => setForm((prev) => ({ ...prev, latitude: event.target.value }))}
            size="small"
            fullWidth
            type="number"
            slotProps={{ htmlInput: { step: 'any' } }}
          />
          <TextField
            label={t('shops.longitudeLabel')}
            value={form.longitude}
            onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))}
            size="small"
            fullWidth
            type="number"
            slotProps={{ htmlInput: { step: 'any' } }}
          />
          <TextField
            label={t('shops.addressLabel')}
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('shops.descriptionLabel')}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            size="small"
            fullWidth
            multiline
            minRows={3}
            sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          {t('shops.cancelButton')}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending || !canSubmit || !isNameAvailable}>
          {isPending ? <CircularProgress size={20} /> : t('shops.saveButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
