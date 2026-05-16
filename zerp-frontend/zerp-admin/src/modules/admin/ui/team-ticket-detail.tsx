'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
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
  Tooltip,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { teamTicketClient } from '../api/team-ticket-client'
import {
  useAddTeamTicketComment,
  useAssignTeamTicket,
  useChangeTeamTicketPriority,
  useChangeTeamTicketStatus,
  useCloseTeamTicket,
  useTeamTicket,
  useUnassignTeamTicket,
  useUploadTeamTicketAttachment,
} from '../hooks/use-team-tickets'
import type { AttachmentResponse } from '../types/ticket'
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

function formatFileSize(size?: number): string {
  if (typeof size !== 'number' || Number.isNaN(size) || size < 0) {
    return '—'
  }

  if (size < 1024) {
    return `${size} B`
  }

  const kb = size / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }

  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

function toTimestamp(value?: string): number {
  if (!value) {
    return 0
  }
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function TeamTicketDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [commentText, setCommentText] = useState('')
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignTeamId, setAssignTeamId] = useState('')
  const [assignAgentId, setAssignAgentId] = useState('')

  const { mutate: addComment, isPending: isCommenting } = useAddTeamTicketComment()
  const { mutate: closeTicket, isPending: isClosing } = useCloseTeamTicket()
  const { mutate: changeStatus, isPending: isChangingStatus } = useChangeTeamTicketStatus()
  const { mutate: changePriority, isPending: isChangingPriority } = useChangeTeamTicketPriority()
  const { mutate: assignTicket, isPending: isAssigning } = useAssignTeamTicket()
  const { mutate: unassignTicket, isPending: isUnassigning } = useUnassignTeamTicket()
  const { mutate: uploadAttachment, isPending: isUploadingAttachment } = useUploadTeamTicketAttachment()
  const { hasPermission, isLoadingPermissions } = useCurrentUserPermissions()
  const canReadTicket = hasPermission(PermissionActions.READ_TICKET)
  const { data: ticket, isLoading, error } = useTeamTicket(id, {
    enabled: canReadTicket && !isLoadingPermissions,
  })
  const canUpdateTicket = hasPermission(PermissionActions.UPDATE_TICKET)
  const canReadTicketComment = hasPermission(PermissionActions.READ_TICKET_COMMENT)
  const canCreateTicketComment = hasPermission(PermissionActions.CREATE_TICKET_COMMENT)
  const canReadTicketAssignment = hasPermission(PermissionActions.READ_TICKET_ASSIGNMENT)
  const canCreateTicketAssignment = hasPermission(PermissionActions.CREATE_TICKET_ASSIGNMENT)
  const canUpdateTicketAssignment = hasPermission(PermissionActions.UPDATE_TICKET_ASSIGNMENT)
  const canDeleteTicketAssignment = hasPermission(PermissionActions.DELETE_TICKET_ASSIGNMENT)
  const canReadTicketSlaTracking = hasPermission(PermissionActions.READ_TICKET_SLA_TRACKING)
  const canReadTicketAttachment = hasPermission(PermissionActions.READ_TICKET_ATTACHMENT)
  const canCreateTicketAttachment = hasPermission(PermissionActions.CREATE_TICKET_ATTACHMENT)
  const trimmedAssignTeamId = assignTeamId.trim()
  const trimmedAssignAgentId = assignAgentId.trim()
  const isAssignTeamIdValid = trimmedAssignTeamId ? isUuid(trimmedAssignTeamId) : true
  const isAssignAgentIdValid = trimmedAssignAgentId ? isUuid(trimmedAssignAgentId) : true

  if (isLoadingPermissions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!canReadTicket) {
    return <Typography color="text.secondary">Talep detayını görüntüleme yetkiniz yok.</Typography>
  }

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
  const hasCurrentAssignment = Boolean(ticket.currentAssignment)
  const canChangeAssignment = hasCurrentAssignment
    ? canUpdateTicketAssignment
    : canCreateTicketAssignment
  const closeActionBlockedReason = !isCloseable
    ? 'Talep mevcut durumunda kapatılamaz.'
    : null
  const assignmentActionBlockedReason = isClosed
    ? 'Talep kapalı olduğu için atama işlemi yapılamaz.'
    : null
  const attachmentUploadBlockedReason = isClosed
    ? 'Talep kapalı olduğu için ek yüklenemez.'
    : null
  const ticketAttachments = canReadTicketAttachment
    ? [...(ticket.attachments ?? [])].sort((left, right) => {
        return toTimestamp(right.uploadedAt) - toTimestamp(left.uploadedAt)
      })
    : []
  const externalComments = canReadTicketComment
    ? (ticket.comments ?? []).filter((comment) => !comment.isInternal)
    : []

  function handleAddComment() {
    if (!canCreateTicketComment) {
      showToast('Yorum ekleme yetkiniz yok.', { severity: 'warning' })
      return
    }
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
    if (!canUpdateTicket) {
      showToast('Talebi kapatma yetkiniz yok.', { severity: 'warning' })
      return
    }
    closeTicket(id, {
      onSuccess: () => showToast('Talep kapatıldı.', { severity: 'success' }),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleStatusChange(newStatus: TicketStatusString) {
    if (!canUpdateTicket) {
      showToast('Durum güncelleme yetkiniz yok.', { severity: 'warning' })
      return
    }
    changeStatus(
      { id, body: { status: newStatus } },
      {
        onSuccess: () => showToast('Durum güncellendi.', { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handlePriorityChange(newPriority: TicketPriorityString) {
    if (!canUpdateTicket) {
      showToast('Öncelik güncelleme yetkiniz yok.', { severity: 'warning' })
      return
    }
    changePriority(
      { id, body: { priority: newPriority } },
      {
        onSuccess: () => showToast('Öncelik güncellendi.', { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleAssign() {
    if (!canChangeAssignment) {
      showToast('Talep atama yetkiniz yok.', { severity: 'warning' })
      return
    }
    if (isClosed) {
      showToast('Talep kapalı olduğu için atama işlemi yapılamaz.', { severity: 'warning' })
      return
    }
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
    if (!canDeleteTicketAssignment) {
      showToast('Atama kaldırma yetkiniz yok.', { severity: 'warning' })
      return
    }
    unassignTicket(id, {
      onSuccess: () => showToast('Atama kaldırıldı.', { severity: 'success' }),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleAttachmentSelected(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    event.target.value = ''

    if (!selectedFile) {
      return
    }

    if (!canCreateTicketAttachment) {
      showToast('Ek yükleme yetkiniz yok.', { severity: 'warning' })
      return
    }

    if (isClosed) {
      showToast('Talep kapalı olduğu için ek yüklenemez.', { severity: 'warning' })
      return
    }

    uploadAttachment(
      { id, file: selectedFile },
      {
        onSuccess: () => showToast('Ek yüklendi.', { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function buildAttachmentUrl(attachment: AttachmentResponse): string | null {
    if (!attachment.id) {
      return null
    }
    return teamTicketClient.getAttachmentUrl(id, attachment.id)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
          Geri
        </Button>
        {canUpdateTicket && (
          <Tooltip title={closeActionBlockedReason ?? ''}>
            <span>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<CheckCircleIcon />}
                onClick={handleClose}
                disabled={isClosing || Boolean(closeActionBlockedReason)}
              >
                {t('teamTickets.closeTicket')}
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        #{ticket.id} — {ticket.title}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
        {canUpdateTicket ? (
          <>
            <FormControl
              size="small"
              sx={{ minWidth: 180 }}
              disabled={isChangingStatus || isClosed}
            >
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

            <FormControl
              size="small"
              sx={{ minWidth: 160 }}
              disabled={isChangingPriority || isClosed}
            >
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
          </>
        ) : (
          <>
            {status && <Chip label={status} color={STATUS_COLOR[status] ?? 'default'} size="small" />}
            {priority && (
              <Chip
                label={priority}
                color={PRIORITY_COLOR[priority] ?? 'default'}
                size="small"
                variant="outlined"
              />
            )}
          </>
        )}

        {ticket.type && <Chip label={ticket.type} size="small" variant="outlined" />}
        <Typography variant="caption" color="text.secondary">
          {ticket.createdAt}
        </Typography>
      </Box>
      {canUpdateTicket && isClosed && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
          Kapalı taleplerde durum ve öncelik güncellenemez.
        </Typography>
      )}

      {ticket.description && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">{ticket.description}</Typography>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">Ekler ({ticketAttachments.length})</Typography>
          {canCreateTicketAttachment && (
            <Tooltip title={attachmentUploadBlockedReason ?? ''}>
              <span>
                <Button
                  size="small"
                  component="label"
                  startIcon={<CloudUploadIcon fontSize="small" />}
                  disabled={isUploadingAttachment || Boolean(attachmentUploadBlockedReason)}
                >
                  Ek Yükle
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAttachmentSelected}
                  />
                </Button>
              </span>
            </Tooltip>
          )}
        </Box>

        {!canReadTicketAttachment ? (
          <Typography variant="body2" color="text.secondary">
            Ekleri görüntüleme yetkiniz yok.
          </Typography>
        ) : ticketAttachments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Bu talepte ek bulunmuyor.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {ticketAttachments.map((attachment, index) => {
              const fileLabel = attachment.fileName?.trim() || attachment.storageKey || 'Dosya'
              const attachmentUrl = buildAttachmentUrl(attachment)

              return (
                <Paper
                  key={attachment.id ?? `${attachment.storageKey ?? fileLabel}-${index}`}
                  variant="outlined"
                  sx={{ p: 1.5, borderStyle: 'dashed' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <AttachFileIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {fileLabel}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(attachment.fileSize)}
                        {attachment.contentType ? ` · ${attachment.contentType}` : ''}
                        {attachment.uploadedAt ? ` · ${attachment.uploadedAt}` : ''}
                      </Typography>
                    </Box>
                    {attachmentUrl ? (
                      <Button
                        component="a"
                        href={attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        startIcon={<DownloadIcon fontSize="small" />}
                      >
                        Aç
                      </Button>
                    ) : (
                      <Button size="small" disabled>
                        Aç
                      </Button>
                    )}
                  </Box>
                </Paper>
              )
            })}
          </Box>
        )}
      </Paper>

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
            {ticket.currentAssignment && canDeleteTicketAssignment && (
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
            {canChangeAssignment && (
              <Tooltip title={assignmentActionBlockedReason ?? ''}>
                <span>
                  <Button
                    size="small"
                    onClick={() => setShowAssignForm((prev) => !prev)}
                    disabled={Boolean(assignmentActionBlockedReason)}
                  >
                    {ticket.currentAssignment ? 'Yeniden Ata' : 'Ata'}
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>

        {canReadTicketAssignment ? (
          ticket.currentAssignment ? (
            <Typography variant="body2">
              Takım ID: {ticket.currentAssignment.teamId ?? '—'}
              {ticket.currentAssignment.agentPartyId && ` · Ajan: ${ticket.currentAssignment.agentPartyId}`}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Atanmamış
            </Typography>
          )
        ) : (
          <Typography variant="body2" color="text.secondary">
            Atama bilgisini görüntüleme yetkiniz yok.
          </Typography>
        )}

        {canChangeAssignment && showAssignForm && (
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
                Boolean(assignmentActionBlockedReason) ||
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

      {canReadTicketSlaTracking && ticket.slaTracking && (
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

      {!canReadTicketComment ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Yorumları görüntüleme yetkiniz yok.
        </Typography>
      ) : externalComments.length === 0 ? (
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

      {canCreateTicketComment && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('teamTickets.addComment')}
          </Typography>
          {isClosed ? (
            <Typography variant="body2" color="text.secondary">
              Talep kapalı olduğu için yorum eklenemez.
            </Typography>
          ) : (
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
          )}
        </>
      )}
    </Box>
  )
}
