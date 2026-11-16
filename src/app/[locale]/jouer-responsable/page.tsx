import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/jouer-responsable')
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale !== 'en') return {}; return { title: 'Play responsibly', description: 'Responsible betting information and support guidance.', alternates: frEnAlternates('/jouer-responsable', 'en') } }
export default async function LocalizedResponsiblePage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (locale !== 'en') notFound(); return <LocalizedLegalPage kind="responsible" /> }
