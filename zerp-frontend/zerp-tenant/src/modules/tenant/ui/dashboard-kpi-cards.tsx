'use client'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import PeopleIcon from '@mui/icons-material/People'
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'

import { useEmployees } from '../hooks/use-employees'
import { useTickets } from '../hooks/use-tickets'

interface KpiCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color?: string
  isLoading?: boolean
}

function KpiCard({ label, value, icon, color, isLoading }: KpiCardProps) {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {label}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={60} height={40} />
            ) : (
              <Typography variant="h4" fontWeight={700} color={color}>
                {value}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color ?? 'text.secondary', opacity: 0.7 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export function DashboardKpiCards() {
  const { t } = useI18n()

  const { data: employeeData, isLoading: isLoadingEmployees } = useEmployees({
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
  })

  const { data: ticketData, isLoading: isLoadingTickets } = useTickets({
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
  })

  const { data: openTicketData, isLoading: isLoadingOpenTickets } = useTickets({
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
    filter: { 'status.eq': 'OPEN' },
  })

  const totalEmployees = employeeData?.total ?? '—'
  const totalTickets = ticketData?.total ?? '—'
  const openTickets = openTicketData?.total ?? '—'

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <KpiCard
        label={t('dashboard.totalEmployees')}
        value={totalEmployees}
        icon={<PeopleIcon fontSize="large" />}
        color="primary.main"
        isLoading={isLoadingEmployees}
      />
      <KpiCard
        label={t('dashboard.totalTickets')}
        value={totalTickets}
        icon={<ConfirmationNumberIcon fontSize="large" />}
        isLoading={isLoadingTickets}
      />
      <KpiCard
        label={t('dashboard.openTickets')}
        value={openTickets}
        icon={<MarkEmailUnreadIcon fontSize="large" />}
        color="success.main"
        isLoading={isLoadingOpenTickets}
      />
    </Box>
  )
}
