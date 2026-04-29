'use client'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useCreateTeam, useUpdateTeam } from '../hooks/use-teams'
import type { TeamResponse } from '../types/team'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  team?: TeamResponse
  onClose: () => void
}

export function TeamFormDialog({ open, mode, team, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { mutate: createTeam, isPending: isCreating } = useCreateTeam()
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam()
  const isPending = isCreating || isUpdating

  function seedForm() {
    if (mode === 'edit') {
      setName(team?.name ?? '')
      setDescription(team?.description ?? '')
      return
    }

    setName('')
    setDescription('')
  }

  function handleClose() {
    seedForm()
    onClose()
  }

  function handleSubmit() {
    if (!name.trim()) {
      showToast('Takım adı zorunludur.', { severity: 'warning' })
      return
    }

    if (mode === 'create') {
      createTeam(
        { name: name.trim(), description: description.trim() || undefined },
        {
          onSuccess: (created) => {
            showToast('Takım oluşturuldu.', { severity: 'success' })
            setName('')
            setDescription('')
            onClose()
            if (created.id) {
              router.push(`${ROUTES.teams}/${created.id}` as Route)
            }
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
      return
    }

    if (!team?.id) return
    updateTeam(
      { id: team.id, data: { name: name.trim(), description: description.trim() || undefined } },
      {
        onSuccess: () => {
          showToast('Takım güncellendi.', { severity: 'success' })
          handleClose()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth onTransitionEnter={seedForm}>
      <DialogTitle>{mode === 'create' ? t('teams.createButton') : t('teams.editButton')}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Takım Adı *"
            value={name}
            onChange={(event) => setName(event.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Açıklama"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          İptal
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isPending ? <CircularProgress size={20} /> : mode === 'create' ? 'Oluştur' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
