'use client'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import RemoveIcon from '@mui/icons-material/Remove'
import SendIcon from '@mui/icons-material/Send'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import jsQR from 'jsqr'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { ShopTableResponseDto, TableOrderResponseDto } from '../../types/sale'
import { getBaseUnitPrice } from '../sale/shared/order-pricing'
import type { CartItem } from './pos-view'
import { extractPublicCartOrderCode } from './public-cart-order-import'

interface Props {
  table: ShopTableResponseDto | undefined
  cart: CartItem[]
  existingOrders: TableOrderResponseDto[]
  orderNote: string
  onNoteChange: (v: string) => void
  onUpdateQuantity: (cartKey: string, delta: number) => void
  onRemove: (cartKey: string) => void
  onPlaceOrder: () => void
  onCancelOrder: (orderId: string) => void
  onUpdateOrderNote: (orderId: string, note: string) => void
  onUpdateOrderItemQty: (order: TableOrderResponseDto, itemId: string, delta: number) => void
  activeEditOrderId: string | null
  onToggleEditOrder: (orderId: string) => void
  onImportPublicCartOrder: (code: string, onSuccess?: () => void) => void
  isImportPending: boolean
  isPending: boolean
}

function QtyControl({
  qty,
  onMinus,
  onPlus,
  disabled,
  size = 'md',
}: {
  qty: number
  onMinus: () => void
  onPlus: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
}) {
  const btnSize = size === 'sm' ? 24 : 28
  const iconSize = size === 'sm' ? 12 : 14
  const fontSize = size === 'sm' ? '0.78rem' : '0.875rem'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
      <IconButton
        size="small"
        disabled={disabled}
        onClick={onMinus}
        sx={{
          width: btnSize,
          height: btnSize,
          border: '1.5px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          p: 0,
        }}
      >
        <RemoveIcon sx={{ fontSize: iconSize }} />
      </IconButton>
      <Typography fontWeight={700} fontSize={fontSize} sx={{ minWidth: 20, textAlign: 'center' }}>
        {qty}
      </Typography>
      <IconButton
        size="small"
        disabled={disabled}
        onClick={onPlus}
        sx={{
          width: btnSize,
          height: btnSize,
          border: '1.5px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          p: 0,
        }}
      >
        <AddIcon sx={{ fontSize: iconSize }} />
      </IconButton>
    </Box>
  )
}

export function OrderPanel({
  table,
  cart,
  existingOrders,
  orderNote,
  onNoteChange,
  onUpdateQuantity,
  onRemove,
  onPlaceOrder,
  onCancelOrder,
  onUpdateOrderNote,
  onUpdateOrderItemQty,
  activeEditOrderId,
  onToggleEditOrder,
  onImportPublicCartOrder,
  isImportPending,
  isPending,
}: Props) {
  const { t } = useI18n()
  const [noteDialogOrderId, setNoteDialogOrderId] = useState<string | null>(null)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [manualQrValue, setManualQrValue] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanLockedRef = useRef(false)

  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0)
  const existingTotal = existingOrders.reduce(
    (s, o) => s + o.items.reduce((is, i) => is + i.unitPrice * i.quantity, 0),
    0,
  )
  const hasAnything = cart.length > 0 || existingOrders.length > 0

  function handleOpenNoteDialog(order: TableOrderResponseDto) {
    setNoteDrafts((prev) => ({
      ...prev,
      [order.id]: prev[order.id] ?? order.note ?? '',
    }))
    setNoteDialogOrderId(order.id)
  }

  function handleSaveOrderNote() {
    if (!noteDialogOrderId) return
    onUpdateOrderNote(noteDialogOrderId, noteDrafts[noteDialogOrderId] ?? '')
    setNoteDialogOrderId(null)
  }

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    scanLockedRef.current = false
    setIsCameraActive(false)
  }, [])

  const handleCloseImportDialog = useCallback(() => {
    stopCamera()
    setImportDialogOpen(false)
    setManualQrValue('')
    setImportError(null)
    setCameraError(null)
  }, [stopCamera])

  const submitImport = useCallback(
    (value: string) => {
      const code = extractPublicCartOrderCode(value)
      if (!code) {
        setImportError(t('pos.importQrInvalid'))
        return
      }
      setImportError(null)
      onImportPublicCartOrder(code, handleCloseImportDialog)
    },
    [handleCloseImportDialog, onImportPublicCartOrder, t],
  )

  async function startCamera() {
    setCameraError(null)
    setImportError(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(t('pos.importQrCameraUnsupported'))
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsCameraActive(true)
    } catch {
      setCameraError(t('pos.importQrCameraError'))
    }
  }

  useEffect(() => {
    if (!isCameraActive) return undefined

    const intervalId = window.setInterval(() => {
      const video = videoRef.current
      const qrCanvas = qrCanvasRef.current
      if (!video || !qrCanvas || scanLockedRef.current) return
      if (
        video.readyState < video.HAVE_CURRENT_DATA ||
        video.videoWidth <= 0 ||
        video.videoHeight <= 0
      )
        return

      if (qrCanvas.width !== video.videoWidth || qrCanvas.height !== video.videoHeight) {
        qrCanvas.width = video.videoWidth
        qrCanvas.height = video.videoHeight
      }

      const context = qrCanvas.getContext('2d', { willReadFrequently: true })
      if (!context) return

      context.drawImage(video, 0, 0, qrCanvas.width, qrCanvas.height)
      const frame = context.getImageData(0, 0, qrCanvas.width, qrCanvas.height)
      const detected = jsQR(frame.data, frame.width, frame.height, {
        inversionAttempts: 'attemptBoth',
      })
      const rawValue = detected?.data
      if (!rawValue || !extractPublicCartOrderCode(rawValue)) return

      scanLockedRef.current = true
      setManualQrValue(rawValue)
      submitImport(rawValue)
    }, 650)

    return () => window.clearInterval(intervalId)
  }, [isCameraActive, submitImport])

  useEffect(() => () => stopCamera(), [stopCamera])

  return (
    <Box
      sx={{
        width: { xs: 280, md: 320, lg: 360 },
        flexShrink: 0,
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: 1.5,
            color: 'text.secondary',
            lineHeight: 1,
          }}
        >
          {t('pos.orderPanelTitle')}
        </Typography>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}
        >
          <Typography variant="h6" fontWeight={800} lineHeight={1}>
            {table?.name ?? '—'}
          </Typography>
          {existingTotal > 0 && (
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              {t('pos.openTotalLabel')} {existingTotal.toFixed(2)} ₺
            </Typography>
          )}
        </Box>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          startIcon={<QrCodeScannerIcon />}
          onClick={() => setImportDialogOpen(true)}
          disabled={!table || isPending || isImportPending}
          sx={{ mt: 1.5, borderRadius: 2, fontWeight: 700 }}
        >
          {t('pos.importQrButton')}
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {existingOrders.map((order, orderIdx) => {
          const oTotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
          const isActiveOrder = activeEditOrderId === order.id

          return (
            <Box key={order.id}>
              {orderIdx === 0 && (
                <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontSize: '0.63rem',
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      color: 'text.secondary',
                    }}
                  >
                    {t('pos.openOrdersSection')}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  mx: 1.5,
                  mb: 1.5,
                  border: `${isActiveOrder ? 2.5 : 1.5}px solid`,
                  borderColor: isActiveOrder ? 'warning.main' : 'divider',
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  boxShadow: isActiveOrder
                    ? (theme) => `0 0 0 2px ${theme.palette.warning.light}`
                    : 'none',
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: (theme) =>
                      isActiveOrder
                        ? alpha(
                            theme.palette.warning.main,
                            theme.palette.mode === 'dark' ? 0.18 : 0.12,
                          )
                        : theme.palette.action.hover,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={t('pos.openStatus')}
                        color="warning"
                        size="small"
                        sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                      />
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.82rem' }}>
                        {t('sale.cashier.itemCount').replace('{n}', String(order.items.length))}
                      </Typography>
                    </Box>
                    {order.note && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.35, fontStyle: 'italic' }}
                      >
                        {t('sale.tableOrder.form.note')}: {order.note}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={800}
                    color="primary.main"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {oTotal.toFixed(2)} ₺
                  </Typography>
                </Box>

                <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
                  {order.items.map((item) => {
                    const baseUnitPrice = getBaseUnitPrice(
                      item.unitPrice,
                      item.selectedExtraOptions,
                    )
                    const lineTotal = item.unitPrice * item.quantity
                    const extras = item.selectedExtraOptions ?? []
                    const isSimpleLine = item.quantity === 1 && extras.length === 0

                    return (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 0.75,
                          borderBottom: '1px solid',
                          borderColor: 'action.hover',
                          '&:last-child': { borderBottom: 'none' },
                        }}
                      >
                        <QtyControl
                          size="sm"
                          qty={item.quantity}
                          disabled={isPending}
                          onMinus={() => onUpdateOrderItemQty(order, item.id, -1)}
                          onPlus={() => onUpdateOrderItemQty(order, item.id, 1)}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'baseline',
                              justifyContent: 'space-between',
                              gap: 1,
                            }}
                          >
                            <Typography variant="caption" fontWeight={600}>
                              {item.quantity}× {item.menuItemName ?? item.menuItemId}
                            </Typography>
                            <Typography variant="caption" fontWeight={700} color="text.primary">
                              {baseUnitPrice.toFixed(2)} ₺
                            </Typography>
                          </Box>
                          {extras.length > 0 && (
                            <Box sx={{ mt: 0.25, pl: 1.25 }}>
                              {extras.map((option) => (
                                <Box
                                  key={option.extraOptionId}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="caption" color="text.secondary">
                                    + {option.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ whiteSpace: 'nowrap' }}
                                  >
                                    {option.price.toFixed(2)} ₺
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                          {item.notes && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.25, fontStyle: 'italic' }}
                            >
                              {t('sale.tableOrder.form.notes')}: {item.notes}
                            </Typography>
                          )}
                          {!isSimpleLine && (
                            <Box
                              sx={{
                                mt: 0.4,
                                pt: 0.4,
                                borderTop: '1px dashed',
                                borderColor: 'divider',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                gap: 1,
                              }}
                            >
                              <Typography variant="caption" fontWeight={600} color="text.secondary">
                                Toplam
                              </Typography>
                              <Typography variant="caption" fontWeight={800} color="text.primary">
                                {lineTotal.toFixed(2)} ₺
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <IconButton
                          size="small"
                          disabled={isPending}
                          onClick={() => onUpdateOrderItemQty(order, item.id, -item.quantity)}
                          sx={{ color: 'error.light', width: 22, height: 22, flexShrink: 0 }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    )
                  })}
                </Box>

                <Box
                  sx={{
                    px: 1.5,
                    pb: 1.25,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <IconButton
                      size="small"
                      disabled={isPending}
                      onClick={() => onToggleEditOrder(order.id)}
                      sx={{ color: isActiveOrder ? 'warning.dark' : 'text.secondary' }}
                      aria-label={t('common.edit')}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={isPending}
                      onClick={() => handleOpenNoteDialog(order)}
                      sx={{ color: 'text.secondary' }}
                      aria-label={t('sale.tableOrder.form.note')}
                    >
                      <StickyNote2OutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    disabled={isPending}
                    onClick={() => onCancelOrder(order.id)}
                    sx={{
                      fontSize: '0.72rem',
                      py: 0.5,
                      borderRadius: 1.5,
                      opacity: 0.75,
                      '&:hover': { opacity: 1 },
                      ml: 'auto',
                    }}
                  >
                    {t('pos.cancelOrderBtn')}
                  </Button>
                </Box>
              </Box>
            </Box>
          )
        })}

        {cart.length > 0 && (
          <Box>
            <Box sx={{ px: 2.5, pt: existingOrders.length > 0 ? 0.5 : 2, pb: 0.5 }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '0.63rem',
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  color: 'primary.main',
                }}
              >
                {t('pos.newItemsSection')}
              </Typography>
            </Box>
            <Box
              sx={{
                mx: 1.5,
                mb: 1,
                border: '1.5px solid',
                borderColor: 'primary.light',
                borderRadius: 2.5,
                overflow: 'hidden',
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08),
              }}
            >
              <Box sx={{ px: 1.5, py: 0.75 }}>
                {cart.map((item) => {
                  const baseUnitPrice = getBaseUnitPrice(item.price, item.selectedExtraOptions)
                  const lineTotal = item.price * item.quantity
                  const extras = item.selectedExtraOptions ?? []
                  const isSimpleLine = item.quantity === 1 && extras.length === 0

                  return (
                    <Box
                      key={item.cartKey}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.75,
                        borderBottom: '1px solid',
                        borderColor: 'action.hover',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <QtyControl
                        qty={item.quantity}
                        onMinus={() => onUpdateQuantity(item.cartKey, -1)}
                        onPlus={() => onUpdateQuantity(item.cartKey, 1)}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.84rem' }}>
                            {item.quantity}× {item.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color="text.primary"
                            sx={{ fontSize: '0.84rem', whiteSpace: 'nowrap' }}
                          >
                            {baseUnitPrice.toFixed(2)} ₺
                          </Typography>
                        </Box>
                        {extras.length > 0 && (
                          <Box sx={{ mt: 0.25, pl: 1.25 }}>
                            {extras.map((option) => (
                              <Box
                                key={option.extraOptionId}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'baseline',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  + {option.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ whiteSpace: 'nowrap' }}
                                >
                                  {option.price.toFixed(2)} ₺
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                        {item.notes && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.25, fontStyle: 'italic' }}
                          >
                            {t('sale.tableOrder.form.notes')}: {item.notes}
                          </Typography>
                        )}
                        {!isSimpleLine && (
                          <Box
                            sx={{
                              mt: 0.4,
                              pt: 0.4,
                              borderTop: '1px dashed',
                              borderColor: 'action.disabled',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              gap: 1,
                            }}
                          >
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                              Toplam
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={800}
                              color="primary.main"
                              sx={{ whiteSpace: 'nowrap' }}
                            >
                              {lineTotal.toFixed(2)} ₺
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => onRemove(item.cartKey)}
                        sx={{ color: 'error.light', width: 26, height: 26, flexShrink: 0 }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )
                })}
              </Box>

              <Box sx={{ px: 1.5, pb: 1.5 }}>
                <TextField
                  placeholder={t('pos.orderNotePlaceholder')}
                  size="small"
                  value={orderNote}
                  onChange={(e) => onNoteChange(e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  sx={{
                    mt: 0.5,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.82rem',
                      bgcolor: 'background.paper',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {!hasAnything && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 220,
              gap: 1.5,
              color: 'text.disabled',
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 48, opacity: 0.25 }} />
            <Typography variant="body2" textAlign="center" fontSize="0.84rem">
              {t('pos.addFromMenuHint')}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
          flexShrink: 0,
          bgcolor: 'background.paper',
        }}
      >
        {cart.length > 0 && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {t('pos.cartTotalLabel')}
              </Typography>
              <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                {cartTotal.toFixed(2)} ₺
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={isPending ? undefined : <SendIcon />}
              onClick={onPlaceOrder}
              disabled={isPending || !table}
              sx={{ fontWeight: 700, py: 1.5, fontSize: '1rem', borderRadius: 2.5, boxShadow: 2 }}
            >
              {isPending ? <CircularProgress size={22} color="inherit" /> : t('pos.placeOrderBtn')}
            </Button>
          </>
        )}
        {!hasAnything && (
          <Typography variant="caption" color="text.disabled" textAlign="center" display="block">
            {t('sale.tableOrder.emptyState')}
          </Typography>
        )}
      </Box>

      <Dialog
        open={noteDialogOrderId !== null}
        onClose={() => setNoteDialogOrderId(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{t('sale.tableOrder.form.note')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            value={noteDialogOrderId ? (noteDrafts[noteDialogOrderId] ?? '') : ''}
            onChange={(event) => {
              if (!noteDialogOrderId) return
              setNoteDrafts((prev) => ({ ...prev, [noteDialogOrderId]: event.target.value }))
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOrderId(null)}>{t('common.cancel')}</Button>
          <Button variant="contained" disabled={isPending} onClick={handleSaveOrderNote}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={importDialogOpen} onClose={handleCloseImportDialog} fullWidth maxWidth="xs">
        <DialogTitle>{t('pos.importQrTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {t('pos.importQrDescription')}
            </Typography>

            {cameraError && <Alert severity="warning">{cameraError}</Alert>}
            {importError && <Alert severity="error">{importError}</Alert>}

            <Box
              component="video"
              ref={videoRef}
              muted
              playsInline
              sx={{
                display: isCameraActive ? 'block' : 'none',
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                borderRadius: 2,
                bgcolor: 'grey.900',
              }}
            />
            <Box component="canvas" ref={qrCanvasRef} sx={{ display: 'none' }} />

            <Button
              variant={isCameraActive ? 'outlined' : 'contained'}
              startIcon={<QrCodeScannerIcon />}
              onClick={isCameraActive ? stopCamera : startCamera}
              disabled={isImportPending}
            >
              {isCameraActive ? t('pos.importQrCameraStop') : t('pos.importQrCameraStart')}
            </Button>

            <TextField
              label={t('pos.importQrManualLabel')}
              placeholder={t('pos.importQrManualPlaceholder')}
              value={manualQrValue}
              onChange={(event) => {
                setManualQrValue(event.target.value)
                setImportError(null)
              }}
              fullWidth
              size="small"
              disabled={isImportPending}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>{t('common.cancel')}</Button>
          <Button
            variant="contained"
            disabled={isImportPending}
            onClick={() => submitImport(manualQrValue)}
          >
            {isImportPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t('pos.importQrSubmit')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
