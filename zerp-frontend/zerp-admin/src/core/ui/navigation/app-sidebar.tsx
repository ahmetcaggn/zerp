'use client'

import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactElement } from 'react'
import React, { useEffect, useMemo, useState } from 'react'

import { appConfig } from '@/core/config/app-config'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import {
  type PermissionAction,
  PermissionActions,
  useCurrentUserPermissions,
} from '@/core/permissions/use-permissions'

const DRAWER_WIDTH = 240
const COLLAPSED_DRAWER_WIDTH = 64

type SidebarLabelKey =
  | 'nav.dashboard'
  | 'nav.tenants'
  | 'nav.teamManagement'
  | 'nav.ticketManagement'
  | 'nav.assignedTickets'

type SidebarSectionLabelKey = 'nav.management' | 'nav.crm'

interface SidebarAction {
  id: string
  labelKey: SidebarLabelKey
  icon: ReactElement
  href: string
  disabled?: boolean
  disabledReason?: string
}

interface SidebarSection {
  id: string
  labelKey: SidebarSectionLabelKey
  actions: SidebarAction[]
}

const TEAM_PERMISSION_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.ADMIN,
  PermissionActions.READ_TEAM,
  PermissionActions.CREATE_TEAM,
  PermissionActions.UPDATE_TEAM,
  PermissionActions.DELETE_TEAM,
  PermissionActions.READ_TEAM_MEMBER,
  PermissionActions.CREATE_TEAM_MEMBER,
  PermissionActions.UPDATE_TEAM_MEMBER,
  PermissionActions.DELETE_TEAM_MEMBER,
]

const TENANT_PERMISSION_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_TENANT,
  PermissionActions.UPDATE_TENANT,
  PermissionActions.ADMIN,
]

const TICKET_MANAGEMENT_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.ADMIN,
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
  const { hasAnyPermission, isLoadingPermissions } = useCurrentUserPermissions()

  const canViewTenants = hasAnyPermission(TENANT_PERMISSION_ACTIONS)
  const canViewTeamManagement = hasAnyPermission(TEAM_PERMISSION_ACTIONS)
  const canViewTicketManagement = hasAnyPermission(TICKET_MANAGEMENT_ACTIONS)
  const canViewAssignedTickets = hasAnyPermission([
    PermissionActions.READ_TICKET,
    PermissionActions.ADMIN,
  ])
  const unauthorizedReason = t('common.unauthorized')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsExpanded(!isMobile)
  }, [isMobile])

  const handleToggle = () => setIsExpanded((prev) => !prev)

  const sidebarSections = useMemo<SidebarSection[]>(() => {
    const sections: SidebarSection[] = [
      {
        id: 'management',
        labelKey: 'nav.management',
        actions: [
          {
            id: 'tenants',
            labelKey: 'nav.tenants',
            icon: <ApartmentRoundedIcon />,
            href: ROUTES.tenants,
            disabled: isLoadingPermissions || !canViewTenants,
            disabledReason: unauthorizedReason,
          },
        ],
      },
      {
        id: 'crm',
        labelKey: 'nav.crm',
        actions: [
          {
            id: 'teams',
            labelKey: 'nav.teamManagement',
            icon: <GroupsRoundedIcon />,
            href: ROUTES.teams,
            disabled: isLoadingPermissions || !canViewTeamManagement,
            disabledReason: unauthorizedReason,
          },
          {
            id: 'teamTickets',
            labelKey: 'nav.ticketManagement',
            icon: <SupportAgentRoundedIcon />,
            href: ROUTES.teamTickets,
            disabled: isLoadingPermissions || !canViewTicketManagement,
            disabledReason: unauthorizedReason,
          },
          {
            id: 'assignedTickets',
            labelKey: 'nav.assignedTickets',
            icon: <AssignmentTurnedInRoundedIcon />,
            href: ROUTES.assignedTickets,
            disabled: isLoadingPermissions || !canViewAssignedTickets,
            disabledReason: unauthorizedReason,
          },
        ],
      },
    ]

    return sections
  }, [
    canViewTenants,
    canViewTeamManagement,
    canViewTicketManagement,
    canViewAssignedTickets,
    isLoadingPermissions,
    unauthorizedReason,
  ])

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
    const isSelected = pathname === hrefWithLocale || pathname.startsWith(`${hrefWithLocale}/`)
    const isDisabled = Boolean(action.disabled)
    const tooltipTitle = isDisabled ? action.disabledReason : t(action.labelKey)

    const listItemButton = (
      <ListItemButton
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) router.push(hrefWithLocale as Route)
        }}
        selected={!isDisabled && isSelected}
        sx={{
          minHeight: 48,
          justifyContent: 'flex-start',
          px: 0,
          pl: isExpanded && nested ? 1.5 : 0,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 64,
            display: 'flex',
            justifyContent: 'center',
            color: !isDisabled && isSelected ? 'primary.main' : 'inherit',
          }}
        >
          {action.icon}
        </ListItemIcon>
        <ListItemText
          primary={t(action.labelKey)}
          sx={{
            opacity: isExpanded ? 1 : 0,
            transition: theme.transitions.create('opacity', {
              duration: theme.transitions.duration.shorter,
            }),
            color: !isDisabled && isSelected ? 'primary.main' : 'inherit',
            '& .MuiTypography-root': {
              fontWeight: !isDisabled && isSelected ? 600 : 400,
              whiteSpace: 'nowrap',
            },
          }}
        />
      </ListItemButton>
    )

    return (
      <ListItem key={action.id} disablePadding sx={{ display: 'block' }}>
        {isExpanded && !isDisabled ? (
          listItemButton
        ) : (
          <Tooltip title={tooltipTitle} placement="right">
            <span style={{ display: 'block' }}>{listItemButton}</span>
          </Tooltip>
        )}
      </ListItem>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
        flexShrink: 0,
        alignSelf: 'stretch',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: isExpanded
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
      }}
      PaperProps={{
        sx: {
          position: 'relative',
          height: '100%',
          minHeight: '100%',
          overflowX: 'hidden',
          width: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          borderRight: '2px solid',
          borderRightColor: 'divider',
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
          px: 0,
          justifyContent: 'flex-start',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Box
          sx={{
            minWidth: 64,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={!isExpanded ? handleToggle : undefined}
        >
          <Box
            component="img"
            src="/zerp_icon_foreground.svg"
            alt="ZERP"
            sx={{ width: 30, height: 30, display: 'block' }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexGrow: 1,
            pr: 1.5,
            opacity: isExpanded ? 1 : 0,
            transition: theme.transitions.create('opacity', {
              duration: theme.transitions.duration.shorter,
            }),
            pointerEvents: isExpanded ? 'auto' : 'none',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography fontWeight={700} noWrap>
            {appConfig.app.name}
          </Typography>
          <IconButton onClick={handleToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      </Box>

      <List sx={{ pt: 1 }}>{baseActions.map((action) => renderAction(action))}</List>

      <Divider sx={{ my: 1 }} />

      {sidebarSections.map((section) => (
        <List key={section.id} sx={{ pt: 0 }}>
          {isExpanded && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ px: 3, py: 1.25, display: 'block' }}
            >
              {t(section.labelKey)}
            </Typography>
          )}
          {section.actions.map((action) => renderAction(action, true))}
        </List>
      ))}
    </Drawer>
  )
}
