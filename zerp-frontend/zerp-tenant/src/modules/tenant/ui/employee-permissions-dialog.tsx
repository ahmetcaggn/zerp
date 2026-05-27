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

import { useAssignPermissionGroup } from '../hooks/use-permission-groups'
import { useCreatePermission, useDeletePermission, useEmployeePermissions } from '../hooks/use-permissions'
import { useShops } from '../hooks/use-shops'
import type { EmployeeListResponseDto } from '../types/employee'
import { prettifyPermissionEnumName, toPermissionKey } from '../types/permission'
import { PermissionAssignmentBuilder } from './permission-assignment-builder'
import {
  type PermissionGroupSelectionValue,
  PermissionGroupSelector,
} from './permission-group-selector'

interface Props {
  open: boolean
  employee?: EmployeeListResponseDto
  onClose: () => void
}

export function EmployeePermissionsDialog({ open, employee, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [searchInput, setSearchInput] = useState('')

  const employeeUserId = employee?.id !== undefined ? String(employee.id) : undefined
  const employeeFullName = `${employee?.firstName ?? ''} ${employee?.lastName ?? ''}`.trim()

  const {
    data: permissions = [],
    isLoading,
    error,
  } = useEmployeePermissions(employeeUserId, open && Boolean(employeeUserId))
  const { mutate: createPermission, isPending: isCreatePending } = useCreatePermission()
  const { mutate: deletePermission, isPending: isDeletePending } = useDeletePermission()
  const { mutateAsync: assignPermissionGroup, isPending: isAssignPending } = useAssignPermissionGroup()
  const { data: shopsResult } = useShops({
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
  })
  const shopOptions = useMemo(
    () =>
      (shopsResult?.data ?? []).map((shop) => ({
        id: shop.id,
        title: shop.name,
      })),
    [shopsResult?.data],
  )
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroupSelectionValue | null>(null)
  const [selectedGroupShopId, setSelectedGroupShopId] = useState('')

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

  function handleAddPermission(input: {
    action: string
    targetType: string
    targetId: string
  }) {
    if (!employeeUserId) return

    createPermission(
      {
        userId: employeeUserId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
      },
      {
        onSuccess: () =>
          showToast(t('employees.permissionAssignedToast'), {
            severity: 'success',
          }),
        onError: (err) =>
          showToast(getUserFriendlyError(err), {
            severity: 'error',
          }),
      },
    )
  }

  function handleDeletePermission(permissionId: number | undefined) {
    if (!employeeUserId || permissionId === undefined) return

    deletePermission(
      { id: permissionId, employeeUserId },
      {
        onSuccess: () =>
          showToast(t('employees.permissionRemovedToast'), {
            severity: 'success',
          }),
        onError: (err) =>
          showToast(getUserFriendlyError(err), {
            severity: 'error',
          }),
      },
    )
  }

  async function handleApplyGroup() {
    if (!employeeUserId || !selectedGroup) return

    if (selectedGroup.scopeType === 'SHOP' && !selectedGroupShopId) {
      showToast(t('permissionGroups.scopeTargetRequired'), { severity: 'warning' })
      return
    }

    try {
      const assignResult = await assignPermissionGroup({
        userId: employeeUserId,
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
    } catch (error) {
      showToast(getUserFriendlyError(error), { severity: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('employees.permissionsDialogTitle')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {employeeFullName
              ? t('employees.permissionsDialogSubtitle', { employee: employeeFullName })
              : t('employees.permissionsDialogSubtitle', { employee: '—' })}
          </Typography>

          <PermissionAssignmentBuilder
            disabled={!employeeUserId || isCreatePending || isAssignPending}
            existingKeys={existingKeys}
            onAdd={handleAddPermission}
          />

          <PermissionGroupSelector
            disabled={!employeeUserId || isAssignPending}
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
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                void handleApplyGroup()
              }}
              disabled={!employeeUserId || !selectedGroup || isAssignPending}
            >
              {isAssignPending ? <CircularProgress size={14} /> : t('permissionGroups.applyButton')}
            </Button>
          </Box>

          <TextField
            label={t('employees.permissionsSearchField')}
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
              {t('employees.permissionsEmptyState')}
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('employees.permissionActionField')}</TableCell>
                  <TableCell>{t('employees.permissionTargetTypeField')}</TableCell>
                  <TableCell>{t('employees.permissionTargetField')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow key={permission.id ?? `${permission.action}-${permission.targetId}`}>
                    <TableCell>{prettifyPermissionEnumName(permission.action ?? '')}</TableCell>
                    <TableCell>{prettifyPermissionEnumName(permission.targetType ?? '')}</TableCell>
                    <TableCell>{permission.targetId ?? '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('employees.permissionRemoveButton')}>
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
        <Button onClick={onClose}>{t('common.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}
