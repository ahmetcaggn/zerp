'use client'
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
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import PauseIcon from '@mui/icons-material/Pause'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
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

  const isTogglePending = isActivating || isDeactivating

  function handleToggleActive() {
    const fn = team!.isActive ? deactivateTeam : activateTeam
    fn(id, {
      onSuccess: () =>
        showToast(
          team!.isActive ? 'Takım pasifleştirildi.' : 'Takım aktifleştirildi.',
          { severity: 'success' },
        ),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleAddMember() {
    if (!addMemberUserId.trim()) return
    addMember(
      { id, body: { userId: addMemberUserId.trim(), role: addMemberRole as 'LEADER' | 'MEMBER' } },
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
      {/* Üst bar */}
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

      {/* Takım bilgileri */}
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

      {/* Üyeler */}
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          {t('teams.membersLabel')} ({team.members?.length ?? 0})
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setShowAddMember((v) => !v)}
        >
          {t('teams.addMemberButton')}
        </Button>
      </Box>

      {/* Üye ekleme formu */}
      {showAddMember && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              size="small"
              label="Kullanıcı ID"
              value={addMemberUserId}
              onChange={(e) => setAddMemberUserId(e.target.value)}
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={addMemberRole}
                label="Rol"
                onChange={(e) => setAddMemberRole(e.target.value)}
              >
                <MenuItem value={TeamMemberRole.Leader}>{t('teams.roleLeader')}</MenuItem>
                <MenuItem value={TeamMemberRole.Member}>{t('teams.roleMember')}</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddMember}
              disabled={isAddingMember || !addMemberUserId.trim()}
            >
              Ekle
            </Button>
          </Box>
        </Paper>
      )}

      {/* Üye tablosu */}
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
            {team.members?.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>{member.userId ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      member.role === 'LEADER' ? t('teams.roleLeader') : t('teams.roleMember')
                    }
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
                        const newRole =
                          member.role === 'LEADER'
                            ? ('MEMBER' as const)
                            : ('LEADER' as const)
                        changeMemberRole(
                          { id, userId: member.userId, body: { role: newRole } },
                          {
                            onSuccess: () =>
                              showToast('Rol güncellendi.', { severity: 'success' }),
                            onError: (err) =>
                              showToast(getUserFriendlyError(err), { severity: 'error' }),
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
                            onSuccess: () =>
                              showToast('Üye çıkarıldı.', { severity: 'success' }),
                            onError: (err) =>
                              showToast(getUserFriendlyError(err), { severity: 'error' }),
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

      <TeamFormDialog
        open={editOpen}
        mode="edit"
        team={team}
        onClose={() => setEditOpen(false)}
      />
    </Box>
  )
}
