'use client'

import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { Button, Container, Stack, Typography } from '@mui/material'

import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Container maxWidth="sm" sx={responsivePageSx.centeredContainer}>
      <Stack spacing={responsiveLayout.sectionGap} textAlign="center">
        <Typography variant="h3">Unexpected Error</Typography>
        <Typography color="text.secondary">{error.message || 'Something went wrong.'}</Typography>
        <Button startIcon={<RefreshRoundedIcon />} onClick={reset} variant="contained">
          Try Again
        </Button>
      </Stack>
    </Container>
  )
}
