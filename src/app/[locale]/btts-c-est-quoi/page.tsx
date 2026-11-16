import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import Navbar from '@/components/bttsbet/Navbar'
import Footer from '@/components/bttsbet/Footer'

const SITE_URL = 'https://bttspredict.com'
const FR_URL = `${SITE_URL}/btts-c-est-quoi`
const EN_URL = `${SITE_URL}/en/btts-c-est-quoi`

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/btts-c-est-quoi')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'en') return {}
  const title = 'What Does BTTS Mean? Definition and Score Examples'
  const description = 'BTTS means Both Teams To Score: both teams must score at least one goal. See simple score examples and how BTTS differs from Over 2.5.'
  return {
    title,
    description,
    alternates: {
      canonical: EN_URL,
      languages: { fr: FR_URL, en: EN_URL, 'x-default': FR_URL },
    },
    openGraph: {
      title,
      description,
      url: EN_URL,
      siteName: 'BTTSPredict',
      type: 'article',
      locale: 'en_US',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  }
}

export default async function EnglishBttsGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'en') notFound()

  return (
    <div className="min-h-screen flex flex-col bg-dark-800 text-papier">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-cendre">
          <a href="/en" className="hover:text-papier">Home</a><span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page">BTTS guide</span>
        </nav>
        <header className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Quick guide</p>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">What does BTTS mean?</h1>
          <p className="mt-4 text-base leading-relaxed text-cendre sm:text-lg">
            BTTS stands for “Both Teams To Score”. A BTTS Yes result requires each team to score at least one goal, regardless of who wins.
          </p>
        </header>

        <div className="space-y-5">
          <section className="rounded-2xl border border-edge bg-dark-900 p-5 sm:p-6" aria-labelledby="btts-examples">
            <h2 id="btts-examples" className="mb-3 text-xl font-semibold">Simple score examples</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-cendre">
              <li><strong className="text-papier">1–1 or 2–1:</strong> both teams scored, so BTTS Yes is met.</li>
              <li><strong className="text-papier">0–0 or 2–0:</strong> at least one team did not score, so BTTS Yes is not met.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-edge bg-dark-900 p-5 sm:p-6" aria-labelledby="btts-vs-over">
            <h2 id="btts-vs-over" className="mb-3 text-xl font-semibold">BTTS is not the same as Over 2.5</h2>
            <p className="text-sm leading-relaxed text-cendre">
              BTTS asks whether both teams scored. Over 2.5 asks whether the match had at least three goals in total. A 1–1 score meets BTTS Yes but not Over 2.5; a 3–0 score meets Over 2.5 but not BTTS Yes.
            </p>
          </section>

          <p className="rounded-2xl border border-edge bg-dark-900 p-5 text-sm leading-relaxed text-cendre">
            This page explains a football term; it does not predict a match or provide betting advice. Sports betting involves risk, and no future result is guaranteed. 18+.
          </p>
        </div>
      </main>
      <Footer initialLocale="en" />
    </div>
  )
}
