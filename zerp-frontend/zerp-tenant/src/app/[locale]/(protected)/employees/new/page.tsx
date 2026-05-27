import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { EmployeeCreatePage } from '@/modules/tenant/ui/employee-create-page'

export const metadata: Metadata = buildMetadata({ title: 'Create Employee' })

export default function EmployeeCreateRoutePage() {
  return <EmployeeCreatePage />
}
