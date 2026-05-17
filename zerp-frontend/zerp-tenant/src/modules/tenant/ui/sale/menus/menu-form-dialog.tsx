'use client'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useCreateMenu, useUpdateMenu } from '../../../hooks/use-menus'
import type { MenuLanguage, MenuResponseDto } from '../../../types/sale'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  menu?: MenuResponseDto | null
  onClose: () => void
}

export function MenuFormDialog({ open, mode, menu, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()

  const [name, setName] = useState(menu?.name ?? '')
  const [description, setDescription] = useState(menu?.description ?? '')
  const [language, setLanguage] = useState<MenuLanguage>(menu?.language ?? 'TR')
  const [active, setActive] = useState(menu?.active ?? false)

  useEffect(() => {
    setName(menu?.name ?? '')
    setDescription(menu?.description ?? '')
    setLanguage(menu?.language ?? 'TR')
    setActive(menu?.active ?? false)
  }, [menu, open])

  const { mutate: createMenu, isPending: isCreating } = useCreateMenu()
  const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu()
  const isPending = isCreating || isUpdating

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    if (mode === 'create') {
      if (scope.mode !== 'SHOP') {
        showToast('Bu işlem için önce bir mağaza seçin.', { severity: 'warning' })
        return
      }

      createMenu(
        {
          name: name.trim(),
          ...(description.trim() && { description: description.trim() }),
          active,
          language,
          shopId: scope.shopId,
        },
        {
          onSuccess: () => {
            showToast(t('sale.menu.createdToast'))
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    } else if (menu) {
      updateMenu(
        {
          id: menu.id,
          data: {
            name: name.trim(),
            ...(description.trim() && { description: description.trim() }),
            language,
            active,
          },
        },
        {
          onSuccess: () => {
            showToast(t('sale.menu.updatedToast'))
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'create' ? t('sale.menu.createButton') : t('sale.menu.editButton')}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('sale.menu.form.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t('sale.menu.form.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('sale.menu.form.language')}</InputLabel>
              <Select
                value={language}
                label={t('sale.menu.form.language')}
                onChange={(e) => setLanguage(e.target.value as MenuLanguage)}
              >
                <MenuItem value="TR">{t('sale.menu.language.tr')}</MenuItem>
                <MenuItem value="EN">{t('sale.menu.language.en')}</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
              label={t('sale.menu.form.isActive')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
