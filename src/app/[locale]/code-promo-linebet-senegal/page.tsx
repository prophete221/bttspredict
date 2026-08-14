import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Linebet Promo Code | BTTSPredict', description: 'Linebet promo code and sign-up guide with terms to verify.', alternates: { canonical: 'https://bttspredict.com/en/code-promo-linebet-senegal' } }
  if (locale === 'ar') return { title: 'رمز Linebet الترويجي | BTTSPredict', description: 'دليل التسجيل ورمز Linebet مع شروط يجب التحقق منها.', alternates: { canonical: 'https://bttspredict.com/ar/code-promo-linebet-senegal' } }
  return {}
}
export default async function LocalizedLinebetPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedPromoClient bookmaker="linebet" /> }
