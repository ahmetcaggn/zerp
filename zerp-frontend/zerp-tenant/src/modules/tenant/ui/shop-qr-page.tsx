'use client'

import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import QRCode from 'react-qr-code'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'

export function ShopQrPage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const { scope, shops } = useShopScope()
  const { hasShopPermission } = useCurrentUserPermissions()

  const isShopScope = scope.mode === 'SHOP'
  const shopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const shopName = scope.mode === 'SHOP' ? scope.shopName : ''

  const selectedShop = useMemo(() => shops.find((shop) => shop.id === shopId), [shopId, shops])
  const canReadShop = Boolean(shopId && hasShopPermission(PermissionActions.READ_SHOP, shopId))

  const targetUrl = useMemo(() => {
    if (!shopId) return ''
    const shopLocale = selectedShop?.defaultMenuLanguage?.toLowerCase() ?? locale
    return `https://client.zeerp.tech/${shopLocale}/restaurants/${shopId}`
  }, [shopId, selectedShop, locale])

  const handleCopyLink = async () => {
    if (!targetUrl) return
    try {
      await navigator.clipboard.writeText(targetUrl)
      showToast(t('shopQr.copySuccessToast'), { severity: 'success' })
    } catch {
      showToast('Error copying link', { severity: 'error' })
    }
  }

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('shop-qr-code-svg')
    if (!svgElement) return

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)

      const downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = `${shopName.replace(/\s+/g, '-').toLowerCase()}-qr.svg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(svgUrl)
    } catch {
      showToast('Error downloading QR code', { severity: 'error' })
    }
  }

  const handlePrint = () => {
    const svgElement = document.getElementById('shop-qr-code-svg')
    if (!svgElement) return

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${shopName} - QR Code</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: system-ui, -apple-system, sans-serif;
                background: #ffffff;
              }
              .print-container {
                text-align: center;
                border: 2px dashed #cbd5e1;
                border-radius: 24px;
                padding: 48px;
                max-width: 380px;
                background: #ffffff;
              }
              .shop-name {
                font-size: 28px;
                font-weight: 800;
                margin-bottom: 8px;
                color: #0f172a;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .shop-subtitle {
                font-size: 15px;
                color: #64748b;
                margin-bottom: 32px;
                font-weight: 500;
              }
              .qr-wrapper {
                background: #ffffff;
                padding: 32px;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                display: inline-block;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              }
              .footer-text {
                margin-top: 32px;
                font-size: 14px;
                color: #475569;
                font-weight: 600;
              }
              .brand {
                margin-top: 12px;
                font-size: 11px;
                color: #94a3b8;
                font-weight: 400;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <div class="shop-name">${shopName}</div>
              <div class="shop-subtitle">${t('shopQr.digitalMenuTitle')}</div>
              <div class="qr-wrapper">
                ${svgElement.outerHTML}
              </div>
              <div class="footer-text">${t('shopQr.scanToViewMenu')}</div>
              <div class="brand">${t('shopQr.poweredBy')}</div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  if (!isShopScope) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.75 }}>
            {t('shopQr.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('shopQr.subtitle')}
          </Typography>
        </Box>
        <Alert severity="warning" variant="outlined" sx={{ borderRadius: 3 }}>
          {t('sale.catalog.selectShopWarning')}
        </Alert>
      </Box>
    )
  }

  if (!canReadShop) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.75 }}>
            {t('shopQr.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('shopQr.subtitle')}
          </Typography>
        </Box>
        <Alert severity="warning" variant="outlined" sx={{ borderRadius: 3 }}>
          {t('common.unauthorized')}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.75 }}>
          {t('shopQr.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('shopQr.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: QR Code Display Card */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              borderWidth: '1px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flexGrow: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                {shopName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                ZERP DIGITAL MENU QR
              </Typography>

              {/* QR Container */}
              <Box
                sx={{
                  p: 4,
                  bgcolor: 'common.white',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <QRCode
                  id="shop-qr-code-svg"
                  value={targetUrl}
                  size={200}
                  level="L"
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                />
              </Box>

              <Stack direction="row" spacing={2} sx={{ width: '100%', mt: 'auto' }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<PrintRoundedIcon />}
                  onClick={handlePrint}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.25,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    },
                  }}
                >
                  {t('shopQr.printButton')}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  startIcon={<DownloadRoundedIcon />}
                  onClick={handleDownloadSvg}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.25,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'text.primary',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {t('shopQr.downloadButton')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Instructions and Details */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={4} sx={{ height: '100%', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ borderRadius: 4, p: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                      {t('shopQr.targetUrlLabel')}
                    </Typography>
                    <TextField
                      fullWidth
                      value={targetUrl}
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Stack direction="row" spacing={1}>
                              <Tooltip title={t('common.copy')}>
                                <IconButton onClick={handleCopyLink} edge="end" size="small">
                                  <ContentCopyRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('restaurants.openOrderMenu') || 'Open Link'}>
                                <IconButton
                                  href={targetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  edge="end"
                                  size="small"
                                >
                                  <OpenInNewRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 3,
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          pr: 1.5,
                        },
                      }}
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
                      <InfoOutlinedIcon color="primary" sx={{ mt: 0.25 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {t('shopQr.scanDescription')}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
