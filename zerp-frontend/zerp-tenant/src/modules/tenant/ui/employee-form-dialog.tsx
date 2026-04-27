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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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
      showToast('Zorunlu alanları doldurun.', { severity: 'warning' })
      return
    }

    const payload: CreateEmployeeRequestDto = {
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
      createEmployee(payload, {
        onSuccess: () => {
          showToast('Çalışan oluşturuldu.', { severity: 'success' })
          onClose()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      })
    } else if (employee?.id !== undefined) {
      updateEmployee(
        { id: employee.id, data: payload },
        {
          onSuccess: () => {
            showToast('Çalışan güncellendi.', { severity: 'success' })
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Ad *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Soyad *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              size="small"
            />
          </Box>

          <TextField
            label="E-posta *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="İşe Giriş Tarihi *"
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Doğum Tarihi"
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
              label="Telefon"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="TC Kimlik"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={status}
                label="Durum"
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
              label="Maaş"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <FormControl size="small" fullWidth>
            <InputLabel>Yönetici</InputLabel>
            <Select
              value={managerId}
              label="Yönetici"
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
              <Typography variant="subtitle2">İletişim Bilgileri</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addContact}>
                Ekle
              </Button>
            </Box>

            {contacts.map((c, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <FormControl size="small" sx={{ width: 180, flexShrink: 0 }}>
                  <InputLabel>Tür</InputLabel>
                  <Select
                    value={c.type}
                    label="Tür"
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
                  label="Değer"
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
          İptal
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isPending ? (
            <CircularProgress size={20} />
          ) : mode === 'create' ? (
            'Oluştur'
          ) : (
            'Kaydet'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
