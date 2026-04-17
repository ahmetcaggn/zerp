import { Box, CircularProgress } from '@mui/material'

export default function LocaleLoadingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={40} thickness={3} />
    </Box>
  )
}
