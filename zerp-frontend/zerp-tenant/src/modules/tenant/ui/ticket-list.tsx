'use client'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
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

const TYPE_OPTIONS: TicketTypeString[] = ['SERVICE_LEVEL', 'QUESTION']

export function TicketList() {
  const { t, locale } = useI18n()
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

  const dateLocale = locale === 'tr' ? 'tr-TR' : 'en-US'

  return (
    <Box>
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

      {/* Filter toolbar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={t('tickets.listSearchPlaceholder')}
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
          {t('tickets.searchButton')}
        </Button>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>{t('tickets.statusLabel')}</InputLabel>
          <Select
            value={statusFilter}
            label={t('tickets.statusLabel')}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
          >
            <MenuItem value="">{t('common.all')}</MenuItem>
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
          <InputLabel>{t('tickets.priorityLabel')}</InputLabel>
          <Select
            value={priorityFilter}
            label={t('tickets.priorityLabel')}
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              setPage(0)
            }}
          >
            <MenuItem value="">{t('common.all')}</MenuItem>
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
          <InputLabel>{t('tickets.typeLabel')}</InputLabel>
          <Select
            value={typeFilter}
            label={t('tickets.typeLabel')}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setPage(0)
            }}
          >
            <MenuItem value="">{t('common.all')}</MenuItem>
            {TYPE_OPTIONS.map((ty) => (
              <MenuItem key={ty} value={ty}>
                {ty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button size="small" color="inherit" onClick={clearFilters}>
            {t('tickets.clearFiltersButton')}
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('tickets.emptyState')}
        </Typography>
      ) : (
          <>
            {/* Desktop Table View */}
            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'title'}
                        direction={sortField === 'title' ? sortDir : 'asc'}
                        onClick={() => handleSort('title')}
                      >
                        {t('tickets.titleColumnHeader')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'status'}
                        direction={sortField === 'status' ? sortDir : 'asc'}
                        onClick={() => handleSort('status')}
                      >
                        {t('tickets.statusLabel')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'priority'}
                        direction={sortField === 'priority' ? sortDir : 'asc'}
                        onClick={() => handleSort('priority')}
                      >
                        {t('tickets.priorityLabel')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'type'}
                        direction={sortField === 'type' ? sortDir : 'asc'}
                        onClick={() => handleSort('type')}
                      >
                        {t('tickets.typeLabel')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'createdAt'}
                        direction={sortField === 'createdAt' ? sortDir : 'asc'}
                        onClick={() => handleSort('createdAt')}
                      >
                        {t('tickets.createdAtColumnHeader')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">{t('common.actions')}</TableCell>
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
                          router.push(withLocale(locale, `${ROUTES.tickets}/${ticket.id}`) as Route)
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
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleString(dateLocale)
                            : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <Tooltip title={t('tickets.detailTooltip')}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (ticket.id !== undefined)
                                router.push(withLocale(locale, `${ROUTES.tickets}/${ticket.id}`) as Route)
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
            </TableContainer>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
              {rows.map((ticket) => (
                <Card
                  key={ticket.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: 'divider',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      borderColor: 'primary.light',
                    },
                  }}
                >
                  <Box
                    onClick={() => {
                      if (ticket.id !== undefined)
                        router.push(withLocale(locale, `${ROUTES.tickets}/${ticket.id}`) as Route)
                    }}
                    sx={{ p: 2, cursor: 'pointer' }}
                  >
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          color="text.primary"
                          sx={{ lineHeight: 1.3, overflowWrap: 'anywhere' }}
                        >
                          {ticket.title ?? '—'}
                        </Typography>
                        {ticket.status && (
                          <Chip
                            label={ticket.status}
                            color={STATUS_COLOR[ticket.status as TicketStatusString] ?? 'default'}
                            size="small"
                          />
                        )}
                      </Box>

                      {ticket.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {ticket.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1.5,
                          pt: 1.5,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {ticket.type && (
                            <Chip
                              label={ticket.type}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {ticket.priority && (
                            <Chip
                              label={ticket.priority}
                              color={PRIORITY_COLOR[ticket.priority as TicketPriorityString] ?? 'default'}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }} onClick={(e) => e.stopPropagation()}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            {ticket.createdAt
                              ? new Date(ticket.createdAt).toLocaleString(dateLocale)
                              : '—'}
                          </Typography>
                          <Tooltip title={t('tickets.detailTooltip')}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (ticket.id !== undefined)
                                  router.push(withLocale(locale, `${ROUTES.tickets}/${ticket.id}`) as Route)
                              }}
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Card>
              ))}
            </Box>
          </>
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
        labelRowsPerPage={t('tickets.rowsPerPageLabel')}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} / ${count !== -1 ? count : `${to}+`}`
        }
      />

      <TicketCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  )
}
