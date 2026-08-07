import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Méthodologie — Modèle statistique de pronostics',
  description: "Méthodologie du modèle statistique de BTTSPredict : approche probabiliste, sources de données publiques, marchés couverts, limites du modèle. Aucun résultat futur garanti. 18+.",
  alternates: { canonical: 'https://bttspredict.com/methodologie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Méthodologie BTTSPredict — Modèle statistique',
    description: "Approche probabiliste, sources de données, marchés couverts, limites. Aucune validation humaine, aucun gain garanti. 18+.",
    url: 'https://bttspredict.com/methodologie',
    type: 'article',
  },
}

export default function MethodologiePage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />

      <main id="main-content" className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <header className="mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
              style={{ backgroundColor: 'rgba(81, 70, 245, 0.12)', color: '#5146F5', border: '1px solid rgba(81, 70, 245, 0.25)' }}>
              Méthodologie
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Méthodologie du modèle statistique
            </h1>
            <p className="text-base text-[#A5ABC5] leading-relaxed">
              BTTSPredict publie des pronostics BTTS (Both Teams To Score) et Over 2.5 sur le football, générés par un modèle statistique probabiliste. Cette page décrit de façon générique l'approche, les marchés couverts, les sources de données, les limites et la gestion des données manquantes — sans divulguer les paramètres internes du modèle.
            </p>
          </header>

          {/* Section 1 — Approche générale */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              1. Approche statistique
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Le modèle utilise une approche probabiliste basée sur la forme récente des équipes. Pour chaque match, le modèle estime les intensités offensives attendues de chaque équipe à partir de leurs performances récentes, puis calcule la probabilité de chaque marché (BTTS, Over 2.5).
            </p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">
              L'approche repose sur l'hypothèse que le nombre de buts marqués par chaque équipe suit une distribution statistique dont les paramètres sont estimés à partir des matchs récents. Cette approche est largement documentée dans la littérature scientifique sur la modélisation sportive.
            </p>
          </section>

          {/* Section 2 — Sources de données */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              2. Sources de données
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
              BTTSPredict utilise deux sources de données publiques, accessibles sans clé API :
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <h3 className="text-base font-bold mb-2 text-[#F7F8FF]">ESPN</h3>
                <p className="text-xs text-[#A5ABC5] leading-relaxed">
                  Source publique gratuite. Utilisée pour récupérer le calendrier des matchs, les scores finaux et les logos d'équipes. Couvre les principales ligues européennes et nord-américaines.
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <h3 className="text-base font-bold mb-2 text-[#F7F8FF]">TheSportsDB</h3>
                <p className="text-xs text-[#A5ABC5] leading-relaxed">
                  Source publique gratuite, utilisée en complément d'ESPN pour la vérification des scores finaux sur les matchs non couverts par la source principale.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
              ⚠️ BTTSPredict utilise uniquement les sources publiques mentionnées ci-dessus (ESPN et TheSportsDB). Aucune autre source n'est utilisée.
            </p>
          </section>

          {/* Section 3 — Marchés couverts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              3. Marchés couverts
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)' }}>
                  <span className="text-xs font-bold text-[#7C3AED]">BT</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F7F8FF] mb-1">BTTS (Both Teams To Score)</h3>
                  <p className="text-xs text-[#A5ABC5] leading-relaxed">
                    Pronostic : les deux équipes marquent au moins un but pendant le match.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(93, 253, 203, 0.15)' }}>
                  <span className="text-xs font-bold text-[#5DFDCB]">O2</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F7F8FF] mb-1">Over 2.5 goals</h3>
                  <p className="text-xs text-[#A5ABC5] leading-relaxed">
                    Pronostic : le total des buts du match est supérieur ou égal à 3.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6B7194] mt-3 leading-relaxed">
              Le modèle ne couvre pas les marchés suivants : score exact, double chance, handicap asiatique, mi-temps/fin de match, buteurs.
            </p>
          </section>

          {/* Section 4 — Ligues couvertes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              4. Ligues couvertes
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Le modèle est calibré sur un ensemble sélectionné de ligues présentant historiquement un taux élevé de BTTS. Cette sélection permet de concentrer les pronostics sur les matchs où le modèle a la meilleure calibration statistique.
            </p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">
              Les ligues couvertes incluent des championnats européens et nord-américains de première et deuxième division. La liste exacte peut évoluer sans préavis pour préserver la qualité du modèle.
            </p>
          </section>

          {/* Section 5 — Calibration et contrôle qualité */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              5. Calibration et contrôle qualité
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Le contrôle qualité est entièrement automatisé :
            </p>
            <ul className="space-y-2 text-sm text-[#A5ABC5]">
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Vérification automatique des critères de publication avant chaque pronostic.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Nombre limité de pronostics publiés par jour (sélection des meilleures probabilités).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Archive quotidienne horodatée et immuable (un pronostic publié n'est jamais modifié rétroactivement).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Vérification post-match via les sources publiques.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Gestion automatique des données manquantes (voir section 7).</span></li>
            </ul>
            <p className="text-xs text-[#6B7194] mt-3 leading-relaxed">
              ⚠️ Il n'y a pas de validation humaine de chaque pronostic. Le modèle est exécuté automatiquement plusieurs fois par jour via GitHub Actions.
            </p>
          </section>

          {/* Section 6 — Limites du modèle */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              6. Limites du modèle
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 113, 133, 0.06)', border: '1px solid rgba(255, 113, 133, 0.2)' }}>
              <ul className="space-y-2 text-sm text-[#A5ABC5]">
                <li>• Le modèle ne prend pas en compte les blessures, suspensions ou transferts récents.</li>
                <li>• Le modèle ne prend pas en compte la météo, l'altitude ou l'état du terrain.</li>
                <li>• Le modèle ne prend pas en compte l'enjeu sportif (finale, match de barrage, relégation).</li>
                <li>• Le modèle repose sur la forme récente des équipes, ce qui implique une variance d'échantillon non négligeable.</li>
                <li>• Le modèle ne couvre pas les coupes nationales, internationales, ni les matchs amicaux.</li>
                <li>• Aucune garantie de gain n'est offerte, même pour les pronostics à probabilité élevée.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 — Gestion des données manquantes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              7. Gestion des données manquantes
            </h2>
            <ul className="space-y-2 text-sm text-[#A5ABC5]">
              <li>• Si la forme récente d'une équipe n'est pas disponible, le match n'est pas publié.</li>
              <li>• Si la ligue n'est pas couverte par le modèle, le match n'est pas publié.</li>
              <li>• Si la probabilité calculée est insuffisante, le pronostic n'est pas publié.</li>
              <li>• Si le score final ne peut être vérifié par les sources publiques, le pronostic reste en attente et n'est pas comptabilisé dans les taux.</li>
              <li>• Un pronostic en attente n'est jamais compté dans les taux (ni gagné ni perdu).</li>
            </ul>
          </section>

          {/* Section 8 — Suivi public */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              8. Suivi public
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Une nouvelle période de suivi public a été lancée le <strong className="text-[#F7F8FF]">8 août 2026</strong>. Tous les pronostics publiés à partir de cette date sont :
            </p>
            <ul className="space-y-2 text-sm text-[#A5ABC5]">
              <li>• Enregistrés dans une archive quotidienne horodatée.</li>
              <li>• Vérifiés après le résultat officiel du match via les sources publiques.</li>
              <li>• Comptabilisés dans les statistiques publiques (taux, tendance 14 jours).</li>
              <li>• Immuables — un pronostic publié n'est jamais modifié rétroactivement.</li>
            </ul>
            <p className="text-xs text-[#6B7194] mt-3 leading-relaxed">
              Les archives antérieures au lancement du nouveau suivi sont conservées pour audit technique interne mais ne sont pas affichées publiquement.
            </p>
          </section>

          {/* Section 9 — Probabilité vs garantie */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              9. Probabilité ≠ garantie
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 200, 87, 0.06)', border: '1px solid rgba(255, 200, 87, 0.2)' }}>
              <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
                Une probabilité de 75% signifie que, sur 100 matchs similaires, le modèle s'attend à ce que 75 se terminent par le résultat prédit. Cela ne garantit pas que le match précis sera gagné.
              </p>
              <p className="text-sm text-[#A5ABC5] leading-relaxed">
                <strong className="text-[#FFC857]">Aucun résultat futur n'est garanti.</strong> Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre. 18+.
              </p>
            </div>
          </section>

          {/* Liens utiles */}
          <section className="pt-8 border-t border-[#303861]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="/historique" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
                style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}>
                Voir l'historique vérifié →
              </a>
              <a href="/pronostics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
                style={{ backgroundColor: '#0D1630', color: '#A5ABC5', border: '1px solid #303861' }}>
                Voir les pronostics du jour →
              </a>
              <a href="/jouer-responsable" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
                style={{ backgroundColor: 'transparent', color: '#FF7185', border: '1px solid rgba(255, 113, 133, 0.3)' }}>
                Jouer responsable →
              </a>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
