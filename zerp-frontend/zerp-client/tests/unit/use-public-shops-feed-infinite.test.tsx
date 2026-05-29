import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePublicShopsFeedInfinite } from '@/modules/restaurants/hooks/use-public-sale'

const mockGetPublicShopsFeed = vi.fn()

vi.mock('@/modules/restaurants/api/public-sale-client', () => ({
  getPublicShops: vi.fn(),
  getPublicNearbyShops: vi.fn(),
  getPublicShopsFeed: (params: unknown) => mockGetPublicShopsFeed(params),
  getPublicShopMenu: vi.fn(),
  getPublicCategoryMenuItems: vi.fn(),
  createPublicCartOrder: vi.fn(),
}))

describe('usePublicShopsFeedInfinite', () => {
  beforeEach(() => {
    mockGetPublicShopsFeed.mockReset()
  })

  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
  }

  it('uses nextPage as pageParam and stops when hasMore=false', async () => {
    mockGetPublicShopsFeed
      .mockResolvedValueOnce({
        items: [{ id: '1', name: 'Alpha' }],
        page: 1,
        pageSize: 1,
        nextPage: 2,
        totalPages: 2,
        hasMore: true,
        total: 2,
      })
      .mockResolvedValueOnce({
        items: [{ id: '2', name: 'Beta' }],
        page: 2,
        pageSize: 1,
        nextPage: null,
        totalPages: 2,
        hasMore: false,
        total: 2,
      })

    const { result } = renderHook(
      () =>
        usePublicShopsFeedInfinite({
          mode: 'ALL',
          pageSize: 1,
          sortBy: 'NAME',
          order: 'ASC',
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(1)
    })

    expect(mockGetPublicShopsFeed).toHaveBeenNthCalledWith(1, expect.objectContaining({
      mode: 'ALL',
      page: 1,
      pageSize: 1,
    }))

    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2)
    })

    expect(mockGetPublicShopsFeed).toHaveBeenNthCalledWith(2, expect.objectContaining({
      mode: 'ALL',
      page: 2,
      pageSize: 1,
    }))
    expect(result.current.hasNextPage).toBe(false)
  })

  it('restarts pagination when query params change', async () => {
    mockGetPublicShopsFeed.mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 12,
      nextPage: null,
      totalPages: 0,
      hasMore: false,
      total: 0,
    })

    const { rerender } = renderHook(
      ({ q }) =>
        usePublicShopsFeedInfinite({
          mode: 'ALL',
          pageSize: 12,
          sortBy: 'NAME',
          order: 'ASC',
          q,
        }),
      {
        initialProps: { q: 'pizza' },
        wrapper: createWrapper(),
      },
    )

    await waitFor(() => {
      expect(mockGetPublicShopsFeed).toHaveBeenCalledTimes(1)
    })

    rerender({ q: 'burger' })

    await waitFor(() => {
      expect(mockGetPublicShopsFeed).toHaveBeenCalledTimes(2)
    })

    expect(mockGetPublicShopsFeed).toHaveBeenNthCalledWith(1, expect.objectContaining({
      q: 'pizza',
      page: 1,
    }))
    expect(mockGetPublicShopsFeed).toHaveBeenNthCalledWith(2, expect.objectContaining({
      q: 'burger',
      page: 1,
    }))
  })

  it('does not fetch nearby feed until coordinates exist', async () => {
    renderHook(
      () =>
        usePublicShopsFeedInfinite({
          mode: 'NEARBY',
          pageSize: 12,
          sortBy: 'DISTANCE',
          order: 'ASC',
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockGetPublicShopsFeed).not.toHaveBeenCalled()
    })
  })
})
