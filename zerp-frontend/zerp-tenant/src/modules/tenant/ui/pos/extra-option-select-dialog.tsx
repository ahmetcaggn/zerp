'use client'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import type { MenuItemResponseDto, ProductExtraOptionResponseDto } from '../../types/sale'

interface Props {
  open: boolean
  item: MenuItemResponseDto | null
  options: ProductExtraOptionResponseDto[]
  onClose: () => void
  onConfirm: (selectedOptions: ProductExtraOptionResponseDto[]) => void
}

export function ExtraOptionSelectDialog({
  open,
  item,
  options,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useI18n()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const selectedOptions = useMemo(
    () => options.filter(option => selectedIds.includes(option.id)),
    [options, selectedIds],
  )

  const selectedExtraTotal = useMemo(
    () => selectedOptions.reduce((sum, option) => sum + option.price, 0),
    [selectedOptions],
  )

  function toggleSelection(optionId: string) {
    setSelectedIds(prev => (
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    ))
  }

  function handleClose() {
    setSelectedIds([])
    onClose()
  }

  function handleConfirm() {
    onConfirm(selectedOptions)
    setSelectedIds([])
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('pos.extraOptionsTitle')}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('pos.extraOptionsForItem').replace('{name}', item?.name ?? '—')}
        </Typography>
        {options.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('pos.extraOptionsNone')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {options.map(option => (
              <Box
                key={option.id}
                sx={{
                  p: 1.25,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={selectedIds.includes(option.id)}
                        onChange={() => toggleSelection(option.id)}
                      />
                    )}
                    label={option.name}
                    sx={{ m: 0 }}
                  />
                  {option.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', pl: 4.5 }}>
                      {option.description}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={`+${option.price.toFixed(2)} ₺`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            ))}
          </Box>
        )}
        {selectedOptions.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              +{selectedExtraTotal.toFixed(2)} ₺
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onConfirm([])
            setSelectedIds([])
          }}
        >
          {t('pos.addWithoutExtra')}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
        >
          {t('pos.addWithSelectedExtra')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
