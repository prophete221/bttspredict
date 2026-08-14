import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale === 'en') return { title: 'Legal notices | BTTSPredict', description: 'Legal information about BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/en/mentions-legales' } }; if (locale === 'ar') return { title: 'الإشعارات القانونية | BTTSPredict', description: 'معلومات قانونية عن BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/ar/mentions-legales' } }; return {} }
export default async function LocalizedLegalPageRoute({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedLegalPage kind="legal" /> }
