import { redirect } from 'next/navigation'

import { appConfig } from '@/core/config/app-config'

export default function RootPage() {
  redirect(`/${appConfig.locale.defaultLocale}/login`)
}
