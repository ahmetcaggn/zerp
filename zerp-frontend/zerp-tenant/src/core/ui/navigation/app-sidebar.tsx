'use client'

import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import {
  type PermissionAction,
  PermissionActions,
  useCurrentUserPermissions,
} from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'

const DRAWER_WIDTH = 240
const COLLAPSED_DRAWER_WIDTH = 64

type SidebarLabelKey =
  | 'nav.dashboard'
  | 'nav.shops'
  | 'nav.sale'
  | 'nav.tables'
  | 'nav.cashier'
  | 'nav.saleHistory'
  | 'nav.stock'
  | 'nav.employees'
  | 'nav.permissionGroups'
  | 'nav.tickets'
  | 'nav.announcements'
  | 'nav.shopQr'

type SidebarSectionLabelKey = 'nav.management' | 'nav.crm' | 'nav.operations' | 'nav.inventory'

interface SidebarAction {
  id: string
  labelKey: SidebarLabelKey
  icon: React.ReactElement
  href: string
  disabled?: boolean
  disabledReason?: string
}

interface SidebarSection {
  id: string
  labelKey: SidebarSectionLabelKey
  actions: SidebarAction[]
}

const DASHBOARD_ACTION: SidebarAction = {
  id: 'dashboard',
  labelKey: 'nav.dashboard',
  icon: <DashboardRoundedIcon />,
  href: '/dashboard',
}

const GLOBAL_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'management',
    labelKey: 'nav.management',
    actions: [
      { id: 'shops', labelKey: 'nav.shops', icon: <StorefrontRoundedIcon />, href: '/shops' },
      {
        id: 'employees',
        labelKey: 'nav.employees',
        icon: <PeopleAltRoundedIcon />,
        href: '/employees',
      },
      {
        id: 'permission-groups',
        labelKey: 'nav.permissionGroups',
        icon: <RuleFolderRoundedIcon />,
        href: '/permission-groups',
      },
    ],
  },
  {
    id: 'crm',
    labelKey: 'nav.crm',
    actions: [
      {
        id: 'tickets',
        labelKey: 'nav.tickets',
        icon: <SupportAgentRoundedIcon />,
        href: '/tickets',
      },
      {
        id: 'announcements',
        labelKey: 'nav.announcements',
        icon: <CampaignRoundedIcon />,
        href: '/announcements',
      },
    ],
  },
]

const SHOP_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'operations',
    labelKey: 'nav.operations',
    actions: [
      { id: 'catalog', labelKey: 'nav.sale', icon: <MenuBookRoundedIcon />, href: '/catalog' },
      {
        id: 'tables',
        labelKey: 'nav.tables',
        icon: <TableRestaurantRoundedIcon />,
        href: '/tables',
      },
      { id: 'sale', labelKey: 'nav.cashier', icon: <PointOfSaleRoundedIcon />, href: '/sale' },
      {
        id: 'sale-history',
        labelKey: 'nav.saleHistory',
        icon: <ReceiptLongRoundedIcon />,
        href: '/sale-history',
      },
      {
        id: 'shop-qr',
        labelKey: 'nav.shopQr',
        icon: <QrCode2RoundedIcon />,
        href: '/shop-qr',
      },
    ],
  },
  {
    id: 'inventory',
    labelKey: 'nav.inventory',
    actions: [
      { id: 'stock', labelKey: 'nav.stock', icon: <InventoryRoundedIcon />, href: '/stock' },
    ],
  },
]

const GLOBAL_SHOP_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_SHOP,
  PermissionActions.UPDATE_SHOP,
]

const GLOBAL_EMPLOYEE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_EMPLOYEE,
  PermissionActions.UPDATE_EMPLOYEE,
  PermissionActions.DELETE_EMPLOYEE,
  PermissionActions.CREATE_EMPLOYEE,
]

const GLOBAL_TICKET_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_TICKET,
  PermissionActions.UPDATE_TICKET,
  PermissionActions.DELETE_TICKET,
  PermissionActions.CREATE_TICKET,
  PermissionActions.READ_TICKET_COMMENT,
  PermissionActions.CREATE_TICKET_COMMENT,
  PermissionActions.READ_TICKET_ASSIGNMENT,
  PermissionActions.CREATE_TICKET_ASSIGNMENT,
  PermissionActions.READ_TICKET_ATTACHMENT,
  PermissionActions.CREATE_TICKET_ATTACHMENT,
  PermissionActions.READ_TICKET_HISTORY,
  PermissionActions.READ_TICKET_SLA_TRACKING,
]

const SHOP_CATALOG_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_PRODUCT,
  PermissionActions.CREATE_PRODUCT,
  PermissionActions.UPDATE_PRODUCT,
  PermissionActions.READ_MENU,
  PermissionActions.CREATE_MENU,
  PermissionActions.READ_MENU_ITEM,
  PermissionActions.CREATE_MENU_ITEM,
  PermissionActions.UPDATE_MENU_ITEM,
  PermissionActions.DELETE_MENU_ITEM,
]

const SHOP_TABLE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_SHOP_TABLE,
  PermissionActions.CREATE_SHOP_TABLE,
  PermissionActions.UPDATE_SHOP_TABLE,
  PermissionActions.READ_TABLE_ORDER,
]

const SHOP_SALE_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_SHOP_TABLE,
  PermissionActions.READ_TABLE_ORDER,
  PermissionActions.CREATE_TABLE_ORDER,
  PermissionActions.UPDATE_TABLE_ORDER,
  PermissionActions.READ_MENU,
  PermissionActions.READ_MENU_CATEGORY,
  PermissionActions.READ_MENU_ITEM,
  PermissionActions.READ_PRODUCT,
  PermissionActions.READ_PRODUCT_RECIPE,
  PermissionActions.READ_PRODUCT_EXTRA_OPTION,
]

const SHOP_SALE_HISTORY_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_SALE_HISTORY,
  PermissionActions.READ_TABLE_ORDER,
]

const SHOP_STOCK_ACTIONS: readonly PermissionAction[] = [
  PermissionActions.READ_STOCK_RESOURCE,
  PermissionActions.CREATE_STOCK_RESOURCE,
  PermissionActions.UPDATE_STOCK_RESOURCE,
  PermissionActions.READ_STOCK_MOVEMENT,
  PermissionActions.CREATE_STOCK_MOVEMENT,
  PermissionActions.CREATE_STOCK_ENTRY,
  PermissionActions.CREATE_STOCK_ADJUSTMENT,
  PermissionActions.CREATE_STOCK_WASTE,
  PermissionActions.CREATE_STOCK_RETURN,
  PermissionActions.UPDATE_STOCK_MOVEMENT,
  PermissionActions.READ_STOCK_COUNT,
  PermissionActions.CREATE_STOCK_COUNT,
  PermissionActions.UPDATE_STOCK_COUNT,
]

export function AppSidebar({ locale }: { locale: string }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isExpanded, setIsExpanded] = useState(!isMobile)
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()
  const { scope } = useShopScope()
  const {
    hasAnyPermission,
    hasTenantPermission,
    hasShopPermission,
    hasAnyShopPermission,
    getDisabledReason,
    isLoadingPermissions,
  } = useCurrentUserPermissions()
  const isShopScope = scope.mode === 'SHOP'
  const currentShopId = isShopScope ? scope.shopId : undefined
  const unauthorizedReason = t('common.unauthorized')
  const loadingReason = t('common.loading')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsExpanded(!isMobile)
  }, [isMobile])

  const handleToggle = () => setIsExpanded((prev) => !prev)

  const withPermissionState = React.useCallback(
    (action: SidebarAction, canAccess: boolean): SidebarAction => ({
      ...action,
      disabled: isLoadingPermissions || !canAccess,
      disabledReason: isLoadingPermissions
        ? loadingReason
        : getDisabledReason(canAccess, unauthorizedReason),
    }),
    [getDisabledReason, isLoadingPermissions, loadingReason, unauthorizedReason],
  )

  const sidebarSections = React.useMemo<SidebarSection[]>(() => {
    if (!isShopScope) {
      return GLOBAL_SIDEBAR_SECTIONS.map((section) => ({
        ...section,
        actions: section.actions.map((action) => {
          switch (action.id) {
            case 'shops':
              return withPermissionState(
                action,
                hasAnyPermission(GLOBAL_SHOP_ACTIONS) ||
                  hasTenantPermission(PermissionActions.ADMIN),
              )
            case 'employees':
              return withPermissionState(
                action,
                hasAnyPermission(GLOBAL_EMPLOYEE_ACTIONS) ||
                  hasTenantPermission(PermissionActions.ADMIN),
              )
            case 'permission-groups':
              return withPermissionState(action, hasTenantPermission(PermissionActions.ADMIN))
            case 'tickets':
              return withPermissionState(
                action,
                hasAnyPermission(GLOBAL_TICKET_ACTIONS) ||
                  hasTenantPermission(PermissionActions.ADMIN),
              )
            default:
              return action
          }
        }),
      }))
    }

    return SHOP_SIDEBAR_SECTIONS.map((section) => ({
      ...section,
      actions: section.actions.map((action) => {
        switch (action.id) {
          case 'catalog':
            return withPermissionState(
              action,
              hasAnyShopPermission(SHOP_CATALOG_ACTIONS, currentShopId),
            )
          case 'tables':
            return withPermissionState(
              action,
              hasAnyShopPermission(SHOP_TABLE_ACTIONS, currentShopId),
            )
          case 'sale':
            return withPermissionState(
              action,
              hasAnyShopPermission(SHOP_SALE_ACTIONS, currentShopId),
            )
          case 'sale-history':
            return withPermissionState(
              action,
              hasAnyShopPermission(SHOP_SALE_HISTORY_ACTIONS, currentShopId),
            )
          case 'shop-qr':
            return withPermissionState(
              action,
              hasShopPermission(PermissionActions.READ_SHOP, currentShopId),
            )
          case 'stock':
            return withPermissionState(
              action,
              hasAnyShopPermission(SHOP_STOCK_ACTIONS, currentShopId),
            )
          default:
            return action
        }
      }),
    }))
  }, [
    currentShopId,
    hasAnyPermission,
    hasAnyShopPermission,
    hasShopPermission,
    hasTenantPermission,
    isShopScope,
    withPermissionState,
  ])

  const renderAction = (action: SidebarAction, nested = false) => {
    const hrefWithLocale = `/${locale}${action.href}`
    const isSelected = pathname === hrefWithLocale || pathname.startsWith(`${hrefWithLocale}/`)
    const isDisabled = Boolean(action.disabled)
    const tooltipTitle = isDisabled ? action.disabledReason : t(action.labelKey)

    const listItemButton = (
      <ListItemButton
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) router.push(hrefWithLocale as Route)
        }}
        selected={!isDisabled && isSelected}
        sx={{
          minHeight: 48,
          justifyContent: 'flex-start',
          px: 0,
          pl: isExpanded && nested ? 1.5 : 0,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 64,
            display: 'flex',
            justifyContent: 'center',
            color: !isDisabled && isSelected ? 'primary.main' : 'inherit',
          }}
        >
          {action.icon}
        </ListItemIcon>
        <ListItemText
          primary={t(action.labelKey)}
          sx={{
            opacity: isExpanded ? 1 : 0,
            transition: theme.transitions.create('opacity', {
              duration: theme.transitions.duration.shorter,
            }),
            color: !isDisabled && isSelected ? 'primary.main' : 'inherit',
            '& .MuiTypography-root': {
              fontWeight: !isDisabled && isSelected ? 600 : 400,
              whiteSpace: 'nowrap',
            },
          }}
        />
      </ListItemButton>
    )

    return (
      <ListItem key={action.id} disablePadding sx={{ display: 'block' }}>
        {isExpanded && !isDisabled ? (
          listItemButton
        ) : (
          <Tooltip title={tooltipTitle} placement="right">
            <span style={{ display: 'block' }}>{listItemButton}</span>
          </Tooltip>
        )}
      </ListItem>
    )
  }

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
          height: '100%',
          minHeight: '100%',
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 64,
          px: 0,
          justifyContent: 'flex-start',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Box
          sx={{
            minWidth: 64,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={!isExpanded ? handleToggle : undefined}
        >
          <Box
            component="img"
            src="/zerp_icon_foreground.svg"
            alt="ZERP"
            sx={{ width: 30, height: 30, display: 'block' }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexGrow: 1,
            pr: 1.5,
            opacity: isExpanded ? 1 : 0,
            transition: theme.transitions.create('opacity', {
              duration: theme.transitions.duration.shorter,
            }),
            pointerEvents: isExpanded ? 'auto' : 'none',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography fontWeight={700} noWrap>
            {appConfig.app.name}
          </Typography>
          <IconButton onClick={handleToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      </Box>

      <List sx={{ pt: 1 }}>{renderAction(DASHBOARD_ACTION)}</List>

      <Divider sx={{ my: 1 }} />

      {sidebarSections.map((section) => (
        <List key={section.id} sx={{ pt: 0 }}>
          {isExpanded && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ px: 3, py: 1.25, display: 'block' }}
            >
              {t(section.labelKey)}
            </Typography>
          )}
          {section.actions.map((action) => renderAction(action, true))}
        </List>
      ))}
    </Drawer>
  )
}
