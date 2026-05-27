'use client'

import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import { useCustomPermissionGroups, usePredefinedPermissionGroups } from '../hooks/use-permission-groups'
import { prettifyPermissionEnumName } from '../types/permission'
import type {
  PermissionGroupResponseDto,
  PermissionGroupScopeType,
  PredefinedPermissionGroupCode,
} from '../types/permission-group'

export interface PermissionGroupSelectionValue {
  source: 'PREDEFINED' | 'CUSTOM'
  id?: string
  code?: PredefinedPermissionGroupCode
  name: string
  scopeType: PermissionGroupScopeType
  actions: string[]
}

interface ShopOption {
  id: string
  title: string
}

interface GroupOption {
  key: string
  label: string
  group: PermissionGroupResponseDto
}

interface Props {
  value: PermissionGroupSelectionValue | null
  onChange: (value: PermissionGroupSelectionValue | null) => void
  selectedShopId?: string
  onSelectedShopIdChange?: (shopId: string) => void
  shopOptions?: ShopOption[]
  disabled?: boolean
}

function toSelection(group: PermissionGroupResponseDto): PermissionGroupSelectionValue {
  return {
    source: group.source,
    id: group.id,
    code: group.code,
    name: group.name,
    scopeType: group.scopeType,
    actions: group.actions,
  }
}

function isOptionSelected(option: GroupOption, value: PermissionGroupSelectionValue | null): boolean {
  if (!value) return false
  if (value.source === 'PREDEFINED') {
    return option.group.source === 'PREDEFINED' && option.group.code === value.code
  }
  return option.group.source === 'CUSTOM' && option.group.id === value.id
}

export function PermissionGroupSelector({
  value,
  onChange,
  selectedShopId,
  onSelectedShopIdChange,
  shopOptions = [],
  disabled = false,
}: Props) {
  const { t } = useI18n()
  const { data: predefined = [], isLoading: isPredefinedLoading } = usePredefinedPermissionGroups(!disabled)
  const { data: custom = [], isLoading: isCustomLoading } = useCustomPermissionGroups(!disabled)

  const options = useMemo<GroupOption[]>(() => {
    const mapped = [...predefined, ...custom].map((group) => {
      const ref = group.source === 'PREDEFINED' ? group.code : group.id
      const key = `${group.source}:${ref ?? ''}`
      const label = `${group.name} (${group.source === 'PREDEFINED' ? t('permissionGroups.predefinedBadge') : t('permissionGroups.customBadge')})`
      return { key, label, group }
    })

    return mapped.sort((a, b) => a.label.localeCompare(b.label))
  }, [custom, predefined, t])

  const selectedOption = useMemo(
    () => options.find((option) => isOptionSelected(option, value)) ?? null,
    [options, value],
  )

  const isLoading = isPredefinedLoading || isCustomLoading
  const isShopScope = value?.scopeType === 'SHOP'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2">{t('permissionGroups.assignmentTitle')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('permissionGroups.assignmentDescription')}
      </Typography>

      <Autocomplete
        size="small"
        options={options}
        value={selectedOption}
        onChange={(_, option) => onChange(option ? toSelection(option.group) : null)}
        disabled={disabled}
        loading={isLoading}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, selected) => option.key === selected.key}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('permissionGroups.groupField')}
            placeholder={t('permissionGroups.groupPlaceholder')}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      {value && (
        <>
          <TextField
            size="small"
            label={t('permissionGroups.scopeField')}
            value={prettifyPermissionEnumName(value.scopeType)}
            disabled
          />

          {isShopScope && (
            <TextField
              size="small"
              select
              label={t('permissionGroups.scopeTargetField')}
              value={selectedShopId ?? ''}
              onChange={(event) => onSelectedShopIdChange?.(event.target.value)}
              disabled={disabled}
              error={!selectedShopId}
              helperText={!selectedShopId ? t('permissionGroups.scopeTargetRequired') : undefined}
            >
              <MenuItem value="">—</MenuItem>
              {shopOptions.map((shop) => (
                <MenuItem key={shop.id} value={shop.id}>
                  {shop.title}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {value.actions.map((action) => (
              <Chip
                key={action}
                label={prettifyPermissionEnumName(action)}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>

          <Alert severity="info">
            {t('permissionGroups.snapshotInfo')}
          </Alert>
        </>
      )}
    </Box>
  )
}
