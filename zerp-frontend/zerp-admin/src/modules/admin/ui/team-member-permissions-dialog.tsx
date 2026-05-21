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
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useCreatePermission,
  useDeletePermission,
  useMemberPermissions,
} from '../hooks/use-permission-management'
import { prettifyPermissionEnumName, toPermissionKey } from '../types/permission'
import type { TeamMemberResponse } from '../types/team'
import { PermissionAssignmentBuilder } from './permission-assignment-builder'

interface Props {
  open: boolean
  member?: TeamMemberResponse
  onClose: () => void
}

export function TeamMemberPermissionsDialog({ open, member, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [searchInput, setSearchInput] = useState('')

  const memberUserId = member?.userId
  const memberName = member?.displayName || member?.email || member?.userId || '—'

  const {
    data: permissions = [],
    isLoading,
    error,
  } = useMemberPermissions(memberUserId, open && Boolean(memberUserId))
  const { mutate: createPermission, isPending: isCreatePending } = useCreatePermission()
  const { mutate: deletePermission, isPending: isDeletePending } = useDeletePermission()

  if (error) {
    showToast(getUserFriendlyError(error), { severity: 'error' })
  }

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
    if (!memberUserId) return

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
    if (!memberUserId || permissionId === undefined) return

    deletePermission(
      { id: permissionId, memberUserId },
      {
        onSuccess: () => showToast(t('teams.permissionRemovedToast'), { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
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
            disabled={!memberUserId || isCreatePending}
            existingKeys={existingKeys}
            onAdd={handleAddPermission}
          />

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
                            disabled={isDeletePending || permission.id === undefined}
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
