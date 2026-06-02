'use client'

import { Alert, Box, CircularProgress } from '@mui/material'

import { useCurrentUserProfile } from '@/core/auth/client/use-current-user-profile'
import { useI18n } from '@/core/i18n/i18n-provider'
import { EmployeeDetailView } from '@/modules/tenant/ui/employee-detail'

export function ProfilePage() {
  const { t } = useI18n()
  const { data: profile, isLoading, isError } = useCurrentUserProfile()

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

  return (
    <Box>
      {isError && <Alert severity="warning" sx={{ mb: 2 }}>{t('profile.unavailable')}</Alert>}
      <EmployeeDetailView employee={profile} id={profile.id} mode="profile" showBackButton={false} />
    </Box>
  )
}
