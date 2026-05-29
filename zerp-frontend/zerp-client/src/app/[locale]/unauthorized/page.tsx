import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

export default async function UnauthorizedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

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
            color: 'warning.main',
            letterSpacing: '-0.05em',
            mb: 1.5,
          }}
        >
          403
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75} mb={1.5}>
          <LockRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="h3">Access Denied</Typography>
        </Stack>
        <Typography color="text.secondary" mb={4}>
          You don&apos;t have permission to view this page.
        </Typography>
        <Button href={`/${locale}`} variant="contained" size="large" fullWidth>
          Return Home
        </Button>
      </Paper>
    </Box>
  )
}
