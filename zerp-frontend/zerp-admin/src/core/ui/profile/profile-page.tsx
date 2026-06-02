'use client'

import BadgeIcon from '@mui/icons-material/Badge'
import CakeIcon from '@mui/icons-material/Cake'
import CallIcon from '@mui/icons-material/Call'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import PersonIcon from '@mui/icons-material/Person'
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'

import { useCurrentUserProfile } from '@/core/auth/client/use-current-user-profile'
import { useI18n } from '@/core/i18n/i18n-provider'
import type { EmploymentStatusValue } from '@/modules/admin/types/employee'

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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}
        >
          {title}
        </Typography>
        <Stack spacing={2}>{children}</Stack>
      </CardContent>
    </Card>
  )
}

function getInitials(firstName?: string, lastName?: string, username?: string) {
  const initials = `${(firstName?.[0] ?? '').toUpperCase()}${(lastName?.[0] ?? '').toUpperCase()}`
  return initials || (username?.[0] ?? '').toUpperCase()
}

export function ProfilePage() {
  const { t } = useI18n()
  const { data: profile, isLoading, isError } = useCurrentUserProfile()

  const STATUS_META: Record<
    EmploymentStatusValue,
    { color: 'success' | 'info' | 'warning' | 'error' | 'default'; label: string }
  > = {
    ACTIVE: { color: 'success', label: t('profile.statusActive') },
    PROBATION: { color: 'info', label: t('profile.statusProbation') },
    ON_LEAVE: { color: 'warning', label: t('profile.statusOnLeave') },
    SUSPENDED: { color: 'error', label: t('profile.statusSuspended') },
    TERMINATED: { color: 'default', label: t('profile.statusTerminated') },
    RETIRED: { color: 'default', label: t('profile.statusRetired') },
    DELETED: { color: 'default', label: t('profile.statusDeleted') },
  }

  if (isLoading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return isError ? <Alert severity="warning">{t('profile.unavailable')}</Alert> : null
  }

  const fullName =
    `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() ||
    profile.username ||
    profile.email ||
    '—'
  const statusMeta = profile.status ? STATUS_META[profile.status] : undefined
  const managerName = profile.manager
    ? `${profile.manager.firstName ?? ''} ${profile.manager.lastName ?? ''}`.trim() || null
    : null

  return (
    <Box>
      {isError && <Alert severity="warning" sx={{ mb: 2 }}>{t('profile.unavailable')}</Alert>}

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
              {getInitials(profile.firstName, profile.lastName, profile.username)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h5" fontWeight={700} noWrap>
                {fullName}
              </Typography>
              {profile.email && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {profile.email}
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
                {profile.phoneNumber && (
                  <Chip
                    icon={<CallIcon sx={{ fontSize: '0.85rem !important' }} />}
                    label={profile.phoneNumber}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SectionCard title={t('profile.employmentSection')}>
            <InfoRow
              icon={<EventAvailableIcon fontSize="small" />}
              label={t('employees.statusField')}
              value={statusMeta?.label}
            />
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label={t('profile.managerLabel')}
              value={managerName ?? undefined}
            />
            <InfoRow
              icon={<BadgeIcon fontSize="small" />}
              label={t('profile.userIdLabel')}
              value={profile.id}
            />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <SectionCard title={t('profile.personalInfoSection')}>
            <InfoRow
              icon={<CallIcon fontSize="small" />}
              label={t('employees.phoneField')}
              value={profile.phoneNumber}
            />
            <InfoRow
              icon={<FingerprintIcon fontSize="small" />}
              label={t('employees.nationalIdField')}
              value={profile.nationalId}
            />
            <InfoRow
              icon={<CakeIcon fontSize="small" />}
              label={t('employees.dateOfBirthField')}
              value={profile.dateOfBirth}
            />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}
