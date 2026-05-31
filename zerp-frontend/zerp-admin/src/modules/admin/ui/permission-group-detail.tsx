'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useCustomPermissionGroup,
  useDeletePermissionGroup,
  usePatchPermissionGroup,
  usePredefinedPermissionGroup,
} from '../hooks/use-permission-groups'
import { usePermissionActionHierarchy } from '../hooks/use-permission-management'
import { prettifyPermissionEnumName } from '../types/permission'
import type {
  PermissionGroupResponse,
  PermissionGroupScopeType,
  PredefinedPermissionGroupCode,
} from '../types/permission-group'

interface Props {
  tenantId: string
  groupKey: string
}

interface FormState {
  name: string
  description: string
  scopeType: PermissionGroupScopeType
  actions: string[]
}

function parseGroupKey(groupKey: string):
  | { type: 'predefined'; code: PredefinedPermissionGroupCode }
  | { type: 'custom'; id: string }
  | null {
  if (groupKey.startsWith('predefined-')) {
    const code = groupKey.replace('predefined-', '') as PredefinedPermissionGroupCode
    return { type: 'predefined', code }
  }

  if (groupKey.startsWith('custom-')) {
    return { type: 'custom', id: groupKey.replace('custom-', '') }
  }

  return null
}

function buildForm(group: PermissionGroupResponse): FormState {
  return {
    name: group.name,
    description: group.description ?? '',
    scopeType: group.scopeType,
    actions: group.actions,
  }
}

function buildActionOptions(
  hierarchy: Record<string, string[]> | undefined,
  scopeType: PermissionGroupScopeType,
): string[] {
  if (!hierarchy) return []
  const targetType = scopeType === 'SHOP' ? 'SHOP' : 'TENANT'

  return Object.entries(hierarchy)
    .filter(([, targetTypes]) => Array.isArray(targetTypes) && targetTypes.includes(targetType))
    .map(([action]) => action)
    .sort((a, b) => a.localeCompare(b))
}

export function PermissionGroupDetail({ tenantId, groupKey }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const parsed = parseGroupKey(groupKey)
  const isPredefined = parsed?.type === 'predefined'
  const customId = parsed?.type === 'custom' ? parsed.id : undefined
  const predefinedCode = parsed?.type === 'predefined' ? parsed.code : undefined

  const {
    data: predefinedGroup,
    isLoading: isPredefinedLoading,
    error: predefinedError,
  } = usePredefinedPermissionGroup(tenantId, predefinedCode, Boolean(predefinedCode))

  const {
    data: customGroup,
    isLoading: isCustomLoading,
    error: customError,
  } = useCustomPermissionGroup(tenantId, customId, Boolean(customId))

  const group = isPredefined ? predefinedGroup : customGroup
  const isLoading = isPredefined ? isPredefinedLoading : isCustomLoading
  const error = isPredefined ? predefinedError : customError

  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState<FormState | null>(null)

  const { mutate: patchGroup, isPending: isPatchPending } = usePatchPermissionGroup(tenantId)
  const { mutate: deleteGroup, isPending: isDeletePending } = useDeletePermissionGroup(tenantId)

  const { data: actionHierarchy } = usePermissionActionHierarchy(editOpen)
  const actionOptions = useMemo(
    () => buildActionOptions(actionHierarchy, form?.scopeType ?? 'TENANT'),
    [actionHierarchy, form?.scopeType],
  )

  if (!parsed) {
    return <Typography color="text.secondary">{t('permissionGroups.notFound')}</Typography>
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !group) {
    return <Typography color="text.secondary">{t('permissionGroups.notFound')}</Typography>
  }

  const resolvedGroup = group

  function openEdit() {
    if (!resolvedGroup.id) return
    setForm(buildForm(resolvedGroup))
    setEditOpen(true)
  }

  function handleSave() {
    if (!form || !resolvedGroup.id) return

    const name = form.name.trim()
    if (!name || form.actions.length === 0) {
      showToast(t('permissionGroups.requiredWarning'), { severity: 'warning' })
      return
    }

    patchGroup(
      {
        id: resolvedGroup.id,
        payload: {
          name,
          description: form.description.trim() || undefined,
          scopeType: form.scopeType,
          actions: form.actions,
        },
      },
      {
        onSuccess: () => {
          showToast(t('permissionGroups.updatedToast'))
          showToast(t('permissionGroups.propagationSummaryToast'), { severity: 'info' })
          setEditOpen(false)
        },
        onError: (err) => {
          const message = getUserFriendlyError(err)
          if (message.includes('Cannot change scopeType while group has active assignments')) {
            showToast(t('permissionGroups.propagationScopeConflictWarning'), { severity: 'warning' })
            return
          }
          showToast(message, { severity: 'error' })
        },
      },
    )
  }

  function handleDelete() {
    if (resolvedGroup.source !== 'CUSTOM' || !resolvedGroup.id) return

    deleteGroup(resolvedGroup.id, {
      onSuccess: () => {
        showToast(t('permissionGroups.deletedToast'))
        router.push(withLocale(locale, `${ROUTES.tenants}/${tenantId}/permission-groups`) as Route)
      },
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(withLocale(locale, `${ROUTES.tenants}/${tenantId}/permission-groups`) as Route)}
        >
          {t('tenants.backButton')}
        </Button>

        <Stack direction="row" spacing={1}>
          <Button startIcon={<EditIcon />} onClick={openEdit} disabled={!resolvedGroup.id}>
            {t('permissionGroups.editButton')}
          </Button>
          {resolvedGroup.source === 'CUSTOM' && (
            <Button startIcon={<DeleteIcon />} color="error" onClick={handleDelete} disabled={isDeletePending}>
              {t('permissionGroups.deleteButton')}
            </Button>
          )}
        </Stack>
      </Box>

      <Box>
        <Typography variant="h5">{resolvedGroup.name}</Typography>
        <Typography color="text.secondary">{resolvedGroup.description || t('permissionGroups.noDescription')}</Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        <Chip
          label={
            resolvedGroup.source === 'PREDEFINED'
              ? t('permissionGroups.predefinedBadge')
              : t('permissionGroups.customBadge')
          }
          size="small"
          color="primary"
          variant="outlined"
        />
        <Chip label={prettifyPermissionEnumName(resolvedGroup.scopeType)} size="small" variant="outlined" />
      </Stack>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {t('permissionGroups.actionsField')}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {resolvedGroup.actions.map((action) => (
            <Chip key={action} size="small" label={prettifyPermissionEnumName(action)} />
          ))}
        </Stack>
      </Box>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('permissionGroups.editButton')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              size="small"
              label={t('permissionGroups.nameField')}
              value={form?.name ?? ''}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, name: event.target.value } : prev))}
            />

            <TextField
              size="small"
              label={t('permissionGroups.descriptionField')}
              value={form?.description ?? ''}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
              multiline
              rows={3}
            />

            <TextField
              size="small"
              select
              label={t('permissionGroups.scopeField')}
              value={form?.scopeType ?? 'TENANT'}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        scopeType: event.target.value as PermissionGroupScopeType,
                        actions: [],
                      }
                    : prev,
                )
              }
            >
              <MenuItem value="TENANT">{t('permissionGroups.scopeTenant')}</MenuItem>
              <MenuItem value="SHOP">{t('permissionGroups.scopeShop')}</MenuItem>
            </TextField>

            <Autocomplete
              multiple
              options={actionOptions}
              value={form?.actions ?? []}
              onChange={(_, values) => setForm((prev) => (prev ? { ...prev, actions: values } : prev))}
              disableCloseOnSelect
              renderTags={(value, getTagProps) =>
                value.map((action, index) => (
                  <Chip {...getTagProps({ index })} key={action} label={prettifyPermissionEnumName(action)} size="small" />
                ))
              }
              renderInput={(params) => <TextField {...params} size="small" label={t('permissionGroups.actionsField')} />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={isPatchPending}>
            {t('permissionGroups.cancelButton')}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isPatchPending}>
            {isPatchPending ? <CircularProgress size={16} /> : t('permissionGroups.saveButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
