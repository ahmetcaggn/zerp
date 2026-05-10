'use client'

import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { appConfig } from '@/core/config/app-config'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { type PermissionAction, PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'

const DRAWER_WIDTH = 252
const COLLAPSED_DRAWER_WIDTH = 72

type SidebarLabelKey =
  | 'nav.dashboard'
  | 'nav.teamManagement'
  | 'nav.ticketManagement'
  | 'nav.assignedTickets'

interface SidebarAction {
  id: string
  labelKey: SidebarLabelKey
  icon: ReactElement
  href: string
}

const TEAM_PERMISSION_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_TEAM,
  PermissionActions.CREATE_TEAM,
  PermissionActions.UPDATE_TEAM,
  PermissionActions.DELETE_TEAM,
  PermissionActions.READ_TEAM_MEMBER,
  PermissionActions.CREATE_TEAM_MEMBER,
  PermissionActions.UPDATE_TEAM_MEMBER,
  PermissionActions.DELETE_TEAM_MEMBER,
]

const TICKET_MANAGEMENT_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_TICKET,
  PermissionActions.READ_TICKET_ASSIGNMENT,
  PermissionActions.READ_TICKET_COMMENT,
  PermissionActions.READ_TICKET_HISTORY,
  PermissionActions.READ_TICKET_SLA_TRACKING,
  PermissionActions.READ_TICKET_ATTACHMENT,
  PermissionActions.READ_TICKET_WATCHER,
  PermissionActions.UPDATE_TICKET,
  PermissionActions.CREATE_TICKET_ASSIGNMENT,
  PermissionActions.UPDATE_TICKET_ASSIGNMENT,
  PermissionActions.DELETE_TICKET_ASSIGNMENT,
  PermissionActions.CREATE_TICKET_COMMENT,
]

export function AppSidebar({ locale }: { locale: 'tr' | 'en' }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isExpanded, setIsExpanded] = useState(!isMobile)
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()
  const { hasPermission, hasAnyPermission, isLoadingPermissions } = useCurrentUserPermissions()

  const canViewTeamManagement = hasAnyPermission(TEAM_PERMISSION_ACTIONS)
  const canViewTicketManagement = hasAnyPermission(TICKET_MANAGEMENT_ACTIONS)
  const canViewAssignedTickets = hasPermission(PermissionActions.READ_TICKET)

  const crmActions = useMemo<SidebarAction[]>(() => {
    const actions: SidebarAction[] = []
    if (canViewTeamManagement) {
      actions.push({
        id: 'teams',
        labelKey: 'nav.teamManagement',
        icon: <GroupsRoundedIcon />,
        href: ROUTES.teams,
      })
    }
    if (canViewTicketManagement) {
      actions.push({
        id: 'teamTickets',
        labelKey: 'nav.ticketManagement',
        icon: <SupportAgentRoundedIcon />,
        href: ROUTES.teamTickets,
      })
    }
    if (canViewAssignedTickets) {
      actions.push({
        id: 'assignedTickets',
        labelKey: 'nav.assignedTickets',
        icon: <AssignmentTurnedInRoundedIcon />,
        href: ROUTES.assignedTickets,
      })
    }
    return actions
  }, [canViewAssignedTickets, canViewTeamManagement, canViewTicketManagement])

  const baseActions: SidebarAction[] = [
    {
      id: 'dashboard',
      labelKey: 'nav.dashboard',
      icon: <DashboardRoundedIcon />,
      href: ROUTES.dashboard,
    },
  ]

  const renderAction = (action: SidebarAction, nested = false) => {
    const hrefWithLocale = `/${locale}${action.href}`
    const isSelected = pathname.startsWith(hrefWithLocale)

    const button = (
      <ListItemButton
        onClick={() => router.push(hrefWithLocale as Route)}
        selected={isSelected}
        sx={{
          minHeight: 44,
          justifyContent: isExpanded ? 'initial' : 'center',
          px: isExpanded ? 2.5 : 1.5,
          pl: isExpanded && nested ? 3.75 : undefined,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isExpanded ? 2 : 0,
            justifyContent: 'center',
            color: isSelected ? 'primary.main' : 'inherit',
          }}
        >
          {action.icon}
        </ListItemIcon>
        <ListItemText
          primary={t(action.labelKey)}
          sx={{
            opacity: isExpanded ? 1 : 0,
            color: isSelected ? 'primary.main' : 'inherit',
            '& .MuiTypography-root': { fontWeight: isSelected ? 600 : 400 },
          }}
        />
      </ListItemButton>
    )

    return (
      <ListItem key={action.id} disablePadding sx={{ display: 'block' }}>
        {isExpanded ? button : <Tooltip title={t(action.labelKey)} placement="right">{button}</Tooltip>}
      </ListItem>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      }}
      PaperProps={{
        sx: {
          width: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isExpanded
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 64,
          px: isExpanded ? 2 : 0,
          justifyContent: isExpanded ? 'space-between' : 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {isExpanded ? (
          <>
            <Stack direction="row" alignItems="center" gap={1.25}>
              <StorefrontRoundedIcon color="primary" />
              <Typography fontWeight={700} noWrap>
                {appConfig.app.name}
              </Typography>
            </Stack>
            <IconButton onClick={() => setIsExpanded(false)} size="small">
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <Tooltip title={appConfig.app.name} placement="right">
            <IconButton onClick={() => setIsExpanded(true)} size="small">
              <StorefrontRoundedIcon color="primary" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <List sx={{ pt: 1 }}>
        {baseActions.map((action) => renderAction(action))}
      </List>

      <Divider sx={{ my: 1 }} />

      {isLoadingPermissions ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={20} />
        </Box>
      ) : crmActions.length > 0 ? (
        <List sx={{ pt: 0 }}>
          {isExpanded && (
            <Typography variant="caption" color="text.secondary" sx={{ px: 3, py: 1.25, display: 'block' }}>
              {t('nav.crm')}
            </Typography>
          )}
          {crmActions.map((action) => renderAction(action, true))}
        </List>
      ) : null}
    </Drawer>
  )
}
