import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedLegalPage from '@/components/bttsbet/LocalizedLegalPage'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (locale === 'en') return { title: 'Play responsibly | BTTSPredict', description: 'Responsible betting information and support guidance.', alternates: { canonical: 'https://bttspredict.com/en/jouer-responsable' } }; if (locale === 'ar') return { title: 'العب بمسؤولية | BTTSPredict', description: 'معلومات عن اللعب المسؤول وطلب المساعدة.', alternates: { canonical: 'https://bttspredict.com/ar/jouer-responsable' } }; return {} }
export default async function LocalizedResponsiblePage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedLegalPage kind="responsible" /> }
