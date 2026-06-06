'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useCreateAnnouncement } from '../hooks/use-announcements'
import { useEmployees } from '../hooks/use-employees'
import type { AnnouncementRecipientMode } from '../types/announcement'
import type { EmployeeListResponseDto } from '../types/employee'

export function AnnouncementCreatePage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [recipientMode, setRecipientMode] = useState<AnnouncementRecipientMode>('all')
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeListResponseDto[]>([])

  const { mutate: createAnnouncement, isPending } = useCreateAnnouncement()
  const employeeOptionsResult = useEmployees(
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'firstName', order: 'ASC' },
    },
    { enabled: recipientMode === 'employees' },
  )
  const employeeOptions = employeeOptionsResult.data?.data ?? []

  function handleSubmit() {
    if (!title.trim()) {
      showToast(t('announcements.titleRequiredWarning'), { severity: 'warning' })
      return
    }
    if (!content.trim()) {
      showToast(t('announcements.contentRequiredWarning'), { severity: 'warning' })
      return
    }
    if (recipientMode === 'employees' && selectedEmployees.length === 0) {
      showToast(t('announcements.recipientsRequiredWarning'), { severity: 'warning' })
      return
    }

    createAnnouncement(
      {
        title: title.trim(),
        content: content.trim(),
        recipientMode,
        ...(recipientMode === 'employees'
          ? {
              employeeIds: selectedEmployees
                .map((employee) => String(employee.id))
                .filter(Boolean),
            }
          : {}),
      },
      {
        onSuccess: () => {
          showToast(t('announcements.createdSuccess'), { severity: 'success' })
          router.push(withLocale(locale, ROUTES.announcements) as Route)
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(withLocale(locale, ROUTES.announcements) as Route)}
        sx={{ mb: 2 }}
      >
        {t('common.back')}
      </Button>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('announcements.createTitle')}
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 760, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label={t('announcements.subjectLabel')}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label={t('announcements.contentLabel')}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={6}
          />

          <FormControl>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('announcements.recipientModeLabel')}
            </Typography>
            <RadioGroup
              value={recipientMode}
              onChange={(event) => {
                const nextMode = event.target.value as AnnouncementRecipientMode
                setRecipientMode(nextMode)
                if (nextMode === 'all') {
                  setSelectedEmployees([])
                }
              }}
            >
              <FormControlLabel value="all" control={<Radio />} label={t('announcements.allEmployeesLabel')} />
              <FormControlLabel value="employees" control={<Radio />} label={t('announcements.selectedEmployeesLabel')} />
            </RadioGroup>
          </FormControl>

          {recipientMode === 'employees' && (
            <Autocomplete
              multiple
              disableCloseOnSelect
              limitTags={2}
              options={employeeOptions}
              value={selectedEmployees}
              onChange={(_, value) => setSelectedEmployees(value)}
              loading={employeeOptionsResult.isLoading}
              isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
              getOptionLabel={(option) => formatEmployeeOption(option)}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props
                return (
                  <Box component="li" key={key} {...optionProps}>
                    <Checkbox checked={selected} sx={{ mr: 1 }} />
                    {formatEmployeeOption(option)}
                  </Box>
                )
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={formatEmployeeOption(option)}
                    size="small"
                    {...getTagProps({ index })}
                    key={String(option.id)}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('announcements.employeeSearchLabel')}
                  placeholder={t('announcements.employeeSearchPlaceholder')}
                  size="small"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {employeeOptionsResult.isLoading ? <CircularProgress color="inherit" size={16} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />
          )}

          <Box>
            <Button
              variant="contained"
              startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              onClick={handleSubmit}
              disabled={isPending}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {t('announcements.sendButton')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

function formatEmployeeOption(employee: EmployeeListResponseDto) {
  const name = [employee.firstName, employee.lastName].filter(Boolean).join(' ')
  return `${name || '-'} (${employee.email ?? '-'})`
}
