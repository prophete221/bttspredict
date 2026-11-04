import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'
import { PROMO_CURRENT_YEAR } from '@/lib/promo-build-date.generated'

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
const YEAR = PROMO_CURRENT_YEAR

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return {
    title: 'Linebet Promo Code VISION221: 300% + 100 Spins',
    description: `Linebet promo code VISION221: 300% bonus + 100 free spins, no wagering requirements, from a €1 deposit. ${YEAR} sign-up guide, 18+.`,
    alternates: { canonical: 'https://bttspredict.com/en/code-promo-linebet-senegal' }
  }
  if (locale === 'ar') return {
    title: 'رمز Linebet الترويجي VISION221: 300% + 100 لفة مجانية',
    description: `رمز Linebet الترويجي VISION221: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة، بدءاً من إيداع 1 يورو. دليل ${YEAR}، 18+.`,
    alternates: { canonical: 'https://bttspredict.com/ar/code-promo-linebet-senegal' }
  }
  return {}
}
export default async function LocalizedLinebetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale === 'ar' ? 'ar' : 'en'
  const faqLd = buildPromoFaqJsonLd('linebet', lang)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <LocalizedPromoClient bookmaker="linebet" />
    </>
  )
}
