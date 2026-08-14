import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale }))
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') notFound()
  const locale = value as Locale
  const meta = LOCALE_META[locale]

  return (
    <div lang={meta.htmlLang} dir={meta.direction} data-locale={locale} className="min-h-screen">
      {children}
    </div>
  )
}
