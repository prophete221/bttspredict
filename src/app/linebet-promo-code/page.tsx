import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = 'Linebet Promo Code VISION221'
const DESCRIPTION = 'Code promo Linebet VISION221 : bonus exclusif de 90 000 XOF (150$). Inscription, dépôt Wave/Orange Money, activation. Guide complet 2026.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['linebet promo code', 'code promo linebet', 'VISION221', 'bonus linebet', 'linebet bonus 90000', 'linebet code'],
  alternates: { canonical: `${SITE_URL}/linebet-promo-code` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/linebet-promo-code`, siteName: 'BTTSPredict', type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }] },
}

const FAQ = [
  { q: "Quel est le code promo Linebet ?", a: "Le code promo Linebet est VISION221 (en majuscules). Saisissez-le lors de votre inscription ou dans la section 'Code Promo' de votre compte Linebet pour recevoir le bonus de 90 000 XOF (150$)." },
  { q: "Quel est le montant du bonus Linebet ?", a: "Le bonus exclusif avec le code VISION221 est de 90 000 XOF (150$) sur votre premier dépôt. Le dépôt minimum sur Linebet est de 200 XOF." },
  { q: "Comment utiliser le code VISION221 ?", a: "1. Inscrivez-vous sur Linebet via notre lien de parrainage. 2. Saisissez le code VISION221 lors de l'inscription. 3. Effectuez un dépôt minimum de 200 XOF via Wave, Orange Money ou carte bancaire. 4. Le bonus est crédité automatiquement." },
  { q: "Le code VISION221 fonctionne-t-il sur 888starz ?", a: "Oui, le même code VISION221 fonctionne sur 888starz en minuscules (vision221). Le bonus 888starz est de 100% du premier dépôt." },
  { q: "Le bonus est-il garanti ?", a: "Le bonus bookmaker est crédité par Linebet/888starz après vérification du compte. Les conditions de mise (rollover) s'appliquent. Consultez les CGU du bookmaker. 18+ — Jeu responsable." },
]

export default function LinebetPromoCodePage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/linebet-promo-code', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'Linebet Promo Code', path: '/linebet-promo-code' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />
      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#8A8494' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F4F1EA' }} aria-current="page">Linebet Promo Code</li>
          </ol>
        </nav>

        <header className="mb-10 text-center">
          <span className="eyebrow">🎟️ Code Promo</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F4F1EA', fontFamily: 'Poppins, sans-serif' }}>
            Linebet Promo Code <span style={{ color: '#C9A227' }}>VISION221</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#8A8494' }}>
            Code promo exclusif VISION221 pour un bonus de 90 000 XOF (150$) sur Linebet. Dépôt minimum 200 XOF via Wave, Orange Money, Free Money.
          </p>
          <div className="mt-6">
            <a href="https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration" rel="sponsored noopener" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors" style={{ backgroundColor: '#FF4D6D', color: '#FFFFFF' }}>
              S'inscrire sur Linebet avec VISION221 →
            </a>
          </div>
        </header>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#0F1219', border: '1px solid rgba(244, 241, 234, 0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F4F1EA', fontFamily: 'Poppins, sans-serif' }}>Comment utiliser le code VISION221</h2>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: '#8A8494' }}>
            <p><strong style={{ color: '#F4F1EA' }}>Étape 1 :</strong> Inscrivez-vous sur Linebet via notre lien de parrainage. Cliquez sur "Inscription" en haut à droite.</p>
            <p><strong style={{ color: '#F4F1EA' }}>Étape 2 :</strong> Saisissez le code promo <strong style={{ color: '#C9A227' }}>VISION221</strong> dans le champ dédié lors de l'inscription.</p>
            <p><strong style={{ color: '#F4F1EA' }}>Étape 3 :</strong> Effectuez un dépôt minimum de 200 XOF via Wave, Orange Money, Free Money ou carte bancaire.</p>
            <p><strong style={{ color: '#F4F1EA' }}>Étape 4 :</strong> Le bonus de 90 000 XOF (150$) est crédité automatiquement sur votre compte.</p>
            <p>Pour comparer Linebet et 888starz, consultez notre <a href="/bookmakers" style={{ color: '#C9A227' }}>comparatif détaillé</a>.</p>
          </div>
        </section>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(201, 162, 39, 0.05)', border: '1px solid rgba(201, 162, 39, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F4F1EA' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#8A8494' }}>
            Code promo VISION221 : bonus exclusif de 90 000 XOF (150$) sur Linebet. Dépôt minimum 200 XOF. Le même code (vision221) fonctionne sur 888starz pour un bonus de 100%. Conditions de mise applicables. 18+ — Jeu responsable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F4F1EA', fontFamily: 'Poppins, sans-serif' }}>FAQ Code Promo Linebet</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <details key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#0F1219', border: '1px solid rgba(244, 241, 234, 0.08)' }}>
                <summary className="p-4 cursor-pointer text-sm font-semibold" style={{ color: '#F4F1EA' }}>{item.q}</summary>
                <p className="px-4 pb-4 text-xs leading-relaxed" style={{ color: '#8A8494' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      
        {/* Pronostics gratuits + VIP + APK sur toutes les pages */}
        <FreePredictionsWidget />
        <VipCardWidget />
        <div className="text-center pb-6">
          <LinebetApkButton />
        </div>
      </main>
      <Footer />
    </div>
  )
}
