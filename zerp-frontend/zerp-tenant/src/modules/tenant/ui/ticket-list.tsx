'use client'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useTicket } from '../hooks/use-tickets'
import type { TicketPriorityString, TicketStatusString } from '../types/ticket'
import { TicketCreateDialog } from './ticket-create-dialog'

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

export function TicketList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [lookupInput, setLookupInput] = useState('')
  const [lookupId, setLookupId] = useState<string | undefined>()

  const { data: lookedUpTicket, isLoading, error } = useTicket(lookupId)

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  function handleLookup() {
    const trimmed = lookupInput.trim()
    if (trimmed) setLookupId(trimmed)
  }

  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
      >
        <Typography variant="h5">{t('tickets.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          {t('tickets.createButton')}
        </Button>
      </Box>

      {/* Backend list endpoint hazır olunca bu uyarı kaldırılır */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Talep listesi için backend desteği bekleniyor. Şimdilik ID ile arama yapabilirsiniz.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          size="small"
          label="Talep ID"
          type="text"
          value={lookupInput}
          onChange={(e) => setLookupInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          sx={{ width: 200 }}
        />
        <Button variant="outlined" onClick={handleLookup}>
          Ara
        </Button>
      </Box>

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}

      {lookedUpTicket && (
        <Paper
          variant="outlined"
          sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
          onClick={() =>
            lookedUpTicket.id !== undefined &&
            router.push(`${ROUTES.tickets}/${lookedUpTicket.id}` as Route)
          }
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                #{lookedUpTicket.id} — {lookedUpTicket.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {lookedUpTicket.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>
              {lookedUpTicket.status && (
                <Chip
                  label={lookedUpTicket.status}
                  color={
                    STATUS_COLOR[lookedUpTicket.status as TicketStatusString] ?? 'default'
                  }
                  size="small"
                />
              )}
              {lookedUpTicket.priority && (
                <Chip
                  label={lookedUpTicket.priority}
                  color={
                    PRIORITY_COLOR[lookedUpTicket.priority as TicketPriorityString] ?? 'default'
                  }
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Oluşturulma: {lookedUpTicket.createdAt}
          </Typography>
        </Paper>
      )}

      <TicketCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  )
}
