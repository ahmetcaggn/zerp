'use client'

import { CircularProgress, Container, Stack, Typography } from '@mui/material'
import type { Route } from 'next'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
// Auth/SSO disabled temporarily. Re-enable these imports with the signIn effect below.
// import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default function LoginPage() {
  // Auth/SSO disabled temporarily.
  // const { status } = useSession()
  const params = useParams<{ locale: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    const locale = params.locale || 'tr'
    const requestedCallbackUrl = searchParams.get('callbackUrl')
    const callbackUrl = requestedCallbackUrl?.startsWith('/')
      ? requestedCallbackUrl
      : `/${locale}/dashboard`
    router.replace(callbackUrl as Route)

    // Auth/SSO disabled temporarily.
    // if (status === 'authenticated') {
    //   router.replace(`/${locale}/dashboard`)
    //   return
    // }
    //
    // if (status === 'unauthenticated') {
    //   const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/dashboard`
    //   void signIn('keycloak', { callbackUrl })
    // }
  }, [params.locale, router, searchParams])

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
