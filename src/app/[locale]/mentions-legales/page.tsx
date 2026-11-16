import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/mentions-legales')
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale !== 'en') return {}; return { title: 'Legal notices', description: 'Legal information about BTTSPredict.', alternates: frEnAlternates('/mentions-legales', 'en') } }
export default async function LocalizedLegalPageRoute({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (locale !== 'en') notFound(); return <LocalizedLegalPage kind="legal" /> }
