import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'
import BttsTomorrowLanding from '@/components/bttsbet/BttsTomorrowLanding'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') return {}
  const locale = value as Locale
  const title = locale === 'ar' ? 'توقعات BTTS للغد' : 'BTTS Predictions Tomorrow'
  const description = locale === 'ar' ? 'تعرف على مكان ظهور توقعات الغد عند توفر المباريات والبيانات. 18+.' : 'Find tomorrow’s BTTS selections on the main board when fixtures and data are available. 18+.'
  const url = `https://bttspredict.com/${locale}/btts/predictions/tomorrow`
  return {
    title,
    description,
    alternates: { canonical: url, languages: {
      fr: 'https://bttspredict.com/btts/predictions/tomorrow',
      en: 'https://bttspredict.com/en/btts/predictions/tomorrow',
      ar: 'https://bttspredict.com/ar/btts/predictions/tomorrow',
      'x-default': 'https://bttspredict.com/btts/predictions/tomorrow',
    } },
    robots: { index: true, follow: true },
  }
}

export default async function LocalizedBTTSPredictionsTomorrowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') notFound()
  return <BttsTomorrowLanding locale={value as Locale} />
}
