'use client'

import AddIcon from '@mui/icons-material/Add'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { permissionClient } from '../api/permission-client'
import { useCreateTenantEmployee, useTenantEmployees } from '../hooks/use-employees'
import { useUsernameCheck } from '../hooks/use-username-check'
import {
  ContactType,
  type CreateEmployeeRequest,
  type EmployeeContactDto,
  EmploymentStatus,
  type EmploymentStatusValue,
} from '../types/employee'
import type { PermissionAssignmentInput, PermissionDraftAssignment } from '../types/permission'
import { prettifyPermissionEnumName, toPermissionKey } from '../types/permission'
import { PermissionAssignmentBuilder } from './permission-assignment-builder'

interface Props {
  open: boolean
  tenantId: string
  tenantName?: string
  onClose: () => void
}

const STATUS_OPTIONS = Object.values(EmploymentStatus)
const CONTACT_TYPE_OPTIONS = Object.values(ContactType)
const EMPTY_CONTACT: EmployeeContactDto = { type: ContactType.WorkPhone, value: '' }

export function TenantEmployeeFormDialog({ open, tenantId, tenantName, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [username, setUsername] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const usernameStatus = useUsernameCheck(open ? username : '')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [hireDate, setHireDate] = useState('')
  const [status, setStatus] = useState<EmploymentStatusValue>(EmploymentStatus.Active)
  const [managerId, setManagerId] = useState('')
  const [salary, setSalary] = useState('')
  const [contacts, setContacts] = useState<EmployeeContactDto[]>([])
  const [draftPermissions, setDraftPermissions] = useState<PermissionDraftAssignment[]>([])

  const { hasAnyPermission } = useCurrentUserPermissions()
  const canCreateEmployee = hasAnyPermission([PermissionActions.CREATE_EMPLOYEE])

  const { data: managersResult } = useTenantEmployees(
    tenantId,
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'id', order: 'ASC' },
    },
    {
      enabled: open && canCreateEmployee,
    },
  )
  const managerOptions = managersResult?.data ?? []

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

  const { mutate: createEmployee, isPending: isCreating } = useCreateTenantEmployee(tenantId)

  function resetForm() {
    setUsername('')
    setTempPassword('')
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhoneNumber('')
    setNationalId('')
    setDateOfBirth('')
    setHireDate('')
    setStatus(EmploymentStatus.Active)
    setManagerId('')
    setSalary('')
    setContacts([])
    setDraftPermissions([])
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function normalizeOptional(value: string): string | undefined {
    const normalized = value.trim()
    return normalized ? normalized : undefined
  }

  function normalizeContacts(): EmployeeContactDto[] | undefined {
    const normalized = contacts
      .map((contact) => ({
        ...contact,
        value: contact.value.trim(),
        contactPersonName: normalizeOptional(contact.contactPersonName ?? ''),
        relationship: normalizeOptional(contact.relationship ?? ''),
      }))
      .filter((contact) => contact.value.length > 0)

    return normalized.length > 0 ? normalized : undefined
  }

  function buildPayload(): CreateEmployeeRequest {
    return {
      username: username.trim(),
      tempPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: normalizeOptional(phoneNumber),
      nationalId: normalizeOptional(nationalId),
      dateOfBirth: normalizeOptional(dateOfBirth),
      hireDate,
      status,
      managerId: normalizeOptional(managerId),
      salary: salary.trim() ? Number(salary) : undefined,
      contacts: normalizeContacts(),
    }
  }

  function addContact() {
    setContacts((prev) => [...prev, { ...EMPTY_CONTACT }])
  }

  function removeContact(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index))
  }

  function updateContact(index: number, field: keyof EmployeeContactDto, value: string) {
    setContacts((prev) => prev.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact)))
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

  function handleSubmit() {
    if (!canCreateEmployee) {
      showToast(t('employees.unauthorized'), { severity: 'warning' })
      return
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !hireDate || !username.trim()) {
      showToast(t('employees.requiredFieldsWarning'), { severity: 'warning' })
      return
    }

    if (tempPassword.length < 8) {
      showToast(t('employees.requiredFieldsWarning'), { severity: 'warning' })
      return
    }

    if (usernameStatus !== 'available') {
      showToast(t('employees.usernameUnavailable'), { severity: 'warning' })
      return
    }

    createEmployee(buildPayload(), {
      onSuccess: async (createdEmployee) => {
        const createdEmployeeId = createdEmployee.id
        if (createdEmployeeId && draftPermissions.length > 0) {
          try {
            await Promise.all(
              draftPermissions.map((permission) =>
                permissionClient.create({
                  userId: createdEmployeeId,
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

        showToast(t('employees.employeeCreatedToast'), { severity: 'success' })
        handleClose()
      },
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth onTransitionEnter={resetForm}>
      <DialogTitle>{t('employees.createButton')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label={t('employees.usernameField')}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            size="small"
            fullWidth
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
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.firstNameField')}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label={t('employees.lastNameField')}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              fullWidth
              size="small"
            />
          </Box>

          <TextField
            label={t('employees.emailField')}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            size="small"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.hireDateField')}
              type="date"
              value={hireDate}
              onChange={(event) => setHireDate(event.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label={t('employees.dateOfBirthField')}
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              size="small"
              fullWidth
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
            />
            <TextField
              label={t('employees.nationalIdField')}
              value={nationalId}
              onChange={(event) => setNationalId(event.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>{t('employees.statusField')}</InputLabel>
              <Select
                value={status}
                label={t('employees.statusField')}
                onChange={(event) => setStatus(event.target.value as EmploymentStatusValue)}
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
            />
          </Box>

          <FormControl size="small" fullWidth>
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <PermissionAssignmentBuilder
              disabled={isCreating}
              existingKeys={existingDraftPermissionKeys}
              onAdd={addDraftPermission}
              i18nPrefix="employees"
              prefilledTargets={tenantName ? { TENANT: { id: tenantId, title: tenantName } } : undefined}
            />

            {draftPermissions.length > 0 && (
              <List dense disablePadding>
                {draftPermissions.map((permission, index) => (
                  <ListItem
                    key={`${permission.action}-${permission.targetType}-${permission.targetId}-${index}`}
                    secondaryAction={
                      <IconButton size="small" color="error" onClick={() => removeDraftPermission(index)}>
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
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">{t('employees.contactInfoSection')}</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addContact}>
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
                  >
                    {CONTACT_TYPE_OPTIONS.map((contactType) => (
                      <MenuItem key={contactType} value={contactType}>
                        {contactType}
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
                />
                <IconButton size="small" color="error" onClick={() => removeContact(index)}>
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isCreating}>
          {t('employees.closeButtonLabel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isCreating || !canCreateEmployee || usernameStatus !== 'available'}
        >
          {isCreating ? <CircularProgress size={20} /> : t('employees.createButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
