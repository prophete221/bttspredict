import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VipPage from '@/app/vip/page'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'en' && locale !== 'ar') return {}
  return locale === 'en'
    ? { title: 'VIP BTTS Analysis Desk | BTTSPredict', description: 'Private BTTS, Over 2.5 and exact-score analysis for international matches.', alternates: { canonical: 'https://bttspredict.com/en/vip' } }
    : { title: 'مكتب تحليل VIP لتوقعات BTTS | BTTSPredict', description: 'تحليل خاص لتوقعات BTTS وأكثر من 2.5 والنتيجة الدقيقة للمباريات الدولية.', alternates: { canonical: 'https://bttspredict.com/ar/vip' } }
}

export default async function LocalizedVipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  return <VipPage />
}
