'use client'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
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
  TableContainer,
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
import { usePermissionActionHierarchy } from '../hooks/use-permissions'
import { prettifyPermissionEnumName } from '../types/permission'
import type {
  PermissionGroupCreateRequestDto,
  PermissionGroupResponseDto,
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

function toRouteId(group: PermissionGroupResponseDto): string {
  if (group.source === 'PREDEFINED') {
    return `predefined-${group.code}`
  }
  return `custom-${group.id}`
}

function buildActionOptions(
  hierarchy: Record<string, string> | Record<string, string[]> | undefined,
  scopeType: PermissionGroupScopeType,
): string[] {
  if (!hierarchy) return []
  const targetType = scopeType === 'SHOP' ? 'SHOP' : 'TENANT'

  return Object.entries(hierarchy)
    .filter(([, targetTypes]) => Array.isArray(targetTypes) && targetTypes.includes(targetType))
    .map(([action]) => action)
    .sort((a, b) => a.localeCompare(b))
}

function buildPrefillForm(group: PermissionGroupResponseDto): PermissionGroupFormState {
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
  disabled,
}: {
  open: boolean
  mode: 'create' | 'edit'
  form: PermissionGroupFormState
  onChange: (next: PermissionGroupFormState) => void
  onClose: () => void
  onSubmit: () => void
  isPending: boolean
  disabled: boolean
}) {
  const { t } = useI18n()
  const { data: actionHierarchy } = usePermissionActionHierarchy(open && !disabled)

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
            disabled={disabled}
          />

          <TextField
            size="small"
            label={t('permissionGroups.descriptionField')}
            value={form.description}
            onChange={(event) => onChange({ ...form, description: event.target.value })}
            multiline
            rows={3}
            disabled={disabled}
          />

          <TextField
            size="small"
            select
            label={t('permissionGroups.scopeField')}
            value={form.scopeType}
            disabled={disabled}
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
            disabled={disabled}
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
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isPending || disabled}>
          {isPending ? <CircularProgress size={16} /> : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function PermissionGroupList() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { hasAnyPermission, hasTenantPermission, getDisabledReason, isLoadingPermissions } =
    useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')
  const loadingReason = t('common.loading')
  const canReadGroups =
    hasTenantPermission(PermissionActions.ADMIN) ||
    hasTenantPermission(PermissionActions.READ_PERMISSION) ||
    hasAnyPermission([PermissionActions.ADMIN, PermissionActions.READ_PERMISSION])
  const canManageGroups = hasTenantPermission(PermissionActions.ADMIN)
  const adminDisabledReason = isLoadingPermissions
    ? loadingReason
    : getDisabledReason(canManageGroups, unauthorizedReason)

  const { data: predefined = [], isLoading: isPredefinedLoading } =
    usePredefinedPermissionGroups(canReadGroups)
  const { data: custom = [], isLoading: isCustomLoading } = useCustomPermissionGroups(canReadGroups)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingGroup, setEditingGroup] = useState<PermissionGroupResponseDto | null>(null)
  const [form, setForm] = useState<PermissionGroupFormState>(EMPTY_FORM)

  const { mutate: createGroup, isPending: isCreatePending } = useCreatePermissionGroup()
  const { mutate: patchGroup, isPending: isPatchPending } = usePatchPermissionGroup()
  const { mutate: deleteGroup, isPending: isDeletePending } = useDeletePermissionGroup()

  const isPending = isCreatePending || isPatchPending

  const mergedGroups = useMemo(() => {
    const all = [...predefined, ...custom]
    const map = new Map<string, PermissionGroupResponseDto>()
    for (const group of all) {
      const key = `${group.source}:${group.source === 'PREDEFINED' ? group.code : group.id}`
      if (!map.has(key)) {
        map.set(key, group)
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [custom, predefined])

  function openCreateDialog() {
    if (!canManageGroups) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    setDialogMode('create')
    setEditingGroup(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEditDialog(group: PermissionGroupResponseDto) {
    if (!canManageGroups) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    setDialogMode('edit')
    setEditingGroup(group)
    setForm(buildPrefillForm(group))
    setDialogOpen(true)
  }

  function closeDialog() {
    if (isPending) return
    setDialogOpen(false)
  }

  function validateForm(): PermissionGroupCreateRequestDto | null {
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
    if (!canManageGroups) {
      showToast(unauthorizedReason, { severity: 'warning' })
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
    if (!canManageGroups) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    if (!groupId) return
    deleteGroup(groupId, {
      onSuccess: () => showToast(t('permissionGroups.deletedToast')),
      onError: (error) => showToast(getUserFriendlyError(error), { severity: 'error' }),
    })
  }

  if (isLoadingPermissions || isPredefinedLoading || isCustomLoading) {
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
        <Tooltip title={adminDisabledReason ?? ''}>
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              disabled={!canManageGroups}
            >
              {t('permissionGroups.createButton')}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {!canReadGroups ? (
        <Alert severity="warning">{unauthorizedReason}</Alert>
      ) : mergedGroups.length === 0 ? (
        <Typography color="text.secondary">{t('permissionGroups.emptyState')}</Typography>
      ) : (
        <>
          {/* Desktop Table View */}
          <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('permissionGroups.nameColumnHeader')}</TableCell>
                  <TableCell>{t('permissionGroups.sourceColumnHeader')}</TableCell>
                  <TableCell>{t('permissionGroups.scopeColumnHeader')}</TableCell>
                  <TableCell>{t('permissionGroups.actionCountColumnHeader')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mergedGroups.map((group) => {
                  const routeId = toRouteId(group)
                  const sourceLabel =
                    group.source === 'PREDEFINED'
                      ? t('permissionGroups.predefinedBadge')
                      : t('permissionGroups.customBadge')

                  return (
                    <TableRow key={`${group.source}:${group.code ?? group.id}`} hover>
                      <TableCell>{group.name}</TableCell>
                      <TableCell>{sourceLabel}</TableCell>
                      <TableCell>{prettifyPermissionEnumName(group.scopeType)}</TableCell>
                      <TableCell>{group.actions.length}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('permissionGroups.openDetailButton')}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!canReadGroups}
                              onClick={() =>
                                router.push(
                                  withLocale(
                                    locale,
                                    `${ROUTES.permissionGroups}/${routeId}`,
                                  ) as Route,
                                )
                              }
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        {group.source === 'CUSTOM' && (
                          <>
                            <Tooltip title={t('permissionGroups.editButton')}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(group)}
                                  disabled={!canManageGroups}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={t('permissionGroups.deleteButton')}>
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={isDeletePending || !canManageGroups}
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
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
            {mergedGroups.map((group) => {
              const routeId = toRouteId(group)
              const sourceLabel =
                group.source === 'PREDEFINED'
                  ? t('permissionGroups.predefinedBadge')
                  : t('permissionGroups.customBadge')

              return (
                <Card
                  key={`${group.source}:${group.code ?? group.id}`}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: 'divider',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      borderColor: 'primary.light',
                    },
                  }}
                >
                  <Box
                    onClick={() =>
                      router.push(
                        withLocale(locale, `${ROUTES.permissionGroups}/${routeId}`) as Route,
                      )
                    }
                    sx={{ p: 2, cursor: 'pointer' }}
                  >
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          color="text.primary"
                          sx={{ lineHeight: 1.3, overflowWrap: 'anywhere' }}
                        >
                          {group.name}
                        </Typography>
                        <Chip
                          label={sourceLabel}
                          size="small"
                          color={group.source === 'PREDEFINED' ? 'default' : 'primary'}
                          variant="outlined"
                        />
                      </Box>

                      {group.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflowWrap: 'anywhere' }}
                        >
                          {group.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1.5,
                          pt: 1.5,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={prettifyPermissionEnumName(group.scopeType)}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`${group.actions.length} ${t('permissionGroups.actionsField')}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>

                        <Box
                          sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Tooltip title={t('permissionGroups.openDetailButton')}>
                            <IconButton
                              size="small"
                              disabled={!canReadGroups}
                              onClick={() =>
                                router.push(
                                  withLocale(
                                    locale,
                                    `${ROUTES.permissionGroups}/${routeId}`,
                                  ) as Route,
                                )
                              }
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {group.source === 'CUSTOM' && (
                            <>
                              <Tooltip title={t('permissionGroups.editButton')}>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(group)}
                                  disabled={!canManageGroups}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('permissionGroups.deleteButton')}>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={isDeletePending || !canManageGroups}
                                  onClick={() => handleDelete(group.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Card>
              )
            })}
          </Box>
        </>
      )}

      <GroupFormDialog
        open={dialogOpen}
        mode={dialogMode}
        form={form}
        onChange={setForm}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        isPending={isPending}
        disabled={!canManageGroups}
      />
    </Box>
  )
}
