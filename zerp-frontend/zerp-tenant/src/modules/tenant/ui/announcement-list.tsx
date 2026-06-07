'use client'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useAnnouncements } from '../hooks/use-announcements'
import type { AnnouncementResponseDto } from '../types/announcement'

export function AnnouncementList() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { hasTenantPermission } = useCurrentUserPermissions()
  const canCreateAnnouncement = hasTenantPermission(PermissionActions.CREATE_ANNOUNCEMENT)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'createdAt', order: 'DESC' as const },
  }
  const { data, isLoading, error } = useAnnouncements(params)

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Typography variant="h5">{t('announcements.title')}</Typography>
        {canCreateAnnouncement && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push(withLocale(locale, `${ROUTES.announcements}/new`) as Route)}
            sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
          >
            {t('announcements.createButton')}
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('announcements.emptyState')}
        </Typography>
      ) : (
        <>
          {/* Desktop Table View */}
          <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('announcements.titleColumnHeader')}</TableCell>
                  <TableCell>{t('announcements.senderColumnHeader')}</TableCell>
                  <TableCell>{t('announcements.recipientsColumnHeader')}</TableCell>
                  <TableCell>{t('announcements.createdAtColumnHeader')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((announcement) => (
                  <TableRow
                    key={announcement.id}
                    hover
                    onClick={() => {
                      if (announcement.id) {
                        router.push(withLocale(locale, `${ROUTES.announcements}/${announcement.id}`) as Route)
                      }
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>{announcement.title}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: 520 }}
                      >
                        {announcement.content}
                      </Typography>
                    </TableCell>
                    <TableCell>{announcement.sender ?? '-'}</TableCell>
                    <TableCell>
                      {renderRecipients(announcement, t('common.all'), t)}
                    </TableCell>
                    <TableCell>
                      {formatDate(announcement.createdAt, locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
            {rows.map((announcement) => (
              <Card
                key={announcement.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    borderColor: 'primary.light',
                  },
                }}
              >
                <Box
                  onClick={() => {
                    if (announcement.id) {
                      router.push(withLocale(locale, `${ROUTES.announcements}/${announcement.id}`) as Route)
                    }
                  }}
                  sx={{ p: 2, cursor: 'pointer' }}
                >
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="text.primary"
                        sx={{
                          lineHeight: 1.3,
                          mb: 0.5,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {announcement.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {announcement.content}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        pt: 1.5,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {t('announcements.senderColumnHeader')}:{' '}
                          <Typography component="span" variant="caption" color="text.primary" fontWeight={600}>
                            {announcement.sender ?? '-'}
                          </Typography>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {t('announcements.recipientsColumnHeader')}:
                          </Typography>
                          {renderRecipients(announcement, t('common.all'), t)}
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', alignSelf: 'flex-end' }}>
                        {formatDate(announcement.createdAt, locale)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      )}

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value))
          setPage(0)
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Box>
  )
}

function renderRecipients(
  announcement: AnnouncementResponseDto,
  allLabel: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  const count = announcement.recipientCount ?? announcement.recipients?.length

  if (announcement.recipientMode === 'all') {
    const label = typeof count === 'number'
      ? `${allLabel} (${t('announcements.recipientCountLabel', { count })})`
      : allLabel

    return (
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
        <Chip size="small" label={label} />
      </Box>
    )
  }

  if (typeof count !== 'number' || count === 0) {
    return <Typography color="text.secondary">-</Typography>
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', maxWidth: 420 }}>
      <Chip size="small" label={t('announcements.recipientCountLabel', { count })} />
    </Box>
  )
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) return '-'
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
