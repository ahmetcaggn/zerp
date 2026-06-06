'use client'

import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useAssignPermissionGroup,
  usePermissionGroupAssignments,
  useRevokePermissionGroupAssignment,
} from '../hooks/use-permission-groups'
import {
  useCreatePermission,
  useDeletePermission,
  useMemberPermissions,
} from '../hooks/use-permission-management'
import { useShops } from '../hooks/use-shops'
import { prettifyPermissionEnumName, toPermissionKey } from '../types/permission'
import type { TeamMemberResponse } from '../types/team'
import { PermissionAssignmentBuilder } from './permission-assignment-builder'
import { buildRevokeGroupToast } from './permission-group-revoke-toast'
import {
  type PermissionGroupSelectionValue,
  PermissionGroupSelector,
} from './permission-group-selector'

interface Props {
  open: boolean
  member?: TeamMemberResponse
  tenantId?: string
  canManagePermissions?: boolean
  onClose: () => void
}

export function TeamMemberPermissionsDialog({
  open,
  member,
  tenantId,
  canManagePermissions = false,
  onClose,
}: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [searchInput, setSearchInput] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroupSelectionValue | null>(null)
  const [selectedGroupShopId, setSelectedGroupShopId] = useState('')

  const memberUserId = member?.userId
  const memberName = member?.displayName || member?.email || member?.userId || '—'

  const {
    data: permissions = [],
    isLoading,
    error,
  } = useMemberPermissions(memberUserId, open && Boolean(memberUserId))
  const { mutate: createPermission, isPending: isCreatePending } = useCreatePermission()
  const { mutate: deletePermission, isPending: isDeletePending } = useDeletePermission()
  const { mutateAsync: assignPermissionGroup, isPending: isAssignPending } =
    useAssignPermissionGroup(tenantId ?? '')
  const { mutateAsync: revokePermissionGroupAssignment, isPending: isRevokeAssignPending } =
    useRevokePermissionGroupAssignment(tenantId ?? '')
  const { data: groupAssignments = [], isLoading: isGroupAssignmentsLoading } =
    usePermissionGroupAssignments(
      tenantId ?? '',
      memberUserId,
      open && Boolean(memberUserId && tenantId),
    )
  const { data: shopsResult } = useShops({
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
    ...(tenantId ? { filter: { 'tenantId.eq': tenantId } } : {}),
  })
  const shopOptions = useMemo(
    () =>
      (shopsResult?.data ?? [])
        .filter((shop) => Boolean(shop.id))
        .map((shop) => ({
          id: String(shop.id),
          title: shop.name ?? String(shop.id),
        })),
    [shopsResult?.data],
  )

  useEffect(() => {
    if (!error) return
    showToast(getUserFriendlyError(error), { severity: 'error' })
  }, [error, showToast])

  const existingKeys = useMemo(() => {
    const keys = new Set<string>()
    for (const permission of permissions) {
      if (!permission.action || !permission.targetType || !permission.targetId) continue
      keys.add(
        toPermissionKey({
          action: permission.action,
          targetType: permission.targetType,
          targetId: permission.targetId,
        }),
      )
    }
    return keys
  }, [permissions])

  const filteredPermissions = useMemo(() => {
    const keyword = searchInput.trim().toLowerCase()
    if (!keyword) return permissions

    return permissions.filter((permission) => {
      const action = permission.action ?? ''
      const targetType = permission.targetType ?? ''
      const targetId = permission.targetId ?? ''
      const payload = `${action} ${targetType} ${targetId}`.toLowerCase()
      return payload.includes(keyword)
    })
  }, [permissions, searchInput])

  function handleAddPermission(input: { action: string; targetType: string; targetId: string }) {
    if (!memberUserId || !canManagePermissions) return

    createPermission(
      {
        userId: memberUserId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
      },
      {
        onSuccess: () => showToast(t('teams.permissionAssignedToast'), { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleDeletePermission(permissionId: number | undefined) {
    if (!memberUserId || permissionId === undefined || !canManagePermissions) return

    deletePermission(
      { id: permissionId, memberUserId },
      {
        onSuccess: () => showToast(t('teams.permissionRemovedToast'), { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  async function handleApplyGroup() {
    if (!memberUserId || !selectedGroup || !tenantId || !canManagePermissions) return

    if (selectedGroup.scopeType === 'SHOP' && !selectedGroupShopId) {
      showToast(t('permissionGroups.scopeTargetRequired'), { severity: 'warning' })
      return
    }

    try {
      const assignResult = await assignPermissionGroup({
        userId: memberUserId,
        ...(selectedGroup.source === 'CUSTOM'
          ? { groupId: selectedGroup.id }
          : { predefinedCode: selectedGroup.code }),
        ...(selectedGroup.scopeType === 'SHOP' && selectedGroupShopId
          ? { scopeTargetId: selectedGroupShopId }
          : {}),
      })

      if (assignResult.skippedCount > 0) {
        showToast(t('permissionGroups.applyPartialToast'), { severity: 'info' })
      } else {
        showToast(t('permissionGroups.appliedToast'), { severity: 'success' })
      }
    } catch (assignError) {
      showToast(getUserFriendlyError(assignError), { severity: 'error' })
    }
  }

  async function handleRevokeGroupAssignment(assignmentId: string) {
    if (!memberUserId || !tenantId || !canManagePermissions) return

    try {
      const response = await revokePermissionGroupAssignment({
        assignmentId,
        userId: memberUserId,
      })
      const toast = buildRevokeGroupToast(t, response)
      showToast(toast.message, { severity: toast.severity })
    } catch (revokeError) {
      showToast(getUserFriendlyError(revokeError), { severity: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('teams.permissionsDialogTitle')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('teams.permissionsDialogSubtitle', { member: memberName })}
          </Typography>

          <PermissionAssignmentBuilder
            disabled={!memberUserId || !canManagePermissions || isCreatePending || isAssignPending}
            existingKeys={existingKeys}
            onAdd={handleAddPermission}
            prefilledTargets={tenantId ? { TENANT: { id: tenantId, title: tenantId } } : undefined}
          />

          {tenantId && (
            <>
              <PermissionGroupSelector
                tenantId={tenantId}
                value={selectedGroup}
                onChange={(next) => {
                  setSelectedGroup(next)
                  if (next?.scopeType !== 'SHOP') {
                    setSelectedGroupShopId('')
                  }
                }}
                selectedShopId={selectedGroupShopId}
                onSelectedShopIdChange={setSelectedGroupShopId}
                shopOptions={shopOptions}
                disabled={!memberUserId || !canManagePermissions || isAssignPending}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    void handleApplyGroup()
                  }}
                  disabled={
                    !memberUserId || !canManagePermissions || !selectedGroup || isAssignPending
                  }
                >
                  {isAssignPending ? (
                    <CircularProgress size={14} />
                  ) : (
                    t('permissionGroups.applyButton')
                  )}
                </Button>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {t('permissionGroups.assignedGroupsTitle')}
                </Typography>
                {isGroupAssignmentsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={18} />
                  </Box>
                ) : groupAssignments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('permissionGroups.assignedGroupsEmptyState')}
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('permissionGroups.nameField')}</TableCell>
                        <TableCell>{t('permissionGroups.scopeField')}</TableCell>
                        <TableCell>{t('permissionGroups.scopeTargetField')}</TableCell>
                        <TableCell align="right">{t('teams.actionsColumnLabel')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupAssignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>{assignment.groupName}</TableCell>
                          <TableCell>
                            {prettifyPermissionEnumName(assignment.groupScopeType ?? '')}
                          </TableCell>
                          <TableCell>{assignment.targetId}</TableCell>
                          <TableCell align="right">
                            <Tooltip title={t('permissionGroups.revokeButton')}>
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={!canManagePermissions || isRevokeAssignPending}
                                  onClick={() => {
                                    void handleRevokeGroupAssignment(assignment.id)
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </>
          )}

          <TextField
            label={t('teams.permissionsSearchField')}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            size="small"
          />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredPermissions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('teams.permissionsEmptyState')}
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('teams.permissionActionField')}</TableCell>
                  <TableCell>{t('teams.permissionTargetTypeField')}</TableCell>
                  <TableCell>{t('teams.permissionTargetField')}</TableCell>
                  <TableCell align="right">{t('teams.actionsColumnLabel')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow key={permission.id ?? `${permission.action}-${permission.targetId}`}>
                    <TableCell>{prettifyPermissionEnumName(permission.action ?? '')}</TableCell>
                    <TableCell>{prettifyPermissionEnumName(permission.targetType ?? '')}</TableCell>
                    <TableCell>{permission.targetId ?? '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('teams.permissionRemoveButton')}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={
                              !canManagePermissions ||
                              isDeletePending ||
                              permission.id === undefined
                            }
                            onClick={() => handleDeletePermission(permission.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('teams.closeButtonLabel')}</Button>
      </DialogActions>
    </Dialog>
  )
}
