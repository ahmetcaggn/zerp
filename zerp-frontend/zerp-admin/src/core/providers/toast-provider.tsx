'use client'

import { Alert, Snackbar } from '@mui/material'
import { createContext, useContext, useMemo, useState } from 'react'

interface ToastOptions {
  severity?: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<ToastOptions['severity']>('info')

  const value = useMemo(
    () => ({
      showToast: (nextMessage: string, options?: ToastOptions) => {
        setMessage(nextMessage)
        setSeverity(options?.severity ?? 'info')
        setOpen(true)
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => setOpen(false)}
      >
        <Alert severity={severity} onClose={() => setOpen(false)} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
