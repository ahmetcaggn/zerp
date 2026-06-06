'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import type { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useMenuCategories } from '../../hooks/use-menu-categories'
import { useMenuItems } from '../../hooks/use-menu-items'
import { useProductExtraOptions } from '../../hooks/use-product-extra-options'
import { useShopTables } from '../../hooks/use-shop-tables'
import {
  useCreateTableOrder,
  useDeleteTableOrder,
  usePatchTableOrder,
  usePreviewPublicCartOrder,
  useTableOrders,
  useUpdateTableOrder,
} from '../../hooks/use-table-orders'
import {
  shopParents,
  shopTableParents,
  targetWithParents,
} from '../../permissions/permission-targets'
import type {
  MenuItemResponseDto,
  ProductExtraOptionResponseDto,
  PublicCartOrderPreviewDto,
  TableOrderResponseDto,
} from '../../types/sale'
import { CategoryChips } from './category-chips'
import { ExtraOptionSelectDialog } from './extra-option-select-dialog'
import { OrderPanel } from './order-panel'
import { ProductGrid } from './product-grid'
import { mergeNotes, mergePublicCartOrderIntoCart } from './public-cart-order-import'

export interface CartSelectedExtraOption {
  extraOptionId: string
  name: string
  price: number
}

export interface CartItem {
  cartKey: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
  selectedExtraOptions: CartSelectedExtraOption[]
}

const STATUS_COLORS: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  AVAILABLE: 'success',
  OCCUPIED: 'error',
  RESERVED: 'warning',
  OUT_OF_ORDER: 'default',
}

const STATUS_I18N_KEY: Record<string, string> = {
  AVAILABLE: 'pos.statusAvailable',
  OCCUPIED: 'pos.statusOccupied',
  RESERVED: 'pos.statusReserved',
  OUT_OF_ORDER: 'pos.statusOutOfOrder',
}

function toCartExtraOptions(options: ProductExtraOptionResponseDto[]): CartSelectedExtraOption[] {
  return options.map((option) => ({
    extraOptionId: option.id,
    name: option.name,
    price: option.price,
  }))
}

function toCartKey(menuItemId: string, selectedExtraOptions: CartSelectedExtraOption[]) {
  const sortedExtraIds = [...selectedExtraOptions].map((option) => option.extraOptionId).sort()
  return `${menuItemId}::${sortedExtraIds.join(',')}`
}

export function PosView() {
  const { locale, t } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableId = searchParams.get('tableId')
  const { showToast } = useToast()
  const { currentTenantId, hasShopPermission, hasPermissionForTarget } = useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderNote, setOrderNote] = useState('')
  const [activeEditOrderId, setActiveEditOrderId] = useState<string | null>(null)
  const [extraDialogOpen, setExtraDialogOpen] = useState(false)
  const [pendingItemForExtra, setPendingItemForExtra] = useState<MenuItemResponseDto | null>(null)
  const [pendingAddTarget, setPendingAddTarget] = useState<
    { type: 'cart' } | { type: 'order'; orderId: string; quantity: number; notes?: string } | null
  >(null)

  const canReadTables = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_SHOP_TABLE, selectedShopId),
  )
  const canReadCategories = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_MENU_CATEGORY, selectedShopId),
  )
  const canReadMenuItems = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_MENU_ITEM, selectedShopId),
  )
  const canReadExtraOptions = Boolean(
    selectedShopId &&
    hasShopPermission(PermissionActions.READ_PRODUCT_EXTRA_OPTION, selectedShopId),
  )
  const canReadOrdersForTable = hasPermissionForTarget(
    PermissionActions.READ_TABLE_ORDER,
    targetWithParents(
      'SHOP_TABLE',
      tableId,
      currentTenantId,
      shopParents(selectedShopId, currentTenantId),
    ),
  )
  const canCreateOrderForTable = hasPermissionForTarget(
    PermissionActions.CREATE_TABLE_ORDER,
    targetWithParents(
      'SHOP_TABLE',
      tableId,
      currentTenantId,
      shopParents(selectedShopId, currentTenantId),
    ),
  )

  const { data: tablesData } = useShopTables(
    {
      pagination: { page: 1, perPage: 100 },
      ...(selectedShopId ? { filter: { shopId: selectedShopId, 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadTables },
  )
  const { data: catData, isLoading: isCatLoading } = useMenuCategories(
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'displayOrder', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'menu.shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadCategories },
  )
  const { data: itemsData, isLoading: isItemsLoading } = useMenuItems(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'name', order: 'ASC' },
      filter: {
        ...(selectedShopId ? { 'category.menu.shop.id': selectedShopId } : {}),
        ...(selectedCategoryId ? { 'category.id': selectedCategoryId } : {}),
      },
    },
    { enabled: canReadMenuItems },
  )
  const { data: extraOptionsData } = useProductExtraOptions(
    {
      pagination: { page: 1, perPage: 500 },
      filter: {
        ...(selectedShopId ? { 'product.shop.id': selectedShopId } : {}),
        isActive: 'true',
      },
    },
    { enabled: canReadExtraOptions },
  )
  const { data: ordersData } = useTableOrders(
    {
      filter: {
        ...(selectedShopId ? { shopId: selectedShopId, 'shop.id': selectedShopId } : {}),
        'shopTable.id': tableId ?? '__none__',
        status: 'OPEN',
      },
      pagination: { page: 1, perPage: 20 },
    },
    { enabled: Boolean(tableId) && canReadOrdersForTable },
  )
  const { mutate: createOrder, isPending } = useCreateTableOrder()
  const { mutate: patchOrder, isPending: isPatchPending } = usePatchTableOrder()
  const { mutate: updateOrder, isPending: isUpdatePending } = useUpdateTableOrder()
  const { mutate: deleteOrder, isPending: isDeletePending } = useDeleteTableOrder()
  const { mutate: previewPublicCartOrder, isPending: isImportPending } = usePreviewPublicCartOrder()

  const table = tablesData?.data?.find((t) => t.id === tableId)
  const categories = catData?.data ?? []
  const menuItems = itemsData?.data ?? []
  const existingOrders = useMemo(() => ordersData?.data ?? [], [ordersData?.data])
  const extraOptions = useMemo(() => extraOptionsData?.data ?? [], [extraOptionsData?.data])

  const selectableExtraOptions = useMemo(() => {
    if (!pendingItemForExtra) return []
    const productIds = new Set(
      (pendingItemForExtra.productItems ?? []).map((product) => product.productId),
    )
    return extraOptions.filter((option) => productIds.has(option.productId))
  }, [extraOptions, pendingItemForExtra])

  function tableOrderTarget(order: TableOrderResponseDto) {
    return targetWithParents(
      'TABLE_ORDER',
      order.id,
      currentTenantId,
      shopTableParents(order.shopTableId, order.shopId, currentTenantId),
    )
  }

  function canUpdateOrder(order: TableOrderResponseDto): boolean {
    return hasPermissionForTarget(PermissionActions.UPDATE_TABLE_ORDER, tableOrderTarget(order))
  }

  function canDeleteOrder(order: TableOrderResponseDto): boolean {
    return hasPermissionForTarget(PermissionActions.DELETE_TABLE_ORDER, tableOrderTarget(order))
  }

  function addToCart(item: MenuItemResponseDto, selectedOptions: ProductExtraOptionResponseDto[]) {
    const selectedExtraOptions = toCartExtraOptions(selectedOptions)
    const extraTotal = selectedExtraOptions.reduce((sum, extra) => sum + extra.price, 0)
    const cartKey = toCartKey(item.id, selectedExtraOptions)

    setCart((prev) => {
      const idx = prev.findIndex((cartItem) => cartItem.cartKey === cartKey)
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [
        ...prev,
        {
          cartKey,
          menuItemId: item.id,
          name: item.name,
          price: (item.price ?? 0) + extraTotal,
          quantity: 1,
          selectedExtraOptions,
        },
      ]
    })
  }

  function handleProductAdd(item: MenuItemResponseDto) {
    const targetOrderId =
      activeEditOrderId && existingOrders.some((order) => order.id === activeEditOrderId)
        ? activeEditOrderId
        : null
    const productIds = new Set((item.productItems ?? []).map((product) => product.productId))
    const itemOptions = extraOptions.filter((option) => productIds.has(option.productId))
    if (targetOrderId) {
      const targetOrder = existingOrders.find((order) => order.id === targetOrderId)
      if (!targetOrder || !canUpdateOrder(targetOrder)) {
        showToast(unauthorizedReason, { severity: 'warning' })
        return
      }
    } else if (!canCreateOrderForTable) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    if (itemOptions.length === 0) {
      if (targetOrderId) {
        appendItemToOrder(targetOrderId, item, 1, undefined, [])
      } else {
        addToCart(item, [])
      }
      return
    }
    setPendingItemForExtra(item)
    setPendingAddTarget(
      targetOrderId ? { type: 'order', orderId: targetOrderId, quantity: 1 } : { type: 'cart' },
    )
    setExtraDialogOpen(true)
  }

  function appendItemToOrder(
    orderId: string,
    menuItem: MenuItemResponseDto,
    quantity: number,
    notes: string | undefined,
    selectedOptions: ProductExtraOptionResponseDto[],
  ) {
    const order = existingOrders.find((it) => it.id === orderId)
    if (!order) return
    if (!canUpdateOrder(order)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    const updatedItems = [
      ...order.items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
        selectedExtraOptionIds: item.selectedExtraOptions?.map((option) => option.extraOptionId),
      })),
      {
        menuItemId: menuItem.id,
        quantity,
        notes,
        selectedExtraOptionIds: selectedOptions.map((option) => option.id),
      },
    ]
    updateOrder(
      { id: order.id, data: { note: order.note, items: updatedItems } },
      {
        onSuccess: () => showToast(t('pos.orderUpdatedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function updateQuantity(cartKey: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(cartKey: string) {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey))
  }

  function handleCancelOrder(orderId: string) {
    const order = existingOrders.find((item) => item.id === orderId)
    if (!order || !canUpdateOrder(order)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    patchOrder(
      { id: orderId, fields: { status: 'CANCELLED' } },
      {
        onSuccess: () => showToast(t('pos.orderCancelledToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUpdateOrderItemQty(order: TableOrderResponseDto, itemId: string, delta: number) {
    if (!canUpdateOrder(order)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    const target = order.items.find((i) => i.id === itemId)
    if (!target) return
    const newQty = target.quantity + delta
    const newItems = order.items
      .map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.id === itemId ? newQty : item.quantity,
        notes: item.notes,
        selectedExtraOptionIds: item.selectedExtraOptions?.map((option) => option.extraOptionId),
      }))
      .filter((item) => item.quantity > 0)
    if (newItems.length === 0) {
      if (!canDeleteOrder(order)) {
        showToast(unauthorizedReason, { severity: 'warning' })
        return
      }
      deleteOrder(order.id, {
        onSuccess: () => showToast(t('pos.orderDeletedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      })
      return
    }
    updateOrder(
      { id: order.id, data: { items: newItems } },
      {
        onSuccess: () => showToast(t('pos.orderUpdatedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUpdateOrderNote(orderId: string, note: string) {
    const order = existingOrders.find((item) => item.id === orderId)
    if (!order || !canUpdateOrder(order)) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    patchOrder(
      { id: orderId, fields: { note: note.trim() ? note : undefined } },
      {
        onSuccess: () => showToast(t('pos.orderUpdatedToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handlePlaceOrder() {
    if (!tableId || cart.length === 0) return
    if (!canCreateOrderForTable) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    createOrder(
      {
        tableId,
        note: orderNote || undefined,
        items: cart.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes,
          selectedExtraOptionIds: item.selectedExtraOptions.map((extra) => extra.extraOptionId),
        })),
      },
      {
        onSuccess: () => {
          showToast(t('pos.orderCreatedToast'))
          setCart([])
          setOrderNote('')
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function addImportedPublicCartOrder(preview: PublicCartOrderPreviewDto) {
    setCart((prev) => mergePublicCartOrderIntoCart(prev, preview))
    setOrderNote((prev) => mergeNotes(prev, preview.note) ?? '')
  }

  function handleImportPublicCartOrder(code: string, onSuccess?: () => void) {
    if (!tableId) return
    if (!canCreateOrderForTable) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }
    previewPublicCartOrder(
      { code, tableId },
      {
        onSuccess: (preview) => {
          addImportedPublicCartOrder(preview)
          showToast(t('pos.importQrSuccess'))
          onSuccess?.()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleExtraDialogClose() {
    setExtraDialogOpen(false)
    setPendingItemForExtra(null)
    setPendingAddTarget(null)
  }

  function handleExtraDialogConfirm(selectedOptions: ProductExtraOptionResponseDto[]) {
    if (pendingItemForExtra && pendingAddTarget) {
      if (pendingAddTarget.type === 'cart') {
        addToCart(pendingItemForExtra, selectedOptions)
      } else {
        appendItemToOrder(
          pendingAddTarget.orderId,
          pendingItemForExtra,
          pendingAddTarget.quantity,
          pendingAddTarget.notes,
          selectedOptions,
        )
      }
    }
    handleExtraDialogClose()
  }

  const activeOrderForAdd = activeEditOrderId
    ? existingOrders.find((order) => order.id === activeEditOrderId)
    : undefined
  const canAddMenuItem = Boolean(
    canReadMenuItems &&
    (activeOrderForAdd ? canUpdateOrder(activeOrderForAdd) : canCreateOrderForTable),
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1.5,
          minHeight: 60,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={() => router.push(`/${locale}/tables` as Route)}
          size="large"
          sx={{ p: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        {table ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {table.name}
            </Typography>
            <Chip
              label={t(STATUS_I18N_KEY[table.status] ?? 'pos.statusAvailable')}
              color={STATUS_COLORS[table.status] ?? 'default'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        ) : (
          <Typography variant="h6" fontWeight={700}>
            {t('nav.cashier')}
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CategoryChips
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            isLoading={isCatLoading}
          />
          <ProductGrid
            items={menuItems}
            cart={cart}
            onAdd={handleProductAdd}
            isLoading={isItemsLoading}
            disabled={!canAddMenuItem}
          />
        </Box>
        <OrderPanel
          table={table}
          cart={cart}
          existingOrders={existingOrders}
          orderNote={orderNote}
          onNoteChange={setOrderNote}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onPlaceOrder={handlePlaceOrder}
          onCancelOrder={handleCancelOrder}
          onUpdateOrderNote={handleUpdateOrderNote}
          onUpdateOrderItemQty={handleUpdateOrderItemQty}
          activeEditOrderId={activeEditOrderId}
          onToggleEditOrder={(orderId) => {
            setActiveEditOrderId((prev) => (prev === orderId ? null : orderId))
          }}
          onImportPublicCartOrder={handleImportPublicCartOrder}
          canCreateOrder={canCreateOrderForTable}
          canUpdateOrder={canUpdateOrder}
          canDeleteOrder={canDeleteOrder}
          isImportPending={isImportPending}
          isPending={isPending || isPatchPending || isUpdatePending || isDeletePending}
        />
      </Box>

      <ExtraOptionSelectDialog
        open={extraDialogOpen}
        item={pendingItemForExtra}
        options={selectableExtraOptions}
        onClose={handleExtraDialogClose}
        onConfirm={handleExtraDialogConfirm}
      />
    </Box>
  )
}
