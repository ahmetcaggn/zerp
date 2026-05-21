'use client'

import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { SyntheticEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { queryKeys } from '@/core/api/query-keys'
import { useI18n } from '@/core/i18n/i18n-provider'

import { tenantClient } from '../api/tenant-client'
import { useTenant } from '../hooks/use-tenants'
import type { TenantResponse } from '../types/tenant'

const TENANT_PAGE_SIZE = 25
const TENANT_SEARCH_DEBOUNCE_MS = 350
const TENANT_SCROLL_LOAD_THRESHOLD_PX = 48

interface TenantAutocompleteProps {
  value: string | null
  onChange: (tenantId: string | null) => void
  label: string
  disabled?: boolean
  required?: boolean
  enabled?: boolean
  selectedTenantName?: string | null
}

export function TenantAutocomplete({
  value,
  onChange,
  label,
  disabled = false,
  required = false,
  enabled = true,
  selectedTenantName = null,
}: TenantAutocompleteProps) {
  const { t } = useI18n()
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, TENANT_SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchInput])

  const infiniteTenantsQuery = useInfiniteQuery({
    queryKey: [...queryKeys.admin.tenants, 'autocomplete', debouncedSearch],
    enabled: enabled && !disabled,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      tenantClient.getList({
        pagination: { page: pageParam, perPage: TENANT_PAGE_SIZE },
        sort: { field: 'name', order: 'ASC' },
        filter: debouncedSearch ? { 'name.like': debouncedSearch } : {},
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (loaded >= lastPage.total) {
        return undefined
      }
      return allPages.length + 1
    },
  })

  const options = useMemo(() => {
    const pages = infiniteTenantsQuery.data?.pages ?? []
    const byId = new Map<string, TenantResponse>()

    pages.forEach((page) => {
      page.data.forEach((tenant) => {
        if (!tenant.id) {
          return
        }
        byId.set(tenant.id, tenant)
      })
    })

    return Array.from(byId.values())
  }, [infiniteTenantsQuery.data?.pages])

  const selectedTenantFromId = useTenant(value ?? undefined, {
    enabled:
      enabled &&
      Boolean(value) &&
      !options.some((option) => option.id === value) &&
      !selectedTenantName,
  })

  const selectedOption = useMemo(() => {
    if (!value) {
      return null
    }

    const found = options.find((option) => option.id === value)
    if (found) {
      return found
    }

    if (selectedTenantName) {
      return { id: value, name: selectedTenantName }
    }

    return selectedTenantFromId.data?.id ? selectedTenantFromId.data : null
  }, [options, selectedTenantFromId.data, selectedTenantName, value])

  function handleListboxScroll(event: SyntheticEvent) {
    const listboxNode = event.currentTarget as HTMLElement
    const isNearBottom =
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - TENANT_SCROLL_LOAD_THRESHOLD_PX

    if (!isNearBottom || !infiniteTenantsQuery.hasNextPage || infiniteTenantsQuery.isFetchingNextPage) {
      return
    }

    infiniteTenantsQuery.fetchNextPage()
  }

  const isLoading =
    infiniteTenantsQuery.isLoading ||
    infiniteTenantsQuery.isFetching ||
    infiniteTenantsQuery.isFetchingNextPage ||
    selectedTenantFromId.isLoading

  return (
    <Autocomplete
      size="small"
      options={options}
      value={selectedOption}
      inputValue={searchInput}
      disabled={disabled}
      loading={isLoading}
      isOptionEqualToValue={(option, currentValue) => option.id === currentValue.id}
      getOptionLabel={(option) => option.name ?? option.id ?? ''}
      noOptionsText={t('shops.tenantNoOptions')}
      onInputChange={(_, nextValue, reason) => {
        if (reason === 'reset' && selectedOption) {
          setSearchInput(selectedOption.name ?? '')
          return
        }
        setSearchInput(nextValue)
      }}
      onChange={(_, nextValue) => {
        onChange(nextValue?.id ?? null)
      }}
      slotProps={{
        listbox: {
          onScroll: handleListboxScroll,
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          placeholder={t('shops.tenantSearchPlaceholder')}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress color="inherit" size={16} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
