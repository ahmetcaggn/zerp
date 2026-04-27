'use client'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useCreateTicket } from '../hooks/use-tickets'
import { TicketPriority, TicketType } from '../types/ticket'

interface Props {
  open: boolean
  onClose: () => void
}

const PRIORITY_OPTIONS = Object.values(TicketPriority)
const TYPE_OPTIONS = Object.values(TicketType)

export function TicketCreateDialog({ open, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>(TicketPriority.Medium)
  const [type, setType] = useState<string>(TicketType.Question)

  const { mutate: createTicket, isPending } = useCreateTicket()

  function handleSubmit() {
    if (!title.trim()) {
      showToast('Başlık zorunludur.', { severity: 'warning' })
      return
    }

    createTicket(
      {
        title: title.trim(),
        ...(description && { description }),
        priority: priority as (typeof TicketPriority)[keyof typeof TicketPriority],
        type: type as (typeof TicketType)[keyof typeof TicketType],
      },
      {
        onSuccess: (ticket) => {
          showToast('Destek talebi oluşturuldu.', { severity: 'success' })
          onClose()
          if (ticket.id !== undefined) {
            router.push(`${ROUTES.tickets}/${ticket.id}` as Route)
          }
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('tickets.createButton')}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Başlık *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={3}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select
                value={priority}
                label="Öncelik"
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Tür</InputLabel>
              <Select
                value={type}
                label="Tür"
                onChange={(e) => setType(e.target.value)}
              >
                {TYPE_OPTIONS.map((ty) => (
                  <MenuItem key={ty} value={ty}>
                    {ty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          İptal
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isPending ? <CircularProgress size={20} /> : 'Oluştur'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
