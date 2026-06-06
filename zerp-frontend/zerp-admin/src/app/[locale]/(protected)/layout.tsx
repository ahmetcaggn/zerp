import { Box, Container } from '@mui/material'
import { notFound } from 'next/navigation'

import { appConfig } from '@/core/config/app-config'
import { isLocale } from '@/core/constants/locales'
import { requireRole } from '@/core/guards/require-role'
import { PermissionRouteGuard } from '@/core/permissions/permission-route-guard'
import { responsivePageSx } from '@/core/theme/layout'
import type { Locale } from '@/core/types/common'
import { AppTopbar } from '@/core/ui/feedback/app-topbar'
import { AppSidebar } from '@/core/ui/navigation/app-sidebar'

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar locale={locale as Locale} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AppTopbar locale={locale as Locale} />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Container sx={responsivePageSx.protectedContainer}>
            <PermissionRouteGuard locale={locale as Locale}>{children}</PermissionRouteGuard>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}
