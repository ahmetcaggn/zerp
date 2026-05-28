'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
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
  TablePagination,
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
import { formatDateTime } from '@/core/utils/date-formatter'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { teamTicketClient } from '../api/team-ticket-client'
import {
  useAddTeamTicketComment,
  useAssignmentTeamCandidates,
  useAssignmentTeamMemberCandidates,
  useAssignTeamTicket,
  useChangeTeamTicketPriority,
  useChangeTeamTicketStatus,
  useTeamTicket,
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
const TERMINAL_STATUSES: TicketStatusString[] = ['RESOLVED', 'CLOSED', 'CANCELLED']
const ASSIGNMENT_CANDIDATE_PAGE_SIZE = 10

interface Props {
  id: string
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

type CommentAuthorType = 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'UNKNOWN'

function resolveCommentAuthorType(authorType?: string): CommentAuthorType {
  const normalized = authorType?.toUpperCase()
  if (normalized === 'CUSTOMER' || normalized === 'AGENT' || normalized === 'SYSTEM') {
    return normalized
  }
  return 'UNKNOWN'
}

export function TeamTicketDetail({ id }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [commentText, setCommentText] = useState('')
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignTeamId, setAssignTeamId] = useState('')
  const [assignTeamQuery, setAssignTeamQuery] = useState('')
  const [assignTeamPage, setAssignTeamPage] = useState(1)
  const [assignAgentId, setAssignAgentId] = useState('')
  const [assignAgentQuery, setAssignAgentQuery] = useState('')
  const [assignAgentPage, setAssignAgentPage] = useState(1)

  const { mutate: addComment, isPending: isCommenting } = useAddTeamTicketComment()
  const { mutate: changeStatus, isPending: isChangingStatus } = useChangeTeamTicketStatus()
  const { mutate: changePriority, isPending: isChangingPriority } = useChangeTeamTicketPriority()
  const { mutate: assignTicket, isPending: isAssigning } = useAssignTeamTicket()
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
  const canReadTicketSlaTracking = hasPermission(PermissionActions.READ_TICKET_SLA_TRACKING)
  const canReadTicketAttachment = hasPermission(PermissionActions.READ_TICKET_ATTACHMENT)
  const canCreateTicketAttachment = hasPermission(PermissionActions.CREATE_TICKET_ATTACHMENT)
  const canChangeAssignmentByPermission =
    canCreateTicketAssignment || canUpdateTicketAssignment
  const normalizedAssignTeamQuery = assignTeamQuery.trim()
  const normalizedAssignAgentQuery = assignAgentQuery.trim()
  const {
    data: assignmentTeamCandidatesResult,
    isLoading: isLoadingAssignmentTeams,
    isFetching: isFetchingAssignmentTeams,
  } = useAssignmentTeamCandidates(
    id,
    {
      pagination: { page: assignTeamPage, perPage: ASSIGNMENT_CANDIDATE_PAGE_SIZE },
      sort: { field: 'name', order: 'ASC' },
      query: normalizedAssignTeamQuery || undefined,
    },
    {
      enabled:
        canReadTicket &&
        !isLoadingPermissions &&
        canChangeAssignmentByPermission &&
        showAssignForm,
    },
  )
  const assignmentTeamCandidates = assignmentTeamCandidatesResult?.data ?? []
  const assignmentTeamCandidateTotal = assignmentTeamCandidatesResult?.total ?? 0
  const effectiveAssignTeamId = assignmentTeamCandidates.some(
    (teamCandidate) => teamCandidate.id === assignTeamId,
  )
    ? assignTeamId
    : ''
  const {
    data: assignmentMemberCandidatesResult,
    isLoading: isLoadingAssignmentMembers,
    isFetching: isFetchingAssignmentMembers,
  } = useAssignmentTeamMemberCandidates(
    id,
    effectiveAssignTeamId
      ? {
          teamId: effectiveAssignTeamId,
          pagination: { page: assignAgentPage, perPage: ASSIGNMENT_CANDIDATE_PAGE_SIZE },
          sort: { field: 'joinedAt', order: 'ASC' },
          query: normalizedAssignAgentQuery || undefined,
        }
      : undefined,
    {
      enabled:
        canReadTicket &&
        !isLoadingPermissions &&
        canChangeAssignmentByPermission &&
        showAssignForm &&
        Boolean(effectiveAssignTeamId),
    },
  )
  const assignmentMemberCandidates = assignmentMemberCandidatesResult?.data ?? []
  const assignmentMemberCandidateTotal = assignmentMemberCandidatesResult?.total ?? 0
  const effectiveAssignAgentId = assignmentMemberCandidates.some(
    (memberCandidate) => memberCandidate.userId === assignAgentId,
  )
    ? assignAgentId
    : ''

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
  const isClosed = status !== undefined && TERMINAL_STATUSES.includes(status)
  const activeAssignment = ticket.currentAssignment?.active
    ? ticket.currentAssignment
    : undefined
  const hasCurrentAssignment = Boolean(activeAssignment)
  const canChangeAssignment = hasCurrentAssignment
    ? canUpdateTicketAssignment
    : canCreateTicketAssignment
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
      showToast('Mesaj yazma yetkiniz yok.', { severity: 'warning' })
      return
    }
    if (!commentText.trim()) return
    addComment(
      { id, body: { content: commentText.trim(), isInternal: false } },
      {
        onSuccess: () => {
          setCommentText('')
          showToast('Mesaj gönderildi.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleStatusChange(newStatus: TicketStatusString) {
    if (!canUpdateTicket) {
      showToast('Durum güncelleme yetkiniz yok.', { severity: 'warning' })
      return
    }
    if (isClosed) {
      showToast('Kapanmış taleplerde durum güncellenemez.', { severity: 'warning' })
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

  function handleClearAssignedAgent() {
    if (!canUpdateTicketAssignment) {
      showToast('Atama güncelleme yetkiniz yok.', { severity: 'warning' })
      return
    }
    if (isClosed) {
      showToast('Talep kapalı olduğu için atama düzenlenemez.', { severity: 'warning' })
      return
    }
    if (!activeAssignment?.teamId) {
      showToast('Aktif takım ataması bulunamadı.', { severity: 'warning' })
      return
    }
    if (!activeAssignment.agentPartyId) {
      showToast('Bu talepte ajan ataması zaten yok.', { severity: 'info' })
      return
    }

    assignTicket(
      {
        id,
        body: {
          teamId: activeAssignment.teamId,
        },
      },
      {
        onSuccess: () => {
          setAssignAgentId('')
          showToast('Ajan ataması kaldırıldı.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleOpenAssignmentEditor() {
    setShowAssignForm((prev) => {
      const next = !prev
      if (next) {
        setAssignTeamId(activeAssignment?.teamId ?? '')
        setAssignAgentId(activeAssignment?.agentPartyId ?? '')
        setAssignTeamQuery('')
        setAssignAgentQuery('')
        setAssignTeamPage(1)
        setAssignAgentPage(1)
      } else {
        setAssignTeamId('')
        setAssignAgentId('')
      }
      return next
    })
  }

  function handleCloseAssignmentEditor() {
    setShowAssignForm(false)
    setAssignTeamId('')
    setAssignAgentId('')
    setAssignTeamQuery('')
    setAssignAgentQuery('')
    setAssignTeamPage(1)
    setAssignAgentPage(1)
  }

  function handleSaveAssignment() {
    assignTicket(
      {
        id,
        body: {
          teamId: effectiveAssignTeamId,
          ...(effectiveAssignAgentId && { agentPartyId: effectiveAssignAgentId }),
        },
      },
      {
        onSuccess: () => {
          setAssignTeamId('')
          setAssignTeamQuery('')
          setAssignTeamPage(1)
          setAssignAgentId('')
          setAssignAgentQuery('')
          setAssignAgentPage(1)
          setShowAssignForm(false)
          showToast('Atama yapıldı.', { severity: 'success' })
        },
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
    if (!effectiveAssignTeamId) {
      showToast('Lütfen listeden bir takım seçin.', { severity: 'warning' })
      return
    }

    handleSaveAssignment()
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
            mb: activeAssignment ? 1 : 0,
          }}
        >
          <Typography variant="subtitle2">Atama</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canChangeAssignment && (
              <Tooltip title={assignmentActionBlockedReason ?? ''}>
                <span>
                  <Button
                    size="small"
                    onClick={handleOpenAssignmentEditor}
                    disabled={Boolean(assignmentActionBlockedReason)}
                  >
                    {activeAssignment ? 'Atamayı Düzenle' : 'Ata'}
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>

        {canReadTicketAssignment ? (
          activeAssignment ? (
            <Typography variant="body2">
              Takım: {activeAssignment.teamName ?? activeAssignment.teamId ?? '—'}
              {activeAssignment.teamType ? ` (${activeAssignment.teamType})` : ''}
              {activeAssignment.agentPartyId &&
                ` · Ajan: ${activeAssignment.agentDisplayName ?? activeAssignment.agentPartyId}`}
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
          <Paper variant="outlined" sx={{ mt: 2, p: 2, overflowX: 'hidden' }}>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'minmax(0,1fr) minmax(0,1fr)',
                },
                alignItems: 'flex-end',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <TextField
                  size="small"
                  label="Takım Ara"
                  value={assignTeamQuery}
                  onChange={(event) => {
                    setAssignTeamQuery(event.target.value)
                    setAssignTeamPage(1)
                  }}
                  helperText="Takım adı, tipi veya ID ile arayın."
                  fullWidth
                />
                <FormControl size="small" sx={{ mt: 1, width: '100%' }}>
                  <InputLabel>Takım</InputLabel>
                  <Select
                    value={effectiveAssignTeamId}
                    label="Takım"
                    sx={{
                      '& .MuiSelect-select': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                    onChange={(event) => {
                      const nextTeamId = event.target.value
                      setAssignTeamId(nextTeamId)
                      setAssignAgentId('')
                      setAssignAgentQuery('')
                      setAssignAgentPage(1)
                    }}
                    disabled={isLoadingAssignmentTeams}
                  >
                    {assignmentTeamCandidates.map((teamCandidate) => (
                      <MenuItem key={teamCandidate.id} value={teamCandidate.id}>
                        {teamCandidate.displayLabel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TablePagination
                  component="div"
                  count={assignmentTeamCandidateTotal}
                  page={Math.max(assignTeamPage - 1, 0)}
                  rowsPerPage={ASSIGNMENT_CANDIDATE_PAGE_SIZE}
                  rowsPerPageOptions={[ASSIGNMENT_CANDIDATE_PAGE_SIZE]}
                  onPageChange={(_, nextPage) => setAssignTeamPage(nextPage + 1)}
                  onRowsPerPageChange={() => {}}
                  sx={{
                    mt: 0.5,
                    '& .MuiTablePagination-toolbar': {
                      minHeight: 32,
                      px: 0,
                      justifyContent: 'flex-start',
                      gap: 0.75,
                    },
                    '& .MuiTablePagination-spacer': {
                      display: 'none',
                      flex: 0,
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-input': {
                      display: 'none',
                    },
                    '& .MuiTablePagination-displayedRows': {
                      m: 0,
                    },
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <TextField
                  size="small"
                  label="Ajan Ara (opsiyonel)"
                  value={assignAgentQuery}
                  onChange={(event) => {
                    setAssignAgentQuery(event.target.value)
                    setAssignAgentPage(1)
                  }}
                  helperText="Ad soyad, username, email veya ID ile arayın."
                  fullWidth
                  disabled={!effectiveAssignTeamId}
                />
                <FormControl size="small" sx={{ mt: 1, width: '100%' }} disabled={!effectiveAssignTeamId || isLoadingAssignmentMembers}>
                  <InputLabel>Ajan (Opsiyonel)</InputLabel>
                  <Select
                    value={effectiveAssignAgentId}
                    label="Ajan (Opsiyonel)"
                    sx={{
                      '& .MuiSelect-select': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                    onChange={(event) => setAssignAgentId(event.target.value)}
                  >
                    <MenuItem value="">
                      Sadece takıma ata
                    </MenuItem>
                    {assignmentMemberCandidates.map((memberCandidate) => (
                      <MenuItem key={memberCandidate.userId} value={memberCandidate.userId}>
                        {memberCandidate.displayLabel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TablePagination
                  component="div"
                  count={assignmentMemberCandidateTotal}
                  page={Math.max(assignAgentPage - 1, 0)}
                  rowsPerPage={ASSIGNMENT_CANDIDATE_PAGE_SIZE}
                  rowsPerPageOptions={[ASSIGNMENT_CANDIDATE_PAGE_SIZE]}
                  onPageChange={(_, nextPage) => setAssignAgentPage(nextPage + 1)}
                  onRowsPerPageChange={() => {}}
                  sx={{
                    mt: 0.5,
                    '& .MuiTablePagination-toolbar': {
                      minHeight: 32,
                      px: 0,
                      justifyContent: 'flex-start',
                      gap: 0.75,
                    },
                    '& .MuiTablePagination-spacer': {
                      display: 'none',
                      flex: 0,
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-input': {
                      display: 'none',
                    },
                    '& .MuiTablePagination-displayedRows': {
                      m: 0,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'stretch', sm: 'flex-end' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 1,
                  minWidth: 0,
                  gridColumn: { xs: '1', md: '1 / -1' },
                  pt: { xs: 0.5, md: 0 },
                }}
              >
                {activeAssignment?.agentPartyId && canUpdateTicketAssignment && (
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    onClick={handleClearAssignedAgent}
                    disabled={isAssigning || Boolean(assignmentActionBlockedReason)}
                  >
                    Ajan Atamasını Kaldır
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAssign}
                  disabled={
                    isAssigning ||
                    Boolean(assignmentActionBlockedReason) ||
                    !effectiveAssignTeamId
                  }
                >
                  Kaydet
                </Button>
                <Button
                  variant="text"
                  size="small"
                  color="inherit"
                  onClick={handleCloseAssignmentEditor}
                  disabled={isAssigning}
                >
                  Vazgeç
                </Button>
              </Box>
            </Box>

            {(isFetchingAssignmentTeams || isFetchingAssignmentMembers) && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Adaylar güncelleniyor...
              </Typography>
            )}
          </Paper>
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
              <Typography variant="body2">
                {formatDateTime(ticket.slaTracking.firstResponseDueAt, locale)}
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
                {formatDateTime(ticket.slaTracking.resolutionDueAt, locale)}
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

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Mesajlar ({externalComments.length})
      </Typography>

      {!canReadTicketComment ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Mesajları görüntüleme yetkiniz yok.
        </Typography>
      ) : externalComments.length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {t('teamTickets.emptyState')}
          </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {externalComments.map((comment, index) => {
            const authorType = resolveCommentAuthorType(comment.authorType)
            const isTenantMessage = authorType === 'CUSTOMER'
            const isAdminMessage = authorType === 'AGENT'
            const alignRight = isAdminMessage

            return (
              <Box
                key={comment.id ?? `${comment.authorId ?? 'unknown'}-${comment.createdAt ?? index}`}
                sx={{ display: 'flex', justifyContent: alignRight ? 'flex-end' : 'flex-start' }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.75,
                    py: 1.5,
                    maxWidth: { xs: '100%', sm: '80%' },
                    borderRadius: 2,
                    ...(alignRight
                      ? { borderBottomRightRadius: 0.75 }
                      : { borderBottomLeftRadius: 0.75 }),
                    bgcolor: (theme) => {
                      if (isAdminMessage) {
                        return theme.palette.mode === 'dark'
                          ? 'rgba(46, 125, 50, 0.28)'
                          : '#DCF8C6'
                      }
                      if (isTenantMessage) {
                        return theme.palette.mode === 'dark'
                          ? 'rgba(66, 165, 245, 0.20)'
                          : '#E3F2FD'
                      }
                      return theme.palette.mode === 'dark'
                        ? 'rgba(255, 213, 79, 0.22)'
                        : '#FFF8E1'
                    },
                    borderColor: (theme) => {
                      if (isAdminMessage) {
                        return theme.palette.mode === 'dark'
                          ? 'rgba(102, 187, 106, 0.5)'
                          : '#B7E1A1'
                      }
                      if (isTenantMessage) {
                        return theme.palette.mode === 'dark'
                          ? 'rgba(66, 165, 245, 0.5)'
                          : '#BBDEFB'
                      }
                      return theme.palette.mode === 'dark'
                        ? 'rgba(255, 213, 79, 0.55)'
                        : '#FFE082'
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {comment.authorName ?? comment.authorId ?? 'Bilinmeyen'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment.createdAt}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {comment.content}
                  </Typography>
                </Paper>
              </Box>
            )
          })}
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
              Talep kapalı olduğu için mesaj yazılamaz.
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
