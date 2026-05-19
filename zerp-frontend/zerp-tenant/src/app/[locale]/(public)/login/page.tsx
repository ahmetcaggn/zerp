'use client'

import { CircularProgress, Container, Stack, Typography } from '@mui/material'
import type { Route } from 'next'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default function LoginPage() {
  const { status } = useSession()
  const params = useParams<{ locale: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    const locale = params.locale || 'tr'
    const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/dashboard`

    if (status === 'authenticated') {
      router.replace(callbackUrl as Route)
      return
    }

    if (status === 'unauthenticated') {
      void signIn('keycloak', { callbackUrl })
    }
  }, [params.locale, router, searchParams, status])

  return (
    <Container maxWidth="sm" sx={responsivePageSx.centeredContainer}>
      <Stack spacing={responsiveLayout.sectionGap} alignItems="center" textAlign="center">
        <Typography variant="h3">{t('auth.loginTitle')}</Typography>
        <Typography color="text.secondary">{t('auth.redirecting')}</Typography>
        <CircularProgress />
      </Stack>
    </Container>
  )
}
