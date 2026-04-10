'use client'

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { IconButton, Tooltip } from '@mui/material'

import { useThemeMode } from '@/core/providers/theme-provider'

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton color="inherit" onClick={toggleMode} size="small">
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  )
}
