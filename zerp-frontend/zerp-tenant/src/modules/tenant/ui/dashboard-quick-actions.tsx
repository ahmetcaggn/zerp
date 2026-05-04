'use client'
import { Box, Button, Typography } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SendIcon from '@mui/icons-material/Send'
import InventoryIcon from '@mui/icons-material/Inventory'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'

export function DashboardQuickActions() {
  const { t, locale } = useI18n()
  const router = useRouter()

  const actions = [
    { label: t('dashboard.addEmployeeAction'), icon: <PersonAddIcon />, href: ROUTES.employees },
    {
      label: t('dashboard.sendNotificationAction'),
      icon: <SendIcon />,
      href: ROUTES.notifications,
    },
    { label: t('dashboard.newTicketAction'), icon: <ConfirmationNumberIcon />, href: ROUTES.tickets },
    { label: t('dashboard.viewStockAction'), icon: <InventoryIcon />, href: ROUTES.stock },
  ]

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        {t('dashboard.quickActionsTitle')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {actions.map((action) => (
          <Button
            key={action.href}
            variant="outlined"
            startIcon={action.icon}
            onClick={() => router.push(withLocale(locale, action.href) as Route)}
            sx={{ justifyContent: 'flex-start' }}
            fullWidth
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
