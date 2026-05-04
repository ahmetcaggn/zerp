import { createResourceClient } from '@/core/api/resource-client'
import type {
  MenuCategoryResponseDto,
  MenuCategoryListResponseDto,
  CreateMenuCategoryRequestDto,
  UpdateMenuCategoryRequestDto,
} from '../types/sale'

export const menuCategoryClient = createResourceClient<
  MenuCategoryResponseDto,
  MenuCategoryListResponseDto,
  CreateMenuCategoryRequestDto,
  UpdateMenuCategoryRequestDto,
  string
>('/sale/menu-categories')
