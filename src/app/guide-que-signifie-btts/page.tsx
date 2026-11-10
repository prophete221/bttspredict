import type { Metadata } from 'next'
import { Footer, Navbar } from '@/components/bttsbet'

const SITE_URL = 'https://bttspredict.com'
const PAGE_URL = `${SITE_URL}/guide-que-signifie-btts`
const TITLE = 'Que signifie BTTS ? Définition et exemples'
const DESCRIPTION = 'BTTS signifie « Both Teams To Score » : les deux équipes marquent au moins un but. Découvrez une définition simple, des exemples de scores et la différence avec le total de buts.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      fr: PAGE_URL,
      'x-default': PAGE_URL,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'article',
    locale: 'fr_FR',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Que signifie BTTS ?' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function GuideBttsPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 relative z-10">
        <nav aria-label="Fil d’Ariane" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <ol className="flex items-center gap-2 text-sm text-cendre">
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Que signifie BTTS ?</li>
          </ol>
        </nav>

        <header className="pb-8 sm:pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-7 text-center">
            <p className="inline-flex rounded-full border border-emerald/30 bg-panel/40 px-3 py-1 text-xs font-semibold tracking-wide text-emerald">
              Définition rapide
            </p>
            <h1
              className="mt-5 text-4xl sm:text-5xl text-papier mb-4"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              Que signifie BTTS ?
            </h1>
            <p className="text-cendre text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              BTTS est l’abréviation de « Both Teams To Score », soit « les deux équipes marquent ».
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 space-y-6">
          <section className="card p-6" aria-labelledby="definition">
            <h2 id="definition" className="text-2xl text-papier mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
              Une définition simple
            </h2>
            <p className="text-cendre text-sm leading-relaxed">
              Dans un match de football, BTTS décrit le fait que chaque équipe a marqué au moins un but. Le résultat final et l’identité du vainqueur ne changent pas cette définition : on regarde seulement si les deux équipes ont marqué.
            </p>
          </section>

          <section className="card p-6" aria-labelledby="exemples">
            <h2 id="exemples" className="text-2xl text-papier mb-4" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
              Exemples de scores
            </h2>
            <ul className="space-y-3 text-sm text-cendre leading-relaxed">
              <li className="rounded-xl border border-emerald/20 bg-panel/40 p-4">
                <strong className="text-papier">1–1 ou 2–1 :</strong> les deux équipes ont marqué au moins un but. La condition BTTS est remplie.
              </li>
              <li className="rounded-xl border border-edge/30 bg-panel/40 p-4">
                <strong className="text-papier">0–0 ou 2–0 :</strong> une équipe n’a marqué aucun but. La condition BTTS n’est pas remplie.
              </li>
            </ul>
          </section>

          <section className="card p-6" aria-labelledby="total-buts">
            <h2 id="total-buts" className="text-2xl text-papier mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
              À ne pas confondre avec le nombre total de buts
            </h2>
            <p className="text-cendre text-sm leading-relaxed">
              Un score de 1–1 donne deux buts au total et les deux équipes ont marqué. Un score de 3–0 donne trois buts au total, mais une seule équipe a marqué : ce n’est donc pas BTTS. Le critère porte sur les équipes qui marquent, pas sur un seuil de buts dans le match.
            </p>
          </section>

          <p className="rounded-xl border border-gold/25 bg-panel/40 p-5 text-sm text-cendre leading-relaxed">
            Cette page explique le sens d’un sigle et donne des exemples de scores. Elle ne prédit pas les résultats d’un match et ne constitue pas un conseil de pari.
          </p>
          <p className="text-sm text-cendre text-center">
            Pour approfondir, consultez aussi notre <a href="/btts-c-est-quoi" className="text-emerald underline underline-offset-2">guide complet sur le BTTS</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
