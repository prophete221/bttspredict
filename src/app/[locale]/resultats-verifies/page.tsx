import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import ResultatsVerifiesPage from '@/app/resultats-verifies/page'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/resultats-verifies')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Verified prediction results', description: 'Publicly verified prediction results with dated data and transparent methodology.', alternates: frEnAlternates('/resultats-verifies', 'en') }
  return {}
}

export default async function LocalizedResultatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'en') notFound()
  return <ResultatsVerifiesPage />
}
