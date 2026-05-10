'use client'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
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
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'
import { LocaleSwitcher } from '@/core/ui/feedback/locale-switcher'
import { ThemeToggle } from '@/core/ui/feedback/theme-toggle'

type TopbarLabelKey = 'nav.login' | 'nav.logout'
type TopbarVisibility = 'always' | 'authenticated' | 'unauthenticated'

interface TopbarAction {
  id: 'login' | 'logout'
  labelKey: TopbarLabelKey
  icon: ReactElement
  visibility: TopbarVisibility
  href?: '/login'
}

const TOPBAR_ACTIONS: readonly TopbarAction[] = [
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
            justifyContent: 'flex-end',
            gap: { xs: 1, sm: 2 },
            minHeight: responsiveLayout.toolbarMinHeight,
            px: responsiveLayout.toolbarPaddingX,
          }}
        >
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
                  variant="text"
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
          <Typography fontWeight={700}>{t('nav.menu')}</Typography>
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
              selected={false}
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
