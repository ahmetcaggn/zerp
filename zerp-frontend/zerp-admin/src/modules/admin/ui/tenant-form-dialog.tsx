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
import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { tenantClient } from '../api/tenant-client'
import { useTenantNameCheck } from '../hooks/use-tenant-name-check'
import { useCreateTenant, useUpdateTenant } from '../hooks/use-tenants'
import type { CreateTenantRequest, TenantResponse, UpdateTenantRequest } from '../types/tenant'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  tenant?: TenantResponse
  onClose: () => void
}

interface TenantFormState {
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
}

const EMPTY_FORM_STATE: TenantFormState = {
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
}

export function TenantFormDialog({ open, mode, tenant, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [form, setForm] = useState<TenantFormState>(EMPTY_FORM_STATE)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const tenantNameStatus = useTenantNameCheck(mode === 'create' ? form.name : '')

  const { mutateAsync: createTenant, isPending: isCreating } = useCreateTenant()
  const { mutateAsync: updateTenant, isPending: isUpdating } = useUpdateTenant()
  const { hasGrant, hasPermission, hasPermissionForTarget } = useCurrentUserPermissions()
  const canCreateTenant = hasGrant(PermissionActions.ADMIN, 'TENANT_ROOT')
  const canUpdateTenant = tenant?.id
    ? hasPermissionForTarget(PermissionActions.UPDATE_TENANT, {
        targetType: 'TENANT',
        targetId: tenant.id,
        tenantId: tenant.id,
      })
    : hasPermission(PermissionActions.UPDATE_TENANT)
  const canSubmit = mode === 'create' ? canCreateTenant : canUpdateTenant
  const isPending = isCreating || isUpdating || isUploadingImage
  const isNameAvailableForCreate = mode === 'create' ? tenantNameStatus === 'available' : true

  function seedForm() {
    setImageFile(null)
    if (mode === 'edit') {
      setForm({
        name: tenant?.name ?? '',
        description: tenant?.description ?? '',
        imageId: tenant?.imageId ?? '',
        address: tenant?.address ?? '',
        city: tenant?.city ?? '',
        state: tenant?.state ?? '',
        country: tenant?.country ?? '',
        postalCode: tenant?.postalCode ?? '',
        phone: tenant?.phone ?? '',
        email: tenant?.email ?? '',
        website: tenant?.website ?? '',
      })
      return
    }
    setForm(EMPTY_FORM_STATE)
  }

  function handleClose() {
    setForm(EMPTY_FORM_STATE)
    setImageFile(null)
    onClose()
  }

  function normalizeOptional(value: string): string | undefined {
    const normalized = value.trim()
    return normalized ? normalized : undefined
  }

  function buildPayload<T extends CreateTenantRequest | UpdateTenantRequest>(): T {
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
    } as T
  }

  function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null
    event.target.value = ''
    setImageFile(selectedFile)
  }

  async function uploadImageIfSelected(tenantId: string) {
    if (!imageFile) {
      return
    }

    setIsUploadingImage(true)
    try {
      const response = await tenantClient.uploadImage(tenantId, imageFile)
      setForm((prev) => ({ ...prev, imageId: response.imageId }))
    } finally {
      setIsUploadingImage(false)
    }
  }

  async function handleSubmit() {
    if (!canSubmit) {
      showToast(t('tenants.unauthorized'), { severity: 'warning' })
      return
    }

    if (!form.name.trim()) {
      showToast(t('tenants.validationName'), { severity: 'warning' })
      return
    }

    try {
      if (mode === 'create') {
        if (tenantNameStatus !== 'available') {
          showToast(t('tenants.nameUnavailable'), { severity: 'warning' })
          return
        }

        const created = await createTenant(buildPayload<CreateTenantRequest>())
        let imageUploadError: unknown = null
        if (created.id && imageFile) {
          try {
            await uploadImageIfSelected(created.id)
          } catch (err) {
            imageUploadError = err
          }
        }

        showToast(t('tenants.createdToast'), { severity: 'success' })
        if (imageUploadError) {
          showToast(getUserFriendlyError(imageUploadError), { severity: 'error' })
        }
        handleClose()
        return
      }

      if (!tenant?.id) {
        return
      }

      await updateTenant({
        id: tenant.id,
        data: buildPayload<UpdateTenantRequest>(),
      })

      let imageUploadError: unknown = null
      if (imageFile) {
        try {
          await uploadImageIfSelected(tenant.id)
        } catch (err) {
          imageUploadError = err
        }
      }

      showToast(t('tenants.updatedToast'), { severity: 'success' })
      if (imageUploadError) {
        showToast(getUserFriendlyError(imageUploadError), { severity: 'error' })
      }
      handleClose()
    } catch (err) {
      showToast(getUserFriendlyError(err), { severity: 'error' })
    }
  }

  const title = mode === 'create' ? t('tenants.createButton') : t('tenants.editButton')

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
          <TextField
            label={`${t('tenants.nameLabel')} *`}
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            size="small"
            fullWidth
            error={
              mode === 'create' &&
              (tenantNameStatus === 'unavailable' || tenantNameStatus === 'error')
            }
            helperText={
              mode !== 'create'
                ? undefined
                : tenantNameStatus === 'idle'
                  ? form.name.trim().length > 0 && form.name.trim().length < 3
                    ? t('tenants.nameMinLength')
                    : undefined
                  : tenantNameStatus === 'checking'
                    ? t('tenants.nameChecking')
                    : tenantNameStatus === 'available'
                      ? t('tenants.nameAvailable')
                      : tenantNameStatus === 'unavailable'
                        ? t('tenants.nameUnavailable')
                        : t('tenants.nameError')
            }
            FormHelperTextProps={{
              sx: {
                color:
                  mode === 'create' && tenantNameStatus === 'available'
                    ? 'success.main'
                    : mode === 'create' && tenantNameStatus === 'checking'
                      ? 'text.secondary'
                      : undefined,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {mode === 'create' && tenantNameStatus === 'checking' && (
                      <CircularProgress size={16} />
                    )}
                    {mode === 'create' && tenantNameStatus === 'available' && (
                      <CheckCircleOutlineIcon color="success" fontSize="small" />
                    )}
                    {mode === 'create' &&
                      (tenantNameStatus === 'unavailable' || tenantNameStatus === 'error') && (
                        <ErrorOutlineIcon color="error" fontSize="small" />
                      )}
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            type="file"
            onChange={handleImageSelected}
            size="small"
            fullWidth
            helperText={imageFile ? imageFile.name : form.imageId || undefined}
            slotProps={{
              htmlInput: {
                accept: 'image/*',
              },
            }}
          />
          <TextField
            label={t('tenants.emailLabel')}
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.phoneLabel')}
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.cityLabel')}
            value={form.city}
            onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.stateLabel')}
            value={form.state}
            onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.countryLabel')}
            value={form.country}
            onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.postalCodeLabel')}
            value={form.postalCode}
            onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.websiteLabel')}
            value={form.website}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.addressLabel')}
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            size="small"
            fullWidth
          />
          <TextField
            label={t('tenants.descriptionLabel')}
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
          {t('tenants.cancelButton')}
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={isPending || !canSubmit || !isNameAvailableForCreate}
        >
          {isPending ? <CircularProgress size={20} /> : t('tenants.saveButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
