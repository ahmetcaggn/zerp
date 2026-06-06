'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useAnnouncement } from '../hooks/use-announcements'
import type { AnnouncementRecipientResponseDto, AnnouncementResponseDto } from '../types/announcement'

interface Props {
  id: string
}

export function AnnouncementDetail({ id }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { data: announcement, isLoading, error } = useAnnouncement(id)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    showToast(getUserFriendlyError(error), { severity: 'error' })
    return null
  }

  if (!announcement) return null

  return (
    <Box sx={{ maxWidth: 980 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        {t('common.back')}
      </Button>

      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.75, overflowWrap: 'anywhere' }}>
            {announcement.title}
          </Typography>
          <Typography color="text.secondary">
            {t('announcements.detailTitle')}
          </Typography>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('announcements.announcementInfoTitle')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <InfoItem label={t('announcements.senderColumnHeader')} value={announcement.sender ?? '-'} />
              <InfoItem
                label={t('announcements.recipientsColumnHeader')}
                value={formatRecipientSummary(announcement, t)}
              />
              <InfoItem
                label={t('announcements.createdAtColumnHeader')}
                value={formatDate(announcement.createdAt, locale)}
              />
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('announcements.contentSectionTitle')}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {announcement.content || '-'}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                mb: 2,
              }}
            >
              <Typography variant="h6">{t('announcements.recipientsSectionTitle')}</Typography>
              {typeof announcement.recipientCount === 'number' && (
                <Chip size="small" label={t('announcements.recipientCountLabel', { count: announcement.recipientCount })} />
              )}
            </Box>
            {renderRecipientList(announcement, t)}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ overflowWrap: 'anywhere' }}>{value}</Typography>
    </Box>
  )
}

function renderRecipientList(
  announcement: AnnouncementResponseDto,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  if (announcement.recipientMode === 'all') {
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={t('common.all')} />
      </Stack>
    )
  }

  const recipients = announcement.recipients ?? []
  if (recipients.length === 0) {
    return <Typography color="text.secondary">{t('announcements.noRecipientsLabel')}</Typography>
  }

  return (
    <Stack divider={<Divider />} spacing={0}>
      {recipients.map((recipient) => (
        <RecipientRow key={`${recipient.employeeId ?? recipient.email}`} recipient={recipient} />
      ))}
    </Stack>
  )
}

function RecipientRow({ recipient }: { recipient: AnnouncementRecipientResponseDto }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 0.5,
        py: 1.25,
      }}
    >
      <Typography fontWeight={600}>{recipient.displayName || '-'}</Typography>
      <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
        {recipient.email || '-'}
      </Typography>
    </Box>
  )
}

function formatRecipientSummary(
  announcement: AnnouncementResponseDto,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  const count = announcement.recipientCount ?? announcement.recipients?.length
  const countLabel = typeof count === 'number'
    ? t('announcements.recipientCountLabel', { count })
    : ''

  if (announcement.recipientMode === 'all') {
    return countLabel ? `${t('common.all')} (${countLabel})` : t('common.all')
  }

  return countLabel || '-'
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) return '-'
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
