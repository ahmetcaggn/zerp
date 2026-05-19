'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import type { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useMenuCategories } from '../../hooks/use-menu-categories'
import { useMenuItems } from '../../hooks/use-menu-items'
import { useShopTables } from '../../hooks/use-shop-tables'
import { useCreateTableOrder, useDeleteTableOrder,usePatchTableOrder, useTableOrders, useUpdateTableOrder } from '../../hooks/use-table-orders'
import type { MenuItemResponseDto, TableOrderResponseDto } from '../../types/sale'
import { CategoryChips } from './category-chips'
import { OrderPanel } from './order-panel'
import { ProductGrid } from './product-grid'

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
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

export function PosView() {
  const { locale, t } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableId = searchParams.get('tableId')
  const { showToast } = useToast()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderNote, setOrderNote] = useState('')

  const { data: tablesData } = useShopTables({
    pagination: { page: 1, perPage: 100 },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const { data: catData, isLoading: isCatLoading } = useMenuCategories({
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'menu.shop.id': selectedShopId } } : {}),
  })
  const { data: itemsData, isLoading: isItemsLoading } = useMenuItems({
    pagination: { page: 1, perPage: 200 },
    sort: { field: 'name', order: 'ASC' },
    filter: {
      ...(selectedShopId ? { 'category.menu.shop.id': selectedShopId } : {}),
      ...(selectedCategoryId ? { 'category.id': selectedCategoryId } : {}),
    },
  })
  const { data: ordersData } = useTableOrders({
    filter: { 'shopTable.id': tableId ?? '__none__', status: 'OPEN' },
    pagination: { page: 1, perPage: 20 },
  })
  const { mutate: createOrder, isPending } = useCreateTableOrder()
  const { mutate: patchOrder, isPending: isPatchPending } = usePatchTableOrder()
  const { mutate: updateOrder, isPending: isUpdatePending } = useUpdateTableOrder()
  const { mutate: deleteOrder, isPending: isDeletePending } = useDeleteTableOrder()

  const table = tablesData?.data?.find(t => t.id === tableId)
  const categories = catData?.data ?? []
  const menuItems = itemsData?.data ?? []
  const existingOrders = ordersData?.data ?? []

  function addToCart(item: MenuItemResponseDto) {
    setCart(prev => {
      const idx = prev.findIndex(c => c.menuItemId === item.id)
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price ?? 0, quantity: 1 }]
    })
  }

  function updateQuantity(menuItemId: string, delta: number) {
    setCart(prev =>
      prev
        .map(c => c.menuItemId === menuItemId ? { ...c, quantity: c.quantity + delta } : c)
        .filter(c => c.quantity > 0)
    )
  }

  function removeFromCart(menuItemId: string) {
    setCart(prev => prev.filter(c => c.menuItemId !== menuItemId))
  }

  function handleCancelOrder(orderId: string) {
    patchOrder(
      { id: orderId, fields: { status: 'CANCELLED' } },
      {
        onSuccess: () => showToast(t('pos.orderCancelledToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      }
    )
  }

  function handleUpdateOrderItemQty(order: TableOrderResponseDto, itemId: string, delta: number) {
    const target = order.items.find(i => i.id === itemId)
    if (!target) return
    const newQty = target.quantity + delta
    const newItems = order.items
      .map(i => ({ menuItemId: i.menuItemId, quantity: i.id === itemId ? newQty : i.quantity, notes: i.notes }))
      .filter(i => i.quantity > 0)
    if (newItems.length === 0) {
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
      }
    )
  }

  function handlePlaceOrder() {
    if (!tableId || cart.length === 0) return
    createOrder(
      {
        tableId,
        note: orderNote || undefined,
        items: cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity, notes: c.notes })),
      },
      {
        onSuccess: () => {
          showToast(t('pos.orderCreatedToast'))
          setCart([])
          setOrderNote('')
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      }
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top bar */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: 1.5, minHeight: 60,
          bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <IconButton onClick={() => router.push(`/${locale}/tables` as Route)} size="large" sx={{ p: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        {table ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={700}>{table.name}</Typography>
            <Chip
              label={t(STATUS_I18N_KEY[table.status] ?? 'pos.statusAvailable')}
              color={STATUS_COLORS[table.status] ?? 'default'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        ) : (
          <Typography variant="h6" fontWeight={700}>{t('nav.cashier')}</Typography>
        )}
      </Box>

      {/* Product area + order panel */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: category chips + product grid */}
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
            onAdd={addToCart}
            isLoading={isItemsLoading}
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
          onUpdateOrderItemQty={handleUpdateOrderItemQty}
          isPending={isPending || isPatchPending || isUpdatePending || isDeletePending}
        />
      </Box>
    </Box>
  )
}
