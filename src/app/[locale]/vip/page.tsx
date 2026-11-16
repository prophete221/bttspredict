import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import VipPage from '@/app/vip/page'

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/vip')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'en') return {}
  return { title: 'VIP BTTS Analysis Desk', description: 'Private BTTS, Over 2.5 and exact-score analysis for international matches.', alternates: frEnAlternates('/vip', 'en') }
}

export default async function LocalizedVipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'en') notFound()
  return <VipPage />
}
