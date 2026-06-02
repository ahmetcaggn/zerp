import type { EmployeeResponse } from '@/modules/admin/types/employee'

export type CurrentUserEmployeeProfile = Omit<
  EmployeeResponse,
  'createdAt' | 'hireDate' | 'salary' | 'terminationDate' | 'updatedAt'
> & {
  username?: string
}
