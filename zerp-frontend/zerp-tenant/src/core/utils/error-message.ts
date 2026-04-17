import { ApiError } from '@/core/types/api'

export function getUserFriendlyError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      return 'Your session has expired. Please log in again.'
    }

    if (error.statusCode === 403) {
      return 'You do not have permission to perform this action.'
    }

    return error.message || 'An API error occurred.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error occurred.'
}
