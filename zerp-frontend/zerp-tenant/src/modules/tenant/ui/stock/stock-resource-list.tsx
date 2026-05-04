'use client'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { useStockResources } from '../../hooks/use-stock-resources'
import type { StockResourceResponseDto, StockMovementType } from '../../types/stock'
import { StockResourceFormDialog } from './stock-resource-form-dialog'
import { StockMovementFormDialog } from './stock-movement-form-dialog'

export function StockResourceList() {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<StockResourceResponseDto | null>(null)
  
  const [movementFormOpen, setMovementFormOpen] = useState(false)
  const [movementResourceId, setMovementResourceId] = useState<string>('')
  const [movementType, setMovementType] = useState<StockMovementType>('ADJUSTMENT')

  const { data, isLoading, error } = useStockResources({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
  })

  // if (error) showToast('error', error.message || 'Error loading resources')

  const handleEdit = (resource: StockResourceResponseDto) => {
    setSelectedResource(resource)
    setFormOpen(true)
  }

  const handleOpenMovement = (resourceId: string, type: StockMovementType) => {
    setMovementResourceId(resourceId)
    setMovementType(type)
    setMovementFormOpen(true)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('stock.tabs.resources')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedResource(null)
            setFormOpen(true)
          }}
        >
          {t('stock.resource.createButton')}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('stock.resource.form.name')}</TableCell>
                <TableCell>{t('stock.resource.form.quantity')}</TableCell>
                <TableCell>{t('stock.resource.form.unitType')}</TableCell>
                <TableCell>{t('stock.resource.form.reorderThreshold')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('stock.resource.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell>{resource.quantity}</TableCell>
                    <TableCell>{resource.unitType}</TableCell>
                    <TableCell>{resource.reorderThreshold}</TableCell>
                    <TableCell align="right">
                      {/* Quick Actions */}
                      <IconButton size="small" onClick={() => handleOpenMovement(resource.id, 'WASTE')} color="error" title={t('stock.resource.quickActions.waste')}>
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleOpenMovement(resource.id, 'PURCHASE')} color="success" title={t('stock.resource.quickActions.restock')}>
                        <AddCircleOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleOpenMovement(resource.id, 'ADJUSTMENT')} color="warning" title={t('stock.resource.quickActions.adjust')}>
                        <BuildCircleIcon fontSize="small" />
                      </IconButton>
                      
                      {/* Edit */}
                      <IconButton size="small" onClick={() => handleEdit(resource)} sx={{ ml: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.total || 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </Box>
      )}

      {formOpen && (
        <StockResourceFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={selectedResource}
        />
      )}

      {movementFormOpen && (
        <StockMovementFormDialog
          open={movementFormOpen}
          onClose={() => setMovementFormOpen(false)}
          preselectedResourceId={movementResourceId}
          preselectedType={movementType}
        />
      )}
    </Box>
  )
}
