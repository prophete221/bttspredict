import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: '888Starz Promo Code | BTTSPredict', description: '888Starz promo code and sign-up guide with terms to verify.', alternates: { canonical: 'https://bttspredict.com/en/bonus-888starz' } }
  if (locale === 'ar') return { title: 'رمز 888Starz الترويجي | BTTSPredict', description: 'دليل التسجيل ورمز 888Starz مع شروط يجب التحقق منها.', alternates: { canonical: 'https://bttspredict.com/ar/bonus-888starz' } }
  return {}
}
export default async function Localized888StarzPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedPromoClient bookmaker="888starz" /> }
