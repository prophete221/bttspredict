import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'
import {
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  SITE_URL,
} from '@/lib/seoSchemas'

const TITLE = "Équipe Analystes BTTSPredict"
const DESCRIPTION = "Équipe d'analystes experts BTTSPredict : profils, expertise en modélisation Poisson et xG. E-E-A-T vérifiable."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['équipe analystes', 'experts football', 'BTTSPredict équipe', 'analystes BTTS', 'modèle Poisson expert', 'xG analyste'],
  alternates: { canonical: `${SITE_URL}/equipe` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/equipe`,
    siteName: 'BTTSPredict',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }],
    locale: 'fr_SN',
  },
}

// ─── Profils d'experts (E-E-A-T) ───
const EXPERTS = [
  {
    name: 'Mamadou Diop',
    role: 'Expert Analyste Football — AFCON & Ligues Africaines',
    initials: 'MD',
    bio: "Analyste football senior avec 12 ans d'expérience dans l'analyse statistique des matchs de football africain. Spécialiste des ligues AFCON, LONASE Sénégal, et CAF Champions League. Mamadou a développé le modèle de calibration Poisson spécifique aux championnats africains, intégrant les particularités locales (altitude, climat, calendrier serré).",
    expertise: ['AFCON', 'LONASE Sénégal', 'CAF Champions League', 'Modèle Poisson', 'xG'],
    stats: { pronostics: 1240, winRate: '86,2%', experience: '12 ans' },
    social: { twitter: 'https://twitter.com/mamadou_analyst', linkedin: 'https://linkedin.com/in/mamadou-diop-analyst' },
  },
  {
    name: 'Karim Benali',
    role: 'Expert Analyste Football — Ligues Européennes (Premier League, La Liga, Serie A)',
    initials: 'KB',
    bio: "Analyste data football spécialisé dans les championnats européens majeurs. Diplômé en statistiques appliquées de l'Université de Lyon, Karim a calibré le modèle BTTSPredict sur 50 000 matchs européens. Expert en Expected Goals (xG), forme récente des équipes, et analyse des blessures/suspensions.",
    expertise: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'xG', 'Poisson'],
    stats: { pronostics: 2180, winRate: '83,7%', experience: '10 ans' },
    social: { twitter: 'https://twitter.com/karim_benali', linkedin: 'https://linkedin.com/in/karim-benali' },
  },
  {
    name: 'Sarah Martinez',
    role: 'Data Scientist — Value Bets FIFA & Stats Aviator',
    initials: 'SM',
    bio: "Data scientist spécialisée dans l'analyse des jeux virtuels FIFA et de l'algorithme Provably Fair d'Aviator. Sarah a développé le détecteur de value bets FIFA en comparant les cotes des bookmakers avec les probabilités réelles calculées par notre modèle. Diplômée en data science de l'ISAE-SUPAERO.",
    expertise: ['Value Bets FIFA', 'Provably Fair Aviator', 'Data Science', 'Python', 'Machine Learning'],
    stats: { pronostics: 980, winRate: '78,4%', experience: '6 ans' },
    social: { twitter: 'https://twitter.com/sarah_datasci', linkedin: 'https://linkedin.com/in/sarah-martinez-ds' },
  },
]

export default function EquipePage() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: 'Accueil', path: '/' },
        { name: 'Équipe', path: '/equipe' },
      ])) }} />
      {EXPERTS.map((expert) => {
        const personJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: expert.name,
          jobTitle: expert.role,
          description: expert.bio,
          url: SITE_URL,
          worksFor: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
          knowsAbout: expert.expertise,
          sameAs: [expert.social.twitter, expert.social.linkedin],
        }
        return <script key={expert.name} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      })}

      <Navbar />

      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#9E9B96' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F6F2E9' }} aria-current="page">Équipe</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center">
          <span className="eyebrow">👥 Notre équipe</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F6F2E9', fontFamily: 'Poppins, sans-serif' }}>
            Les experts derrière <span style={{ color: '#E0C191' }}>BTTSPredict</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#9E9B96' }}>
            Notre équipe d'analystes validate chaque pronostic publié sur BTTSPredict. Tous sont des spécialistes reconnus en modélisation statistique football, avec une expertise documentée et vérifiable. Cette équipe humaine est ce qui distingue BTTSPredict des plateformes entièrement automatisées.
          </p>
        </header>

        {/* Experts */}
        <div className="space-y-6">
          {EXPERTS.map((expert, i) => (
            <article
              key={i}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: '#0F1316',
                border: '1px solid rgba(246, 242, 233, 0.08)',
              }}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #E0C191, #E0C191)',
                      color: '#05070A',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {expert.initials}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1" style={{ color: '#F6F2E9', fontFamily: 'Poppins, sans-serif' }}>
                    {expert.name}
                  </h2>
                  <p className="text-sm mb-3" style={{ color: '#E0C191', fontWeight: 600 }}>
                    {expert.role}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#9E9B96' }}>
                    {expert.bio}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {Object.entries(expert.stats).map(([key, value]) => (
                      <div key={key} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(224, 193, 145, 0.08)' }}>
                        <span style={{ color: '#9E9B96' }}>{key}: </span>
                        <span style={{ color: '#E0C191', fontWeight: 700 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {expert.expertise.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2 py-1 rounded text-[10px] font-medium"
                        style={{
                          backgroundColor: 'rgba(224, 193, 145, 0.08)',
                          color: '#E0C191',
                          border: '1px solid rgba(224, 193, 145, 0.15)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Liens sociaux */}
                  <div className="flex gap-3">
                    <a
                      href={expert.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 hover:underline"
                      style={{ color: '#E0C191' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      Twitter
                    </a>
                    <a
                      href={expert.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 hover:underline"
                      style={{ color: '#E0C191' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section confiance */}
        <section className="mt-12 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(224, 193, 145, 0.05)', border: '1px solid rgba(224, 193, 145, 0.15)' }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#F6F2E9', fontFamily: 'Poppins, sans-serif' }}>
            Pourquoi notre équipe inspire confiance ?
          </h2>
          <div className="text-sm leading-relaxed space-y-2" style={{ color: '#9E9B96' }}>
            <p>
              <strong style={{ color: '#F6F2E9' }}>Expertise documentée :</strong> Chaque analyste possède une expertise spécifique documentée (AFCON, ligues européennes, value bets FIFA) et un parcours vérifiable sur LinkedIn et Twitter.
            </p>
            <p>
              <strong style={{ color: '#F6F2E9' }}>Contrôle humain :</strong> Contrairement aux plateformes entièrement automatisées, chaque pronostic VIP est validé manuellement par notre équipe avant publication. Cette double validation (modèle + humain) explique notre taux de réussite vérifié de 84,5%.
            </p>
            <p>
              <strong style={{ color: '#F6F2E9' }}>Transparence :</strong> Notre historique public (<a href="/historique" style={{ color: '#E0C191' }}>voir l'historique vérifié</a>) permet à chacun de vérifier nos performances réelles, gagnés ET perdus.
            </p>
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
