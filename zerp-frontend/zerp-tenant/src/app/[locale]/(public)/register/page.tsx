'use client'

import { CircularProgress, Container, Stack, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default function RegisterPage() {
  const { status } = useSession()
  const params = useParams<{ locale: string }>()
  const { t } = useI18n()

  useEffect(() => {
    const locale = params.locale || 'tr'

    if (status === 'authenticated') {
      window.location.href = `/${locale}/dashboard`
      return
    }

    if (status === 'unauthenticated') {
      void signIn('keycloak', { callbackUrl: `/${locale}/dashboard` }, { kc_action: 'register', prompt: 'login' })
    }
  }, [params.locale, status])

  return (
    <Container maxWidth="sm" sx={responsivePageSx.centeredContainer}>
      <Stack spacing={responsiveLayout.sectionGap} alignItems="center" textAlign="center">
        <Typography variant="h3">{t('auth.registerTitle')}</Typography>
        <Typography color="text.secondary">{t('auth.redirecting')}</Typography>
        <CircularProgress />
      </Stack>
    </Container>
  )
}
