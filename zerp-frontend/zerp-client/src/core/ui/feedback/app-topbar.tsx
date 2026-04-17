'use client'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { appConfig } from '@/core/config/app-config'
import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'
import { LocaleSwitcher } from '@/core/ui/feedback/locale-switcher'
import { ThemeToggle } from '@/core/ui/feedback/theme-toggle'

type TopbarLabelKey = 'nav.dashboard' | 'nav.login' | 'nav.logout'
type TopbarVisibility = 'always' | 'authenticated' | 'unauthenticated'

interface TopbarAction {
  id: 'dashboard' | 'login' | 'logout'
  labelKey: TopbarLabelKey
  icon: ReactElement
  visibility: TopbarVisibility
  href?: '/dashboard' | '/login'
}

const TOPBAR_ACTIONS: readonly TopbarAction[] = [
  {
    id: 'dashboard',
    labelKey: 'nav.dashboard',
    icon: <DashboardRoundedIcon fontSize="small" />,
    visibility: 'always',
    href: '/dashboard',
  },
  {
    id: 'login',
    labelKey: 'nav.login',
    icon: <LoginRoundedIcon fontSize="small" />,
    visibility: 'unauthenticated',
    href: '/login',
  },
  {
    id: 'logout',
    labelKey: 'nav.logout',
    icon: <LogoutRoundedIcon fontSize="small" />,
    visibility: 'authenticated',
  },
] as const

export function AppTopbar({ locale }: { locale: 'tr' | 'en' }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useI18n()
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const isAuthenticated = status === 'authenticated'

  const visibleActions = useMemo(
    () =>
      TOPBAR_ACTIONS.filter((action) => {
        if (action.visibility === 'authenticated') {
          return isAuthenticated
        }

        if (action.visibility === 'unauthenticated') {
          return !isAuthenticated
        }

        return true
      }),
    [isAuthenticated],
  )

  const handleActionClick = (action: TopbarAction) => {
    setDrawerOpen(false)

    if (action.id === 'logout') {
      void signOut({ callbackUrl: '/api/sso-logout' })
      return
    }

    if (action.href) {
      router.push(`/${locale}${action.href}`)
    }
  }

  return (
    <>
      <AppBar
        color="transparent"
        position="static"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 2 },
            minHeight: responsiveLayout.toolbarMinHeight,
            px: responsiveLayout.toolbarPaddingX,
          }}
        >
          <Stack alignItems="center" direction="row" gap={1.25} minWidth={0}>
            <StorefrontRoundedIcon color="primary" />
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
              <LocaleSwitcher locale={locale} />
              <ThemeToggle />
              <IconButton
                aria-label="Open menu"
                color="inherit"
                size="small"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          ) : (
            <Stack alignItems="center" direction="row" gap={1}>
              {visibleActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  size="small"
                  variant={
                    action.id === 'dashboard' && pathname.includes('/dashboard') ? 'contained' : 'text'
                  }
                >
                  {t(action.labelKey)}
                </Button>
              ))}
              <LocaleSwitcher locale={locale} />
              <ThemeToggle />
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={isMobile && isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            p: 1,
            width: responsiveLayout.drawerWidth,
            maxWidth: '90vw',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={1.5} py={1}>
          <Typography fontWeight={700}>Menu</Typography>
          <IconButton aria-label="Close menu" size="small" onClick={() => setDrawerOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Divider />

        <List sx={{ py: 1 }}>
          {visibleActions.map((action) => (
            <ListItemButton
              key={action.id}
              onClick={() => handleActionClick(action)}
              selected={action.id === 'dashboard' && pathname.includes('/dashboard')}
            >
              <ListItemIcon sx={{ minWidth: 34 }}>{action.icon}</ListItemIcon>
              <ListItemText primary={t(action.labelKey)} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  )
}
