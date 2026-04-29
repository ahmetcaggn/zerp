'use client'

import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

export function AdminDashboard() {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <Stack spacing={responsiveLayout.sectionGap}>
      <Typography variant="h2">{t('dashboard.title')}</Typography>
      <Typography color="text.secondary">{t('dashboard.subtitle')}</Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<GroupsRoundedIcon />}
          onClick={() => router.push(ROUTES.teams)}
        >
          {t('nav.teams')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<SupportAgentRoundedIcon />}
          onClick={() => router.push(ROUTES.teamTickets)}
        >
          {t('nav.teamTickets')}
        </Button>
      </Box>
    </Stack>
  )
}
