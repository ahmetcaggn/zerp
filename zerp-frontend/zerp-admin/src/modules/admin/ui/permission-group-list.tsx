'use client'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
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
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useCreatePermissionGroup,
  useCustomPermissionGroups,
  useDeletePermissionGroup,
  usePatchPermissionGroup,
  usePredefinedPermissionGroups,
} from '../hooks/use-permission-groups'
import { usePermissionActionHierarchy } from '../hooks/use-permission-management'
import { prettifyPermissionEnumName } from '../types/permission'
import type {
  PermissionGroupCreateRequest,
  PermissionGroupResponse,
  PermissionGroupScopeType,
} from '../types/permission-group'

interface PermissionGroupFormState {
  name: string
  description: string
  scopeType: PermissionGroupScopeType
  actions: string[]
}

const EMPTY_FORM: PermissionGroupFormState = {
  name: '',
  description: '',
  scopeType: 'TENANT',
  actions: [],
}

function toRouteId(group: PermissionGroupResponse): string {
  if (group.source === 'PREDEFINED') {
    return `predefined-${group.code}`
  }
  return `custom-${group.id}`
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

function buildPrefillForm(group: PermissionGroupResponse): PermissionGroupFormState {
  return {
    name: group.name,
    description: group.description ?? '',
    scopeType: group.scopeType,
    actions: group.actions,
  }
}

function GroupFormDialog({
  open,
  mode,
  form,
  onChange,
  onClose,
  onSubmit,
  isPending,
  canSubmit,
}: {
  open: boolean
  mode: 'create' | 'edit'
  form: PermissionGroupFormState
  onChange: (next: PermissionGroupFormState) => void
  onClose: () => void
  onSubmit: () => void
  isPending: boolean
  canSubmit: boolean
}) {
  const { t } = useI18n()
  const { data: actionHierarchy } = usePermissionActionHierarchy(open)

  const actionOptions = useMemo(
    () => buildActionOptions(actionHierarchy, form.scopeType),
    [actionHierarchy, form.scopeType],
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? t('permissionGroups.createButton') : t('permissionGroups.editButton')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            size="small"
            label={t('permissionGroups.nameField')}
            value={form.name}
            onChange={(event) => onChange({ ...form, name: event.target.value })}
          />

          <TextField
            size="small"
            label={t('permissionGroups.descriptionField')}
            value={form.description}
            onChange={(event) => onChange({ ...form, description: event.target.value })}
            multiline
            rows={3}
          />

          <TextField
            size="small"
            select
            label={t('permissionGroups.scopeField')}
            value={form.scopeType}
            onChange={(event) =>
              onChange({
                ...form,
                scopeType: event.target.value as PermissionGroupScopeType,
                actions: [],
              })
            }
          >
            <MenuItem value="TENANT">{t('permissionGroups.scopeTenant')}</MenuItem>
            <MenuItem value="SHOP">{t('permissionGroups.scopeShop')}</MenuItem>
          </TextField>

          <Autocomplete
            multiple
            options={actionOptions}
            value={form.actions}
            onChange={(_, values) => onChange({ ...form, actions: values })}
            disableCloseOnSelect
            renderTags={(value, getTagProps) =>
              value.map((action, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={action}
                  label={prettifyPermissionEnumName(action)}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} size="small" label={t('permissionGroups.actionsField')} />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          {t('permissionGroups.cancelButton')}
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isPending || !canSubmit}>
          {isPending ? <CircularProgress size={16} /> : t('permissionGroups.saveButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface Props {
  tenantId: string
}

export function PermissionGroupList({ tenantId }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { hasPermissionForTarget } = useCurrentUserPermissions()
  const canManagePermissionGroups = hasPermissionForTarget(PermissionActions.ADMIN, {
    targetType: 'TENANT',
    targetId: tenantId,
    tenantId,
  })
  const unauthorizedReason = t('common.unauthorized')

  const { data: predefined = [], isLoading: isPredefinedLoading } =
    usePredefinedPermissionGroups(tenantId)
  const { data: custom = [], isLoading: isCustomLoading } = useCustomPermissionGroups(tenantId)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingGroup, setEditingGroup] = useState<PermissionGroupResponse | null>(null)
  const [form, setForm] = useState<PermissionGroupFormState>(EMPTY_FORM)

  const { mutate: createGroup, isPending: isCreatePending } = useCreatePermissionGroup(tenantId)
  const { mutate: patchGroup, isPending: isPatchPending } = usePatchPermissionGroup(tenantId)
  const { mutate: deleteGroup, isPending: isDeletePending } = useDeletePermissionGroup(tenantId)

  const isPending = isCreatePending || isPatchPending

  const mergedGroups = useMemo(() => {
    const all = [...predefined, ...custom]
    const map = new Map<string, PermissionGroupResponse>()
    for (const group of all) {
      const key = `${group.source}:${group.source === 'PREDEFINED' ? group.code : group.id}`
      if (!map.has(key)) {
        map.set(key, group)
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [custom, predefined])

  function openCreateDialog() {
    if (!canManagePermissionGroups) return
    setDialogMode('create')
    setEditingGroup(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEditDialog(group: PermissionGroupResponse) {
    if (!canManagePermissionGroups) return
    setDialogMode('edit')
    setEditingGroup(group)
    setForm(buildPrefillForm(group))
    setDialogOpen(true)
  }

  function closeDialog() {
    if (isPending) return
    setDialogOpen(false)
  }

  function validateForm(): PermissionGroupCreateRequest | null {
    const name = form.name.trim()
    if (!name || form.actions.length === 0) {
      showToast(t('permissionGroups.requiredWarning'), { severity: 'warning' })
      return null
    }

    return {
      name,
      description: form.description.trim() || undefined,
      scopeType: form.scopeType,
      actions: form.actions,
    }
  }

  function handleSubmit() {
    if (!canManagePermissionGroups) {
      showToast(t('common.unauthorized'), { severity: 'warning' })
      return
    }

    const payload = validateForm()
    if (!payload) return

    if (dialogMode === 'create') {
      createGroup(payload, {
        onSuccess: () => {
          showToast(t('permissionGroups.createdToast'))
          setDialogOpen(false)
        },
        onError: (error) => showToast(getUserFriendlyError(error), { severity: 'error' }),
      })
      return
    }

    if (!editingGroup?.id) return

    patchGroup(
      { id: editingGroup.id, payload },
      {
        onSuccess: () => {
          showToast(t('permissionGroups.updatedToast'))
          setDialogOpen(false)
        },
        onError: (error) => showToast(getUserFriendlyError(error), { severity: 'error' }),
      },
    )
  }

  function handleDelete(groupId: string | undefined) {
    if (!groupId || !canManagePermissionGroups) return
    deleteGroup(groupId, {
      onSuccess: () => showToast(t('permissionGroups.deletedToast')),
      onError: (error) => showToast(getUserFriendlyError(error), { severity: 'error' }),
    })
  }

  if (isPredefinedLoading || isCustomLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5">{t('permissionGroups.title')}</Typography>
          <Typography color="text.secondary">{t('permissionGroups.subtitle')}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          disabled={!canManagePermissionGroups}
        >
          {t('permissionGroups.createButton')}
        </Button>
      </Box>

      {mergedGroups.length === 0 ? (
        <Typography color="text.secondary">{t('permissionGroups.emptyState')}</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('permissionGroups.nameColumn')}</TableCell>
              <TableCell>{t('permissionGroups.sourceColumn')}</TableCell>
              <TableCell>{t('permissionGroups.scopeColumn')}</TableCell>
              <TableCell>{t('permissionGroups.actionsColumn')}</TableCell>
              <TableCell align="right">{t('employees.actionsColumnLabel')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mergedGroups.map((group) => (
              <TableRow key={`${group.source}-${group.id ?? group.code}`} hover>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={
                      group.source === 'PREDEFINED'
                        ? t('permissionGroups.predefinedBadge')
                        : t('permissionGroups.customBadge')
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{prettifyPermissionEnumName(group.scopeType)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {group.actions.slice(0, 3).map((action) => (
                      <Chip key={action} size="small" label={prettifyPermissionEnumName(action)} />
                    ))}
                    {group.actions.length > 3 && (
                      <Chip size="small" label={`+${group.actions.length - 3}`} />
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={t('permissionGroups.detailButton')}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const path = `${ROUTES.tenants}/${tenantId}/permission-groups/${toRouteId(group)}`
                        router.push(withLocale(locale, path) as Route)
                      }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {group.source === 'CUSTOM' && (
                    <>
                      <Tooltip
                        title={
                          canManagePermissionGroups
                            ? t('permissionGroups.editButton')
                            : unauthorizedReason
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(group)}
                            disabled={!canManagePermissionGroups}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip
                        title={
                          canManagePermissionGroups
                            ? t('permissionGroups.deleteButton')
                            : unauthorizedReason
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={isDeletePending || !canManagePermissionGroups}
                            onClick={() => handleDelete(group.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <GroupFormDialog
        open={dialogOpen}
        mode={dialogMode}
        form={form}
        onChange={setForm}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        isPending={isPending}
        canSubmit={canManagePermissionGroups}
      />
    </Box>
  )
}
