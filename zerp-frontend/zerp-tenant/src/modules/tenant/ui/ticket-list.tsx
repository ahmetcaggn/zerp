'use client'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SearchIcon from '@mui/icons-material/Search'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useTickets } from '../hooks/use-tickets'
import type { TicketPriorityString, TicketStatusString, TicketTypeString } from '../types/ticket'
import { TicketCreateDialog } from './ticket-create-dialog'

type SortField = 'title' | 'status' | 'priority' | 'type' | 'createdAt'

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

const STATUS_OPTIONS: TicketStatusString[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_CUSTOMER',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
]

const PRIORITY_OPTIONS: TicketPriorityString[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const TYPE_OPTIONS: TicketTypeString[] = ['BUG', 'FEATURE_REQUEST', 'QUESTION', 'INCIDENT']

export function TicketList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC')
  const [searchInput, setSearchInput] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const filter: Record<string, string> = {}
  if (searchQ) filter['q'] = searchQ
  if (statusFilter) filter['status.eq'] = statusFilter
  if (priorityFilter) filter['priority.eq'] = priorityFilter
  if (typeFilter) filter['type.eq'] = typeFilter

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: sortField, order: sortOrder },
    filter,
  }

  const { data, isLoading, error } = useTickets(params)

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSortField(field)
      setSortOrder('ASC')
    }
    setPage(0)
  }

  const handleSearch = useCallback(() => {
    setSearchQ(searchInput.trim())
    setPage(0)
  }, [searchInput])

  function clearFilters() {
    setSearchInput('')
    setSearchQ('')
    setStatusFilter('')
    setPriorityFilter('')
    setTypeFilter('')
    setPage(0)
  }

  const hasActiveFilters = searchQ || statusFilter || priorityFilter || typeFilter

  const sortDir = sortOrder === 'ASC' ? 'asc' : 'desc'

  return (
    <Box>
      {/* Başlık */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('tickets.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          {t('tickets.createButton')}
        </Button>
      </Box>

      {/* Filtre toolbar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Başlık veya açıklamada ara…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ width: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchInput ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchInput('')
                      setSearchQ('')
                      setPage(0)
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <Button variant="outlined" size="small" onClick={handleSearch}>
          Ara
        </Button>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={statusFilter}
            label="Durum"
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                <Chip
                  label={s}
                  color={STATUS_COLOR[s] ?? 'default'}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Öncelik</InputLabel>
          <Select
            value={priorityFilter}
            label="Öncelik"
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              setPage(0)
            }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {PRIORITY_OPTIONS.map((p) => (
              <MenuItem key={p} value={p}>
                <Chip
                  label={p}
                  color={PRIORITY_COLOR[p] ?? 'default'}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Tür</InputLabel>
          <Select
            value={typeFilter}
            label="Tür"
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setPage(0)
            }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {TYPE_OPTIONS.map((ty) => (
              <MenuItem key={ty} value={ty}>
                {ty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button size="small" color="inherit" onClick={clearFilters}>
            Filtreleri Temizle
          </Button>
        )}
      </Box>

      {/* Tablo */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('tickets.emptyState')}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'title'}
                  direction={sortField === 'title' ? sortDir : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Başlık
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'status'}
                  direction={sortField === 'status' ? sortDir : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Durum
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'priority'}
                  direction={sortField === 'priority' ? sortDir : 'asc'}
                  onClick={() => handleSort('priority')}
                >
                  Öncelik
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'type'}
                  direction={sortField === 'type' ? sortDir : 'asc'}
                  onClick={() => handleSort('type')}
                >
                  Tür
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortDir : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Oluşturulma
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((ticket) => (
              <TableRow
                key={ticket.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  if (ticket.id !== undefined)
                    router.push(`${ROUTES.tickets}/${ticket.id}` as Route)
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 320 }}>
                    {ticket.title ?? '—'}
                  </Typography>
                  {ticket.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ display: 'block', maxWidth: 320 }}
                    >
                      {ticket.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {ticket.status ? (
                    <Chip
                      label={ticket.status}
                      color={STATUS_COLOR[ticket.status as TicketStatusString] ?? 'default'}
                      size="small"
                    />
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  {ticket.priority ? (
                    <Chip
                      label={ticket.priority}
                      color={PRIORITY_COLOR[ticket.priority as TicketPriorityString] ?? 'default'}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{ticket.type ?? '—'}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString('tr-TR') : '—'}
                  </Typography>
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Detay">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (ticket.id !== undefined)
                          router.push(`${ROUTES.tickets}/${ticket.id}` as Route)
                      }}
                    >
                      <OpenInNewIcon fontSize="small" />
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
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value))
          setPage(0)
        }}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Sayfa başına:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} / ${count !== -1 ? count : `${to}+`}`
        }
      />

      <TicketCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  )
}
