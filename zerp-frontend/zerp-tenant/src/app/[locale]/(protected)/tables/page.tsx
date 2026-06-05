import { Box, CircularProgress } from '@mui/material'
import type { Metadata } from 'next'
import { Suspense } from 'react'

import { buildMetadata } from '@/core/seo/metadata'
import { TablesContent } from '@/modules/tenant/ui/pos/tables-content'

export const metadata: Metadata = buildMetadata({ title: 'Masalar' })

export default function TablesPage() {
  return (
    <Box
      sx={{
        flex: 1,
        mx: { xs: -2, sm: -3, md: -4 },
        my: { xs: -3, sm: -4 },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Suspense
        fallback={
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <TablesContent />
      </Suspense>
    </Box>
  )
}
