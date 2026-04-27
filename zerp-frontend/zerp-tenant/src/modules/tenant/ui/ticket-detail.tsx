'use client'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendIcon from '@mui/icons-material/Send'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useAddComment, useCloseTicket, useTicket } from '../hooks/use-tickets'
import type { TicketPriorityString, TicketStatusString } from '../types/ticket'

const STATUS_COLOR: Record<
  TicketStatusString,
  'info' | 'warning' | 'secondary' | 'success' | 'default' | 'error'
> = {
  OPEN: 'info',
  IN_PROGRESS: 'warning',
  WAITING_CUSTOMER: 'secondary',
  RESOLVED: 'success',
  CLOSED: 'default',
  CANCELLED: 'error',
}

const PRIORITY_COLOR: Record<TicketPriorityString, 'error' | 'warning' | 'info' | 'default'> = {
  CRITICAL: 'error',
  HIGH: 'warning',
  MEDIUM: 'info',
  LOW: 'default',
}

const CLOSEABLE_STATUSES: TicketStatusString[] = ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER']

interface Props {
  id: string
}

export function TicketDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [commentText, setCommentText] = useState('')

  const { data: ticket, isLoading, error } = useTicket(id)
  const { mutate: addComment, isPending: isCommenting } = useAddComment()
  const { mutate: closeTicket, isPending: isClosing } = useCloseTicket()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    showToast(getUserFriendlyError(error), { severity: 'error' })
    return null
  }

  if (!ticket) return null

  const status = ticket.status as TicketStatusString | undefined
  const priority = ticket.priority as TicketPriorityString | undefined
  const isCloseable = status !== undefined && CLOSEABLE_STATUSES.includes(status)
  const externalComments = (ticket.comments ?? []).filter((c) => !c.isInternal)

  function handleAddComment() {
    if (!commentText.trim()) return
    addComment(
      { id, body: { content: commentText.trim(), isInternal: false } },
      {
        onSuccess: () => {
          setCommentText('')
          showToast('Yorum eklendi.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleClose() {
    closeTicket(id, {
      onSuccess: () => showToast('Talep kapatıldı.', { severity: 'success' }),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      {/* Üst bar */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(ROUTES.tickets)}>
          {t('tickets.title')}
        </Button>
        {isCloseable && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CheckCircleIcon />}
            onClick={handleClose}
            disabled={isClosing}
          >
            {t('tickets.closeTicket')}
          </Button>
        )}
      </Box>

      {/* Başlık ve chip'ler */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        #{ticket.id} — {ticket.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {status && (
          <Chip label={status} color={STATUS_COLOR[status] ?? 'default'} size="small" />
        )}
        {priority && (
          <Chip
            label={priority}
            color={PRIORITY_COLOR[priority] ?? 'default'}
            size="small"
            variant="outlined"
          />
        )}
        {ticket.type && <Chip label={ticket.type} size="small" variant="outlined" />}
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
          {ticket.createdAt}
        </Typography>
      </Box>

      {/* Açıklama */}
      {ticket.description && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">{ticket.description}</Typography>
        </Paper>
      )}

      {/* Atama bilgisi */}
      {ticket.currentAssignment && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Atama
          </Typography>
          <Typography variant="body2">
            Takım ID: {ticket.currentAssignment.teamId ?? '—'}
            {ticket.currentAssignment.agentPartyId &&
              ` · Ajan: ${ticket.currentAssignment.agentPartyId}`}
          </Typography>
        </Paper>
      )}

      {/* SLA */}
      {ticket.slaTracking && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            SLA Takibi
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                İlk Yanıt Hedefi
              </Typography>
              <Typography variant="body2">
                {ticket.slaTracking.firstResponseDueAt ?? '—'}
              </Typography>
              {ticket.slaTracking.isFirstResponseBreached && (
                <Alert severity="error" sx={{ py: 0, px: 1, mt: 0.5 }}>
                  İhlal
                </Alert>
              )}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Çözüm Hedefi
              </Typography>
              <Typography variant="body2">
                {ticket.slaTracking.resolutionDueAt ?? '—'}
              </Typography>
              {ticket.slaTracking.isResolutionBreached && (
                <Alert severity="error" sx={{ py: 0, px: 1, mt: 0.5 }}>
                  İhlal
                </Alert>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Yorumlar */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Yorumlar ({externalComments.length})
      </Typography>

      {externalComments.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('tickets.emptyState')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {externalComments.map((comment) => (
            <Paper key={comment.id} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {comment.authorId ?? 'Bilinmeyen'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {comment.createdAt}
                </Typography>
              </Box>
              <Typography variant="body2">{comment.content}</Typography>
            </Paper>
          ))}
        </Box>
      )}

      {/* Yorum ekleme — kapalı talepler için devre dışı */}
      {status !== 'CLOSED' && status !== 'CANCELLED' && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('tickets.addComment')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              multiline
              minRows={2}
              fullWidth
              placeholder={t('tickets.commentPlaceholder')}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleAddComment}
              disabled={isCommenting || !commentText.trim()}
              sx={{ flexShrink: 0 }}
            >
              Gönder
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
