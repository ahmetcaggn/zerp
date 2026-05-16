'use client'

import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Card, CardContent, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { useShopScope } from '@/core/providers/shop-scope-provider'

const MOCK_LOW_STOCK_PRODUCTS = [
  { id: 'p-1', name: 'Espresso Çekirdeği', remaining: 1.4, threshold: 3, unit: 'kg' },
  { id: 'p-2', name: 'Tam Yağlı Süt', remaining: 6, threshold: 12, unit: 'lt' },
  { id: 'p-3', name: 'Cheesecake Dilimi', remaining: 4, threshold: 10, unit: 'adet' },
]

const MOCK_METRICS = [
  { id: 'm-1', label: 'Bugünkü Ciro', value: '₺28.430' },
  { id: 'm-2', label: 'Ortalama Adisyon', value: '₺412' },
  { id: 'm-3', label: 'Aktif Masa', value: '14 / 20' },
  { id: 'm-4', label: 'İptal Oranı', value: '%2.1' },
]

export function ShopDashboard() {
  const { scope } = useShopScope()
  const shopName = scope.mode === 'SHOP' ? scope.shopName : 'Shop'

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {shopName} Paneli
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mağaza özel operasyon görünümü (şimdilik mock veriler).
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {MOCK_METRICS.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <WarningAmberRoundedIcon color="warning" />
          <Typography variant="h6" fontWeight={600}>
            Azalan Stoktaki Ürünler
          </Typography>
        </Box>

        <Stack spacing={1}>
          {MOCK_LOW_STOCK_PRODUCTS.map((product) => (
            <Box
              key={product.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                px: 1.5,
                py: 1,
              }}
            >
              <Typography fontWeight={500}>{product.name}</Typography>
              <Chip
                color="warning"
                variant="outlined"
                label={`${product.remaining} ${product.unit} / eşik ${product.threshold} ${product.unit}`}
                size="small"
              />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  )
}
