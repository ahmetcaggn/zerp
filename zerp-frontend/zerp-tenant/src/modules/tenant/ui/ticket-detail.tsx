'use client'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SendIcon from '@mui/icons-material/Send'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import {
  useAddComment,
  useAssignTicket,
  useChangePriority,
  useChangeTicketStatus,
  useCloseTicket,
  useDeleteTicket,
  useTicket,
  useUnassignTicket,
  useUpdateTicket,
} from '../hooks/use-tickets'
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

const STATUS_OPTIONS: TicketStatusString[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_CUSTOMER',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
]

const PRIORITY_OPTIONS: TicketPriorityString[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

interface Props {
  id: string
}

export function TicketDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [commentText, setCommentText] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignTeamId, setAssignTeamId] = useState('')
  const [assignAgentId, setAssignAgentId] = useState('')

  const { data: ticket, isLoading, error } = useTicket(id)
  const { mutate: addComment, isPending: isCommenting } = useAddComment()
  const { mutate: closeTicket, isPending: isClosing } = useCloseTicket()
  const { mutate: changeStatus, isPending: isChangingStatus } = useChangeTicketStatus()
  const { mutate: changePriority, isPending: isChangingPriority } = useChangePriority()
  const { mutate: assignTicket, isPending: isAssigning } = useAssignTicket()
  const { mutate: unassignTicket, isPending: isUnassigning } = useUnassignTicket()
  const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket()
  const { mutate: deleteTicket, isPending: isDeleting } = useDeleteTicket()

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
    if (!assignTeamId.trim()) return
    assignTicket(
      {
        id,
        body: {
          teamId: assignTeamId.trim() as unknown as number,
          ...(assignAgentId.trim() && { agentPartyId: assignAgentId.trim() }),
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

  function handleOpenEdit() {
    setEditTitle(ticket!.title ?? '')
    setEditDescription(ticket!.description ?? '')
    setEditOpen(true)
  }

  function handleUpdate() {
    if (!editTitle.trim()) {
      showToast('Başlık zorunludur.', { severity: 'warning' })
      return
    }
    updateTicket(
      { id, data: { title: editTitle.trim(), description: editDescription } },
      {
        onSuccess: () => {
          setEditOpen(false)
          showToast('Talep güncellendi.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleDelete() {
    deleteTicket(id, {
      onSuccess: () => {
        showToast('Talep silindi.', { severity: 'success' })
        router.back()
      },
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      {/* Üst bar */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ color: 'text.secondary' }}
        >
          Geri
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={handleOpenEdit}>
            Düzenle
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteOpen(true)}
          >
            Sil
          </Button>
          {isCloseable && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<CheckCircleIcon />}
              onClick={handleClose}
              disabled={isClosing}
            >
              {t('tickets.closeTicket')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Başlık */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        #{ticket.id} — {ticket.title}
      </Typography>

      {/* Durum ve Öncelik — inline select */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 180 }} disabled={isChangingStatus || isClosed}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={status ?? ''}
            label="Durum"
            onChange={(e) => handleStatusChange(e.target.value as TicketStatusString)}
            renderValue={(val) => (
              <Chip
                label={val}
                color={STATUS_COLOR[val as TicketStatusString] ?? 'default'}
                size="small"
              />
            )}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                <Chip label={s} color={STATUS_COLOR[s] ?? 'default'} size="small" />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }} disabled={isChangingPriority || isClosed}>
          <InputLabel>Öncelik</InputLabel>
          <Select
            value={priority ?? ''}
            label="Öncelik"
            onChange={(e) => handlePriorityChange(e.target.value as TicketPriorityString)}
            renderValue={(val) => (
              <Chip
                label={val}
                color={PRIORITY_COLOR[val as TicketPriorityString] ?? 'default'}
                size="small"
                variant="outlined"
              />
            )}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <MenuItem key={p} value={p}>
                <Chip
                  label={p}
                  color={PRIORITY_COLOR[p] ?? 'default'}
                  size="small"
                  variant="outlined"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {ticket.type && (
          <Chip label={ticket.type} size="small" variant="outlined" />
        )}
        <Typography variant="caption" color="text.secondary">
          {ticket.createdAt}
        </Typography>
      </Box>

      {/* Açıklama */}
      {ticket.description && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">{ticket.description}</Typography>
        </Paper>
      )}

      {/* Atama */}
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
              <Button size="small" onClick={() => setShowAssignForm((v) => !v)}>
                {ticket.currentAssignment ? 'Yeniden Ata' : 'Ata'}
              </Button>
            )}
          </Box>
        </Box>

        {ticket.currentAssignment ? (
          <Typography variant="body2">
            Takım ID: {ticket.currentAssignment.teamId ?? '—'}
            {ticket.currentAssignment.agentPartyId &&
              ` · Ajan: ${ticket.currentAssignment.agentPartyId}`}
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
              onChange={(e) => setAssignTeamId(e.target.value)}
              sx={{ flex: 1, minWidth: 140 }}
            />
            <TextField
              size="small"
              label="Ajan ID (opsiyonel)"
              value={assignAgentId}
              onChange={(e) => setAssignAgentId(e.target.value)}
              sx={{ flex: 1, minWidth: 160 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAssign}
              disabled={isAssigning || !assignTeamId.trim()}
            >
              Kaydet
            </Button>
          </Box>
        )}
      </Paper>

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

      {/* Yorum ekleme */}
      {!isClosed && (
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

      {/* Düzenleme dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Talebi Düzenle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Başlık *"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Açıklama"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={isUpdating}>
            İptal
          </Button>
          <Button variant="contained" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={20} /> : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme onay dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Talebi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu destek talebini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
            İptal
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={20} /> : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
