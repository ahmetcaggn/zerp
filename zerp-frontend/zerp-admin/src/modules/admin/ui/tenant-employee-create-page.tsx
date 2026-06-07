'use client'

import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
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
import { useCreateTenantEmployee, useTenantEmployees } from '../hooks/use-employees'
import { useAssignPermissionGroup } from '../hooks/use-permission-groups'
import { useShops } from '../hooks/use-shops'
import { useTenant } from '../hooks/use-tenants'
import { useUsernameCheck } from '../hooks/use-username-check'
import {
  ContactType,
  type CreateEmployeeRequest,
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

interface Props {
  tenantId: string
}

export function TenantEmployeeCreatePage({ tenantId }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { data: tenant } = useTenant(tenantId)
  const { hasPermission } = useCurrentUserPermissions()
  const canCreateEmployee = hasPermission(PermissionActions.CREATE_EMPLOYEE_ANY_TENANT)

  const [username, setUsername] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const usernameStatus = useUsernameCheck(username)

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

  const { data: managersResult } = useTenantEmployees(
    tenantId,
    { pagination: { page: 1, perPage: 100 }, sort: { field: 'id', order: 'ASC' } },
    { enabled: canCreateEmployee },
  )
  const managerOptions = managersResult?.data ?? []

  const { data: shopsResult } = useShops(
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'name', order: 'ASC' },
      filter: { 'tenantId.eq': tenantId },
    },
    { enabled: canCreateEmployee },
  )

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

  const { mutateAsync: createEmployeeAsync } = useCreateTenantEmployee(tenantId)
  const { mutateAsync: assignGroupAsync } = useAssignPermissionGroup(tenantId)

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
      status: status as CreateEmployeeRequest['status'],
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
      showToast(t('employees.unauthorized'), { severity: 'warning' })
      return
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !hireDate || !username.trim()) {
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

    if (selectedGroup?.scopeType === 'SHOP' && !selectedGroupShopId) {
      showToast(t('permissionGroups.scopeTargetRequired'), { severity: 'warning' })
      return
    }

    setIsSubmitting(true)

    try {
      const createdEmployee = await createEmployeeAsync(buildPayload())
      const createdEmployeeUserId = createdEmployee.id

      if (createdEmployeeUserId && draftPermissions.length > 0) {
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

      if (createdEmployeeUserId && selectedGroup) {
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
            showToast(t('permissionGroups.appliedToast'), { severity: 'success' })
          }
        } catch {
          showToast(t('permissionGroups.applyPartialToast'), { severity: 'warning' })
        }
      }

      showToast(t('employees.employeeCreatedToast'), { severity: 'success' })
      router.push(withLocale(locale, `${ROUTES.tenants}/${tenantId}`) as Route)
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
          onClick={() => router.push(withLocale(locale, `${ROUTES.tenants}/${tenantId}`) as Route)}
        >
          {t('tenants.backButton')}
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h5">{t('employees.createButton')}</Typography>
          {tenant?.name && (
            <Typography variant="body2" color="text.secondary">
              {t('employees.tenantContextSubtitle', { tenant: tenant.name })}
            </Typography>
          )}

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
            <FormControl size="small" fullWidth>
              <InputLabel>{t('employees.statusField')}</InputLabel>
              <Select
                label={t('employees.statusField')}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {prettifyPermissionEnumName(option)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>{t('employees.managerField')}</InputLabel>
              <Select
                label={t('employees.managerField')}
                value={managerId}
                onChange={(event) => setManagerId(event.target.value)}
              >
                <MenuItem value="">—</MenuItem>
                {managerOptions
                  .filter((manager) => Boolean(manager.id))
                  .map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {`${manager.firstName ?? ''} ${manager.lastName ?? ''}`.trim()}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label={t('employees.salaryField')}
            type="number"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            size="small"
          />

          <Typography variant="subtitle2">{t('employees.contactInfoSection')}</Typography>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {contacts.map((contact, index) => (
              <ListItem
                key={`${contact.type}-${index}`}
                disableGutters
                sx={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 1 }}
              >
                <FormControl size="small">
                  <InputLabel>{t('employees.contactTypeLabel')}</InputLabel>
                  <Select
                    label={t('employees.contactTypeLabel')}
                    value={contact.type}
                    onChange={(event) => updateContact(index, 'type', event.target.value)}
                  >
                    {CONTACT_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {prettifyPermissionEnumName(option)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label={t('employees.contactValueField')}
                  value={contact.value}
                  onChange={(event) => updateContact(index, 'value', event.target.value)}
                />
                <IconButton
                  color="error"
                  onClick={() => removeContact(index)}
                  disabled={!canCreateEmployee || isSubmitting}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="text"
            size="small"
            startIcon={<AddIcon />}
            onClick={addContact}
            disabled={!canCreateEmployee || isSubmitting}
          >
            {t('employees.addContactButton')}
          </Button>

          <PermissionAssignmentBuilder
            disabled={!canCreateEmployee || isSubmitting}
            existingKeys={existingDraftPermissionKeys}
            onAdd={addDraftPermission}
            i18nPrefix="employees"
            prefilledTargets={
              tenantId && tenant?.name
                ? { TENANT: { id: tenantId, title: tenant.name } }
                : undefined
            }
            tenantId={tenantId}
          />

          {draftPermissions.length > 0 && (
            <List dense>
              {draftPermissions.map((permission, index) => (
                <ListItem
                  key={`${permission.action}-${permission.targetType}-${permission.targetId}-${index}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => removeDraftPermission(index)}
                      disabled={!canCreateEmployee || isSubmitting}
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
            disabled={!canCreateEmployee || isSubmitting}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting || !canCreateEmployee}
            >
              {isSubmitting ? <CircularProgress size={18} /> : t('employees.createButton')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
