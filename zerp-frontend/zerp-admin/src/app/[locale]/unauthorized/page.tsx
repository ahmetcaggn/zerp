import { Button, Container, Stack, Typography } from '@mui/material'

import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default function UnauthorizedPage({ params }: { params: { locale: string } }) {
  return (
    <Container maxWidth="sm" sx={responsivePageSx.centeredContainer}>
      <Stack spacing={responsiveLayout.sectionGap} textAlign="center">
        <Typography variant="h3">Unauthorized</Typography>
        <Typography color="text.secondary">
          You do not have permission to view this page.
        </Typography>
        <Button href={`/${params.locale}`} variant="contained">
          Return Home
        </Button>
      </Stack>
    </Container>
  )
}
