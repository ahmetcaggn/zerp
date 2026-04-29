import { ProductList } from '@/modules/restaurants/ui/product-list'

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params

  return <ProductList restaurantId={restaurantId} />
}
