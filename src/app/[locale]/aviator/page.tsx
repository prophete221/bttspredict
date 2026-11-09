import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AviatorPageContent, { aviatorMeta } from '@/components/bttsbet/AviatorPageContent'
import { isLocale, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'fr').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || locale === 'fr') return {}
  return aviatorMeta(locale)
}

export default async function LocalizedAviatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || locale === 'fr') notFound()
  return <AviatorPageContent locale={locale as Locale} />
}
