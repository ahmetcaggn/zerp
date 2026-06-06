'use client'

import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import {
  type PermissionAction,
  PermissionActions,
  useCurrentUserPermissions,
} from '@/core/permissions/use-permissions'
import { responsiveLayout } from '@/core/theme/layout'

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

export function AdminDashboard() {
  const { t } = useI18n()
  const router = useRouter()
  const { hasAnyPermission, isLoadingPermissions } = useCurrentUserPermissions()
  const canOpenTeamManagement = hasAnyPermission(TEAM_PERMISSION_ACTIONS)
  const canOpenTicketManagement = hasAnyPermission(TICKET_MANAGEMENT_ACTIONS)
  const canOpenAssignedTickets = hasAnyPermission([
    PermissionActions.READ_TICKET,
    PermissionActions.ADMIN,
  ])

  return (
    <Stack spacing={responsiveLayout.sectionGap}>
      <Typography variant="h2">{t('dashboard.title')}</Typography>
      <Typography color="text.secondary">{t('dashboard.subtitle')}</Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        {isLoadingPermissions && <CircularProgress size={20} />}
        <Button
          variant="outlined"
          startIcon={<GroupsRoundedIcon />}
          onClick={() => router.push(ROUTES.teams)}
          disabled={isLoadingPermissions || !canOpenTeamManagement}
        >
          {t('nav.teamManagement')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<SupportAgentRoundedIcon />}
          onClick={() => router.push(ROUTES.teamTickets)}
          disabled={isLoadingPermissions || !canOpenTicketManagement}
        >
          {t('nav.ticketManagement')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<AssignmentTurnedInRoundedIcon />}
          onClick={() => router.push(ROUTES.assignedTickets)}
          disabled={isLoadingPermissions || !canOpenAssignedTickets}
        >
          {t('nav.assignedTickets')}
        </Button>
      </Box>
    </Stack>
  )
}
