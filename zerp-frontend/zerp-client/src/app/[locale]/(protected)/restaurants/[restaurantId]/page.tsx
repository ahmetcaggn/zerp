import { MenuItemList } from '@/modules/restaurants/ui/menu-item-list'

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params

  return <MenuItemList restaurantId={restaurantId} />
}
