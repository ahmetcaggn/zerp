import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { EmployeeList } from '@/modules/tenant/ui/employee-list'

export const metadata: Metadata = buildMetadata({ title: 'Employees' })

export default function EmployeesPage() {
  return <EmployeeList />
}
