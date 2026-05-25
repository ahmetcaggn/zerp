'use client'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useI18n } from '@/core/i18n/i18n-provider'
import type { StockOperationResponseDto } from '../../types/stock'

interface StockOperationDetailDialogProps {
  open: boolean
  onClose: () => void
  operation: StockOperationResponseDto | null
}

function formatDateTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function StockOperationDetailDialog({ open, onClose, operation }: StockOperationDetailDialogProps) {
  const { t, locale } = useI18n()
  const items = operation?.items ?? []

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{t('stock.operation.detailTitle')}</DialogTitle>
      <DialogContent dividers>
        {!operation ? null : (
          <Stack spacing={1.5}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
              <Typography variant="body2"><strong>{t('stock.movement.date')}:</strong> {operation.createdAt ? formatDateTime(operation.createdAt, locale) : '-'}</Typography>
              <Typography variant="body2"><strong>{t('stock.operation.type')}:</strong> {t(`stock.operation.types.${operation.operationType}`) || operation.operationType}</Typography>
              <Typography variant="body2"><strong>{t('stock.operation.status')}:</strong> {t(`stock.operation.statuses.${operation.status}`) || operation.status}</Typography>
              <Typography variant="body2"><strong>{t('stock.operation.referenceNo')}:</strong> {operation.referenceNo || '-'}</Typography>
              <Typography variant="body2"><strong>{t('stock.operation.itemCount')}:</strong> {operation.itemCount}</Typography>
              <Typography variant="body2"><strong>{t('stock.operation.notes')}:</strong> {operation.notes || '-'}</Typography>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('stock.tabs.resources')}</TableCell>
                    <TableCell>{t('stock.resource.form.unitType')}</TableCell>
                    <TableCell>{t('stock.operation.direction')}</TableCell>
                    <TableCell align="right">{t('stock.operation.quantity')}</TableCell>
                    <TableCell>{t('stock.operation.reason')}</TableCell>
                    <TableCell>{t('stock.operation.referenceNo')}</TableCell>
                    <TableCell>{t('stock.operation.notes')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!items.length ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {t('stock.operation.emptyDetailItems')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.stockResourceName}</TableCell>
                        <TableCell>{item.unitType || '-'}</TableCell>
                        <TableCell>{t(`stock.operation.directions.${item.direction}`) || item.direction}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>{item.reason || '-'}</TableCell>
                        <TableCell>{item.referenceNo || '-'}</TableCell>
                        <TableCell>{item.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}
