import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale === 'en') return { title: 'Terms of use | BTTSPredict', description: 'Terms governing use of BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/en/cgu' } }; if (locale === 'ar') return { title: 'الشروط العامة | BTTSPredict', description: 'شروط استخدام BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/ar/cgu' } }; return {} }
export default async function LocalizedCguPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedLegalPage kind="cgu" /> }
