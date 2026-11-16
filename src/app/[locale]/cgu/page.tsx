import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/cgu')
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale !== 'en') return {}; return { title: 'Terms of use', description: 'Terms governing use of BTTSPredict.', alternates: frEnAlternates('/cgu', 'en') } }
export default async function LocalizedCguPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (locale !== 'en') notFound(); return <LocalizedLegalPage kind="cgu" /> }
