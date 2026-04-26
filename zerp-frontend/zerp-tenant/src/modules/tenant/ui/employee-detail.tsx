'use client'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useEmployee } from '../hooks/use-employees'
import { EmployeeFormDialog } from './employee-form-dialog'

interface Props {
  id: String
}

export function EmployeeDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  const { data: employee, isLoading, error } = useEmployee(id)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    showToast(getUserFriendlyError(error), { severity: 'error' })
    return null
  }

  if (!employee) return null

  const fields: Array<{ label: string; value: ReactNode }> = [
    { label: 'E-posta', value: employee.email ?? '—' },
    { label: 'Telefon', value: employee.phoneNumber ?? '—' },
    { label: 'TC Kimlik', value: employee.nationalId ?? '—' },
    { label: 'Doğum Tarihi', value: employee.dateOfBirth ?? '—' },
    { label: 'İşe Giriş', value: employee.hireDate ?? '—' },
    { label: 'Ayrılış Tarihi', value: employee.terminationDate ?? '—' },
    {
      label: 'Maaş',
      value: employee.salary !== undefined ? `${employee.salary} ₺` : '—',
    },
    {
      label: 'Durum',
      value: employee.status ? <Chip label={employee.status} size="small" /> : '—',
    },
    {
      label: 'Yönetici',
      value: employee.manager
        ? `${employee.manager.firstName ?? ''} ${employee.manager.lastName ?? ''}`.trim() || '—'
        : '—',
    },
    {
      label: 'Oluşturulma',
      value: employee.createdAt ?? '—',
    },
    {
      label: 'Güncelleme',
      value: employee.updatedAt ?? '—',
    },
  ]

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(ROUTES.employees)}>
          {t('employees.title')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setEditOpen(true)}
        >
          {t('employees.editButton')}
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {`${employee.firstName ?? ''} ${employee.lastName ?? ''}`}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {fields.map(({ label, value }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              {label}
            </Typography>
            <Typography variant="body2" component="div">{value}</Typography>
          </Grid>
        ))}
      </Grid>

      {(employee.contacts?.length ?? 0) > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            İletişim Bilgileri
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {employee.contacts?.map((c) => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label={c.type} size="small" variant="outlined" />
                <Typography variant="body2">{c.value}</Typography>
                {c.contactPersonName && (
                  <Typography variant="caption" color="text.secondary">
                    ({c.contactPersonName})
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      <EmployeeFormDialog
        open={editOpen}
        mode="edit"
        employee={employee}
        onClose={() => setEditOpen(false)}
      />
    </Box>
  )
}
