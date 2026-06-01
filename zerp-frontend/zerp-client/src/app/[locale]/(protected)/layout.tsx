import { Container } from '@mui/material'
import { notFound } from 'next/navigation'

// Auth/role protection disabled temporarily. Re-enable these imports with requireRole below.
// import { appConfig } from '@/core/config/app-config'
import { isLocale } from '@/core/constants/locales'
// import { requireRole } from '@/core/guards/require-role'
import { responsivePageSx } from '@/core/theme/layout'
import type { Locale } from '@/core/types/common'
import { AppTopbar } from '@/core/ui/feedback/app-topbar'

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

  // Auth/role protection disabled temporarily.
  // await requireRole({
  //   locale,
  //   requiredRoles: appConfig.access.dashboardRoles,
  //   callbackPath: '/dashboard',
  // })

  return (
    <>
      <AppTopbar locale={locale as Locale} />
      <Container sx={responsivePageSx.protectedContainer}>{children}</Container>
    </>
  )
}
