export const EmploymentStatus = {
  Active: 'ACTIVE',
  Terminated: 'TERMINATED',
  Suspended: 'SUSPENDED',
  OnLeave: 'ON_LEAVE',
  Retired: 'RETIRED',
  Probation: 'PROBATION',
  Deleted: 'DELETED',
} as const

export type EmploymentStatusValue = (typeof EmploymentStatus)[keyof typeof EmploymentStatus]

export const ContactType = {
  WorkPhone: 'WORK_PHONE',
  PersonalPhone: 'PERSONAL_PHONE',
  WorkEmail: 'WORK_EMAIL',
  PersonalEmail: 'PERSONAL_EMAIL',
  EmergencyContact: 'EMERGENCY_CONTACT',
} as const

export type ContactTypeValue = (typeof ContactType)[keyof typeof ContactType]

export interface EmployeeContactDto {
  id?: number
  type: ContactTypeValue
  value: string
  contactPersonName?: string
  relationship?: string
}

export interface EmployeeContactResponseDto {
  id?: number
  type?: ContactTypeValue
  value?: string
  contactPersonName?: string
  relationship?: string
}

export interface EmployeeListResponse {
  id?: string
  username?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  status?: EmploymentStatusValue
}

export interface ManagerResponse {
  id?: string
  firstName?: string
  lastName?: string
}

export interface EmployeeResponse extends EmployeeListResponse {
  nationalId?: string
  dateOfBirth?: string
  hireDate?: string
  terminationDate?: string
  manager?: ManagerResponse
  salary?: number
  contacts?: EmployeeContactResponseDto[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateEmployeeRequest {
  username: string
  tempPassword: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  nationalId?: string
  dateOfBirth?: string
  hireDate: string
  status?: EmploymentStatusValue
  managerId?: string
  salary?: number
  isActive?: boolean
  contacts?: EmployeeContactDto[]
}

export interface AdminCreateEmployeeRequest extends CreateEmployeeRequest {
  tenantId: string
}

export interface UpdateEmployeeRequest {
  username?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  nationalId?: string
  dateOfBirth?: string
  hireDate?: string
  terminationDate?: string
  status?: EmploymentStatusValue
  managerId?: string
  salary?: number
  contacts?: EmployeeContactDto[]
}
