'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SendIcon from '@mui/icons-material/Send'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useAddTeamTicketComment,
  useAssignTeamTicket,
  useChangeTeamTicketPriority,
  useChangeTeamTicketStatus,
  useCloseTeamTicket,
  useTeamTicket,
  useUnassignTeamTicket,
} from '../hooks/use-team-tickets'
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

const STATUS_OPTIONS: TicketStatusString[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_CUSTOMER',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
]

const PRIORITY_OPTIONS: TicketPriorityString[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const CLOSEABLE_STATUSES: TicketStatusString[] = ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER']

interface Props {
  id: string
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}

export function TeamTicketDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [commentText, setCommentText] = useState('')
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignTeamId, setAssignTeamId] = useState('')
  const [assignAgentId, setAssignAgentId] = useState('')

  const { data: ticket, isLoading, error } = useTeamTicket(id)
  const { mutate: addComment, isPending: isCommenting } = useAddTeamTicketComment()
  const { mutate: closeTicket, isPending: isClosing } = useCloseTeamTicket()
  const { mutate: changeStatus, isPending: isChangingStatus } = useChangeTeamTicketStatus()
  const { mutate: changePriority, isPending: isChangingPriority } = useChangeTeamTicketPriority()
  const { mutate: assignTicket, isPending: isAssigning } = useAssignTeamTicket()
  const { mutate: unassignTicket, isPending: isUnassigning } = useUnassignTeamTicket()
  const trimmedAssignTeamId = assignTeamId.trim()
  const trimmedAssignAgentId = assignAgentId.trim()
  const isAssignTeamIdValid = trimmedAssignTeamId ? isUuid(trimmedAssignTeamId) : true
  const isAssignAgentIdValid = trimmedAssignAgentId ? isUuid(trimmedAssignAgentId) : true

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
  const isClosed = status === 'CLOSED' || status === 'CANCELLED'
  const externalComments = (ticket.comments ?? []).filter((comment) => !comment.isInternal)

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

  function handleStatusChange(newStatus: TicketStatusString) {
    changeStatus(
      { id, body: { status: newStatus } },
      {
        onSuccess: () => showToast('Durum güncellendi.', { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handlePriorityChange(newPriority: TicketPriorityString) {
    changePriority(
      { id, body: { priority: newPriority } },
      {
        onSuccess: () => showToast('Öncelik güncellendi.', { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleAssign() {
    if (!trimmedAssignTeamId) {
      showToast('Takim ID zorunlu.', { severity: 'warning' })
      return
    }
    if (!isUuid(trimmedAssignTeamId)) {
      showToast('Gecerli bir takim UUID degeri girin.', { severity: 'warning' })
      return
    }
    if (trimmedAssignAgentId && !isUuid(trimmedAssignAgentId)) {
      showToast('Gecerli bir ajan UUID degeri girin.', { severity: 'warning' })
      return
    }
    assignTicket(
      {
        id,
        body: {
          teamId: trimmedAssignTeamId,
          ...(trimmedAssignAgentId && { agentPartyId: trimmedAssignAgentId }),
        },
      },
      {
        onSuccess: () => {
          setAssignTeamId('')
          setAssignAgentId('')
          setShowAssignForm(false)
          showToast('Atama yapıldı.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUnassign() {
    unassignTicket(id, {
      onSuccess: () => showToast('Atama kaldırıldı.', { severity: 'success' }),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
          Geri
        </Button>
        {isCloseable && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<CheckCircleIcon />}
            onClick={handleClose}
            disabled={isClosing}
          >
            {t('teamTickets.closeTicket')}
          </Button>
        )}
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        #{ticket.id} — {ticket.title}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 180 }} disabled={isChangingStatus || isClosed}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={status ?? ''}
            label="Durum"
            onChange={(event) => handleStatusChange(event.target.value as TicketStatusString)}
            renderValue={(value) => (
              <Chip
                label={value}
                color={STATUS_COLOR[value as TicketStatusString] ?? 'default'}
                size="small"
              />
            )}
          >
            {STATUS_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                <Chip label={value} color={STATUS_COLOR[value] ?? 'default'} size="small" />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }} disabled={isChangingPriority || isClosed}>
          <InputLabel>Öncelik</InputLabel>
          <Select
            value={priority ?? ''}
            label="Öncelik"
            onChange={(event) => handlePriorityChange(event.target.value as TicketPriorityString)}
            renderValue={(value) => (
              <Chip
                label={value}
                color={PRIORITY_COLOR[value as TicketPriorityString] ?? 'default'}
                size="small"
                variant="outlined"
              />
            )}
          >
            {PRIORITY_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                <Chip
                  label={value}
                  color={PRIORITY_COLOR[value] ?? 'default'}
                  size="small"
                  variant="outlined"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {ticket.type && <Chip label={ticket.type} size="small" variant="outlined" />}
        <Typography variant="caption" color="text.secondary">
          {ticket.createdAt}
        </Typography>
      </Box>

      {ticket.description && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">{ticket.description}</Typography>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: ticket.currentAssignment ? 1 : 0,
          }}
        >
          <Typography variant="subtitle2">Atama</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {ticket.currentAssignment && (
              <Button
                size="small"
                color="error"
                startIcon={<PersonRemoveIcon fontSize="small" />}
                onClick={handleUnassign}
                disabled={isUnassigning}
              >
                Atamayı Kaldır
              </Button>
            )}
            {!isClosed && (
              <Button size="small" onClick={() => setShowAssignForm((prev) => !prev)}>
                {ticket.currentAssignment ? 'Yeniden Ata' : 'Ata'}
              </Button>
            )}
          </Box>
        </Box>

        {ticket.currentAssignment ? (
          <Typography variant="body2">
            Takım ID: {ticket.currentAssignment.teamId ?? '—'}
            {ticket.currentAssignment.agentPartyId && ` · Ajan: ${ticket.currentAssignment.agentPartyId}`}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Atanmamış
          </Typography>
        )}

        {showAssignForm && (
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <TextField
              size="small"
              label="Takım ID"
              value={assignTeamId}
              onChange={(event) => setAssignTeamId(event.target.value)}
              error={Boolean(trimmedAssignTeamId) && !isAssignTeamIdValid}
              helperText={
                Boolean(trimmedAssignTeamId) && !isAssignTeamIdValid
                  ? 'Gecerli bir UUID girin.'
                  : 'Takim system tenant altinda olmalidir.'
              }
              sx={{ flex: 1, minWidth: 140 }}
            />
            <TextField
              size="small"
              label="Ajan ID (opsiyonel)"
              value={assignAgentId}
              onChange={(event) => setAssignAgentId(event.target.value)}
              error={Boolean(trimmedAssignAgentId) && !isAssignAgentIdValid}
              helperText={
                Boolean(trimmedAssignAgentId) && !isAssignAgentIdValid
                  ? 'Gecerli bir UUID girin.'
                  : 'Ajan, secilen takimin system tenant uyelerinden biri olmali.'
              }
              sx={{ flex: 1, minWidth: 160 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAssign}
              disabled={
                isAssigning ||
                !trimmedAssignTeamId ||
                !isAssignTeamIdValid ||
                !isAssignAgentIdValid
              }
            >
              Kaydet
            </Button>
          </Box>
        )}
      </Paper>

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
              <Typography variant="body2">{ticket.slaTracking.firstResponseDueAt ?? '—'}</Typography>
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
              <Typography variant="body2">{ticket.slaTracking.resolutionDueAt ?? '—'}</Typography>
              {ticket.slaTracking.isResolutionBreached && (
                <Alert severity="error" sx={{ py: 0, px: 1, mt: 0.5 }}>
                  İhlal
                </Alert>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Yorumlar ({externalComments.length})
      </Typography>

      {externalComments.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('teamTickets.emptyState')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {externalComments.map((comment, index) => (
            <Paper
              key={comment.id ?? `${comment.authorId ?? 'unknown'}-${comment.createdAt ?? index}`}
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {comment.authorName ?? comment.authorId ?? 'Bilinmeyen'}
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

      {!isClosed && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('teamTickets.addComment')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              multiline
              minRows={2}
              fullWidth
              placeholder={t('teamTickets.commentPlaceholder')}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
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
