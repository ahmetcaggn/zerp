'use client'

import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{ p: { xs: 4, sm: 6 }, maxWidth: 440, width: '100%', textAlign: 'center', borderRadius: 2 }}
      >
        <Typography
          sx={{
            fontSize: { xs: '5.5rem', sm: '7rem' },
            fontWeight: 800,
            lineHeight: 1,
            color: 'error.main',
            letterSpacing: '-0.05em',
            mb: 1.5,
          }}
        >
          500
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75} mb={1.5}>
          <ErrorOutlineRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="h3">Something Went Wrong</Typography>
        </Stack>
        <Typography color="text.secondary" mb={4}>
          {error.message || 'An unexpected error occurred. Please try again.'}
        </Typography>
        <Button
          onClick={reset}
          variant="contained"
          size="large"
          fullWidth
          startIcon={<RefreshRoundedIcon />}
        >
          Try Again
        </Button>
      </Paper>
    </Box>
  )
}
