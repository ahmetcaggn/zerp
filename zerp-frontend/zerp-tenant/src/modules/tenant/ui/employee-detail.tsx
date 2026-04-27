'use client'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BadgeIcon from '@mui/icons-material/Badge'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CallIcon from '@mui/icons-material/Call'
import CakeIcon from '@mui/icons-material/Cake'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PersonIcon from '@mui/icons-material/Person'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useEmployee } from '../hooks/use-employees'
import type { EmploymentStatusValue } from '../types/employee'
import { EmployeeFormDialog } from './employee-form-dialog'

interface Props {
  id: string
}

const STATUS_META: Record<
  EmploymentStatusValue,
  { color: 'success' | 'info' | 'warning' | 'error' | 'default'; label: string }
> = {
  ACTIVE:     { color: 'success', label: 'Aktif' },
  PROBATION:  { color: 'info',    label: 'Deneme Süreci' },
  ON_LEAVE:   { color: 'warning', label: 'İzinli' },
  SUSPENDED:  { color: 'error',   label: 'Askıya Alındı' },
  TERMINATED: { color: 'default', label: 'Ayrıldı' },
  RETIRED:    { color: 'default', label: 'Emekli' },
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value?: string | null
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Box sx={{ color: 'text.secondary', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
          {title}
        </Typography>
        <Stack spacing={2}>{children}</Stack>
      </CardContent>
    </Card>
  )
}

function getInitials(firstName?: string, lastName?: string) {
  return `${(firstName?.[0] ?? '').toUpperCase()}${(lastName?.[0] ?? '').toUpperCase()}`
}

export function EmployeeDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  const { data: employee, isLoading, error } = useEmployee(id)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    showToast(getUserFriendlyError(error), { severity: 'error' })
    return null
  }

  if (!employee) return null

  const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim()
  const statusMeta = employee.status ? STATUS_META[employee.status] : undefined
  const managerName = employee.manager
    ? `${employee.manager.firstName ?? ''} ${employee.manager.lastName ?? ''}`.trim() || null
    : null

  return (
    <Box>
      {/* Üst bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ color: 'text.secondary' }}
        >
          Geri
        </Button>
        <Tooltip title={t('employees.editButton')}>
          <IconButton onClick={() => setEditOpen(true)} color="primary">
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Hero — avatar + isim + durum */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: '1.6rem',
                fontWeight: 700,
                bgcolor: 'primary.main',
              }}
            >
              {getInitials(employee.firstName, employee.lastName)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h5" fontWeight={700} noWrap>
                {fullName || '—'}
              </Typography>
              {employee.email && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {employee.email}
                </Typography>
              )}
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {statusMeta && (
                  <Chip
                    label={statusMeta.label}
                    color={statusMeta.color}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {employee.phoneNumber && (
                  <Chip
                    icon={<CallIcon sx={{ fontSize: '0.85rem !important' }} />}
                    label={employee.phoneNumber}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Kart grid'i */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* İstihdam */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SectionCard title="İstihdam">
            <InfoRow
              icon={<EventAvailableIcon fontSize="small" />}
              label="İşe Giriş Tarihi"
              value={employee.hireDate}
            />
            <InfoRow
              icon={<EventBusyIcon fontSize="small" />}
              label="Ayrılış Tarihi"
              value={employee.terminationDate}
            />
            <InfoRow
              icon={<MonetizationOnIcon fontSize="small" />}
              label="Maaş"
              value={employee.salary !== undefined ? `${employee.salary.toLocaleString('tr-TR')} ₺` : undefined}
            />
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label="Yönetici"
              value={managerName ?? undefined}
            />
          </SectionCard>
        </Grid>

        {/* Kişisel */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SectionCard title="Kişisel Bilgiler">
            <InfoRow
              icon={<EmailIcon fontSize="small" />}
              label="E-posta"
              value={employee.email}
            />
            <InfoRow
              icon={<FingerprintIcon fontSize="small" />}
              label="TC Kimlik No"
              value={employee.nationalId}
            />
            <InfoRow
              icon={<CakeIcon fontSize="small" />}
              label="Doğum Tarihi"
              value={employee.dateOfBirth}
            />
            <InfoRow
              icon={<BadgeIcon fontSize="small" />}
              label="Çalışan ID"
              value={String(id)}
            />
          </SectionCard>
        </Grid>
      </Grid>

      {/* İletişim bilgileri */}
      {(employee.contacts?.length ?? 0) > 0 && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}
            >
              İletişim Bilgileri
            </Typography>
            <Stack divider={<Divider flexItem />} spacing={1.5}>
              {employee.contacts?.map((c) => (
                <Box key={c.id} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip label={c.type} size="small" variant="outlined" sx={{ minWidth: 100 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {c.value ?? '—'}
                  </Typography>
                  {c.contactPersonName && (
                    <Typography variant="caption" color="text.secondary">
                      {c.contactPersonName}
                      {c.relationship ? ` · ${c.relationship}` : ''}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Sistem bilgileri */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <CalendarTodayIcon sx={{ fontSize: '0.85rem', color: 'text.disabled' }} />
          <Typography variant="caption" color="text.disabled">
            Oluşturulma: {employee.createdAt ?? '—'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <CalendarTodayIcon sx={{ fontSize: '0.85rem', color: 'text.disabled' }} />
          <Typography variant="caption" color="text.disabled">
            Son güncelleme: {employee.updatedAt ?? '—'}
          </Typography>
        </Box>
      </Box>

      <EmployeeFormDialog
        open={editOpen}
        mode="edit"
        employee={employee}
        onClose={() => setEditOpen(false)}
      />
    </Box>
  )
}
