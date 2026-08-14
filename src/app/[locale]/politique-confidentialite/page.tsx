import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale === 'en') return { title: 'Privacy policy | BTTSPredict', description: 'Privacy policy for BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/en/politique-confidentialite' } }; if (locale === 'ar') return { title: 'سياسة الخصوصية | BTTSPredict', description: 'سياسة الخصوصية في BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/ar/politique-confidentialite' } }; return {} }
export default async function LocalizedPrivacyPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedLegalPage kind="privacy" /> }
