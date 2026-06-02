'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BadgeIcon from '@mui/icons-material/Badge'
import CakeIcon from '@mui/icons-material/Cake'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CallIcon from '@mui/icons-material/Call'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PersonIcon from '@mui/icons-material/Person'
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
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useEmployee } from '../hooks/use-employees'
import type { EmployeeResponseDto, EmploymentStatusValue } from '../types/employee'
import { EmployeeFormDialog } from './employee-form-dialog'

interface Props {
  id: string
}

type EmployeeDetailData = Omit<EmployeeResponseDto, 'id'> & {
  id?: number | string
  username?: string
}

interface EmployeeDetailViewProps {
  employee: EmployeeDetailData
  id?: string
  mode?: 'detail' | 'profile'
  showBackButton?: boolean
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
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontSize: '0.7rem',
          }}
        >
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

export function EmployeeDetailView({
  employee,
  id,
  mode = 'detail',
  showBackButton = true,
}: EmployeeDetailViewProps) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  const STATUS_META: Record<
    EmploymentStatusValue,
    { color: 'success' | 'info' | 'warning' | 'error' | 'default'; label: string }
  > = {
    ACTIVE:     { color: 'success', label: t('employees.statusActive') },
    PROBATION:  { color: 'info',    label: t('employees.statusProbation') },
    ON_LEAVE:   { color: 'warning', label: t('employees.statusOnLeave') },
    SUSPENDED:  { color: 'error',   label: t('employees.statusSuspended') },
    TERMINATED: { color: 'default', label: t('employees.statusTerminated') },
    RETIRED:    { color: 'default', label: t('employees.statusRetired') },
  }

  const fullName =
    `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim() ||
    employee.username ||
    employee.email
  const statusMeta = employee.status ? STATUS_META[employee.status] : undefined
  const managerName = employee.manager
    ? `${employee.manager.firstName ?? ''} ${employee.manager.lastName ?? ''}`.trim() || null
    : null

  const salaryLocale = locale === 'tr' ? 'tr-TR' : 'en-US'
  const employeeId = String(employee.id ?? id ?? '')
  const isProfileMode = mode === 'profile'

  return (
    <Box>
      {/* Top bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {showBackButton ? (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ color: 'text.secondary' }}
          >
            {t('common.back')}
          </Button>
        ) : (
          <Box />
        )}
        {!isProfileMode && (
          <Tooltip title={t('employees.editButton')}>
            <IconButton onClick={() => setEditOpen(true)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Hero — avatar + name + status */}
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

      {/* Card grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Employment */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SectionCard title={t('employees.employmentSection')}>
            {isProfileMode ? (
              <InfoRow
                icon={<EventAvailableIcon fontSize="small" />}
                label={t('employees.statusField')}
                value={statusMeta?.label}
              />
            ) : (
              <>
                <InfoRow
                  icon={<EventAvailableIcon fontSize="small" />}
                  label={t('employees.hireDateLabel')}
                  value={employee.hireDate}
                />
                <InfoRow
                  icon={<EventBusyIcon fontSize="small" />}
                  label={t('employees.terminationDateLabel')}
                  value={employee.terminationDate}
                />
                <InfoRow
                  icon={<MonetizationOnIcon fontSize="small" />}
                  label={t('employees.salaryLabel')}
                  value={
                    employee.salary != null
                      ? employee.salary.toLocaleString(salaryLocale)
                      : undefined
                  }
                />
              </>
            )}
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label={t('employees.managerLabel')}
              value={managerName ?? undefined}
            />
            {isProfileMode && (
              <InfoRow
                icon={<BadgeIcon fontSize="small" />}
                label={t('employees.employeeIdLabel')}
                value={employeeId}
              />
            )}
          </SectionCard>
        </Grid>

        {/* Personal */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SectionCard title={t('employees.personalInfoSection')}>
            {isProfileMode ? (
              <InfoRow
                icon={<CallIcon fontSize="small" />}
                label={t('employees.phoneField')}
                value={employee.phoneNumber}
              />
            ) : (
              <InfoRow
                icon={<EmailIcon fontSize="small" />}
                label={t('employees.emailLabel')}
                value={employee.email}
              />
            )}
            <InfoRow
              icon={<FingerprintIcon fontSize="small" />}
              label={t('employees.nationalIdLabel')}
              value={employee.nationalId}
            />
            <InfoRow
              icon={<CakeIcon fontSize="small" />}
              label={t('employees.dateOfBirthLabel')}
              value={employee.dateOfBirth}
            />
            {!isProfileMode && (
              <InfoRow
                icon={<BadgeIcon fontSize="small" />}
                label={t('employees.employeeIdLabel')}
                value={employeeId}
              />
            )}
          </SectionCard>
        </Grid>
      </Grid>

      {/* Contact info */}
      {(employee.contacts?.length ?? 0) > 0 && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.7rem',
              }}
            >
              {t('employees.contactInfoSection')}
            </Typography>
            <Stack divider={<Divider flexItem />} spacing={1.5}>
              {employee.contacts?.map((c) => (
                <Box
                  key={c.id}
                  sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}
                >
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

      {!isProfileMode && (
        <>
          {/* System info */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ fontSize: '0.85rem', color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled">
                {t('employees.createdAtLabel')} {employee.createdAt ?? '—'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ fontSize: '0.85rem', color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled">
                {t('employees.updatedAtLabel')} {employee.updatedAt ?? '—'}
              </Typography>
            </Box>
          </Box>

          <EmployeeFormDialog
            open={editOpen}
            mode="edit"
            employee={employee as EmployeeResponseDto}
            onClose={() => setEditOpen(false)}
          />
        </>
      )}
    </Box>
  )
}

export function EmployeeDetail({ id }: Props) {
  const { showToast } = useToast()
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

  return <EmployeeDetailView employee={employee} id={id} />
}
