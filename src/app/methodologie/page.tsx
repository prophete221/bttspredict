import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Méthodologie — Modèle statistique Poisson V3-Reliability',
  description: "Méthodologie du modèle statistique Poisson V3-Reliability : données ESPN + TheSportsDB, 8 variables, 4 filtres, calibration, limites. Aucun résultat futur garanti. 18+.",
  alternates: { canonical: 'https://bttspredict.com/methodologie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Méthodologie BTTSPredict — Modèle Poisson V3-Reliability',
    description: "Sources de données, modèle statistique, calibration, limites. Aucune validation humaine, aucun gain garanti. 18+.",
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
              Modèle V3-Reliability
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Méthodologie du modèle statistique
            </h1>
            <p className="text-base text-[#A5ABC5] leading-relaxed">
              BTTSPredict publie des pronostics BTTS (Both Teams To Score) et Over 2.5 sur le football, générés par un modèle statistique Poisson bivarié. Cette page décrit de façon transparente les données réellement utilisées, le modèle réellement exécuté, ses marchés couverts, ses limites et la gestion des données manquantes.
            </p>
          </header>

          {/* Section 1 — Données réellement utilisées */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              1. Données réellement utilisées
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
              BTTSPredict utilise deux sources de données publiques, accessibles sans clé API :
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <h3 className="text-base font-bold mb-2 text-[#F7F8FF]">ESPN Soccer API</h3>
                <p className="text-xs text-[#A5ABC5] leading-relaxed mb-2">
                  URL : <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#1E2340' }}>site.api.espn.com/apis/site/v2/sports/soccer/&lt;slug&gt;/scoreboard</code>
                </p>
                <p className="text-xs text-[#A5ABC5] leading-relaxed">
                  Source publique gratuite, sans clé API. Utilisée pour récupérer les matchs à venir (calendrier), les scores finaux (vérification), et les logos d'équipes. Couvre les 11 ligues HIGH_BTTS.
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <h3 className="text-base font-bold mb-2 text-[#F7F8FF]">TheSportsDB v3</h3>
                <p className="text-xs text-[#A5ABC5] leading-relaxed mb-2">
                  URL : <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#1E2340' }}>thesportsdb.com/api/v1/json/3/eventsday.php</code>
                </p>
                <p className="text-xs text-[#A5ABC5] leading-relaxed">
                  Source publique gratuite (clé "3" gratuite), utilisée en fallback d'ESPN pour la vérification des scores finaux sur les matchs non couverts par ESPN.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
              ⚠️ BTTSPredict n'utilise pas API-Football, Forebet, Windrawwin ni Soccerbase. Toute mention de ces sources dans d'anciennes versions du site était erronée et a été corrigée.
            </p>
          </section>

          {/* Section 2 — Variables réellement utilisées */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              2. Variables réellement utilisées
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
              Le modèle utilise <strong className="text-[#F7F8FF]">8 variables par match</strong> (et non 200+ comme indiqué dans d'anciennes versions) :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #303861' }}>
                    <th className="text-left py-2 px-3 font-bold text-[#A5ABC5]">#</th>
                    <th className="text-left py-2 px-3 font-bold text-[#A5ABC5]">Variable</th>
                    <th className="text-left py-2 px-3 font-bold text-[#A5ABC5]">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[#F7F8FF]">
                  {[
                    ['1', 'homeForm.scoredIn', 'Nb de matchs (sur 5) où l\'équipe à domicile a marqué'],
                    ['2', 'homeForm.concededIn', 'Nb de matchs (sur 5) où l\'équipe à domicile a encaissé'],
                    ['3', 'homeForm.avgScored', 'Moyenne de buts marqués à domicile sur les 5 derniers matchs'],
                    ['4', 'homeForm.avgConceded', 'Moyenne de buts encaissés à domicile sur les 5 derniers matchs'],
                    ['5', 'awayForm.scoredIn', 'Nb de matchs (sur 5) où l\'équipe à l\'extérieur a marqué'],
                    ['6', 'awayForm.concededIn', 'Nb de matchs (sur 5) où l\'équipe à l\'extérieur a encaissé'],
                    ['7', 'awayForm.avgScored', 'Moyenne de buts marqués à l\'extérieur sur les 5 derniers matchs'],
                    ['8', 'awayForm.avgConceded', 'Moyenne de buts encaissés à l\'extérieur sur les 5 derniers matchs'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #303861' }}>
                      <td className="py-2 px-3 text-[#6B7194]">{row[0]}</td>
                      <td className="py-2 px-3"><code className="text-xs text-[#5DFDCB]" style={{ backgroundColor: '#1E2340', padding: '2px 6px', borderRadius: '3px' }}>{row[1]}</code></td>
                      <td className="py-2 px-3 text-[#A5ABC5]">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
              Les 4 variables de ligue (bttsRate, avgGoals, homeFactor, awayFactor) sont des constantes de calibration par ligue, et non des variables par match.
            </p>
          </section>

          {/* Section 3 — Modèle réellement exécuté */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              3. Modèle Poisson bivarié
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
              Le modèle suppose que le nombre de buts marqués par chaque équipe suit une loi de Poisson indépendante. Les intensités (lambdas) sont calculées à partir de la forme récente des équipes :
            </p>
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#1E2340', border: '1px solid #303861' }}>
              <pre className="text-xs text-[#5DFDCB] overflow-x-auto" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
{`# 1. Forme récente des équipes (5 derniers matchs)
homeForm = { scoredIn, concededIn, avgScored, avgConceded }
awayForm = { scoredIn, concededIn, avgScored, avgConceded }

# 2. Lambdas Poisson (intensités attendues)
homeLambda = max(0.3, homeAttack × awayDefense × (leagueAvgHome / 1.3) × 1.15)
awayLambda = max(0.3, awayAttack × homeDefense × (leagueAvgAway / 1.1))

# 3. Probabilités Poisson exactes
bttsProb    = (1 - e^(-homeLambda)) × (1 - e^(-awayLambda))
over25Prob  = 1 - Σ P(home=i, away=j)  pour i+j ≤ 2
            = 1 - Σ PoissonPMF(i, homeLambda) × PoissonPMF(j, awayLambda)`}
              </pre>
            </div>
            <p className="text-xs text-[#A5ABC5] leading-relaxed">
              Le modèle suppose l'indépendance entre les buts marqués par chaque équipe. C'est une simplification — en réalité, les buts d'une équipe peuvent affecter la stratégie de l'autre (un but rapide peut mener à un match plus ouvert). Cette limite est assumée pour la simplicité du calcul.
            </p>
          </section>

          {/* Section 4 — Marchés couverts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              4. Marchés couverts
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)' }}>
                  <span className="text-xs font-bold text-[#7C3AED]">BT</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F7F8FF] mb-1">BTTS (Both Teams To Score)</h3>
                  <p className="text-xs text-[#A5ABC5] leading-relaxed">
                    Pronostic : les deux équipes marquent au moins un but. Calcul : P(home ≥ 1) × P(away ≥ 1).
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
                    Pronostic : le total des buts du match est supérieur ou égal à 3. Calcul : 1 - P(total ≤ 2).
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6B7194] mt-3 leading-relaxed">
              Le modèle ne couvre pas les marchés suivants : score exact, double chance, handicap asiatique, mi-temps/fin de match, buteurs.
            </p>
          </section>

          {/* Section 5 — Filtres de publication */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              5. Filtres de publication
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Un prono n'est publié que si les 4 filtres suivants sont satisfaits simultanément :
            </p>
            <ol className="space-y-2 text-sm text-[#A5ABC5]">
              <li className="flex items-start gap-2"><span className="text-[#5146F5] font-bold">1.</span> <span>Les deux équipes ont marqué dans au moins 3 de leurs 5 derniers matchs.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5146F5] font-bold">2.</span> <span>Les deux équipes ont encaissé dans au moins 3 de leurs 5 derniers matchs.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5146F5] font-bold">3.</span> <span>Le match se joue dans une des 11 ligues HIGH_BTTS (taux historique &gt; 53%).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5146F5] font-bold">4.</span> <span>La probabilité Poisson du marché est ≥ 0.62.</span></li>
            </ol>
            <p className="text-xs text-[#6B7194] mt-3 leading-relaxed">
              Si aucun match ne passe les 4 filtres un jour donné, aucun prono n'est publié. C'est intentionnel.
            </p>
          </section>

          {/* Section 6 — Ligues HIGH_BTTS */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              6. Ligues HIGH_BTTS (11 ligues)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                'Premier League (Angleterre)',
                'Championship (Angleterre D2)',
                'Bundesliga (Allemagne)',
                '2. Bundesliga (Allemagne D2)',
                'Eredivisie (Pays-Bas)',
                'Jupiler Pro League (Belgique)',
                'Swiss Super League (Suisse)',
                'Liga Portugal (Portugal)',
                'Austrian Bundesliga (Autriche)',
                'Scottish Premiership (Écosse)',
                'MLS (États-Unis)',
              ].map((lg, i) => (
                <div key={i} className="p-2 rounded-lg text-center" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                  <span className="text-[#A5ABC5]">{lg}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 — Calibration */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              7. Calibration et contrôle qualité
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Le contrôle qualité est entièrement automatisé :
            </p>
            <ul className="space-y-2 text-sm text-[#A5ABC5]">
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Vérification automatique des filtres avant publication.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Force <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: '#1E2340' }}>proba = 0.62</code> si la probabilité est manquante (jamais 0).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Limite de 5 pronos par jour (top proba).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Archive quotidienne horodatée (immutabilité rétroactive).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#5DFDCB]">✓</span> <span>Vérification post-match via ESPN + TheSportsDB (sans clé API).</span></li>
            </ul>
            <p className="text-xs text-[#6B7194] mt-3 leading-relaxed">
              ⚠️ Il n'y a pas de validation humaine de chaque pronostic. Le modèle est exécuté automatiquement 4 fois par jour via GitHub Actions.
            </p>
          </section>

          {/* Section 8 — Limites du modèle */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              8. Limites du modèle
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 113, 133, 0.06)', border: '1px solid rgba(255, 113, 133, 0.2)' }}>
              <ul className="space-y-2 text-sm text-[#A5ABC5]">
                <li>• Le modèle ne prend pas en compte les blessures, suspensions ou transferts récents.</li>
                <li>• Le modèle ne prend pas en compte la météo, l'altitude ou l'état du terrain.</li>
                <li>• Le modèle ne prend pas en compte l'enjeu sportif (finale, match de barrage, relégation).</li>
                <li>• Le modèle suppose l'indépendance entre les buts marqués par chaque équipe.</li>
                <li>• Le modèle utilise uniquement les 5 derniers matchs — la variance d'échantillon est élevée.</li>
                <li>• Le modèle ne couvre pas les coupes nationales, internationales, ni les matchs amicaux.</li>
                <li>• Aucune garantie de gain n'est offerte, même pour les pronostics GOLD à proba élevée.</li>
              </ul>
            </div>
          </section>

          {/* Section 9 — Gestion des données manquantes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              9. Gestion des données manquantes
            </h2>
            <ul className="space-y-2 text-sm text-[#A5ABC5]">
              <li>• Si la forme d'une équipe n'est pas disponible, le match est filtré (non publié).</li>
              <li>• Si la ligue n'est pas dans HIGH_BTTS, le match est filtré.</li>
              <li>• Si la probabilité calculée est &lt; 0.62, le prono est filtré.</li>
              <li>• Si la probabilité est manquante après calcul, elle est forcée à 0.62 (jamais 0).</li>
              <li>• Si le score final ne peut être vérifié (ESPN + TheSportsDB indisponibles), le prono reste en statut PENDING.</li>
              <li>• Un prono en PENDING n'est jamais compté dans les taux (ni gagné ni perdu).</li>
            </ul>
          </section>

          {/* Section 10 — Suivi du nouveau modèle */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              10. Suivi du nouveau modèle
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Une nouvelle période de suivi public a été lancée le <strong className="text-[#F7F8FF]">8 août 2026</strong>. Tous les pronostics publiés à partir de cette date sont :
            </p>
            <ul className="space-y-2 text-sm text-[#A5ABC5]">
              <li>• Enregistrés dans une archive quotidienne horodatée.</li>
              <li>• Vérifiés après le résultat officiel du match (ESPN + TheSportsDB).</li>
              <li>• Comptabilisés dans les statistiques publiques (taux, ROI, trend 14j).</li>
              <li>• Immuables — un prono publié n'est jamais modifié rétroactivement.</li>
            </ul>
            <p className="text-xs text-[#6B7194] mt-3 leading-relaxed">
              Les archives antérieures au 8 août 2026 sont conservées pour audit technique interne mais ne sont pas affichées publiquement.
            </p>
          </section>

          {/* Section 11 — Probabilité vs garantie */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              11. Probabilité ≠ garantie
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
