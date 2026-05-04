'use client'

import React, { useState } from 'react'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import { usePathname, useRouter } from 'next/navigation'
import { useI18n } from '@/core/i18n/i18n-provider'

const DRAWER_WIDTH = 240
const COLLAPSED_DRAWER_WIDTH = 64

type SidebarLabelKey = 'nav.dashboard' | 'nav.sale' | 'nav.stock' | 'nav.employees' | 'nav.tickets' | 'nav.notifications'

interface SidebarAction {
  id: string
  labelKey: SidebarLabelKey
  icon: React.ReactElement
  href: string
}

const SIDEBAR_ACTIONS: SidebarAction[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: <DashboardRoundedIcon />, href: '/dashboard' },
  { id: 'sale', labelKey: 'nav.sale', icon: <MenuBookRoundedIcon />, href: '/sale' },
  { id: 'stock', labelKey: 'nav.stock', icon: <InventoryRoundedIcon />, href: '/stock' },
  { id: 'employees', labelKey: 'nav.employees', icon: <PeopleAltRoundedIcon />, href: '/employees' },
  { id: 'tickets', labelKey: 'nav.tickets', icon: <SupportAgentRoundedIcon />, href: '/tickets' },
  { id: 'notifications', labelKey: 'nav.notifications', icon: <NotificationsRoundedIcon />, href: '/notifications' },
]

export function AppSidebar({ locale }: { locale: string }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isExpanded, setIsExpanded] = useState(!isMobile)
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()

  const currentWidth = isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH

  const handleToggle = () => setIsExpanded(!isExpanded)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      }}
      PaperProps={{
        sx: {
          position: 'relative',
          height: '100vh',
          ...(isExpanded
            ? {
                width: DRAWER_WIDTH,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden',
              }
            : {
                width: COLLAPSED_DRAWER_WIDTH,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                overflowX: 'hidden',
              }),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'flex-end' : 'center', p: 1, minHeight: 64 }}>
        <IconButton onClick={handleToggle}>
          {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {SIDEBAR_ACTIONS.map((action) => {
          const hrefWithLocale = `/${locale}${action.href}`
          const isSelected = pathname.startsWith(hrefWithLocale)

          const listItemButton = (
            <ListItemButton
              onClick={() => router.push(hrefWithLocale)}
              selected={isSelected}
              sx={{
                minHeight: 48,
                justifyContent: isExpanded ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isExpanded ? 2 : 'auto',
                  justifyContent: 'center',
                  color: isSelected ? 'primary.main' : 'inherit',
                }}
              >
                {action.icon}
              </ListItemIcon>
              <ListItemText
                primary={t(action.labelKey)}
                sx={{
                  opacity: isExpanded ? 1 : 0,
                  color: isSelected ? 'primary.main' : 'inherit',
                  '& .MuiTypography-root': { fontWeight: isSelected ? 600 : 400 },
                }}
              />
            </ListItemButton>
          )

          return (
            <ListItem key={action.id} disablePadding sx={{ display: 'block' }}>
              {!isExpanded ? (
                <Tooltip title={t(action.labelKey)} placement="right">
                  {listItemButton}
                </Tooltip>
              ) : (
                listItemButton
              )}
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}
