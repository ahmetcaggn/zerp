'use client'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import PauseIcon from '@mui/icons-material/Pause'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useActivateTeam,
  useAddTeamMember,
  useChangeTeamMemberRole,
  useDeactivateTeam,
  useRemoveTeamMember,
  useTeam,
} from '../hooks/use-teams'
import { TeamMemberRole } from '../types/team'
import { TeamFormDialog } from './team-form-dialog'

interface Props {
  id: string
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}

export function TeamDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [addMemberUserId, setAddMemberUserId] = useState('')
  const [addMemberRole, setAddMemberRole] = useState<string>(TeamMemberRole.Member)
  const [showAddMember, setShowAddMember] = useState(false)

  const { data: team, isLoading, error } = useTeam(id)
  const { mutate: activateTeam, isPending: isActivating } = useActivateTeam()
  const { mutate: deactivateTeam, isPending: isDeactivating } = useDeactivateTeam()
  const { mutate: addMember, isPending: isAddingMember } = useAddTeamMember()
  const { mutate: removeMember } = useRemoveTeamMember()
  const { mutate: changeMemberRole } = useChangeTeamMemberRole()
  const trimmedAddMemberUserId = addMemberUserId.trim()
  const isAddMemberUserIdValid = trimmedAddMemberUserId
    ? isUuid(trimmedAddMemberUserId)
    : true

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

  if (!team) return null
  const currentTeam = team

  const isTogglePending = isActivating || isDeactivating

  function handleToggleActive() {
    const mutateFn = currentTeam.isActive ? deactivateTeam : activateTeam
    mutateFn(id, {
      onSuccess: () =>
        showToast(
          currentTeam.isActive ? 'Takım pasifleştirildi.' : 'Takım aktifleştirildi.',
          { severity: 'success' },
        ),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleAddMember() {
    if (!trimmedAddMemberUserId) return
    if (!isUuid(trimmedAddMemberUserId)) {
      showToast('Gecerli bir kullanici UUID degeri girin.', { severity: 'warning' })
      return
    }
    addMember(
      {
        id,
        body: {
          userId: trimmedAddMemberUserId,
          role: addMemberRole as 'LEADER' | 'MEMBER',
        },
      },
      {
        onSuccess: () => {
          setAddMemberUserId('')
          setShowAddMember(false)
          showToast('Üye eklendi.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
          Geri
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color={team.isActive ? 'warning' : 'success'}
            startIcon={team.isActive ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handleToggleActive}
            disabled={isTogglePending}
          >
            {team.isActive ? t('teams.deactivateButton') : t('teams.activateButton')}
          </Button>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            {t('teams.editButton')}
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 1 }}>
        {team.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip
          label={team.isActive ? t('teams.activeLabel') : t('teams.inactiveLabel')}
          color={team.isActive ? 'success' : 'default'}
          size="small"
        />
      </Box>
      {team.description && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">{team.description}</Typography>
        </Paper>
      )}

      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          {t('teams.membersLabel')} ({team.members?.length ?? 0})
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setShowAddMember((prev) => !prev)}>
          {t('teams.addMemberButton')}
        </Button>
      </Box>

      {showAddMember && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              size="small"
              label="Kullanıcı ID"
              value={addMemberUserId}
              onChange={(event) => setAddMemberUserId(event.target.value)}
              error={Boolean(trimmedAddMemberUserId) && !isAddMemberUserIdValid}
              helperText={
                Boolean(trimmedAddMemberUserId) && !isAddMemberUserIdValid
                  ? 'Gecerli bir UUID girin.'
                  : 'Sadece system tenant kullanicilari eklenebilir.'
              }
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={addMemberRole}
                label="Rol"
                onChange={(event) => setAddMemberRole(event.target.value)}
              >
                <MenuItem value={TeamMemberRole.Leader}>{t('teams.roleLeader')}</MenuItem>
                <MenuItem value={TeamMemberRole.Member}>{t('teams.roleMember')}</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddMember}
              disabled={
                isAddingMember || !trimmedAddMemberUserId || !isAddMemberUserIdValid
              }
            >
              Ekle
            </Button>
          </Box>
        </Paper>
      )}

      {(team.members?.length ?? 0) > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Kullanıcı ID</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Katılım Tarihi</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTeam.members?.map((member, index) => (
              <TableRow key={member.id ?? `${member.userId ?? 'member'}-${index}`} hover>
                <TableCell>{member.userId ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={member.role === 'LEADER' ? t('teams.roleLeader') : t('teams.roleMember')}
                    color={member.role === 'LEADER' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{member.joinedAt ?? '—'}</TableCell>
                <TableCell align="right">
                  <Tooltip
                    title={
                      member.role === 'LEADER'
                        ? `${t('teams.roleMember')} yap`
                        : `${t('teams.roleLeader')} yap`
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (!member.userId) return
                        const nextRole =
                          member.role === 'LEADER' ? ('MEMBER' as const) : ('LEADER' as const)
                        changeMemberRole(
                          { id, userId: member.userId, body: { role: nextRole } },
                          {
                            onSuccess: () => showToast('Rol güncellendi.', { severity: 'success' }),
                            onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
                          },
                        )
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('teams.removeMemberButton')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (!member.userId) return
                        removeMember(
                          { id, userId: member.userId },
                          {
                            onSuccess: () => showToast('Üye çıkarıldı.', { severity: 'success' }),
                            onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
                          },
                        )
                      }}
                    >
                      <PersonRemoveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography color="text.secondary">{t('teams.emptyState')}</Typography>
      )}

      <TeamFormDialog open={editOpen} mode="edit" team={currentTeam} onClose={() => setEditOpen(false)} />
    </Box>
  )
}
