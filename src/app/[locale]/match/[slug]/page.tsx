import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MatchPage from '@/app/match/[slug]/page'
import { getAllMatchSlugs, getMatchBySlug } from '@/lib/matches'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export const dynamicParams = false
export const dynamic = 'force-static'
export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').flatMap(locale => getAllMatchSlugs().map(slug => ({ locale, slug }))) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; const match = getMatchBySlug(slug); if (!match) return { title: 'Match not found | BTTSPredict', robots: { index: false, follow: false } }; const title = `${match.home} vs ${match.away} BTTS`; return { title: locale === 'ar' ? `${match.home} ضد ${match.away} | BTTSPredict` : title, description: locale === 'ar' ? `تحليل مباراة ${match.home} ضد ${match.away} وتوقعات BTTS وOver 2.5.` : `BTTS and Over 2.5 analysis for ${match.home} vs ${match.away}.`, alternates: { canonical: `https://bttspredict.com/${locale}/match/${slug}` } } }
export default async function LocalizedMatchPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr' || !getMatchBySlug(slug)) notFound(); return <MatchPage params={Promise.resolve({ slug })} /> }
