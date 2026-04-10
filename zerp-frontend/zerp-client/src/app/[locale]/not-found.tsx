import { Button, Container, Stack, Typography } from '@mui/material'

import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default function LocaleNotFound() {
  return (
    <Container maxWidth="sm" sx={responsivePageSx.centeredContainer}>
      <Stack spacing={responsiveLayout.sectionGap} textAlign="center">
        <Typography variant="h2">404</Typography>
        <Typography color="text.secondary">Requested page could not be found.</Typography>
        <Button href="/" variant="contained">
          Go Home
        </Button>
      </Stack>
    </Container>
  )
}
