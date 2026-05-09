'use client'
import { Box, Chip, Skeleton } from '@mui/material'
import { useI18n } from '@/core/i18n/i18n-provider'
import type { MenuCategoryResponseDto } from '../../types/sale'

interface Props {
  categories: MenuCategoryResponseDto[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  isLoading: boolean
}

export function CategoryChips({ categories, selectedId, onSelect, isLoading }: Props) {
  const { t } = useI18n()
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        px: 2,
        py: 1.5,
        overflowX: 'auto',
        flexShrink: 0,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {isLoading
        ? [...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rounded" width={72} height={32} sx={{ flexShrink: 0, borderRadius: 4 }} />
          ))
        : [{ id: null, name: t('pos.allCategories') }, ...categories.map(c => ({ id: c.id, name: c.name }))].map(item => {
            const active = item.id === selectedId
            return (
              <Chip
                key={item.id ?? '__all__'}
                label={item.name}
                onClick={() => onSelect(item.id)}
                color={active ? 'primary' : 'default'}
                variant={active ? 'filled' : 'outlined'}
                sx={{
                  flexShrink: 0,
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.82rem',
                  height: 34,
                  cursor: 'pointer',
                  borderColor: active ? undefined : 'divider',
                  transition: 'all 0.12s',
                }}
              />
            )
          })}
    </Box>
  )
}
