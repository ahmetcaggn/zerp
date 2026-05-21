'use client'
import { useState } from 'react'
import {
  Box, Card, CardActionArea, Chip, IconButton,
  Menu, MenuItem, Divider, Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import LayersIcon from '@mui/icons-material/Layers'
import { useI18n } from '@/core/i18n/i18n-provider'
import type { ShopTableResponseDto, ShopTableStatus } from '../../types/sale'

const STATUS_STYLE: Record<ShopTableStatus, { bg: string; border: string; chip: 'success' | 'error' | 'warning' | 'default' }> = {
  AVAILABLE:    { bg: 'rgba(22,163,74,0.09)',    border: '#16a34a', chip: 'success'  },
  OCCUPIED:     { bg: 'rgba(220,38,38,0.09)',    border: '#dc2626', chip: 'error'    },
  RESERVED:     { bg: 'rgba(217,119,6,0.09)',    border: '#d97706', chip: 'warning'  },
  OUT_OF_ORDER: { bg: 'rgba(107,114,128,0.09)', border: '#9ca3af', chip: 'default'  },
}

const STATUS_KEY: Record<ShopTableStatus, string> = {
  AVAILABLE:    'pos.statusAvailable',
  OCCUPIED:     'pos.statusOccupied',
  RESERVED:     'pos.statusReserved',
  OUT_OF_ORDER: 'pos.statusOutOfOrder',
}

interface Props {
  table: ShopTableResponseDto
  onTap: (id: string) => void
  onEdit: (table: ShopTableResponseDto) => void
  onDelete: (id: string) => void
  onChangeStatus: (table: ShopTableResponseDto, status: ShopTableStatus) => void
}

export function TableCard({ table, onTap, onEdit, onDelete, onChangeStatus }: Props) {
  const { t } = useI18n()
  const style = STATUS_STYLE[table.status]
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  return (
    <Card
      elevation={0}
      sx={{
        border: `2px solid ${style.border}`,
        bgcolor: style.bg,
        borderRadius: 3,
        position: 'relative',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
        '&:active': { transform: 'scale(0.97)' },
      }}
    >
      <CardActionArea
        onClick={() => onTap(table.id)}
        sx={{
          p: 2, minHeight: 160,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          fontSize="1.1rem"
          lineHeight={1.2}
          sx={{ pr: 3, mb: 1, width: '100%' }}
        >
          {table.name}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <PeopleOutlineIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" fontWeight={500}>
              {t('pos.persons').replace('{n}', String(table.capacity))}
            </Typography>
          </Box>
          {table.floor > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <LayersIcon sx={{ fontSize: 15 }} />
              <Typography variant="caption" fontWeight={500}>
                {t('pos.floorLabel').replace('{n}', String(table.floor))}
              </Typography>
            </Box>
          )}
        </Box>

        <Chip
          label={t(STATUS_KEY[table.status])}
          color={style.chip}
          size="small"
          sx={{ mt: 1.5, fontWeight: 700, fontSize: '0.72rem' }}
        />
      </CardActionArea>

      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget) }}
        sx={{
          position: 'absolute', top: 8, right: 8,
          width: 28, height: 28,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'background.default' },
        }}
      >
        <MoreVertIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuItem dense onClick={() => { setAnchor(null); onTap(table.id) }}>
          {t('pos.openOrderMenu')}
        </MenuItem>
        <Divider />
        <MenuItem dense disabled>
          {t('pos.changeStatusMenu')}
        </MenuItem>
        {(['AVAILABLE', 'RESERVED', 'OCCUPIED', 'OUT_OF_ORDER'] as ShopTableStatus[]).map(status => (
          <MenuItem
            key={status}
            dense
            selected={table.status === status}
            onClick={() => {
              setAnchor(null)
              onChangeStatus(table, status)
            }}
          >
            {t(STATUS_KEY[status])}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem dense onClick={() => { setAnchor(null); onEdit(table) }}>
          {t('common.edit')}
        </MenuItem>
        <MenuItem dense sx={{ color: 'error.main' }} onClick={() => { setAnchor(null); onDelete(table.id) }}>
          {t('common.delete')}
        </MenuItem>
      </Menu>
    </Card>
  )
}
