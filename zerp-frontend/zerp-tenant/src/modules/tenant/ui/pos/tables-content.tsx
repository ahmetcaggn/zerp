'use client'
import { useSearchParams } from 'next/navigation'
import { FloorView } from './floor-view'
import { PosView } from './pos-view'

export function TablesContent() {
  const searchParams = useSearchParams()
  const tableId = searchParams.get('tableId')
  return tableId ? <PosView /> : <FloorView />
}
