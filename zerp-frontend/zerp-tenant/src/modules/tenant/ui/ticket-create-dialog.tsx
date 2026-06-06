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
  Tooltip,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useCreateTicket } from '../hooks/use-tickets'
import type { TicketTypeValue } from '../types/ticket'
import { TicketPriority, TicketType } from '../types/ticket'

interface Props {
  open: boolean
  onClose: () => void
  canCreate: boolean
  disabledReason?: string
}

const PRIORITY_OPTIONS = Object.values(TicketPriority)
const TYPE_OPTIONS = Object.values(TicketType)

export function TicketCreateDialog({ open, onClose, canCreate, disabledReason }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>(TicketPriority.Medium)
  const [type, setType] = useState<TicketTypeValue>(TicketType.Question)

  const { mutate: createTicket, isPending } = useCreateTicket()

  function handleSubmit() {
    if (!canCreate) {
      showToast(disabledReason ?? t('common.unauthorized'), { severity: 'warning' })
      return
    }

    if (!title.trim()) {
      showToast(t('tickets.titleRequiredWarning'), { severity: 'warning' })
      return
    }

    createTicket(
      {
        title: title.trim(),
        ...(description && { description }),
        priority: priority as (typeof TicketPriority)[keyof typeof TicketPriority],
        type,
      },
      {
        onSuccess: (ticket) => {
          showToast(t('tickets.ticketCreatedToast'), { severity: 'success' })
          onClose()
          if (ticket.id !== undefined) {
            router.push(withLocale(locale, `${ROUTES.tickets}/${ticket.id}`) as Route)
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
            label={t('tickets.titleField')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            fullWidth
            disabled={!canCreate}
          />

          <TextField
            label={t('tickets.descriptionField')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={3}
            disabled={!canCreate}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth disabled={!canCreate}>
              <InputLabel>{t('tickets.priorityLabel')}</InputLabel>
              <Select
                value={priority}
                label={t('tickets.priorityLabel')}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth disabled={!canCreate}>
              <InputLabel>{t('tickets.typeLabel')}</InputLabel>
              <Select
                value={type}
                label={t('tickets.typeLabel')}
                onChange={(e) => setType(e.target.value as TicketTypeValue)}
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
          {t('common.cancel')}
        </Button>
        <Tooltip title={disabledReason ?? ''}>
          <span>
            <Button variant="contained" onClick={handleSubmit} disabled={isPending || !canCreate}>
              {isPending ? <CircularProgress size={20} /> : t('common.create')}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  )
}
