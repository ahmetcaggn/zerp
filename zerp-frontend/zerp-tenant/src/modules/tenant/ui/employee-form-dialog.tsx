'use client'
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
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import {
  useCreateEmployee,
  useEmployees,
  useUpdateEmployee,
} from '../hooks/use-employees'
import { useUsernameCheck } from '../hooks/use-username-check'
import {
  ContactType,
  EmploymentStatus,
  type CreateEmployeeRequestDto,
  type EmployeeContactDto,
  type EmployeeResponseDto,
} from '../types/employee'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  employee?: EmployeeResponseDto
  onClose: () => void
}

const STATUS_OPTIONS = Object.values(EmploymentStatus)
const CONTACT_TYPE_OPTIONS = Object.values(ContactType)
const EMPTY_CONTACT: EmployeeContactDto = { type: ContactType.WorkPhone, value: '' }

export function EmployeeFormDialog({ open, mode, employee, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [username, setUsername] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const usernameStatus = useUsernameCheck(mode === 'create' ? username : '')

  const [firstName, setFirstName] = useState(employee?.firstName ?? '')
  const [lastName, setLastName] = useState(employee?.lastName ?? '')
  const [email, setEmail] = useState(employee?.email ?? '')
  const [phoneNumber, setPhoneNumber] = useState(employee?.phoneNumber ?? '')
  const [nationalId, setNationalId] = useState(employee?.nationalId ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(employee?.dateOfBirth ?? '')
  const [hireDate, setHireDate] = useState(employee?.hireDate ?? '')
  const [status, setStatus] = useState<string>(employee?.status ?? EmploymentStatus.Active)
  const [managerId, setManagerId] = useState<string>(
    employee?.manager?.id !== undefined ? String(employee.manager.id) : '',
  )
  const [salary, setSalary] = useState<string>(
    employee?.salary !== undefined ? String(employee.salary) : '',
  )
  const [contacts, setContacts] = useState<EmployeeContactDto[]>(
    employee?.contacts?.map((c) => ({
      id: c.id,
      type: (c.type ?? ContactType.WorkPhone) as EmployeeContactDto['type'],
      value: c.value ?? '',
      contactPersonName: c.contactPersonName,
      relationship: c.relationship,
    })) ?? [],
  )

  const { data: managersResult } = useEmployees({ pagination: { page: 1, perPage: 50 } })
  const managerOptions = managersResult?.data ?? []

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee()
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee()
  const isPending = isCreating || isUpdating

  function handleSubmit() {
    if (!firstName || !lastName || !email || !hireDate) {
      showToast(t('employees.requiredFieldsWarning'), { severity: 'warning' })
      return
    }

    if (mode === 'create' && tempPassword.length < 8) {
      showToast(t('employees.requiredFieldsWarning'), { severity: 'warning' })
      return
    }

    const sharedFields = {
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

    if (mode === 'create') {
      if (usernameStatus !== 'available') {
        showToast(t('employees.usernameUnavailable'), { severity: 'warning' })
        return
      }
      createEmployee({ username, tempPassword, ...sharedFields }, {
        onSuccess: () => {
          showToast(t('employees.employeeCreatedToast'), { severity: 'success' })
          onClose()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      })
    } else if (employee?.id !== undefined) {
      updateEmployee(
        { id: String(employee.id), data: sharedFields },
        {
          onSuccess: () => {
            showToast(t('employees.employeeUpdatedToast'), { severity: 'success' })
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
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
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? t('employees.createButton') : t('employees.editButton')}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {mode === 'create' && (
            <TextField
              label={t('employees.usernameField')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          )}

          {mode === 'create' && (
            <TextField
              label={t('employees.tempPasswordField')}
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              size="small"
              fullWidth
            />
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.firstNameField')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label={t('employees.lastNameField')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              size="small"
            />
          </Box>

          <TextField
            label={t('employees.emailField')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.hireDateField')}
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label={t('employees.dateOfBirthField')}
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('employees.phoneField')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label={t('employees.nationalIdField')}
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
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
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('employees.salaryField')}
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <FormControl size="small" fullWidth>
            <InputLabel>{t('employees.managerField')}</InputLabel>
            <Select
              value={managerId}
              label={t('employees.managerField')}
              onChange={(e) => setManagerId(String(e.target.value))}
            >
              <MenuItem value="">—</MenuItem>
              {managerOptions.map((m) => (
                <MenuItem key={m.id} value={String(m.id)}>
                  {`${m.firstName ?? ''} ${m.lastName ?? ''}`.trim()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">
                {t('employees.contactInfoSection')}
              </Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addContact}>
                {t('employees.addContactButton')}
              </Button>
            </Box>

            {contacts.map((c, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <FormControl size="small" sx={{ width: 180, flexShrink: 0 }}>
                  <InputLabel>{t('employees.contactTypeLabel')}</InputLabel>
                  <Select
                    value={c.type}
                    label={t('employees.contactTypeLabel')}
                    onChange={(e) => updateContact(i, 'type', e.target.value)}
                  >
                    {CONTACT_TYPE_OPTIONS.map((ct) => (
                      <MenuItem key={ct} value={ct}>
                        {ct}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label={t('employees.contactValueField')}
                  value={c.value}
                  onChange={(e) => updateContact(i, 'value', e.target.value)}
                  size="small"
                  fullWidth
                />
                <IconButton size="small" color="error" onClick={() => removeContact(i)}>
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            isPending ||
            (mode === 'create' && usernameStatus !== 'available')
          }
        >
          {isPending ? (
            <CircularProgress size={20} />
          ) : mode === 'create' ? (
            t('common.create')
          ) : (
            t('common.save')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
