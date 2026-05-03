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
import { useEffect, useState } from 'react'
import { useAuth } from '@/core/auth/client/use-auth'
import { ROUTES, withLocale } from '@/core/constants/routes'
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
const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

export function TicketCreateDialog({ open, onClose }: Props) {
  const { t, locale } = useI18n()
  const { tenantId: sessionTenantId } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const [tenantId, setTenantId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>(TicketPriority.Medium)
  const [type, setType] = useState<string>(TicketType.Question)

  const { mutate: createTicket, isPending } = useCreateTicket()

  useEffect(() => {
    if (sessionTenantId && !tenantId) {
      setTenantId(sessionTenantId)
    }
  }, [sessionTenantId, tenantId])

  function handleSubmit() {
    const normalizedTenantId = tenantId.trim()
    if (!normalizedTenantId) {
      showToast(t('tickets.tenantRequiredWarning'), { severity: 'warning' })
      return
    }
    if (!UUID_REGEX.test(normalizedTenantId)) {
      showToast(t('tickets.tenantFormatWarning'), { severity: 'warning' })
      return
    }

    if (!title.trim()) {
      showToast(t('tickets.titleRequiredWarning'), { severity: 'warning' })
      return
    }

    createTicket(
      {
        tenantId: normalizedTenantId,
        title: title.trim(),
        ...(description && { description }),
        priority: priority as (typeof TicketPriority)[keyof typeof TicketPriority],
        type: type as (typeof TicketType)[keyof typeof TicketType],
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
            label={t('tickets.tenantIdField')}
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            size="small"
            fullWidth
            required
            helperText={t('tickets.tenantIdFieldHelper')}
          />

          <TextField
            label={t('tickets.titleField')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label={t('tickets.descriptionField')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={3}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth>
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

            <FormControl size="small" fullWidth>
              <InputLabel>{t('tickets.typeLabel')}</InputLabel>
              <Select
                value={type}
                label={t('tickets.typeLabel')}
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
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isPending ? <CircularProgress size={20} /> : t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
