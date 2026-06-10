import { Box, Typography } from '@mui/material'
import type { Metadata } from 'next'

import { getMessages } from '@/core/i18n/messages'
import { buildMetadata } from '@/core/seo/metadata'
import type { Locale } from '@/core/types/common'
import { CashierPaymentView } from '@/modules/tenant/ui/pos/cashier-payment-view'

export const metadata: Metadata = buildMetadata({ title: 'Sales' })

export default async function SalePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tableId?: string | string[] }>
}) {
  const { locale } = await params
  const { tableId } = await searchParams
  const m = getMessages(locale as Locale)
  const initialTableId = typeof tableId === 'string' ? tableId : undefined

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
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {m.nav.cashier}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {m.sale.cashier.pageSubtitle}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <CashierPaymentView initialTableId={initialTableId} />
      </Box>
    </Box>
  )
}
