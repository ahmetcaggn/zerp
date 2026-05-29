import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

export default function LocaleNotFound() {
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
            color: 'primary.main',
            letterSpacing: '-0.05em',
            mb: 1.5,
          }}
        >
          404
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75} mb={1.5}>
          <SearchOffRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="h3">Page Not Found</Typography>
        </Stack>
        <Typography color="text.secondary" mb={4}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button href="/" variant="contained" size="large" fullWidth>
          Go Home
        </Button>
      </Paper>
    </Box>
  )
}
