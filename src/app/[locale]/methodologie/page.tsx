import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import LocalizedMethodologieClient from '@/app/methodologie/LocalizedMethodologieClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/methodologie')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Methodology', description: 'Transparent BTTS and Over 2.5 methodology, data sources and limitations.', alternates: frEnAlternates('/methodologie', 'en') }
  return {}
}

export default async function LocalizedMethodologiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'en') notFound()
  return <LocalizedMethodologieClient />
}
