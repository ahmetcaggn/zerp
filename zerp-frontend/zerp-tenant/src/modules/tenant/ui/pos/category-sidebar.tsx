'use client'
import { Box, ButtonBase, Skeleton, Typography } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import type { MenuCategoryResponseDto } from '../../types/sale'

interface Props {
  categories: MenuCategoryResponseDto[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  isLoading: boolean
}

export function CategorySidebar({ categories, selectedId, onSelect, isLoading }: Props) {
  const items: { id: string | null; name: string }[] = [
    { id: null, name: 'Tümü' },
    ...categories.map(c => ({ id: c.id, name: c.name })),
  ]

  return (
    <Box
      sx={{
        width: 176,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        pt: 1.5,
        pb: 8,
      }}
    >
      {isLoading
        ? [...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={50} sx={{ mx: 1.5, mb: 1 }} />
          ))
        : items.map(item => {
            const active = item.id === selectedId
            return (
              <ButtonBase
                key={item.id ?? '__all__'}
                onClick={() => onSelect(item.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mx: 1.5,
                  mb: 0.5,
                  px: 1.5,
                  py: 1.5,
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? 'primary.contrastText' : 'text.primary',
                  transition: 'all 0.12s',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                  },
                  minHeight: 50,
                }}
              >
                {item.id === null && (
                  <GridViewIcon sx={{ fontSize: 18, flexShrink: 0, opacity: active ? 1 : 0.6 }} />
                )}
                <Typography
                  variant="body2"
                  fontWeight={active ? 700 : 500}
                  fontSize="0.88rem"
                  color="inherit"
                  textAlign="left"
                  lineHeight={1.3}
                >
                  {item.name}
                </Typography>
              </ButtonBase>
            )
          })}
    </Box>
  )
}
