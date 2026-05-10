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
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  useActivateTeam,
  useAddTeamMember,
  useChangeTeamMemberRole,
  useDeactivateTeam,
  useRemoveTeamMember,
  useTeam,
  useTeamMemberCandidates,
} from '../hooks/use-teams'
import { TeamMemberRole } from '../types/team'
import { TeamFormDialog } from './team-form-dialog'

interface Props {
  id: string
}

const CANDIDATE_PAGE_SIZE = 10

export function TeamDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [candidateSearch, setCandidateSearch] = useState('')
  const [candidatePage, setCandidatePage] = useState(1)
  const [addMemberRole, setAddMemberRole] = useState<string>(TeamMemberRole.Member)
  const [showAddMember, setShowAddMember] = useState(false)

  const { hasPermission, isLoadingPermissions } = useCurrentUserPermissions()
  const canReadTeam = hasPermission(PermissionActions.READ_TEAM)
  const { data: team, isLoading, error } = useTeam(id, {
    enabled: canReadTeam && !isLoadingPermissions,
  })
  const { mutate: activateTeam, isPending: isActivating } = useActivateTeam()
  const { mutate: deactivateTeam, isPending: isDeactivating } = useDeactivateTeam()
  const { mutate: addMember, isPending: isAddingMember } = useAddTeamMember()
  const { mutate: removeMember } = useRemoveTeamMember()
  const { mutate: changeMemberRole } = useChangeTeamMemberRole()
  const canUpdateTeam = hasPermission(PermissionActions.UPDATE_TEAM)
  const canReadTeamMember = hasPermission(PermissionActions.READ_TEAM_MEMBER)
  const canCreateTeamMember = hasPermission(PermissionActions.CREATE_TEAM_MEMBER)
  const canUpdateTeamMember = hasPermission(PermissionActions.UPDATE_TEAM_MEMBER)
  const canDeleteTeamMember = hasPermission(PermissionActions.DELETE_TEAM_MEMBER)
  const canReadUser = hasPermission(PermissionActions.READ_USER)
  const canCreateTeamMemberWithUserList = canCreateTeamMember && canReadUser

  const normalizedCandidateSearch = candidateSearch.trim()
  const {
    data: candidateResult,
    isLoading: isLoadingCandidates,
    isFetching: isFetchingCandidates,
  } = useTeamMemberCandidates(
    id,
    {
      pagination: { page: candidatePage, perPage: CANDIDATE_PAGE_SIZE },
      sort: { field: 'username', order: 'ASC' },
      username: normalizedCandidateSearch || undefined,
    },
    {
      enabled: canCreateTeamMemberWithUserList && showAddMember,
    },
  )

  const candidateUsers = candidateResult?.data ?? []
  const candidateTotal = candidateResult?.total ?? 0
  const effectiveSelectedCandidateId = candidateUsers.some(
    (candidate) => candidate.id === selectedCandidateId,
  )
    ? selectedCandidateId
    : ''

  if (isLoadingPermissions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!canReadTeam) {
    return <Typography color="text.secondary">Takım detayını görüntüleme yetkiniz yok.</Typography>
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
    if (!effectiveSelectedCandidateId) {
      showToast('Lütfen listeden bir kullanıcı seçin.', { severity: 'warning' })
      return
    }

    addMember(
      {
        id,
        body: {
          userId: effectiveSelectedCandidateId,
          role: addMemberRole as 'LEADER' | 'MEMBER',
        },
      },
      {
        onSuccess: () => {
          setSelectedCandidateId('')
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
          {canUpdateTeam && (
            <>
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
            </>
          )}
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 1 }}>
        {team.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {team.type && <Chip label={team.type} size="small" variant="outlined" />}
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
          {t('teams.membersLabel')} ({canReadTeamMember ? (team.members?.length ?? 0) : '—'})
        </Typography>
        {canCreateTeamMemberWithUserList && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setShowAddMember((prev) => {
                const next = !prev
                if (!next) {
                  setSelectedCandidateId('')
                  setCandidateSearch('')
                  setCandidatePage(1)
                }
                return next
              })
            }}
          >
            {t('teams.addMemberButton')}
          </Button>
        )}
      </Box>

      {canCreateTeamMember && !canReadUser && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Üye ekleme listesini kullanmak için READ_USER yetkisi gerekli.
        </Typography>
      )}

      {canCreateTeamMemberWithUserList && showAddMember && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                md: '1.2fr 1.2fr 160px auto',
              },
              alignItems: 'flex-end',
            }}
          >
            <TextField
              size="small"
              label="Kullanıcı Ara (username)"
              value={candidateSearch}
              onChange={(event) => {
                setCandidateSearch(event.target.value)
                setCandidatePage(1)
              }}
              helperText="Sadece system tenant kullanıcıları listelenir."
            />
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>Kullanıcı</InputLabel>
              <Select
                value={effectiveSelectedCandidateId}
                label="Kullanıcı"
                onChange={(event) => setSelectedCandidateId(event.target.value)}
                disabled={isLoadingCandidates}
              >
                {candidateUsers.map((candidate) => (
                  <MenuItem key={candidate.id} value={candidate.id}>
                    {candidate.username} ({candidate.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              disabled={isAddingMember || !effectiveSelectedCandidateId}
            >
              Ekle
            </Button>
          </Box>

          <Box sx={{ mt: 1 }}>
            {isLoadingCandidates || isFetchingCandidates ? (
              <Typography variant="body2" color="text.secondary">
                Kullanıcılar yükleniyor...
              </Typography>
            ) : candidateTotal === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Uygun kullanıcı bulunamadı.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Toplam {candidateTotal} kullanıcı
              </Typography>
            )}
          </Box>

          <TablePagination
            component="div"
            count={candidateTotal}
            page={Math.max(candidatePage - 1, 0)}
            rowsPerPage={CANDIDATE_PAGE_SIZE}
            rowsPerPageOptions={[CANDIDATE_PAGE_SIZE]}
            onPageChange={(_, nextPage) => setCandidatePage(nextPage + 1)}
            onRowsPerPageChange={() => {}}
          />
        </Paper>
      )}

      {canReadTeamMember ? (
        (team.members?.length ?? 0) > 0 ? (
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
                  {canUpdateTeamMember && (
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
                  )}
                  {canDeleteTeamMember && (
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
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
          <Typography color="text.secondary">{t('teams.emptyState')}</Typography>
        )
      ) : (
        <Typography color="text.secondary">Üye listesini görüntüleme yetkiniz yok.</Typography>
      )}

      <TeamFormDialog open={editOpen} mode="edit" team={currentTeam} onClose={() => setEditOpen(false)} />
    </Box>
  )
}
