import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { notFound } from 'next/navigation'

import { appConfig } from '@/core/config/app-config'
import { isLocale } from '@/core/constants/locales'
import { getMessages } from '@/core/i18n/messages'
import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const messages = getMessages(locale)

  return (
    <Container maxWidth="lg" sx={responsivePageSx.homeContainer}>
      <Stack gap={responsiveLayout.sectionGap}>
        <Box>
          <Typography variant="h1">{messages.home.title}</Typography>
          <Typography color="text.secondary" mt={1}>
            {messages.home.description}
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 1.5, sm: 2 }}>
          <Button href={`/${locale}/dashboard`} variant="contained" fullWidth>
            {messages.home.cta}
          </Button>
          <Button href={`/${locale}/login`} variant="outlined" fullWidth>
            {messages.nav.login}
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
