'use client'
import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useEmployees } from '../hooks/use-employees'

function initials(firstName?: string, lastName?: string): string {
  return `${(firstName ?? '')[0] ?? ''}${(lastName ?? '')[0] ?? ''}`.toUpperCase()
}

export function DashboardRecentActivity() {
  const { t } = useI18n()
  const router = useRouter()

  const { data, isLoading } = useEmployees({
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'id', order: 'DESC' },
  })

  const employees = data?.data ?? []

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        {t('dashboard.recentEmployeesTitle')}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : employees.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          {t('employees.emptyState')}
        </Typography>
      ) : (
        <List disablePadding>
          {employees.map((emp) => (
            <ListItemButton
              key={emp.id}
              dense
              onClick={() => {
                if (emp.id !== undefined)
                  router.push(`${ROUTES.employees}/${emp.id}` as Route)
              }}
              sx={{ borderRadius: 1, px: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, fontSize: 13, mr: 1.5 }}>
                {initials(emp.firstName, emp.lastName)}
              </Avatar>
              <ListItemText
                primary={`${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim()}
                secondary={emp.email}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  )
}
