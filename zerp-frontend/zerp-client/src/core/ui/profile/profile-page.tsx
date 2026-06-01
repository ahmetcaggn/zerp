'use client'

import { Alert, Box, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material'

import { useAuth } from '@/core/auth/client/use-auth'
import { useCurrentUserProfile } from '@/core/auth/client/use-current-user-profile'
import { useI18n } from '@/core/i18n/i18n-provider'

function resolveFallbackUsername(name?: string | null, email?: string | null): string {
  const normalizedName = name?.trim()
  if (normalizedName) {
    return normalizedName
  }

  const normalizedEmail = email?.trim()
  if (normalizedEmail) {
    return normalizedEmail
  }

  return '—'
}

export function ProfilePage() {
  const { t } = useI18n()
  const { session } = useAuth()
  const { data: profile, isLoading, isError } = useCurrentUserProfile()

  if (isLoading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  const username = profile?.username ?? resolveFallbackUsername(session?.user?.name, session?.user?.email)
  const email = profile?.email ?? session?.user?.email ?? '—'

  return (
    <Box sx={{ maxWidth: 720, width: '100%', mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {t('profile.title')}
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          {isError && <Alert severity="warning">{t('profile.unavailable')}</Alert>}
          <TextField label={t('profile.usernameLabel')} value={username} fullWidth InputProps={{ readOnly: true }} />
          <TextField label={t('profile.emailLabel')} value={email} fullWidth InputProps={{ readOnly: true }} />
        </Stack>
      </Paper>
    </Box>
  )
}
