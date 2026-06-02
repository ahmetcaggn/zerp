'use client'

import { CircularProgress, Container, Stack, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
// Auth/SSO disabled temporarily. Re-enable these imports with the signIn effect below.
// import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default function RegisterPage() {
  // Auth/SSO disabled temporarily.
  // const { status } = useSession()
  const params = useParams<{ locale: string }>()
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    const locale = params.locale || 'tr'
    router.replace(`/${locale}`)

    // Auth/SSO disabled temporarily.
    // if (status === 'authenticated') {
    //   window.location.href = `/${locale}`
    //   return
    // }
    //
    // if (status === 'unauthenticated') {
    //   void signIn('keycloak', { callbackUrl: `/${locale}` }, { kc_action: 'register' })
    // }
  }, [params.locale, router])

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
