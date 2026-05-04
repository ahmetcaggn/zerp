import { createResourceClient } from '@/core/api/resource-client'
import type {
  MenuItemResponseDto,
  MenuItemListResponseDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
} from '../types/sale'

export const menuItemClient = createResourceClient<
  MenuItemResponseDto,
  MenuItemListResponseDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
  string
>('/sale/menu-items')
