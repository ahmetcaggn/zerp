'use client'
import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
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
  List,
  ListItem,
  ListItemText,
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
import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { permissionClient } from '../api/permission-client'
import {
  useActivateTeam,
  useAddTeamMember,
  useChangeTeamMemberRole,
  useDeactivateTeam,
  useRemoveTeamMember,
  useTeam,
  useTeamMemberCandidates,
} from '../hooks/use-teams'
import type { PermissionAssignmentInput, PermissionDraftAssignment } from '../types/permission'
import { prettifyPermissionEnumName, toPermissionKey } from '../types/permission'
import { type TeamMemberResponse, TeamMemberRole } from '../types/team'
import { PermissionAssignmentBuilder } from './permission-assignment-builder'
import { TeamFormDialog } from './team-form-dialog'
import { TeamMemberPermissionsDialog } from './team-member-permissions-dialog'

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
  const [debouncedCandidateSearch, setDebouncedCandidateSearch] = useState('')
  const [candidatePage, setCandidatePage] = useState(1)
  const [addMemberRole, setAddMemberRole] = useState<string>(TeamMemberRole.Member)
  const [showAddMember, setShowAddMember] = useState(false)
  const [draftPermissions, setDraftPermissions] = useState<PermissionDraftAssignment[]>([])
  const [permissionDialogMember, setPermissionDialogMember] = useState<
    TeamMemberResponse | undefined
  >(undefined)

  const existingDraftPermissionKeys = useMemo(() => {
    const keys = new Set<string>()
    for (const permission of draftPermissions) {
      keys.add(
        toPermissionKey({
          action: permission.action,
          targetType: permission.targetType,
          targetId: permission.targetId,
        }),
      )
    }
    return keys
  }, [draftPermissions])

  const { hasPermission, isLoadingPermissions } = useCurrentUserPermissions()
  const canReadTeam = hasPermission(PermissionActions.READ_TEAM)
  const {
    data: team,
    isLoading,
    error,
  } = useTeam(id, {
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

  useEffect(() => {
    const normalizedInput = candidateSearch.trim()
    const timer = window.setTimeout(
      () => {
        setDebouncedCandidateSearch(normalizedInput)
      },
      normalizedInput ? 1000 : 0,
    )

    return () => window.clearTimeout(timer)
  }, [candidateSearch])

  const normalizedCandidateSearch = debouncedCandidateSearch.trim()
  const isDebouncing =
    candidateSearch.trim().length > 0 && candidateSearch.trim() !== debouncedCandidateSearch
  const {
    data: candidateResult,
    isLoading: isLoadingCandidates,
    isFetching: isFetchingCandidates,
  } = useTeamMemberCandidates(
    id,
    {
      pagination: { page: candidatePage, perPage: CANDIDATE_PAGE_SIZE },
      sort: { field: 'username', order: 'ASC' },
      query: normalizedCandidateSearch || undefined,
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
        showToast(currentTeam.isActive ? 'Takım pasifleştirildi.' : 'Takım aktifleştirildi.', {
          severity: 'success',
        }),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleAddMember() {
    if (!effectiveSelectedCandidateId) {
      showToast('Lütfen listeden bir kullanıcı seçin.', { severity: 'warning' })
      return
    }

    const candidateId = effectiveSelectedCandidateId

    addMember(
      {
        id,
        body: {
          userId: candidateId,
          role: addMemberRole as 'LEADER' | 'MEMBER',
        },
      },
      {
        onSuccess: async () => {
          if (draftPermissions.length > 0) {
            try {
              await Promise.all(
                draftPermissions.map((permission) =>
                  permissionClient.create({
                    userId: candidateId,
                    action: permission.action,
                    targetType: permission.targetType,
                    targetId: permission.targetId,
                  }),
                ),
              )
            } catch {
              showToast(t('teams.permissionAssignPartialError'), { severity: 'warning' })
            }
          }

          setSelectedCandidateId('')
          setCandidateSearch('')
          setDebouncedCandidateSearch('')
          setCandidatePage(1)
          setDraftPermissions([])
          setShowAddMember(false)
          showToast('Üye eklendi.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function addDraftPermission(permission: PermissionAssignmentInput) {
    setDraftPermissions((prev) => [
      ...prev,
      {
        action: permission.action,
        targetType: permission.targetType,
        targetId: permission.targetId,
        targetTitle: permission.targetTitle,
      },
    ])
  }

  function removeDraftPermission(index: number) {
    setDraftPermissions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ color: 'text.secondary' }}
        >
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
                  setDebouncedCandidateSearch('')
                  setCandidatePage(1)
                  setDraftPermissions([])
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
                md: 'minmax(0,1fr) 190px auto',
              },
              alignItems: 'flex-start',
            }}
          >
            <TextField
              size="small"
              label="Kullanıcı Ara"
              value={candidateSearch}
              onChange={(event) => {
                setCandidateSearch(event.target.value)
                setSelectedCandidateId('')
                setCandidatePage(1)
              }}
              helperText="Ad soyad, username, email veya ID ile arayın. 1 saniye sonra sonuçlar listelenir."
              sx={{ minWidth: 0 }}
            />
            <FormControl size="small" sx={{ width: '100%' }}>
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
              sx={{ height: 40, minWidth: 96 }}
            >
              Ekle
            </Button>
          </Box>

          <Box sx={{ mt: 1.5 }}>
            {isDebouncing ? (
              <Typography variant="body2" color="text.secondary">
                Arama için bekleniyor...
              </Typography>
            ) : isLoadingCandidates || isFetchingCandidates ? (
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

          {!isDebouncing && candidateUsers.length > 0 && (
            <Box
              sx={{
                mt: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                maxHeight: 240,
                overflowY: 'auto',
              }}
            >
              {candidateUsers.map((candidate) => {
                const isSelected = effectiveSelectedCandidateId === candidate.id
                const candidateMetaSegments = [
                  candidate.username?.trim() ? `@${candidate.username.trim()}` : null,
                  candidate.email?.trim() || null,
                  candidate.id,
                ].filter((segment): segment is string => Boolean(segment))
                const candidateMeta = candidateMetaSegments.join(' · ')

                return (
                  <Box
                    key={candidate.id}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderBottom: '1px solid',
                      borderBottomColor: 'divider',
                      cursor: 'pointer',
                      bgcolor: isSelected ? 'action.selected' : 'transparent',
                      '&:last-of-type': {
                        borderBottom: 'none',
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Typography variant="body2">{candidate.displayName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {candidateMeta}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          )}

          {!isDebouncing && candidateTotal > 0 && (
            <TablePagination
              component="div"
              count={candidateTotal}
              page={Math.max(candidatePage - 1, 0)}
              rowsPerPage={CANDIDATE_PAGE_SIZE}
              rowsPerPageOptions={[CANDIDATE_PAGE_SIZE]}
              onPageChange={(_, nextPage) => setCandidatePage(nextPage + 1)}
              onRowsPerPageChange={() => {}}
            />
          )}

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <PermissionAssignmentBuilder
              disabled={isAddingMember}
              existingKeys={existingDraftPermissionKeys}
              onAdd={addDraftPermission}
            />

            {draftPermissions.length > 0 && (
              <List dense disablePadding>
                {draftPermissions.map((permission, index) => (
                  <ListItem
                    key={`${permission.action}-${permission.targetType}-${permission.targetId}-${index}`}
                    secondaryAction={
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeDraftPermission(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${prettifyPermissionEnumName(permission.action)} · ${prettifyPermissionEnumName(permission.targetType)}`}
                      secondary={`${permission.targetTitle} (${permission.targetId})`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      )}

      {canReadTeamMember ? (
        (team.members?.length ?? 0) > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Üye</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Katılım Tarihi</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTeam.members?.map((member, index) => {
                const memberPrimary = member.displayName ?? member.username ?? member.userId ?? '—'
                const normalizedPrimary = memberPrimary.trim().toLowerCase()
                const normalizedUsername = member.username?.trim().toLowerCase()
                const shouldShowUsername = Boolean(normalizedUsername) && normalizedUsername !== normalizedPrimary

                return (
                  <TableRow key={member.id ?? `${member.userId ?? 'member'}-${index}`} hover>
                    <TableCell>
                      <Typography variant="body2">{memberPrimary}</Typography>
                      {shouldShowUsername && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          @{member.username}
                        </Typography>
                      )}
                      {member.userId && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {member.userId}
                        </Typography>
                      )}
                      {member.email && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {member.email}
                        </Typography>
                      )}
                    </TableCell>
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
                      {canUpdateTeamMember && (
                        <Tooltip title={t('teams.permissionsDialogTitle')}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (!member.userId) return
                              setPermissionDialogMember(member)
                            }}
                          >
                            <AdminPanelSettingsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <Typography color="text.secondary">{t('teams.emptyState')}</Typography>
        )
      ) : (
        <Typography color="text.secondary">Üye listesini görüntüleme yetkiniz yok.</Typography>
      )}

      <TeamMemberPermissionsDialog
        open={Boolean(permissionDialogMember)}
        member={permissionDialogMember}
        onClose={() => setPermissionDialogMember(undefined)}
      />

      <TeamFormDialog
        open={editOpen}
        mode="edit"
        team={currentTeam}
        onClose={() => setEditOpen(false)}
      />
    </Box>
  )
}
