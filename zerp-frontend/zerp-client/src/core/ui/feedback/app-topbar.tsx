'use client'

// import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
// import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
// import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { AppBar, Box, Container, Stack, Toolbar, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRouter } from 'next/navigation'

// Auth/SSO disabled temporarily. Re-enable when login/logout comes back.
// import { signOut, useSession } from 'next-auth/react'
// Profile disabled with Auth/SSO temporarily.
// import { useCurrentUserProfile } from '@/core/auth/client/use-current-user-profile'
import { appConfig } from '@/core/config/app-config'
import { responsiveLayout } from '@/core/theme/layout'
import { LocaleSwitcher } from '@/core/ui/feedback/locale-switcher'
import { ThemeToggle } from '@/core/ui/feedback/theme-toggle'

export function AppTopbar({ locale }: { locale: 'tr' | 'en' }) {
  // Auth/SSO disabled temporarily.
  // const { data: session, status } = useSession()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isAuthenticated = false
  // const isAuthenticated = status === 'authenticated'
  // const { data: currentUser } = useCurrentUserProfile()

  // Profile disabled with Auth/SSO temporarily.
  // const resolvedUsername = useMemo(() => {
  //   const fromApi = currentUser?.username?.trim()
  //   if (fromApi) {
  //     return fromApi
  //   }
  //
  //   const fromName = session?.user?.name?.trim()
  //   if (fromName) {
  //     return fromName
  //   }
  //
  //   const fromEmail = session?.user?.email?.trim()
  //   if (fromEmail) {
  //     return fromEmail
  //   }
  //
  //   return '—'
  // }, [currentUser?.username, session?.user?.email, session?.user?.name])

  // Profile disabled with Auth/SSO temporarily.
  // const handleProfileClick = () => {
  //   router.push(`/${locale}/profile` as Parameters<typeof router.push>[0])
  // }

  return (
    <>
      <AppBar
        color="transparent"
        position="static"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX }}>
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 2 },
              minHeight: responsiveLayout.toolbarMinHeight,
            }}
          >
            <Stack alignItems="center" direction="row" gap={1.25} minWidth={0}>
              <Box
                component="img"
                src="/zerp_icon_foreground.svg"
                alt="ZERP"
                sx={{ width: 30, height: 30, display: 'block', flexShrink: 0 }}
              />
              <Typography
                role="link"
                tabIndex={0}
                fontWeight={700}
                noWrap
                onClick={() => router.push(`/${locale}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    router.push(`/${locale}`)
                  }
                }}
                sx={{ color: 'inherit', cursor: 'pointer' }}
              >
                {appConfig.app.name}
              </Typography>
            </Stack>

            {isMobile ? (
              <Stack alignItems="center" direction="row" gap={0.5}>
                {/* Profile disabled with Auth/SSO temporarily.
                {isAuthenticated && (
                  <Typography variant="body2" noWrap sx={{ maxWidth: 110 }}>
                    {resolvedUsername}
                  </Typography>
                )}
                {isAuthenticated && (
                  <IconButton
                    aria-label={t('nav.profile')}
                    color="inherit"
                    size="small"
                    onClick={handleProfileClick}
                  >
                    <AccountCircleRoundedIcon fontSize="small" />
                  </IconButton>
                )} */}
                <LocaleSwitcher locale={locale} />
                <ThemeToggle />
              </Stack>
            ) : (
              <Stack alignItems="center" direction="row" gap={1}>
                {/* Profile disabled with Auth/SSO temporarily.
                {isAuthenticated && (
                  <Stack alignItems="center" direction="row" gap={0.5} sx={{ maxWidth: 240 }}>
                    <Typography variant="body2" noWrap>
                      {resolvedUsername}
                    </Typography>
                    <IconButton
                      aria-label={t('nav.profile')}
                      color="inherit"
                      size="small"
                      onClick={handleProfileClick}
                    >
                      <AccountCircleRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                )} */}
                <LocaleSwitcher locale={locale} />
                <ThemeToggle />
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}
