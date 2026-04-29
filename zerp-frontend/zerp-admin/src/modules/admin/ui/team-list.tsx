'use client'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useActivateTeam, useDeactivateTeam, useDeleteTeam, useTeams } from '../hooks/use-teams'
import { TeamFormDialog } from './team-form-dialog'

export function TeamList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'id', order: 'ASC' as const },
  }

  const { data, isLoading, error } = useTeams(params)
  const { mutate: deleteTeam } = useDeleteTeam()
  const { mutate: activateTeam } = useActivateTeam()
  const { mutate: deactivateTeam } = useDeactivateTeam()

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('teams.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          {t('teams.createButton')}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('teams.emptyState')}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ad</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Üye Sayısı</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((team, index) => (
              <TableRow key={team.id ?? `team-${index}`} hover>
                <TableCell>{team.name ?? '—'}</TableCell>
                <TableCell>{team.description ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={team.isActive ? t('teams.activeLabel') : t('teams.inactiveLabel')}
                    color={team.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{team.members?.length ?? 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title={t('teams.editButton')}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (team.id) router.push(`${ROUTES.teams}/${team.id}` as Route)
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={team.isActive ? t('teams.deactivateButton') : t('teams.activateButton')}>
                    <IconButton
                      size="small"
                      color={team.isActive ? 'warning' : 'success'}
                      onClick={() => {
                        if (!team.id) return
                        const mutateFn = team.isActive ? deactivateTeam : activateTeam
                        mutateFn(team.id, {
                          onSuccess: () =>
                            showToast(
                              team.isActive ? 'Takım pasifleştirildi.' : 'Takım aktifleştirildi.',
                              { severity: 'success' },
                            ),
                          onError: (err) =>
                            showToast(getUserFriendlyError(err), { severity: 'error' }),
                        })
                      }}
                    >
                      {team.isActive ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('teams.deleteButton')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (!team.id) return
                        deleteTeam(team.id, {
                          onSuccess: () => showToast('Takım silindi.', { severity: 'success' }),
                          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
                        })
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value))
          setPage(0)
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />

      <TeamFormDialog open={formOpen} mode="create" onClose={() => setFormOpen(false)} />
    </Box>
  )
}
