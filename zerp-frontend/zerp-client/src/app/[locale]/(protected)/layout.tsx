import { Container } from '@mui/material'
import { notFound } from 'next/navigation'

import { appConfig } from '@/core/config/app-config'
import { isLocale } from '@/core/constants/locales'
import { requireRole } from '@/core/guards/require-role'
import { responsivePageSx } from '@/core/theme/layout'

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  await requireRole({
    locale,
    requiredRoles: appConfig.access.dashboardRoles,
    callbackPath: '/dashboard',
  })

  return <Container sx={responsivePageSx.protectedContainer}>{children}</Container>
}
