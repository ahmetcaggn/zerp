'use client'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Autocomplete,
  Box,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'

import type { MenuItemProductItemDto, ProductResponseDto } from '../../../types/sale'

interface MenuItemProductMultiSelectFieldProps {
  products: ProductResponseDto[]
  productItems: MenuItemProductItemDto[]
  onChange: (productItems: MenuItemProductItemDto[]) => void
  label: string
  placeholder: string
  quantityLabel: string
  disabled?: boolean
}

export function MenuItemProductMultiSelectField({
  products,
  productItems,
  onChange,
  label,
  placeholder,
  quantityLabel,
  disabled = false,
}: MenuItemProductMultiSelectFieldProps) {
  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>()
    return products.filter((product) => {
      if (seen.has(product.id)) {
        return false
      }
      seen.add(product.id)
      return true
    })
  }, [products])

  const selectedProductIds = useMemo(
    () => new Set(productItems.map((item) => item.productId)),
    [productItems],
  )

  const selectedProducts = useMemo(
    () => uniqueProducts.filter((product) => selectedProductIds.has(product.id)),
    [selectedProductIds, uniqueProducts],
  )

  function clampQuantity(rawQuantity: number) {
    if (!Number.isFinite(rawQuantity)) {
      return 1
    }
    return Math.max(1, Math.floor(rawQuantity))
  }

  function handleSelectionChange(value: ProductResponseDto[]) {
    const selectedIds = new Set(value.map((product) => product.id))
    const nextItems = value.map((product) => {
      const existing = productItems.find((item) => item.productId === product.id)
      return {
        productId: product.id,
        quantity: clampQuantity(existing?.quantity ?? 1),
      }
    })

    if (nextItems.length !== selectedIds.size) {
      return
    }
    onChange(nextItems)
  }

  function handleQuantityChange(productId: string, quantity: number) {
    onChange(
      productItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: clampQuantity(quantity) }
          : item,
      ),
    )
  }

  function removeProduct(productId: string) {
    onChange(productItems.filter((item) => item.productId !== productId))
  }

  return (
    <Stack spacing={1.25}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        disabled={disabled}
        options={uniqueProducts}
        getOptionKey={(option) => option.id}
        value={selectedProducts}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, value) => handleSelectionChange(value)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index })
            return <Chip key={key} {...tagProps} label={option.name} size="small" />
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
          />
        )}
      />

      {productItems.map((item) => {
        const product = uniqueProducts.find((candidate) => candidate.id === item.productId)
        return (
          <Box
            key={item.productId}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, border: 1, borderColor: 'divider', borderRadius: 1, px: 1.25, py: 0.75 }}
          >
            <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
              {product?.name ?? item.productId}
            </Typography>
            <TextField
              size="small"
              type="number"
              label={quantityLabel}
              value={item.quantity}
              onChange={(event) => handleQuantityChange(item.productId, Number(event.target.value))}
              inputProps={{ min: 1, step: 1 }}
              disabled={disabled}
              sx={{ width: 110 }}
            />
            <IconButton
              size="small"
              onClick={() => removeProduct(item.productId)}
              disabled={disabled}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        )
      })}
    </Stack>
  )
}
