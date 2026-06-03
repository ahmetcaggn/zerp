import type { Locale } from '@/core/types/common'
import { AppTopbar } from '@/core/ui/feedback/app-topbar'

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <AppTopbar contentWidth="container" locale={locale as Locale} />
      {children}
    </>
  )
}
