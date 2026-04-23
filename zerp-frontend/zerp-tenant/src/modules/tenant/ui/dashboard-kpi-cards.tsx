'use client'
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import PeopleIcon from '@mui/icons-material/People'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useEmployees } from '../hooks/use-employees'
import { useTeams } from '../hooks/use-teams'

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

  const { data: teamData, isLoading: isLoadingTeams } = useTeams({
    pagination: { page: 1, perPage: 200 },
    sort: { field: 'id', order: 'ASC' },
  })

  const totalEmployees = employeeData?.total ?? '—'
  const totalTeams = teamData?.total ?? '—'
  const activeTeams = isLoadingTeams
    ? undefined
    : (teamData?.data.filter((t) => t.isActive).length ?? '—')

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
        label={t('dashboard.totalTeams')}
        value={totalTeams}
        icon={<GroupsIcon fontSize="large" />}
        isLoading={isLoadingTeams}
      />
      <KpiCard
        label={t('dashboard.activeTeams')}
        value={activeTeams ?? '—'}
        icon={<GroupWorkIcon fontSize="large" />}
        color="success.main"
        isLoading={isLoadingTeams}
      />
    </Box>
  )
}
