'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useAddTicketComment, usePatchTicket, useTicket } from '../hooks/use-tickets'
import type {
  TicketPriorityString,
  TicketStatusString,
  TicketTypeString,
} from '../types/ticket'

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

const TYPE_OPTIONS: TicketTypeString[] = ['BUG', 'FEATURE_REQUEST', 'QUESTION', 'INCIDENT']

interface Props {
  id: string
}

function formatDate(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('tr-TR')
}

export function TicketDetail({ id }: Props) {
  const router = useRouter()
  const { showToast } = useToast()

  const [editOpen, setEditOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editType, setEditType] = useState<TicketTypeString | ''>('')
  const [editTags, setEditTags] = useState('')
  const [editCustomAttributes, setEditCustomAttributes] = useState('{}')
  const [commentText, setCommentText] = useState('')

  const { data: ticket, isLoading, error } = useTicket(id)
  const { mutate: patchTicket, isPending: isSaving } = usePatchTicket()
  const { mutate: addComment, isPending: isCommenting } = useAddTicketComment()

  const comments = (ticket?.comments ?? []).filter((comment) => !comment.isInternal).sort((a, b) => {
    const left = new Date(a.createdAt ?? '').getTime()
    const right = new Date(b.createdAt ?? '').getTime()
    return right - left
  })

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
  const currentTicket = ticket

  const status = currentTicket.status as TicketStatusString | undefined
  const priority = currentTicket.priority as TicketPriorityString | undefined
  const tags = Array.from(currentTicket.tags ?? [])
  const isClosed = status === 'CLOSED' || status === 'CANCELLED'
  const isEditLocked = status === 'IN_PROGRESS'

  function openEditDialog() {
    if (isEditLocked) {
      showToast('IN_PROGRESS durumundaki talepler düzenlenemez.', { severity: 'warning' })
      return
    }
    setEditTitle(currentTicket.title ?? '')
    setEditDescription(currentTicket.description ?? '')
    setEditType((currentTicket.type as TicketTypeString | undefined) ?? '')
    setEditTags(tags.join(', '))
    setEditCustomAttributes(JSON.stringify(currentTicket.customAttributes ?? {}, null, 2))
    setEditOpen(true)
  }

  function handleSave() {
    if (isEditLocked) {
      showToast('IN_PROGRESS durumundaki talepler düzenlenemez.', { severity: 'warning' })
      setEditOpen(false)
      return
    }

    const title = editTitle.trim()
    if (!title) {
      showToast('Başlık zorunludur.', { severity: 'warning' })
      return
    }

    let customAttributes: Record<string, unknown> = {}
    try {
      const parsed = JSON.parse(editCustomAttributes || '{}') as unknown
      if (
        parsed === null ||
        Array.isArray(parsed) ||
        typeof parsed !== 'object'
      ) {
        showToast('Özel alanlar geçerli bir JSON nesnesi olmalı.', { severity: 'warning' })
        return
      }
      customAttributes = parsed as Record<string, unknown>
    } catch {
      showToast('Özel alanlar geçerli JSON formatında olmalı.', { severity: 'warning' })
      return
    }

    const tags = editTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const fields: Record<string, unknown> = {
      title,
      description: editDescription.trim() ? editDescription : null,
      type: editType || null,
      tags,
      customAttributes,
    }

    patchTicket(
      { id, fields },
      {
        onSuccess: () => {
          setEditOpen(false)
          showToast('Talep güncellendi.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

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

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ color: 'text.secondary' }}
        >
          Geri
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={openEditDialog}
          disabled={isEditLocked}
        >
          Düzenle
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          #{currentTicket.id} — {currentTicket.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {status && (
            <Chip
              label={status}
              color={STATUS_COLOR[status] ?? 'default'}
              size="small"
            />
          )}
          {priority && (
            <Chip
              label={priority}
              color={PRIORITY_COLOR[priority] ?? 'default'}
              size="small"
              variant="outlined"
            />
          )}
          {currentTicket.type && <Chip label={currentTicket.type} size="small" variant="outlined" />}
        </Box>

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Oluşturulma: {formatDate(currentTicket.createdAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Son Güncelleme: {formatDate(currentTicket.updatedAt)}
          </Typography>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Açıklama
          </Typography>
          <Typography variant="body2">{currentTicket.description || '—'}</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Etiketler
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Özel Alanlar
          </Typography>
          <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'background.default' }}>
            <Typography
              component="pre"
              variant="caption"
              sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {JSON.stringify(currentTicket.customAttributes ?? {}, null, 2)}
            </Typography>
          </Paper>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Yorumlar ({comments.length})
        </Typography>

        {comments.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Yorum yok.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {comments.map((comment, index) => (
              <Paper
                key={comment.id ?? `${comment.authorId ?? 'unknown'}-${comment.createdAt ?? index}`}
                variant="outlined"
                sx={{ p: 1.5 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {comment.authorName ?? comment.authorId ?? 'Bilinmeyen'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      {!isClosed && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Yorum Ekle
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              multiline
              minRows={2}
              fullWidth
              placeholder="Yorumunuzu yazın..."
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
        </Paper>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Talebi Düzenle</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Başlık *"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Açıklama"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              select
              label="Tür"
              value={editType}
              onChange={(event) => setEditType(event.target.value as TicketTypeString)}
              size="small"
              fullWidth
            >
              <MenuItem value="">Seçilmedi</MenuItem>
              {TYPE_OPTIONS.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Etiketler"
              value={editTags}
              onChange={(event) => setEditTags(event.target.value)}
              size="small"
              fullWidth
              helperText="Virgülle ayırın. Örn: ödeme, acil, teknik"
            />
            <TextField
              label="Özel Alanlar (JSON)"
              value={editCustomAttributes}
              onChange={(event) => setEditCustomAttributes(event.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={6}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={isSaving}>
            İptal
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <CircularProgress size={20} /> : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
