import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Méthodologie BTTSPredict : comment sont analysés les matchs',
  description: "Découvrez les données, filtres et limites utilisés pour analyser BTTS et Over 2,5. Méthode transparente, résultats vérifiables et aucune garantie.",
  alternates: { canonical: 'https://bttspredict.com/methodologie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Méthodologie BTTSPredict : comment sont analysés les matchs',
    description: "Découvrez les données, filtres et limites utilisés pour analyser BTTS et Over 2,5. Méthode transparente, résultats vérifiables et aucune garantie.",
    url: 'https://bttspredict.com/methodologie',
    type: 'article',
  },
}

export default function MethodologiePage() {
  return (
    <div className="min-h-screen bg-[#131314] flex flex-col text-[#f0f4f9]">
      <Navbar />

      <main id="main-content" className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <header className="mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
              style={{ backgroundColor: 'rgba(199, 244, 100, 0.12)', color: '#22c55e', border: '1px solid rgba(199, 244, 100, 0.25)' }}>
              Méthodologie
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Notre méthodologie d&apos;analyse
            </h1>
            <p className="text-base text-[#9ca3af] leading-relaxed">
              BTTSPredict publie des pronostics BTTS (Both Teams To Score) et Over 2.5 sur le football, générés par un modèle Poisson corrigé + xG. Cette page présente l'approche, les marchés couverts, les sources de données et la gestion qualité — dans une approche transparente et crédible.
            </p>
          </header>

          {/* Section 1 — Approche générale */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              1. Approche statistique
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
              Modèle Poisson corrigé + xG, entraîné sur la période 2023-2025. Variables utilisées : forme des 5 derniers matchs, taux BTTS domicile/extérieur, xG moyen, absences clés. Calibration mensuelle pour s&apos;adapter aux évolutions tactiques.
            </p>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              Pour chaque match, le modèle estime les intensités offensives attendues (lambdas) de chaque équipe à partir de ces variables, puis calcule la probabilité de chaque marché (BTTS, Over 2.5) via la distribution de Poisson. Cette approche est largement documentée dans la littérature scientifique sur la modélisation sportive.
            </p>
          </section>

          {/* Section 2 — Sources de données */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              2. Sources de données
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-4">
              BTTSPredict utilise deux sources de données publiques :
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
                <h3 className="text-base font-bold mb-2 text-[#f0f4f9]">ESPN</h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed">
                  Source publique gratuite. Utilisée pour récupérer le calendrier des matchs, les scores finaux et les logos d'équipes. Couvre les principales ligues européennes et nord-américaines.
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
                <h3 className="text-base font-bold mb-2 text-[#f0f4f9]">TheSportsDB</h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed">
                  Source publique gratuite, utilisée en complément d'ESPN pour la vérification des scores finaux sur les matchs non couverts par la source principale.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#9ca3af] mt-4 leading-relaxed">
              ⚠️ BTTSPredict utilise uniquement les sources publiques mentionnées ci-dessus (ESPN et TheSportsDB). Aucune autre source n'est utilisée.
            </p>
          </section>

          {/* Section 3 — Marchés couverts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              3. Marchés couverts
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(99, 214, 255, 0.15)' }}>
                  <span className="text-xs font-bold text-[#06b6d4]">BT</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f0f4f9] mb-1">BTTS (Both Teams To Score)</h3>
                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    Pronostic : les deux équipes marquent au moins un but pendant le match.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(99, 214, 255, 0.15)' }}>
                  <span className="text-xs font-bold text-[#06b6d4]">O2</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f0f4f9] mb-1">Over 2.5 goals</h3>
                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    Pronostic : le total des buts du match est supérieur ou égal à 3.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#9ca3af] mt-3 leading-relaxed">
              Le modèle ne couvre pas les marchés suivants : score exact, double chance, handicap asiatique, mi-temps/fin de match, buteurs.
            </p>
          </section>

          {/* Section 4 — Ligues couvertes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              4. Ligues couvertes
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
              Moteur entraîné sur 50+ championnats internationaux, prédictions appliquées en priorité Afrique de l&apos;Ouest (Sénégal, Mali, CIV, Guinée, Congo) &amp; Maroc + top ligues Europe pour volume. Cette sélection permet de concentrer les pronostics sur les matchs où le modèle a la meilleure calibration statistique.
            </p>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              Ligues prioritaires Afrique : Ligue 1 Sénégal, Botola Pro (Maroc). Ligues européennes de volume : Bundesliga, Eredivisie, Jupiler Pro League, Championship, Liga Portugal. La liste exacte peut évoluer sans préavis.
            </p>
          </section>

          {/* Section 5 — Calibration et contrôle qualité */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              5. Calibration et contrôle qualité
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
              Le contrôle qualité est entièrement automatisé :
            </p>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li className="flex items-start gap-2"><span className="text-[#06b6d4]">✓</span> <span>Vérification automatique des critères de publication avant chaque pronostic.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#06b6d4]">✓</span> <span>Nombre limité de pronostics publiés par jour (sélection des meilleures probabilités).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#06b6d4]">✓</span> <span>Archive quotidienne horodatée et immuable (un pronostic publié n'est jamais modifié rétroactivement).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#06b6d4]">✓</span> <span>Vérification post-match via les sources publiques.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#06b6d4]">✓</span> <span>Gestion automatique des données manquantes (voir section 7).</span></li>
            </ul>
            <p className="text-xs text-[#9ca3af] mt-3 leading-relaxed">
              ⚠️ Il n'y a pas de validation humaine de chaque pronostic. Le modèle est exécuté automatiquement plusieurs fois par jour via GitHub Actions.
            </p>
          </section>

          {/* Section 6 — Couverture et robustesse */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              6. Couverture et robustesse
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(199, 244, 100, 0.06)', border: '1px solid rgba(199, 244, 100, 0.2)' }}>
              <ul className="space-y-2 text-sm text-[#9ca3af]">
                <li>• Le moteur IA couvre les principales ligues européennes et nord-américaines de première et deuxième division.</li>
                <li>• Chaque match est analysé à partir de la dynamique offensive et défensive récente des deux équipes, sur leurs derniers matchs.</li>
                <li>• Le moteur est calibré en continu pour s'adapter aux évolutions tactiques et aux performances des équipes.</li>
                <li>• Les compétitions aux formats atypiques (coupes nationales, internationales, matchs amicaux) sont volontairement exclues pour préserver la qualité des pronostics.</li>
                <li>• Chaque pronostic est accompagné d'un indice de confiance transparent, basé sur la qualité des données disponibles.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 - Gestion de la qualite (v91 - display first) */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              7. Criteres de publication (v91)
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
              Depuis la version 91, BTTSPredict applique une strategie display-first :
            </p>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li>• Seuls les matchs avec BTTS ET Over 2.5 tous deux &lt; 35% sont rejetes.</li>
              <li>• Les autres matchs sont publies, tries par score interne.</li>
              <li>• Top 8 matchs en gratuit, top 6 suivants en apercu VIP.</li>
              <li>• Pour chaque match, seul le pronostic Oui/Non est affiche.</li>
            </ul>
            <p className="text-sm text-[#9ca3af] leading-relaxed mt-3">
              Aucun pourcentage ni score de fiabilite n&apos;est affiche sur le site. Seul le resultat Oui ou Non est montre, pour une lecture simple et rapide.
            </p>
          </section>

          {/* Section 8 — Suivi public */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              8. Suivi public vérifiable
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
              Une nouvelle période de suivi public a été lancée le <strong className="text-[#f0f4f9]">8 août 2026</strong>. Tous les pronostics publiés à partir de cette date sont :
            </p>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li>• Enregistrés dans une archive quotidienne horodatée et immuable.</li>
              <li>• Vérifiés après le résultat officiel du match via les sources publiques de référence.</li>
              <li>• Comptabilisés en temps réel dans les statistiques publiques (taux, tendance 14 jours).</li>
              <li>• Conservés sans modification rétroactive — un pronostic publié ne change jamais.</li>
            </ul>
          </section>

          {/* Section 9 — Probabilité et transparence */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              9. Probabilité et transparence
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(199, 244, 100, 0.06)', border: '1px solid rgba(199, 244, 100, 0.2)' }}>
              <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
                Une probabilité élevée signifie que, sur un échantillon de matchs aux caractéristiques similaires, le modèle s'attend à ce qu'une majorité se termine par le résultat prédit. BTTSPredict publie ces probabilités en toute transparence pour aider à la décision.
              </p>
              <p className="text-sm text-[#9ca3af] leading-relaxed">
                <strong className="text-[#22c55e]">Aucun résultat futur n'est garanti.</strong> Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre. 18+.
              </p>
            </div>
          </section>

          {/* Liens utiles */}
          <section className="pt-8 border-t border-[#2d2f31]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="/pronostics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
                style={{ backgroundColor: '#22c55e', color: '#131314' }}>
                Voir les pronostics du jour →
              </a>
              <a href="/jouer-responsable" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
                style={{ backgroundColor: 'transparent', color: '#FF7185', border: '1px solid rgba(255, 122, 122, 0.3)' }}>
                Jouer responsable →
              </a>
            </div>
          </section>
        </article>
              <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions />
        </section>
      </main>

      <Footer />
    </div>
  )
}
