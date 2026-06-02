import type { EmployeeResponseDto } from '@/modules/tenant/types/employee'

export type CurrentUserEmployeeProfile = Omit<
  EmployeeResponseDto,
  'createdAt' | 'hireDate' | 'id' | 'salary' | 'terminationDate' | 'updatedAt'
> & {
  id?: string
  username?: string
}
