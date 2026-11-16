import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/politique-confidentialite')
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale !== 'en') return {}; return { title: 'Privacy policy', description: 'Privacy policy for BTTSPredict.', alternates: frEnAlternates('/politique-confidentialite', 'en') } }
export default async function LocalizedPrivacyPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (locale !== 'en') notFound(); return <LocalizedLegalPage kind="privacy" /> }
