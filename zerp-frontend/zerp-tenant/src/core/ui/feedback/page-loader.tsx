import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight="40vh" spacing={2}>
      <CircularProgress />
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Stack>
  )
}
