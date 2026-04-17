'use client'

import { CssBaseline } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'

import { createAppTheme } from '@/core/theme/mui-theme'
import type { ThemeMode } from '@/core/types/common'

const STORAGE_KEY = 'zerp-theme-mode'
const listeners = new Set<() => void>()

interface ThemeModeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

function getSnapshot(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedMode = window.localStorage.getItem(STORAGE_KEY)
  return storedMode === 'light' || storedMode === 'dark' ? storedMode : 'light'
}

function getServerSnapshot(): ThemeMode {
  return 'light'
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(listener)
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener()
    }
  }

  window.addEventListener('storage', handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}

function setModeInStore(mode: ThemeMode) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, mode)
  listeners.forEach((listener) => listener())
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleMode = () => {
    const nextMode = mode === 'light' ? 'dark' : 'light'
    setModeInStore(nextMode)
  }

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode must be used inside AppThemeProvider')
  }

  return context
}
