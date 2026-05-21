'use client'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { appConfig } from '@/core/config/app-config'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'

const DRAWER_WIDTH = 240
const COLLAPSED_DRAWER_WIDTH = 64

type SidebarLabelKey =
  | 'nav.dashboard'
  | 'nav.sale'
  | 'nav.tables'
  | 'nav.cashier'
  | 'nav.stock'
  | 'nav.employees'
  | 'nav.tickets'
  | 'nav.notifications'

interface SidebarAction {
  id: string
  labelKey: SidebarLabelKey
  icon: React.ReactElement
  href: string
}

const GLOBAL_SIDEBAR_ACTIONS: SidebarAction[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: <DashboardRoundedIcon />, href: '/test/dashboard' },
  { id: 'employees', labelKey: 'nav.employees', icon: <PeopleAltRoundedIcon />, href: '/employees' },
  { id: 'tickets', labelKey: 'nav.tickets', icon: <SupportAgentRoundedIcon />, href: '/tickets' },
  { id: 'notifications', labelKey: 'nav.notifications', icon: <NotificationsRoundedIcon />, href: '/notifications' },
]

const SHOP_SIDEBAR_ACTIONS: SidebarAction[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: <DashboardRoundedIcon />, href: '/test/dashboard' },
  { id: 'catalog', labelKey: 'nav.sale', icon: <MenuBookRoundedIcon />, href: '/catalog' },
  { id: 'tables', labelKey: 'nav.tables', icon: <TableRestaurantRoundedIcon />, href: '/tables' },
  { id: 'sale', labelKey: 'nav.cashier', icon: <PointOfSaleRoundedIcon />, href: '/sale' },
  { id: 'stock', labelKey: 'nav.stock', icon: <InventoryRoundedIcon />, href: '/stock' },
]

export function AppSidebar({ locale }: { locale: string }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isExpanded, setIsExpanded] = useState(!isMobile)
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()
  const { scope } = useShopScope()
  const isShopScope = scope.mode === 'SHOP'
  const sidebarActions = isShopScope ? SHOP_SIDEBAR_ACTIONS : GLOBAL_SIDEBAR_ACTIONS

  useEffect(() => {
    setIsExpanded(!isMobile)
  }, [isMobile])

  const handleToggle = () => setIsExpanded((prev) => !prev)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
        flexShrink: 0,
        alignSelf: 'stretch',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: isExpanded
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
      }}
      PaperProps={{
        sx: {
          position: 'relative',
          minHeight: '100%',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          width: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          borderRight: '2px solid',
          borderRightColor: isShopScope ? 'primary.main' : 'divider',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isExpanded
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      {/* Logo header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 64,
          px: isExpanded ? 2 : 0,
          justifyContent: isExpanded ? 'space-between' : 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {isExpanded ? (
          <>
            <Stack direction="row" alignItems="center" gap={1.25}>
              <StorefrontRoundedIcon color="primary" />
              <Typography fontWeight={700} noWrap>
                {appConfig.app.name}
              </Typography>
            </Stack>
            <IconButton onClick={handleToggle} size="small">
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <Tooltip title={appConfig.app.name} placement="right">
            <IconButton onClick={handleToggle} size="small">
              <StorefrontRoundedIcon color="primary" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Nav items */}
      <List sx={{ pt: 1, flexGrow: 1 }}>
        {sidebarActions.map((action) => {
          const hrefWithLocale = `/${locale}${action.href}`
          const isSelected = pathname.startsWith(hrefWithLocale)

          const listItemButton = (
            <ListItemButton
              onClick={() => router.push(hrefWithLocale as Route)}
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
