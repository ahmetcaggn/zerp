'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { useServerInsertedHTML } from 'next/navigation'
import { useState } from 'react'

export function MuiEmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'mui' })
    cache.compat = true

    const previousInsert = cache.insert
    let insertedStyles: Array<{ name: string; isGlobal: boolean }> = []

    cache.insert = (...args) => {
      const selector = args[0]
      const serialized = args[1]

      if (cache.inserted[serialized.name] === undefined) {
        insertedStyles.push({ name: serialized.name, isGlobal: !selector })
      }

      return previousInsert(...args)
    }

    const flush = () => {
      const styles = insertedStyles
      insertedStyles = []
      return styles
    }

    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const inserted = flush()

    if (inserted.length === 0) {
      return null
    }

    const globalStyles: React.ReactNode[] = []
    const classNames: string[] = []
    let styles = ''

    for (const { name, isGlobal } of inserted) {
      const style = cache.inserted[name]

      if (typeof style !== 'string') {
        continue
      }

      if (isGlobal) {
        globalStyles.push(
          <style
            key={`${cache.key}-global-${name}`}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />,
        )
        continue
      }

      classNames.push(name)
      styles += style
    }

    return (
      <>
        {globalStyles}
        {classNames.length > 0 ? (
          <style
            key={cache.key}
            data-emotion={`${cache.key} ${classNames.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        ) : null}
      </>
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
