'use client'

import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { queryKeys } from '@/core/api/query-keys'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { responsiveLayout } from '@/core/theme/layout'

import { DockerInfrastructureDashboard } from './docker-infrastructure-dashboard'
import { INSTANCE_TO_SERVICE, ServicesMetricsDashboard } from './services-metrics-dashboard'

type MetricsTab = 'docker' | 'services'

type MetricCardConfig = {
  title: string
  caption: string
  slot: string
  size?: { xs: number; sm?: number; md?: number; lg?: number; xl?: number }
}

const SERVICE_METRIC_CARDS: readonly MetricCardConfig[] = [
  { title: 'Request Rate', caption: 'Requests per second', slot: 'services.rps' },
  { title: 'P95 Latency', caption: 'Slow request threshold', slot: 'services.latency' },
  { title: 'Error Rate', caption: 'Failed request ratio', slot: 'services.errors' },
  { title: 'Availability', caption: 'Service uptime signal', slot: 'services.availability' },
  { title: 'Database Connections', caption: 'Open connection usage', slot: 'services.database' },
  { title: 'Queue Depth', caption: 'Pending async workload', slot: 'services.queue' },
  { title: 'JVM Heap', caption: 'Runtime memory pressure', slot: 'services.heap' },
  { title: 'SLA Breaches', caption: 'Ticket/service objective misses', slot: 'services.sla' },
  {
    title: 'Top Slow Endpoints',
    caption: 'Endpoints requiring attention',
    slot: 'services.slowEndpoints',
    size: { xs: 12, md: 6 },
  },
  {
    title: 'Recent Incidents',
    caption: 'Operational event stream',
    slot: 'services.incidents',
    size: { xs: 12, md: 6 },
  },
]

function MetricPlaceholderCard({ card }: { card: MetricCardConfig }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={1.5} sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                {card.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {card.caption}
              </Typography>
            </Box>
            <Chip label="Ready" size="small" variant="outlined" />
          </Box>
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="h4" fontWeight={700}>
              -
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {card.slot}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

function PlaceholderMetricsGrid({ cards }: { cards: readonly MetricCardConfig[] }) {
  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.slot} size={card.size ?? { xs: 12, sm: 6, md: 3 }}>
          <MetricPlaceholderCard card={card} />
        </Grid>
      ))}
    </Grid>
  )
}

function DockerInfrastructureSkeleton() {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} variant="rectangular" height={92} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
      <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1 }} />
      </Box>
    </Stack>
  )
}

export function AdminDashboard() {
  const { t } = useI18n()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { hasGrant, isLoadingPermissions } = useCurrentUserPermissions()
  const [activeMetricsTab, setActiveMetricsTab] = useState<MetricsTab>('services')
  const [durationMs, setDurationMs] = useState<number>(15 * 60 * 1000)
  const [refetchInterval, setRefetchInterval] = useState<number | false>(15_000)
  const [selectedService, setSelectedService] = useState<string | 'ALL'>('ALL')

  const queryClient = useQueryClient()

  const canReadSystemMetrics =
    hasGrant(PermissionActions.READ_SYSTEM_METRICS, 'TENANT_ROOT') ||
    hasGrant(PermissionActions.ADMIN, 'TENANT_ROOT')

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.prometheusMetrics })
  }

  return (
    <Stack spacing={responsiveLayout.sectionGap}>
      <Typography variant="h2">{t('dashboard.title')}</Typography>
      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* Dashboard control and navigation bar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
              pb: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Tabs
              value={activeMetricsTab}
              onChange={(_, value: MetricsTab) => setActiveMetricsTab(value)}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ 
                minHeight: 40,
                width: { xs: '100%', md: 'auto' }
              }}
            >
              {/* <Tab value="docker" label={t('dashboard.dockerTab')} sx={{ fontWeight: 700, minHeight: 40 }} /> */}
              <Tab value="services" label={t('dashboard.servicesTab')} sx={{ fontWeight: 700, minHeight: 40 }} />
            </Tabs>

            {activeMetricsTab === 'docker' && canReadSystemMetrics && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'space-between', md: 'flex-end' },
                  width: { xs: '100%', md: 'auto' },
                }}
              >
                {/* Time range quick selector */}
                <Select
                  size="small"
                  value={durationMs}
                  onChange={(e) => setDurationMs(Number(e.target.value))}
                  sx={{
                    height: 30,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexGrow: { xs: 1, md: 0 },
                    minWidth: { xs: 'calc(50% - 20px)', md: 130 },
                    '.MuiSelect-select': { py: 0.5, pl: 1.2, pr: 3 },
                  }}
                >
                  <MenuItem value={5 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time5m')}</MenuItem>
                  <MenuItem value={15 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time15m')}</MenuItem>
                  <MenuItem value={30 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time30m')}</MenuItem>
                  <MenuItem value={60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time1h')}</MenuItem>
                  <MenuItem value={3 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time3h')}</MenuItem>
                  <MenuItem value={6 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time6h')}</MenuItem>
                  <MenuItem value={12 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time12h')}</MenuItem>
                  <MenuItem value={24 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time24h')}</MenuItem>
                  <MenuItem value={2 * 24 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time2d')}</MenuItem>
                  <MenuItem value={7 * 24 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time7d')}</MenuItem>
                </Select>

                {/* Auto Refresh Selector */}
                <Select
                  size="small"
                  value={refetchInterval === false ? 'off' : refetchInterval}
                  onChange={(e) => {
                    const val = e.target.value
                    setRefetchInterval(val === 'off' ? false : Number(val))
                  }}
                  sx={{
                    height: 30,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexGrow: { xs: 1, md: 0 },
                    minWidth: { xs: 'calc(50% - 20px)', md: 130 },
                    '.MuiSelect-select': { py: 0.5, pl: 1.2, pr: 3 },
                  }}
                >
                  <MenuItem value="off" sx={{ fontSize: '0.75rem' }}>{t('dashboard.refreshOff')}</MenuItem>
                  <MenuItem value={15_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh15s')}</MenuItem>
                  <MenuItem value={30_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh30s')}</MenuItem>
                  <MenuItem value={60_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh1m')}</MenuItem>
                  <MenuItem value={300_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh5m')}</MenuItem>
                </Select>

                {/* Manual Refresh Button */}
                <Tooltip title={t('dashboard.refreshTooltip')}>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 0.75,
                      flexShrink: 0,
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {activeMetricsTab === 'services' && canReadSystemMetrics && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'space-between', md: 'flex-end' },
                  width: { xs: '100%', md: 'auto' },
                }}
              >
                {/* Service Dropdown */}
                <Select
                  size="small"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value as string)}
                  sx={{
                    height: 30,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexGrow: { xs: 1, md: 0 },
                    width: { xs: '100%', md: 'auto' },
                    minWidth: { xs: '100%', md: 140 },
                    '.MuiSelect-select': { py: 0.5, pl: 1.2, pr: 3 },
                  }}
                >
                  <MenuItem value="ALL" sx={{ fontSize: '0.75rem' }}>{t('dashboard.allServices')}</MenuItem>
                  {Array.from(new Set(Object.values(INSTANCE_TO_SERVICE))).map((serviceName) => (
                    <MenuItem key={serviceName} value={serviceName} sx={{ fontSize: '0.75rem' }}>
                      {t('dashboard.serviceLabel', { serviceName })}
                    </MenuItem>
                  ))}
                </Select>

                {/* Time range quick selector */}
                <Select
                  size="small"
                  value={durationMs}
                  onChange={(e) => setDurationMs(Number(e.target.value))}
                  sx={{
                    height: 30,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexGrow: { xs: 1, md: 0 },
                    minWidth: { xs: 'calc(50% - 20px)', md: 130 },
                    '.MuiSelect-select': { py: 0.5, pl: 1.2, pr: 3 },
                  }}
                >
                  <MenuItem value={5 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time5m')}</MenuItem>
                  <MenuItem value={15 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time15m')}</MenuItem>
                  <MenuItem value={30 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time30m')}</MenuItem>
                  <MenuItem value={60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time1h')}</MenuItem>
                  <MenuItem value={3 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time3h')}</MenuItem>
                  <MenuItem value={6 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time6h')}</MenuItem>
                  <MenuItem value={12 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time12h')}</MenuItem>
                  <MenuItem value={24 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time24h')}</MenuItem>
                  <MenuItem value={2 * 24 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time2d')}</MenuItem>
                  <MenuItem value={7 * 24 * 60 * 60 * 1000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.time7d')}</MenuItem>
                </Select>

                {/* Auto Refresh Selector */}
                <Select
                  size="small"
                  value={refetchInterval === false ? 'off' : refetchInterval}
                  onChange={(e) => {
                    const val = e.target.value
                    setRefetchInterval(val === 'off' ? false : Number(val))
                  }}
                  sx={{
                    height: 30,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexGrow: { xs: 1, md: 0 },
                    minWidth: { xs: 'calc(50% - 20px)', md: 130 },
                    '.MuiSelect-select': { py: 0.5, pl: 1.2, pr: 3 },
                  }}
                >
                  <MenuItem value="off" sx={{ fontSize: '0.75rem' }}>{t('dashboard.refreshOff')}</MenuItem>
                  <MenuItem value={15_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh15s')}</MenuItem>
                  <MenuItem value={30_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh30s')}</MenuItem>
                  <MenuItem value={60_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh1m')}</MenuItem>
                  <MenuItem value={300_000} sx={{ fontSize: '0.75rem' }}>{t('dashboard.refresh5m')}</MenuItem>
                </Select>

                <Tooltip title={t('dashboard.refreshTooltip')}>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 0.75,
                      flexShrink: 0,
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {activeMetricsTab === 'docker' && isLoadingPermissions ? (
            <DockerInfrastructureSkeleton />
          ) : activeMetricsTab === 'docker' && canReadSystemMetrics ? (
            <DockerInfrastructureDashboard durationMs={durationMs} refetchInterval={refetchInterval} />
          ) : activeMetricsTab === 'docker' ? (
            <Alert severity="warning" variant="outlined">
              {t('dashboard.noPermissionSystem')}
            </Alert>
          ) : activeMetricsTab === 'services' && canReadSystemMetrics ? (
            <ServicesMetricsDashboard
              key={`services-metrics-${selectedService}`}
              durationMs={durationMs}
              refetchInterval={refetchInterval}
              selectedService={selectedService}
            />
          ) : activeMetricsTab === 'services' ? (
            <Alert severity="warning" variant="outlined">
              {t('dashboard.noPermissionServices')}
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  )
}
