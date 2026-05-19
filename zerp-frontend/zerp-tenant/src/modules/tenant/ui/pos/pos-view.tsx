'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import type { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
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
  useTableOrders,
  useUpdateTableOrder,
} from '../../hooks/use-table-orders'
import type {
  MenuItemResponseDto,
  ProductExtraOptionResponseDto,
  TableOrderResponseDto,
} from '../../types/sale'
import { CategoryChips } from './category-chips'
import { ExtraOptionSelectDialog } from './extra-option-select-dialog'
import { OrderPanel } from './order-panel'
import { ProductGrid } from './product-grid'

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
  return options.map(option => ({
    extraOptionId: option.id,
    name: option.name,
    price: option.price,
  }))
}

function toCartKey(menuItemId: string, selectedExtraOptions: CartSelectedExtraOption[]) {
  const sortedExtraIds = [...selectedExtraOptions]
    .map(option => option.extraOptionId)
    .sort()
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

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderNote, setOrderNote] = useState('')
  const [extraDialogOpen, setExtraDialogOpen] = useState(false)
  const [pendingItemForExtra, setPendingItemForExtra] = useState<MenuItemResponseDto | null>(null)

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
  const { data: extraOptionsData } = useProductExtraOptions({
    pagination: { page: 1, perPage: 500 },
    filter: {
      ...(selectedShopId ? { 'product.shop.id': selectedShopId } : {}),
      isActive: 'true',
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
  const extraOptions = extraOptionsData?.data ?? []

  const selectableExtraOptions = useMemo(() => {
    if (!pendingItemForExtra) return []
    const productIds = new Set((pendingItemForExtra.productItems ?? []).map(product => product.productId))
    return extraOptions.filter(option => productIds.has(option.productId))
  }, [extraOptions, pendingItemForExtra])

  function addToCart(item: MenuItemResponseDto, selectedOptions: ProductExtraOptionResponseDto[]) {
    const selectedExtraOptions = toCartExtraOptions(selectedOptions)
    const extraTotal = selectedExtraOptions.reduce((sum, extra) => sum + extra.price, 0)
    const cartKey = toCartKey(item.id, selectedExtraOptions)

    setCart(prev => {
      const idx = prev.findIndex(cartItem => cartItem.cartKey === cartKey)
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
    const productIds = new Set((item.productItems ?? []).map(product => product.productId))
    const itemOptions = extraOptions.filter(option => productIds.has(option.productId))
    if (itemOptions.length === 0) {
      addToCart(item, [])
      return
    }
    setPendingItemForExtra(item)
    setExtraDialogOpen(true)
  }

  function updateQuantity(cartKey: string, delta: number) {
    setCart(prev =>
      prev
        .map(item => item.cartKey === cartKey ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0),
    )
  }

  function removeFromCart(cartKey: string) {
    setCart(prev => prev.filter(item => item.cartKey !== cartKey))
  }

  function handleCancelOrder(orderId: string) {
    patchOrder(
      { id: orderId, fields: { status: 'CANCELLED' } },
      {
        onSuccess: () => showToast(t('pos.orderCancelledToast')),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleUpdateOrderItemQty(order: TableOrderResponseDto, itemId: string, delta: number) {
    const target = order.items.find(i => i.id === itemId)
    if (!target) return
    const newQty = target.quantity + delta
    const newItems = order.items
      .map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.id === itemId ? newQty : item.quantity,
        notes: item.notes,
        selectedExtraOptionIds: item.selectedExtraOptions?.map(option => option.extraOptionId),
      }))
      .filter(item => item.quantity > 0)
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
      },
    )
  }

  function handlePlaceOrder() {
    if (!tableId || cart.length === 0) return
    createOrder(
      {
        tableId,
        note: orderNote || undefined,
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes,
          selectedExtraOptionIds: item.selectedExtraOptions.map(extra => extra.extraOptionId),
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

  function handleExtraDialogClose() {
    setExtraDialogOpen(false)
    setPendingItemForExtra(null)
  }

  function handleExtraDialogConfirm(selectedOptions: ProductExtraOptionResponseDto[]) {
    if (pendingItemForExtra) {
      addToCart(pendingItemForExtra, selectedOptions)
    }
    handleExtraDialogClose()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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
