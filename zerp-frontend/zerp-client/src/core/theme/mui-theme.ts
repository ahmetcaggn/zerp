import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles'

import { responsiveLayout } from '@/core/theme/layout'
import { themeTokens } from '@/core/theme/tokens'
import type { ThemeMode } from '@/core/types/common'

export function createAppTheme(mode: ThemeMode) {
  const paletteSource = mode === 'light' ? themeTokens.light : themeTokens.dark
  const toolbarMobileHeight = responsiveLayout.toolbarMinHeight.xs
  const toolbarDesktopHeight = responsiveLayout.toolbarMinHeight.sm

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: paletteSource.primary,
        contrastText: mode === 'dark' ? '#06211c' : '#f8fafc',
      },
      secondary: {
        main: paletteSource.secondary,
        contrastText: mode === 'dark' ? '#081426' : '#eff6ff',
      },
      background: {
        default: paletteSource.backgroundDefault,
        paper: paletteSource.backgroundPaper,
      },
      text: {
        primary: paletteSource.textPrimary,
        secondary: paletteSource.textSecondary,
      },
      divider: paletteSource.divider,
      success: {
        main: mode === 'dark' ? '#34d399' : '#059669',
      },
      error: {
        main: mode === 'dark' ? '#f87171' : '#dc2626',
      },
      warning: {
        main: mode === 'dark' ? '#fbbf24' : '#d97706',
      },
      info: {
        main: mode === 'dark' ? '#60a5fa' : '#2563eb',
      },
      action: {
        hover: mode === 'dark' ? alpha('#94a3b8', 0.1) : alpha('#0f172a', 0.04),
        selected: mode === 'dark' ? alpha('#94a3b8', 0.18) : alpha('#0f172a', 0.08),
        focus: mode === 'dark' ? alpha('#94a3b8', 0.24) : alpha('#0f172a', 0.12),
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: 'var(--font-dm-sans), "Segoe UI", sans-serif',
      h1: {
        fontSize: '2.2rem',
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '1.8rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.4rem',
        fontWeight: 700,
        lineHeight: 1.25,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            colorScheme: mode,
            '--app-bg-1': paletteSource.appBg1,
            '--app-bg-2': paletteSource.appBg2,
            '--app-grid': paletteSource.appGrid,
            '--app-toolbar-height-mobile': `${toolbarMobileHeight}px`,
            '--app-toolbar-height-desktop': `${toolbarDesktopHeight}px`,
          },
          body: {
            backgroundColor: paletteSource.backgroundDefault,
            backgroundImage: `linear-gradient(145deg, var(--app-bg-1), var(--app-bg-2)), repeating-linear-gradient(90deg, transparent, transparent 44px, var(--app-grid) 44px, var(--app-grid) 45px)`,
            color: paletteSource.textPrimary,
            transition: 'background-color 200ms ease, color 200ms ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${mode === 'dark' ? alpha('#94a3b8', 0.16) : alpha('#0f172a', 0.08)}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: paletteSource.appBar,
            backgroundImage: 'none',
            backdropFilter: 'blur(12px)',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 'var(--app-toolbar-height-mobile)',
            '@media (min-width:600px)': {
              minHeight: 'var(--app-toolbar-height-desktop)',
            },
          },
        },
      },
    },
  })

  return responsiveFontSizes(theme, { variants: ['h1', 'h2', 'h3'] })
}
