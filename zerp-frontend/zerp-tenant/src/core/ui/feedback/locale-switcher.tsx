'use client'

import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { appConfig } from '@/core/config/app-config'
import { useI18n } from '@/core/i18n/i18n-provider'
import { getPathWithoutLocale, toLocalizedPath } from '@/core/utils/route-helpers'

export function LocaleSwitcher({ locale }: { locale: 'tr' | 'en' }) {
  const router = useRouter()
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useI18n()

  const currentPathWithoutLocale = getPathWithoutLocale(pathname, locale)

  return (
    <>
      <Tooltip title={t('common.changeLanguage')}>
        <IconButton
          color="inherit"
          size="small"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <TranslateRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {appConfig.locale.supportedLocales.map((item) => (
          <MenuItem
            key={item}
            selected={item === locale}
            onClick={() => {
              setAnchorEl(null)
              router.push(toLocalizedPath(item, currentPathWithoutLocale) as Route)
            }}
          >
            {item.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

