'use client'
import { Box, Button, Typography } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import CampaignIcon from '@mui/icons-material/Campaign'
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
      label: t('dashboard.createAnnouncementAction'),
      icon: <CampaignIcon />,
      href: ROUTES.announcements,
    },
    { label: t('dashboard.newTicketAction'), icon: <ConfirmationNumberIcon />, href: ROUTES.tickets },
    { label: t('dashboard.viewStockAction'), icon: <InventoryIcon />, href: ROUTES.stock },
    { label: t('dashboard.openCashierAction'), icon: <PointOfSaleIcon />, href: ROUTES.sale },
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
