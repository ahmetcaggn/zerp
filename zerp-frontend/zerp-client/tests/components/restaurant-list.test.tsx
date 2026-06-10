import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RestaurantList } from '@/modules/restaurants/ui/restaurant-list'

const mockUsePublicShopsFeedInfinite = vi.fn()

let searchParamsValues: Record<string, string | null> = {
  lat: null,
  lng: null,
}

let observerCallback: IntersectionObserverCallback | null = null

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]

  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback
  }

  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn(() => [])
  unobserve = vi.fn()
}

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => searchParamsValues[key] ?? null,
  }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/core/i18n/i18n-provider', () => ({
  useI18n: () => ({
    locale: 'tr',
    t: (key: string) => key,
  }),
}))

vi.mock('@/modules/restaurants/hooks/use-public-sale', () => ({
  usePublicShopsFeedInfinite: (params: unknown) => mockUsePublicShopsFeedInfinite(params),
}))

vi.mock('@/modules/restaurants/ui/restaurant-card', () => ({
  RestaurantCard: ({ restaurant }: { restaurant: { name: string } }) => <div>{restaurant.name}</div>,
}))

describe('RestaurantList', () => {
  beforeEach(() => {
    searchParamsValues = { lat: null, lng: null }
    observerCallback = null
    mockUsePublicShopsFeedInfinite.mockReset()
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  it('enables district filter when city is selected', async () => {
    mockUsePublicShopsFeedInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isError: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    })

    render(<RestaurantList />)

    const districtSelect = screen.getByRole('combobox', { name: 'restaurants.districtLabel' })
    expect(districtSelect).toHaveAttribute('aria-expanded', 'false')
    expect(districtSelect).toHaveAttribute('aria-disabled', 'true')

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'restaurants.cityLabel' }))
    fireEvent.click(await screen.findByRole('option', { name: 'Adana' }))

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'restaurants.districtLabel' })).not.toHaveAttribute('aria-disabled')
    })
  })

  it('hides city and district selectors in nearby mode', () => {
    searchParamsValues = { lat: '41.0082', lng: '28.9784' }

    mockUsePublicShopsFeedInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isError: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    })

    render(<RestaurantList />)

    expect(screen.queryByLabelText('restaurants.cityLabel')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('restaurants.districtLabel')).not.toBeInTheDocument()
    expect(screen.getByText('restaurants.nearbyFiltersDisabled')).toBeInTheDocument()
  })

  it('fetches next page when sentinel enters viewport', async () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined)

    mockUsePublicShopsFeedInfinite.mockReturnValue({
      data: {
        pages: [
          {
            items: [
              {
                id: 'shop-1',
                name: 'North Cafe',
                latitude: 41.0,
                longitude: 29.0,
              },
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage,
    })

    render(<RestaurantList />)

    expect(observerCallback).not.toBeNull()

    observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    await waitFor(() => {
      expect(fetchNextPage).toHaveBeenCalledTimes(1)
    })
  })

  it('clears applied restaurant filters and fetches the unfiltered list', async () => {
    mockUsePublicShopsFeedInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isError: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    })

    render(<RestaurantList />)

    const searchInput = screen.getAllByPlaceholderText('restaurants.searchPlaceholder')[0]
    fireEvent.change(searchInput, { target: { value: 'pizza' } })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    await waitFor(() => {
      expect(mockUsePublicShopsFeedInfinite).toHaveBeenLastCalledWith(
        expect.objectContaining({ q: 'pizza' }),
      )
    })

    fireEvent.click(screen.getByRole('button', { name: 'restaurants.clearFilters' }))

    await waitFor(() => {
      expect(mockUsePublicShopsFeedInfinite).toHaveBeenLastCalledWith(
        expect.objectContaining({
          mode: 'ALL',
          q: undefined,
          city: undefined,
          state: undefined,
          cuisineCategories: [],
          sortBy: 'NAME',
          order: 'ASC',
        }),
      )
    })
  })
})
