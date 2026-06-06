'use client'

import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
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

import { permissionClient } from '../api/permission-client'
import { useCreateEmployee, useEmployees } from '../hooks/use-employees'
import { useAssignPermissionGroup } from '../hooks/use-permission-groups'
import { useShops } from '../hooks/use-shops'
import { useUsernameCheck } from '../hooks/use-username-check'
import {
  ContactType,
  type CreateEmployeeRequestDto,
  type EmployeeContactDto,
  EmploymentStatus,
} from '../types/employee'
import type { PermissionAssignmentInput, PermissionDraftAssignment } from '../types/permission'
import { prettifyPermissionEnumName, toPermissionKey } from '../types/permission'
import { PermissionAssignmentBuilder } from './permission-assignment-builder'
import {
  type PermissionGroupSelectionValue,
  PermissionGroupSelector,
} from './permission-group-selector'

const STATUS_OPTIONS = Object.values(EmploymentStatus)
const CONTACT_TYPE_OPTIONS = Object.values(ContactType)
const EMPTY_CONTACT: EmployeeContactDto = { type: ContactType.WorkPhone, value: '' }

export function EmployeeCreatePage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { hasPermission, hasTenantPermission, getDisabledReason, isLoadingPermissions } =
    useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')
  const loadingReason = t('common.loading')
  const canCreateEmployee = hasTenantPermission(PermissionActions.CREATE_EMPLOYEE)
  const canManagePermissions = hasTenantPermission(PermissionActions.ADMIN)
  const canReadEmployees =
    hasPermission(PermissionActions.READ_EMPLOYEE) ||
    hasTenantPermission(PermissionActions.READ_EMPLOYEE)
  const formDisabled = isLoadingPermissions || !canCreateEmployee
  const createDisabledReason = isLoadingPermissions
    ? loadingReason
    : getDisabledReason(canCreateEmployee, unauthorizedReason)
  const managePermissionsDisabledReason = isLoadingPermissions
    ? loadingReason
    : getDisabledReason(canManagePermissions, unauthorizedReason)

  const [username, setUsername] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const usernameStatus = useUsernameCheck(canCreateEmployee ? username : '')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [hireDate, setHireDate] = useState('')
  const [status, setStatus] = useState<string>(EmploymentStatus.Active)
  const [managerId, setManagerId] = useState('')
  const [salary, setSalary] = useState('')
  const [contacts, setContacts] = useState<EmployeeContactDto[]>([])

  const [draftPermissions, setDraftPermissions] = useState<PermissionDraftAssignment[]>([])
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroupSelectionValue | null>(null)
  const [selectedGroupShopId, setSelectedGroupShopId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const existingDraftPermissionKeys = useMemo(() => {
    const keys = new Set<string>()
    for (const permission of draftPermissions) {
      keys.add(
        toPermissionKey({
          action: permission.action,
          targetType: permission.targetType,
          targetId: permission.targetId,
        }),
      )
    }
    return keys
  }, [draftPermissions])

  const { data: managersResult } = useEmployees(
    { pagination: { page: 1, perPage: 50 } },
    { enabled: canReadEmployees },
  )
  const managerOptions = managersResult?.data ?? []

  const { data: shopsResult } = useShops(
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'name', order: 'ASC' },
    },
    canManagePermissions,
  )

  const shopOptions = useMemo(
    () =>
      (shopsResult?.data ?? []).map((shop) => ({
        id: shop.id,
        title: shop.name,
      })),
    [shopsResult?.data],
  )

  const { mutateAsync: createEmployeeAsync } = useCreateEmployee()
  const { mutateAsync: assignGroupAsync } = useAssignPermissionGroup()

  const isPending = isSubmitting

  function addContact() {
    setContacts((prev) => [...prev, { ...EMPTY_CONTACT }])
  }

  function removeContact(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index))
  }

  function updateContact(index: number, field: keyof EmployeeContactDto, value: string) {
    setContacts((prev) =>
      prev.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact)),
    )
  }

  function addDraftPermission(permission: PermissionAssignmentInput) {
    setDraftPermissions((prev) => [
      ...prev,
      {
        action: permission.action,
        targetType: permission.targetType,
        targetId: permission.targetId,
        targetTitle: permission.targetTitle,
      },
    ])
  }

  function removeDraftPermission(index: number) {
    setDraftPermissions((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (!canCreateEmployee) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    if (!firstName || !lastName || !email || !hireDate) {
      showToast(t('employees.requiredFieldsWarning'), { severity: 'warning' })
      return
    }

    if (tempPassword.length < 8) {
      showToast(t('employees.tempPasswordMinLengthWarning'), { severity: 'warning' })
      return
    }

    if (usernameStatus !== 'available') {
      showToast(t('employees.usernameUnavailable'), { severity: 'warning' })
      return
    }

    if (canManagePermissions && selectedGroup?.scopeType === 'SHOP' && !selectedGroupShopId) {
      showToast(t('permissionGroups.scopeTargetRequired'), { severity: 'warning' })
      return
    }

    const payload: CreateEmployeeRequestDto = {
      username,
      tempPassword,
      firstName,
      lastName,
      email,
      hireDate,
      ...(phoneNumber && { phoneNumber }),
      ...(nationalId && { nationalId }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(status && { status: status as CreateEmployeeRequestDto['status'] }),
      ...(managerId && { managerId: managerId as unknown as number }),
      ...(salary && { salary: Number(salary) }),
      ...(contacts.length > 0 && { contacts }),
    }

    setIsSubmitting(true)

    try {
      const createdEmployee = await createEmployeeAsync(payload)
      const createdEmployeeUserId =
        createdEmployee?.id !== undefined ? String(createdEmployee.id) : undefined

      if (createdEmployeeUserId && canManagePermissions && draftPermissions.length > 0) {
        try {
          await Promise.all(
            draftPermissions.map((permission) =>
              permissionClient.create({
                userId: createdEmployeeUserId,
                action: permission.action,
                targetType: permission.targetType,
                targetId: permission.targetId,
              }),
            ),
          )
        } catch {
          showToast(t('employees.permissionAssignPartialError'), { severity: 'warning' })
        }
      }

      if (createdEmployeeUserId && canManagePermissions && selectedGroup) {
        try {
          const assignResponse = await assignGroupAsync({
            userId: createdEmployeeUserId,
            ...(selectedGroup.source === 'CUSTOM'
              ? { groupId: selectedGroup.id }
              : { predefinedCode: selectedGroup.code }),
            ...(selectedGroup.scopeType === 'SHOP' && selectedGroupShopId
              ? { scopeTargetId: selectedGroupShopId }
              : {}),
          })

          if (assignResponse.skippedCount > 0) {
            showToast(t('permissionGroups.applyPartialToast'), { severity: 'info' })
          } else {
            showToast(t('permissionGroups.appliedToast'))
          }
        } catch {
          showToast(t('permissionGroups.applyPartialToast'), { severity: 'warning' })
        }
      }

      showToast(t('employees.employeeCreatedToast'), { severity: 'success' })
      router.push(withLocale(locale, ROUTES.employees) as Route)
    } catch (error) {
      showToast(getUserFriendlyError(error), { severity: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(withLocale(locale, ROUTES.employees) as Route)}
        >
          {t('common.back')}
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h5">{t('employees.createButton')}</Typography>
          {!canCreateEmployee && !isLoadingPermissions ? (
            <Alert severity="warning">{unauthorizedReason}</Alert>
          ) : null}

          <TextField
            label={t('employees.usernameField')}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            size="small"
            fullWidth
            disabled={formDisabled}
            error={usernameStatus === 'unavailable' || usernameStatus === 'error'}
            helperText={
              usernameStatus === 'idle'
                ? username.trim().length > 0 && username.trim().length < 3
                  ? t('employees.usernameMinLength')
                  : undefined
                : usernameStatus === 'checking'
                  ? t('employees.usernameChecking')
                  : usernameStatus === 'available'
                    ? t('employees.usernameAvailable')
                    : usernameStatus === 'unavailable'
                      ? t('employees.usernameUnavailable')
                      : t('employees.usernameError')
            }
            FormHelperTextProps={{
              sx: {
                color:
                  usernameStatus === 'available'
                    ? 'success.main'
                    : usernameStatus === 'checking'
                      ? 'text.secondary'
                      : undefined,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {usernameStatus === 'checking' && <CircularProgress size={16} />}
                    {usernameStatus === 'available' && (
                      <CheckCircleOutlineIcon color="success" fontSize="small" />
                    )}
                    {(usernameStatus === 'unavailable' || usernameStatus === 'error') && (
                      <ErrorOutlineIcon color="error" fontSize="small" />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label={t('employees.tempPasswordField')}
            type="password"
            value={tempPassword}
            onChange={(event) => setTempPassword(event.target.value)}
            size="small"
            fullWidth
            disabled={formDisabled}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.firstNameField')}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              fullWidth
              size="small"
              disabled={formDisabled}
            />
            <TextField
              label={t('employees.lastNameField')}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              fullWidth
              size="small"
              disabled={formDisabled}
            />
          </Box>

          <TextField
            label={t('employees.emailField')}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            size="small"
            disabled={formDisabled}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.hireDateField')}
              type="date"
              value={hireDate}
              onChange={(event) => setHireDate(event.target.value)}
              size="small"
              fullWidth
              disabled={formDisabled}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label={t('employees.dateOfBirthField')}
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              size="small"
              fullWidth
              disabled={formDisabled}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.phoneField')}
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              size="small"
              fullWidth
              disabled={formDisabled}
            />
            <TextField
              label={t('employees.nationalIdField')}
              value={nationalId}
              onChange={(event) => setNationalId(event.target.value)}
              size="small"
              fullWidth
              disabled={formDisabled}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth disabled={formDisabled}>
              <InputLabel>{t('employees.statusField')}</InputLabel>
              <Select
                value={status}
                label={t('employees.statusField')}
                onChange={(event) => setStatus(event.target.value)}
              >
                {STATUS_OPTIONS.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('employees.salaryField')}
              type="number"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              size="small"
              fullWidth
              disabled={formDisabled}
            />
          </Box>

          <FormControl size="small" fullWidth disabled={formDisabled}>
            <InputLabel>{t('employees.managerField')}</InputLabel>
            <Select
              value={managerId}
              label={t('employees.managerField')}
              onChange={(event) => setManagerId(String(event.target.value))}
            >
              <MenuItem value="">—</MenuItem>
              {managerOptions.map((manager) => (
                <MenuItem key={manager.id} value={String(manager.id)}>
                  {`${manager.firstName ?? ''} ${manager.lastName ?? ''}`.trim()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title={managePermissionsDisabledReason ?? ''}>
            <span>
              <PermissionGroupSelector
                disabled={isPending || !canManagePermissions}
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
            </span>
          </Tooltip>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <PermissionAssignmentBuilder
              disabled={isPending || !canManagePermissions}
              existingKeys={existingDraftPermissionKeys}
              onAdd={addDraftPermission}
            />

            {draftPermissions.length > 0 && (
              <List dense disablePadding>
                {draftPermissions.map((permission, index) => (
                  <ListItem
                    key={`${permission.action}-${permission.targetType}-${permission.targetId}-${index}`}
                    secondaryAction={
                      <IconButton
                        size="small"
                        color="error"
                        disabled={!canManagePermissions}
                        onClick={() => removeDraftPermission(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${prettifyPermissionEnumName(permission.action)} · ${prettifyPermissionEnumName(permission.targetType)}`}
                      secondary={`${permission.targetTitle} (${permission.targetId})`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
            >
              <Typography variant="subtitle2">{t('employees.contactInfoSection')}</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={addContact}
                disabled={formDisabled}
              >
                {t('employees.addContactButton')}
              </Button>
            </Box>

            {contacts.map((contact, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <FormControl size="small" sx={{ width: 180, flexShrink: 0 }}>
                  <InputLabel>{t('employees.contactTypeLabel')}</InputLabel>
                  <Select
                    value={contact.type}
                    label={t('employees.contactTypeLabel')}
                    onChange={(event) => updateContact(index, 'type', event.target.value)}
                    disabled={formDisabled}
                  >
                    {CONTACT_TYPE_OPTIONS.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label={t('employees.contactValueField')}
                  value={contact.value}
                  onChange={(event) => updateContact(index, 'value', event.target.value)}
                  size="small"
                  fullWidth
                  disabled={formDisabled}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeContact(index)}
                  disabled={formDisabled}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title={createDisabledReason ?? ''}>
              <span>
                <Button
                  variant="contained"
                  onClick={() => {
                    void handleSubmit()
                  }}
                  disabled={isPending || usernameStatus !== 'available' || !canCreateEmployee}
                >
                  {isPending ? <CircularProgress size={20} /> : t('common.create')}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
