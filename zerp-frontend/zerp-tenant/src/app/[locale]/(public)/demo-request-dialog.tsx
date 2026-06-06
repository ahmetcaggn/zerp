'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import type { FormEvent } from 'react'
import { useState } from 'react'

type DemoRequestTexts = {
  title: string
  description: string
  fullNameLabel: string
  emailLabel: string
  companyNameLabel: string
  serviceAreaLabel: string
  noteLabel: string
  cancel: string
  submit: string
  subject: string
  bodyIntro: string
  fullNameBodyLabel: string
  emailBodyLabel: string
  companyNameBodyLabel: string
  serviceAreaBodyLabel: string
  noteBodyLabel: string
}

type DemoRequestForm = {
  fullName: string
  email: string
  companyName: string
  serviceArea: string
  note: string
}

const initialForm: DemoRequestForm = {
  companyName: '',
  email: '',
  fullName: '',
  note: '',
  serviceArea: '',
}

function buildGmailComposeUrl(
  recipientEmail: string,
  texts: DemoRequestTexts,
  form: DemoRequestForm,
) {
  const body = [
    texts.bodyIntro,
    '',
    `${texts.fullNameBodyLabel}: ${form.fullName.trim()}`,
    `${texts.emailBodyLabel}: ${form.email.trim()}`,
    `${texts.companyNameBodyLabel}: ${form.companyName.trim()}`,
    `${texts.serviceAreaBodyLabel}: ${form.serviceArea.trim()}`,
    form.note.trim() ? `${texts.noteBodyLabel}: ${form.note.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const params = new URLSearchParams({
    body,
    fs: '1',
    su: texts.subject,
    to: recipientEmail,
    view: 'cm',
  })

  return `https://mail.google.com/mail/?${params.toString()}`
}

export function DemoRequestDialog({
  recipientEmail,
  texts,
  triggerLabel,
}: {
  recipientEmail: string
  texts: DemoRequestTexts
  triggerLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<DemoRequestForm>(initialForm)

  function updateField(field: keyof DemoRequestForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleClose() {
    setOpen(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    window.open(buildGmailComposeUrl(recipientEmail, texts, form), '_blank', 'noopener,noreferrer')
    setOpen(false)
    setForm(initialForm)
  }

  return (
    <>
      <Button
        type="button"
        size="large"
        variant="contained"
        endIcon={<ArrowForwardRoundedIcon />}
        onClick={() => setOpen(true)}
        sx={{
          minHeight: 52,
          borderRadius: 2,
          px: 3.5,
          fontWeight: 800,
          fontSize: '1rem',
        }}
      >
        {triggerLabel}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{texts.title}</DialogTitle>
        <DialogContent>
          <Stack
            component="form"
            id="demo-request-form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{ pt: 1 }}
          >
            <TextField
              required
              fullWidth
              label={texts.fullNameLabel}
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
            />
            <TextField
              required
              fullWidth
              type="email"
              label={texts.emailLabel}
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            <TextField
              required
              fullWidth
              label={texts.companyNameLabel}
              value={form.companyName}
              onChange={(event) => updateField('companyName', event.target.value)}
            />
            <TextField
              required
              fullWidth
              label={texts.serviceAreaLabel}
              value={form.serviceArea}
              onChange={(event) => updateField('serviceArea', event.target.value)}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label={texts.noteLabel}
              value={form.note}
              onChange={(event) => updateField('note', event.target.value)}
              helperText={texts.description}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{texts.cancel}</Button>
          <Button type="submit" form="demo-request-form" variant="contained">
            {texts.submit}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
