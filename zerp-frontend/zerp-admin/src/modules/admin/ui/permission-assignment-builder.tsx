'use client'

import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from '@mui/material'
import { useQueries } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { queryKeys } from '@/core/api/query-keys'
import { useI18n } from '@/core/i18n/i18n-provider'

import { permittableClient } from '../api/permittable-client'
import { usePermissionActionHierarchy } from '../hooks/use-permission-management'
import type {
  PermissionAction,
  PermissionAssignmentInput,
  PermissionTargetType,
  PermittableResponseDto,
} from '../types/permission'
import {
  getSelectableTargetChain,
  prettifyPermissionEnumName,
  toPermissionKey,
} from '../types/permission'

interface PermittableOption {
  id: string
  title: string
}

interface Props {
  onAdd: (assignment: PermissionAssignmentInput) => void
  existingKeys?: ReadonlySet<string>
  disabled?: boolean
}

function formatTargetOptionLabel(option: PermittableOption): string {
  return `${option.title} (${option.id})`
}

function toPermittableOption(item: PermittableResponseDto): PermittableOption | null {
  if (!item.id) return null
  return {
    id: item.id,
    title: item.title ?? item.id,
  }
}

export function PermissionAssignmentBuilder({ onAdd, existingKeys, disabled = false }: Props) {
  const { t } = useI18n()
  const {
    data: actionHierarchy,
    isLoading: isActionsLoading,
    error: actionsError,
  } = usePermissionActionHierarchy(!disabled)

  const [selectedAction, setSelectedAction] = useState<PermissionAction | null>(null)
  const [selectedTargetType, setSelectedTargetType] = useState<PermissionTargetType | null>(null)
  const [selectedTargetsByType, setSelectedTargetsByType] = useState<
    Record<string, PermittableOption | null>
  >({})
  const [searchByType, setSearchByType] = useState<Record<string, string>>({})

  const actionOptions = useMemo(
    () => Object.keys(actionHierarchy ?? {}).sort((a, b) => a.localeCompare(b)),
    [actionHierarchy],
  )

  const availableTargetTypes = useMemo(() => {
    if (!selectedAction || !actionHierarchy) return []
    return (actionHierarchy[selectedAction] ?? []).filter(
      (targetType) => getSelectableTargetChain(targetType).length > 0,
    )
  }, [actionHierarchy, selectedAction])

  const selectableTargetChain = useMemo(() => {
    if (!selectedTargetType) return []
    return getSelectableTargetChain(selectedTargetType)
  }, [selectedTargetType])

  const targetQueries = useQueries({
    queries: selectableTargetChain.map((targetType, index) => {
      const parentType = index > 0 ? selectableTargetChain[index - 1] : undefined
      const parentTarget = parentType ? selectedTargetsByType[parentType] : undefined
      const parentId = parentTarget?.id
      const keyword = searchByType[targetType] ?? ''
      const isEnabled = !disabled && (index === 0 || Boolean(parentId))

      return {
        queryKey: [
          ...queryKeys.admin.permissions,
          'assignment',
          'permittables',
          targetType,
          parentId ?? '',
          keyword,
        ],
        queryFn: () =>
          permittableClient.list({
            targetType,
            parentId,
            keyword,
          }),
        enabled: isEnabled,
        staleTime: 30_000,
      }
    }),
  })

  const targetOptionsByType = useMemo(() => {
    const optionsByType: Record<string, PermittableOption[]> = {}

    selectableTargetChain.forEach((targetType, index) => {
      const query = targetQueries[index]
      const baseOptions = (query.data?.data ?? [])
        .map(toPermittableOption)
        .filter((option): option is PermittableOption => option !== null)

      const selectedOption = selectedTargetsByType[targetType]
      const options =
        selectedOption && !baseOptions.some((option) => option.id === selectedOption.id)
          ? [selectedOption, ...baseOptions]
          : baseOptions

      optionsByType[targetType] = options
    })

    return optionsByType
  }, [selectableTargetChain, selectedTargetsByType, targetQueries])

  const finalTargetType = selectableTargetChain.at(-1)
  const finalTarget = finalTargetType ? (selectedTargetsByType[finalTargetType] ?? null) : null

  const assignmentKey =
    selectedAction && selectedTargetType && finalTarget
      ? toPermissionKey({
          action: selectedAction,
          targetType: selectedTargetType,
          targetId: finalTarget.id,
        })
      : null

  const isDuplicate = Boolean(assignmentKey && existingKeys?.has(assignmentKey))
  const isAnyTargetLoading = targetQueries.some((query) => query.isLoading || query.isFetching)

  function resetTargetSelections() {
    setSelectedTargetsByType({})
    setSearchByType({})
  }

  function handleActionChange(action: PermissionAction | null) {
    setSelectedAction(action)
    setSelectedTargetType(null)
    resetTargetSelections()
  }

  function handleTargetTypeChange(targetType: PermissionTargetType | null) {
    setSelectedTargetType(targetType)
    resetTargetSelections()
  }

  function handleTargetSelection(
    type: PermissionTargetType,
    index: number,
    value: PermittableOption | null,
  ) {
    setSelectedTargetsByType((prev) => {
      const next: Record<string, PermittableOption | null> = { ...prev, [type]: value }

      for (let i = index + 1; i < selectableTargetChain.length; i += 1) {
        delete next[selectableTargetChain[i]]
      }

      return next
    })
  }

  function handleAdd() {
    if (!selectedAction || !selectedTargetType || !finalTarget || isDuplicate) return

    onAdd({
      action: selectedAction,
      targetType: selectedTargetType,
      targetId: finalTarget.id,
      targetTitle: finalTarget.title,
    })

    resetTargetSelections()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2">{t('teams.permissionsSectionTitle')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('teams.permissionsSectionDescription')}
      </Typography>

      <Autocomplete
        size="small"
        options={actionOptions}
        value={selectedAction}
        onChange={(_, value) => handleActionChange(value)}
        disabled={disabled || isActionsLoading}
        loading={isActionsLoading}
        getOptionLabel={(option) => prettifyPermissionEnumName(option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('teams.permissionActionField')}
            placeholder={t('teams.permissionSearchPlaceholder')}
            error={Boolean(actionsError)}
          />
        )}
      />

      <Autocomplete
        size="small"
        options={availableTargetTypes}
        value={selectedTargetType}
        onChange={(_, value) => handleTargetTypeChange(value)}
        disabled={disabled || !selectedAction}
        getOptionLabel={(option) => prettifyPermissionEnumName(option)}
        renderInput={(params) => (
          <TextField {...params} label={t('teams.permissionTargetTypeField')} />
        )}
      />

      {selectableTargetChain.map((targetType, index) => {
        const options = targetOptionsByType[targetType] ?? []
        const query = targetQueries[index]
        const parentType = index > 0 ? selectableTargetChain[index - 1] : undefined
        const parentSelected = parentType ? Boolean(selectedTargetsByType[parentType]?.id) : true

        return (
          <Autocomplete
            key={targetType}
            size="small"
            options={options}
            value={selectedTargetsByType[targetType] ?? null}
            inputValue={searchByType[targetType] ?? ''}
            onInputChange={(_, value) =>
              setSearchByType((prev) => ({ ...prev, [targetType]: value }))
            }
            onChange={(_, value) => handleTargetSelection(targetType, index, value)}
            disabled={disabled || !parentSelected}
            loading={query.isLoading || query.isFetching}
            noOptionsText={t('teams.permissionNoOptions')}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => formatTargetOptionLabel(option)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`${t('teams.permissionTargetField')} · ${prettifyPermissionEnumName(targetType)}`}
                error={Boolean(query.error)}
              />
            )}
          />
        )
      })}

      <Divider />

      {isDuplicate && <Alert severity="info">{t('teams.permissionAlreadyAdded')}</Alert>}

      <Button
        variant="outlined"
        size="small"
        startIcon={isAnyTargetLoading ? <CircularProgress size={14} /> : <AddIcon />}
        onClick={handleAdd}
        disabled={
          disabled ||
          !selectedAction ||
          !selectedTargetType ||
          !finalTarget ||
          isDuplicate ||
          isAnyTargetLoading
        }
      >
        {t('teams.permissionAddButton')}
      </Button>
    </Box>
  )
}
