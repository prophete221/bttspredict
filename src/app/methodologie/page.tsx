import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import { frEnAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Méthodologie',
  description: "Découvrez les données, filtres et limites utilisés pour analyser BTTS et Over 2,5. Méthode transparente, résultats vérifiables et aucune garantie.",
  alternates: frEnAlternates('/methodologie', 'fr'),
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Méthodologie | BTTSPredict',
    description: "Découvrez les données, filtres et limites utilisés pour analyser BTTS et Over 2,5. Méthode transparente, résultats vérifiables et aucune garantie.",
    url: 'https://bttspredict.com/methodologie',
    type: 'article',
  },
}

export default function MethodologiePage() {
  return (
    <div className="content-page method-page min-h-screen flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
        <article className="legal-page__main max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <header className="mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
              style={{ backgroundColor: 'rgba(127, 162, 198, 0.16)', color: '#2F7DFF', border: '1px solid rgba(127, 162, 198, 0.30)' }}>
              Méthodologie
            </span>
            <AnimatedTitle
              as="h1"
              text="Notre méthodologie d’analyse"
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
            <p className="text-base text-[#9DABBB] leading-relaxed">
              BTTSPredict publie des sélections BTTS (Both Teams To Score) et Over 2.5 publiées uniquement après validation par le flux public. Cette page présente les marchés, les contrôles de publication, les sources de données et leurs limites.
            </p>
          </header>

          {/* Section 1 — Approche générale */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              1. Source des pronostics
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              Chaque sélection publique BTTS ou Over 2.5 passe les contrôles du flux public avant publication. Les valeurs affichées sont celles du pick validé ; la page ne les recalcule pas avec Poisson ni avec une heuristique locale.
            </p>
            <p className="text-sm text-[#9DABBB] leading-relaxed">
              Le calendrier et les résultats servent à identifier les rencontres et à vérifier ensuite leur issue. Ils ne sont pas transformés localement en nouveaux pronostics ; en l&apos;absence d&apos;un pick valide, aucun pick n&apos;est fabriqué.
            </p>
          </section>

          {/* Section 2 — Sources de données */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              2. Sources de données
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-4">
              BTTSPredict utilise deux sources de données publiques :
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
                <h3 className="text-base font-bold mb-2 text-[#F2F6FA]">ESPN</h3>
                <p className="text-xs text-[#9DABBB] leading-relaxed">
                  Source publique gratuite. Utilisée pour récupérer le calendrier des matchs, les scores finaux et les logos d'équipes. Couvre les principales ligues européennes et nord-américaines.
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
                <h3 className="text-base font-bold mb-2 text-[#F2F6FA]">TheSportsDB</h3>
                <p className="text-xs text-[#9DABBB] leading-relaxed">
                  Source publique gratuite, utilisée en complément d'ESPN pour la vérification des scores finaux sur les matchs non couverts par la source principale.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#9DABBB] mt-4 leading-relaxed">
              Ces sources fournissent du contexte de calendrier et de vérification. Les actualités et photos de contexte utilisent des sources distinctes, avec leurs dates et attributions ; elles ne créent ni ne remplacent les sélections publiées.
            </p>
          </section>

          {/* Section 3 — Marchés couverts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              3. Marchés couverts
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(169, 196, 223, 0.15)' }}>
                  <span className="text-xs font-bold text-[#2F7DFF]">BT</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F6FA] mb-1">BTTS (Both Teams To Score)</h3>
                  <p className="text-xs text-[#9DABBB] leading-relaxed">
                    Pronostic : les deux équipes marquent au moins un but pendant le match.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(169, 196, 223, 0.15)' }}>
                  <span className="text-xs font-bold text-[#2F7DFF]">O2</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F6FA] mb-1">Over 2.5 goals</h3>
                  <p className="text-xs text-[#9DABBB] leading-relaxed">
                    Pronostic : le total des buts du match est supérieur ou égal à 3.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#9DABBB] mt-3 leading-relaxed">
              Le flux public validé ne publie actuellement que les marchés BTTS et Over 2.5. Aucun score exact ni combiné calculé localement n&apos;est ajouté à ces sélections.
            </p>
          </section>

          {/* Section 4 — Ligues couvertes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              4. Ligues couvertes
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              Le flux peut fournir des éléments de contexte comme la forme récente, les cotes, la compétition ou le nombre de matchs disponibles. Ces champs ne sont pas des sélections et ne remplacent jamais un marché validé. Les informations absentes ne sont pas inventées.
            </p>
            <p className="text-sm text-[#9DABBB] leading-relaxed">
              Le flux public ne représente pas le calendrier complet des championnats. Une rencontre n&apos;apparaît comme pronostic que si un pick valide existe ; les dates et marchés visibles dépendent donc des données effectivement publiées.
            </p>
          </section>

          {/* Section 5 — Calibration et contrôle qualité */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              5. Calibration et contrôle qualité
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              Les contrôles du flux public portent notamment sur :
            </p>
            <ul className="space-y-2 text-sm text-[#9DABBB]">
              <li className="flex items-start gap-2"><span className="text-[#2F7DFF]">✓</span> <span>Contrôle de validation et marché pris en charge (BTTS ou Over 2.5).</span></li>
              <li className="flex items-start gap-2"><span className="text-[#2F7DFF]">✓</span> <span>Identité du match, date et heure de coup d&apos;envoi vérifiables.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#2F7DFF]">✓</span> <span>Doublons et marchés contradictoires écartés lors de la fusion des flux.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#2F7DFF]">✓</span> <span>Rencontres déjà commencées retirées des listes de pronostics à venir.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#2F7DFF]">✓</span> <span>Tous les picks valides à venir sont affichés, sans coupure fixe à J+7.</span></li>
            </ul>
          </section>

          {/* Section 6 — Couverture et robustesse */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              6. Couverture et robustesse
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(47, 125, 255, 0.06)', border: '1px solid rgba(47, 125, 255, 0.2)' }}>
              <ul className="space-y-2 text-sm text-[#9DABBB]">
                <li>• La liste publiée contient les sélections validées, pas un calendrier exhaustif des ligues.</li>
                <li>• Les statistiques d&apos;équipe, les cotes et la forme récente restent des données de contexte.</li>
                <li>• Un score de qualité des données n&apos;est pas une probabilité de gain.</li>
                <li>• Les marchés non pris en charge et les matchs sans pick valide ne sont pas complétés par un calcul local.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 - Sélections publiques */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              7. Sélections publiques
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              Par défaut, la page affiche tous les picks valides du flux public, marché par marché : elle ne choisit pas un « top 3 » et ne calcule pas de combiné. Les filtres facultatifs peuvent réduire la liste affichée, mais ils ne créent ni ne modifient les picks.
            </p>
            <ul className="space-y-2 text-sm text-[#9DABBB]">
              <li>• Les sélections BTTS et Over 2.5 sont affichées séparément.</li>
              <li>• Les valeurs visibles proviennent des sélections publiées ; le site ne crée pas de sélection à partir des statistiques de contexte.</li>
              <li>• Les coups d&apos;envoi passés, doublons et marchés contradictoires ne sont pas affichés comme picks à venir.</li>
            </ul>
          </section>

          {/* Section 8 — Suivi public */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              8. Suivi public vérifiable
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              Une nouvelle période de suivi public a été lancée le <strong className="text-[#F2F6FA]">8 août 2026</strong>. Tous les pronostics publiés à partir de cette date sont :
            </p>
            <ul className="space-y-2 text-sm text-[#9DABBB]">
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
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(47, 125, 255, 0.06)', border: '1px solid rgba(47, 125, 255, 0.2)' }}>
              <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
                La probabilité affichée est l&apos;estimation associée au marché concerné. Elle ne constitue ni une fréquence historique, ni une certitude ; BTTSPredict ne la recalcule pas avec un modèle local.
              </p>
              <p className="text-sm text-[#9DABBB] leading-relaxed">
                <strong className="text-[#2F7DFF]">Aucun résultat futur n'est garanti.</strong> Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre. 18+.
              </p>
            </div>
          </section>

          {/* Liens utiles */}
          <section className="pt-8 border-t border-[#6B7A8C]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="/btts/predictions/today" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
                style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
                Voir les pronostics du jour →
              </a>
              <a href="/jouer-responsable" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
                style={{ backgroundColor: 'transparent', color: '#F87171', border: '1px solid rgba(255, 122, 122, 0.3)' }}>
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
