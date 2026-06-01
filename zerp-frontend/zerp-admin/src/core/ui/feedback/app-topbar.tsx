'use client'

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
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
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { useCurrentUserProfile } from '@/core/auth/client/use-current-user-profile'
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useI18n()
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)
  const isAuthenticated = status === 'authenticated'
  const { data: currentUser } = useCurrentUserProfile()

  const resolvedUsername = useMemo(() => {
    const fromApi = currentUser?.username?.trim()
    if (fromApi) {
      return fromApi
    }

    const fromName = session?.user?.name?.trim()
    if (fromName) {
      return fromName
    }

    const fromEmail = session?.user?.email?.trim()
    if (fromEmail) {
      return fromEmail
    }

    return '—'
  }, [currentUser?.username, session?.user?.email, session?.user?.name])

  const visibleActions = useMemo(
    () =>
      TOPBAR_ACTIONS.filter((action) => {
        if (action.id === 'logout' && !isMobile) {
          return false
        }

        if (action.visibility === 'authenticated') {
          return isAuthenticated
        }

        if (action.visibility === 'unauthenticated') {
          return !isAuthenticated
        }

        return true
      }),
    [isAuthenticated, isMobile],
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

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    handleMenuClose()
    router.push(`/${locale}/profile` as Parameters<typeof router.push>[0])
  }

  const handleLogoutClick = () => {
    handleMenuClose()
    void signOut({ callbackUrl: '/api/sso-logout' })
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
              {isAuthenticated && (
                <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                  {resolvedUsername}
                </Typography>
              )}
              {isAuthenticated && (
                <IconButton
                  aria-label={t('nav.profile')}
                  color="inherit"
                  size="medium"
                  onClick={handleProfileMenuClick}
                >
                  <AccountCircleRoundedIcon fontSize="medium" />
                </IconButton>
              )}
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
              {isAuthenticated && (
                <Stack alignItems="center" direction="row" gap={0.5} sx={{ maxWidth: 260 }}>
                  <Typography variant="body2" noWrap>
                    {resolvedUsername}
                  </Typography>
                  <IconButton
                    aria-label={t('nav.profile')}
                    color="inherit"
                    size="medium"
                    onClick={handleProfileMenuClick}
                  >
                    <AccountCircleRoundedIcon fontSize="medium" />
                  </IconButton>
                </Stack>
              )}
              <LocaleSwitcher locale={locale} />
              <ThemeToggle />
            </Stack>
          )}

          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountCircleRoundedIcon fontSize="small" />
              </ListItemIcon>
              {t('nav.profile')}
            </MenuItem>
            <MenuItem
              onClick={handleLogoutClick}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <ListItemIcon>
                <LogoutRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              {t('nav.logout')}
            </MenuItem>
          </Menu>
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
          {isAuthenticated && (
            <ListItemButton onClick={handleProfileClick} selected={false}>
              <ListItemIcon sx={{ minWidth: 34 }}>
                <AccountCircleRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('nav.profile')} secondary={resolvedUsername} />
            </ListItemButton>
          )}
          {isAuthenticated && visibleActions.length > 0 && <Divider />}
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
