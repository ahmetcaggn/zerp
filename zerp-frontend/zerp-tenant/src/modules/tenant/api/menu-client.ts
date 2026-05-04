import { createResourceClient } from '@/core/api/resource-client'
import type {
  MenuResponseDto,
  MenuListResponseDto,
  CreateMenuRequestDto,
  UpdateMenuRequestDto,
} from '../types/sale'

export const menuClient = createResourceClient<
  MenuResponseDto,
  MenuListResponseDto,
  CreateMenuRequestDto,
  UpdateMenuRequestDto,
  string
>('/sale/menus')
