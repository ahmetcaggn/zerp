'use client'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import {
  useSendBulkNotification,
  useSendBulkNotificationHtml,
} from '../hooks/use-notifications'

export function NotificationSendForm() {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [recipients, setRecipients] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [htmlBody, setHtmlBody] = useState('')
  const [htmlMode, setHtmlMode] = useState(false)

  const { mutate: sendBulk, isPending: isSendingBulk } = useSendBulkNotification()
  const { mutate: sendBulkHtml, isPending: isSendingHtml } = useSendBulkNotificationHtml()
  const isPending = isSendingBulk || isSendingHtml

  function addRecipient(value: string) {
    const trimmed = value.trim().toLowerCase()
    if (trimmed && !recipients.includes(trimmed)) {
      setRecipients((prev) => [...prev, trimmed])
    }
    setInputValue('')
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault()
      addRecipient(inputValue)
    }
  }

  function resetForm() {
    setRecipients([])
    setSubject('')
    setBody('')
    setHtmlBody('')
    setHtmlMode(false)
    setInputValue('')
  }

  function handleSubmit() {
    if (recipients.length === 0) {
      showToast('En az bir alıcı ekleyin.', { severity: 'warning' })
      return
    }
    if (!subject.trim()) {
      showToast('Konu zorunludur.', { severity: 'warning' })
      return
    }
    if (!body.trim()) {
      showToast('Mesaj zorunludur.', { severity: 'warning' })
      return
    }

    const callbacks = {
      onSuccess: () => {
        showToast(t('notifications.sentSuccess'), { severity: 'success' })
        resetForm()
      },
      onError: (err: unknown) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    }

    if (htmlMode) {
      sendBulkHtml(
        { toList: recipients, subject: subject.trim(), plainTextBody: body.trim(), htmlBody: htmlBody.trim() || undefined },
        callbacks,
      )
    } else {
      sendBulk(
        { toList: recipients, subject: subject.trim(), body: body.trim() },
        callbacks,
      )
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('notifications.title')}
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 680 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Alıcılar */}
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={recipients}
            inputValue={inputValue}
            onInputChange={(_, val) => setInputValue(val)}
            onChange={(_, val) => setRecipients(val as string[])}
            onKeyDown={handleInputKeyDown}
            onBlur={() => {
              if (inputValue.trim()) addRecipient(inputValue)
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('notifications.recipientsLabel')}
                placeholder={recipients.length === 0 ? t('notifications.recipientPlaceholder') : undefined}
                size="small"
              />
            )}
          />

          {/* Konu */}
          <TextField
            label={t('notifications.subjectLabel')}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            size="small"
            fullWidth
          />

          {/* Mesaj */}
          <TextField
            label={t('notifications.bodyLabel')}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={4}
          />

          {/* HTML Modu Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={htmlMode}
                onChange={(e) => setHtmlMode(e.target.checked)}
                size="small"
              />
            }
            label={t('notifications.htmlModeLabel')}
          />

          {/* HTML Gövde (yalnızca HTML modunda) */}
          {htmlMode && (
            <TextField
              label={t('notifications.htmlBodyLabel')}
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={4}
              placeholder="<p>HTML içerik buraya...</p>"
            />
          )}

          {/* Gönder */}
          <Box>
            <Button
              variant="contained"
              startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              onClick={handleSubmit}
              disabled={isPending}
            >
              {t('notifications.sendButton')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
