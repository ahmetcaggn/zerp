'use client'
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useStockMovements } from '../../hooks/use-stock-movements'
import { StockMovementFormDialog } from './stock-movement-form-dialog'

export function StockMovementList() {
  const { t } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)

  const { data, isLoading } = useStockMovements({
    pagination: { page: page + 1, perPage: rowsPerPage },
    ...(selectedShopId ? { filter: { 'stockResource.shop.id': selectedShopId } } : {}),
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('stock.tabs.movements')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          {t('stock.movement.createButton')}
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
                <TableCell>{t('stock.movement.type')}</TableCell>
                <TableCell align="right">{t('stock.movement.quantity')}</TableCell>
                <TableCell>{t('stock.movement.notes')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('stock.movement.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.stockResourceName || movement.stockResourceId}</TableCell>
                    <TableCell>{t(`stock.movement.types.${movement.type}` as any) || movement.type}</TableCell>
                    <TableCell align="right">{movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}</TableCell>
                    <TableCell>{movement.notes}</TableCell>
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
        <StockMovementFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />
      )}
    </Box>
  )
}
