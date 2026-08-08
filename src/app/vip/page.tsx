import type { Metadata } from 'next'
import { Navbar, Footer, VipCardGrid, PromoVip, VipSports, AviatorVip, HowToGetVip, VipLevelModal, CopyableCode, LinebetApkButton } from '@/components/bttsbet'
import { SITE, AFFILIATE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'VIP — Pronostics premium BTTS et Over 2.5',
  description: "Programme VIP BTTSPredict : pronostics premium, multi-sports, analyses détaillées. Accès après activation chez le bookmaker partenaire. Aucun gain garanti. 18+.",
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'VIP BTTSPredict — Pronostics premium',
    description: "Programme VIP BTTSPredict : pronostics premium et analyses détaillées. Aucun gain garanti. 18+.",
    url: 'https://bttspredict.com/vip',
    type: 'website',
  },
}

const AFFILIATION_NOTICE = "Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds."

export default function VipPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 1. Introduction */}
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', color: '#FFC857', border: '1px solid rgba(255, 200, 87, 0.25)' }}>
              Programme VIP
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pronostics premium BTTS et Over 2.5
            </h1>
            <p className="text-base sm:text-lg text-[#A5ABC5] leading-relaxed mb-3">
              Le programme VIP BTTSPredict propose des pronostics premium avec des sélections supplémentaires et des analyses détaillées, générés par un modèle IA nouvelle génération.
            </p>
            <p className="text-sm text-[#6B7194] leading-relaxed">
              Aucun gain n'est garanti. Les pronostics sont publiés à titre informatif et ne constituent pas une incitation à parier. 18+.
            </p>
          </div>
        </section>

        {/* 2. Cartes VIP (comparaison des niveaux) — placées en premier */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Comparaison des niveaux VIP
          </h2>
          <VipCardGrid />
        </section>

        {/* 3. Sports couverts (VIP Multi-Sports — placé juste après VIP Pro) */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sports couverts
          </h2>
          <p className="text-sm text-[#A5ABC5] mb-4 leading-relaxed">
            Le moteur IA est calibré en priorité pour le football, sport où le volume de données disponibles est le plus riche. D'autres sports sont également disponibles en VIP pour élargir le champ des opportunités d'analyse.
          </p>
          <VipSports />
          <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
            La couverture multi-sports est en déploiement progressif. Les performances par sport seront communiquées au fur et à mesure de l'accumulation des données vérifiées.
          </p>
        </section>

        {/* 4. Proposition de valeur */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '⚽', title: 'Sélections supplémentaires', desc: 'Accès à des pronostics supplémentaires par rapport à la version gratuite, sur les mêmes marchés BTTS et Over 2.5.' },
              { icon: '📊', title: 'Analyses détaillées', desc: 'Pour chaque prono VIP : indices IA, forme récente des équipes, contexte de la ligue, niveau de confiance des données.' },
              { icon: '🎯', title: 'Calibration continue', desc: 'Moteur IA calibré en continu pour s\'adapter aux dynamiques récentes des équipes et des compétitions.' },
            ].map((card, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="text-3xl mb-3" aria-hidden="true">{card.icon}</div>
                <h2 className="text-base font-bold mb-2 text-[#F7F8FF]">{card.title}</h2>
                <p className="text-sm text-[#A5ABC5] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Avantages réels de chaque niveau */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ce que contient réellement chaque niveau
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #303861' }}>
                  <th className="text-left py-3 px-4 font-bold text-[#A5ABC5]">Caractéristique</th>
                  <th className="text-center py-3 px-4 font-bold text-[#A5ABC5]">VIP Essentiel</th>
                  <th className="text-center py-3 px-4 font-bold text-[#A5ABC5]">VIP Pro</th>
                </tr>
              </thead>
              <tbody className="text-[#F7F8FF]">
                {[
                  ['Pronostics BTTS du jour', '✓', '✓'],
                  ['Pronostics Over 2.5 du jour', '✓', '✓'],
                  ['Historique vérifiable', '✓', '✓'],
                  ['Pronostics premium supplémentaires', '—', '✓'],
                  ['Gold Picks (proba ≥ 75%)', '—', '✓'],
                  ['Analyses xG détaillées', '—', '✓'],
                  ['Support prioritaire', '—', '✓'],
                  ['Support email standard', '✓', '—'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #303861' }}>
                    <td className="py-3 px-4 text-[#A5ABC5]">{row[0]}</td>
                    <td className="text-center py-3 px-4">{row[1]}</td>
                    <td className="text-center py-3 px-4">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
            Les pronostics VIP offrent un volume de sélections plus important et un niveau de détail d'analyse supérieur aux pronostics gratuits.
          </p>
        </section>

        {/* 6. Nombre réel de pronostics */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Nombre de pronostics par jour
          </h2>
          <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Le nombre réel de pronostics publiés chaque jour dépend du nombre de matchs qui passent les critères de qualité du modèle. En moyenne, un nombre limité de pronostics est publié chaque jour.
            </p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">
              Si aucun match ne passe les filtres un jour donné, aucun prono n'est publié. C'est intentionnel — mieux vaut 0 prono que 50 à 0%.
            </p>
          </div>
        </section>

        {/* 7. Durée réelle d'accès */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Durée d'accès
          </h2>
          <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">
              L'accès VIP est activé pour 30 jours à compter de la validation de votre inscription chez le bookmaker partenaire. La durée exacte est confirmée par le support WhatsApp après vérification de l'ID joueur.
            </p>
          </div>
        </section>

        {/* 8. Méthode de validation */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Comment activer le VIP
          </h2>
          <HowToGetVip />
          <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
            La vérification de l'ID joueur se fait auprès du support WhatsApp. BTTSPredict ne collecte pas de données bancaires et ne prend pas de paris. La validation est manuelle et peut prendre jusqu'à 24h.
          </p>
        </section>

        {/* 9. Coupon VIP du jour */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sélections VIP du jour
          </h2>
          <PromoVip />
        </section>

        {/* 10. Aviator (informatif, non prédictif) */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Statistiques Aviator (informatif)
          </h2>
          <AviatorVip />
          <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
            Les statistiques Aviator sont fournies à titre informatif uniquement, basées sur l'algorithme Provably Fair. BTTSPredict ne prédit pas les résultats Aviator.
          </p>
        </section>

        {/* 11. Lien vers l'historique */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="p-5 rounded-2xl text-center" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Vérifier nos résultats
            </h2>
            <p className="text-sm text-[#A5ABC5] mb-4 leading-relaxed">
              Tous les pronostics publiés sont enregistrés, horodatés et vérifiés après le résultat officiel du match. Le suivi public est lancé depuis le 8 août 2026.
            </p>
          </div>
        </section>

        {/* 12. Conditions et limites */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Conditions et limites
          </h2>
          <div className="p-5 rounded-2xl space-y-3" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">• L'accès VIP ne garantit aucun gain. Les paris sportifs comportent un risque de perte.</p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">• Les pronostics sont publiés à titre informatif et ne constituent pas une incitation à parier.</p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">• BTTSPredict ne prend pas de paris et ne collecte pas de fonds.</p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">• L'accès VIP est lié à un compte bookmaker partenaire actif.</p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">• Le moteur IA peut produire des séries de pertes inhérentes aux paris sportifs. Aucun remboursement n'est prévu.</p>
            <p className="text-sm text-[#A5ABC5] leading-relaxed">• Réservé aux personnes majeures (18+).</p>
          </div>
        </section>

        {/* 13. Code promo + CTA affiliation */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Code promo partenaire
            </h2>
            <p className="text-sm text-[#A5ABC5] mb-5 leading-relaxed">
              {AFFILIATION_NOTICE}
            </p>
            <div className="flex flex-col items-center gap-4">
              <CopyableCode code={SITE.promoCode} />
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={AFFILIATE.linebet} rel={AFFILIATE.rel} className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
                  style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}
                  data-cta="vip-linebet-inscription">
                  S'inscrire sur Linebet
                </a>
                <a href={AFFILIATE.star888} rel={AFFILIATE.rel} className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
                  style={{ backgroundColor: 'transparent', color: '#FFC857', border: '1px solid #FFC857' }}
                  data-cta="vip-888starz-inscription">
                  S'inscrire sur 888starz
                </a>
              </div>
              <LinebetApkButton />
            </div>
          </div>
        </section>

        {/* 14. FAQ VIP */}
        <section className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Questions fréquentes VIP
          </h2>
          <div className="space-y-3">
            {[
              { q: 'Le VIP garantit-il des gains ?', a: 'Non. Aucun gain n\'est garanti. Les paris sportifs comportent un risque de perte. Le VIP propose des sélections supplémentaires basées sur une approche statistique.' },
              { q: 'Pourquoi le VIP est-il lié à un bookmaker ?', a: 'BTTSPredict est un site d\'analyse statistique. Le VIP est un service premium réservé aux utilisateurs inscrits chez nos bookmakers partenaires. BTTSPredict ne prend pas de paris et ne collecte pas de fonds.' },
              { q: 'Combien de pronostics par jour ?', a: 'Un nombre limité de pronostics est publié chaque jour, sélectionnés parmi les meilleures probabilités. Le nombre exact varie selon les matchs disponibles.' },
              { q: 'Puis-je obtenir un remboursement ?', a: 'Aucun remboursement n\'est prévu. Le moteur IA peut produire des séries de pertes inhérentes aux paris sportifs. Le VIP est un service d\'analyse, pas un produit financier.' },
              { q: 'Comment contacter le support VIP ?', a: 'Le support VIP se fait via WhatsApp. Le numéro est communiqué après activation du compte. Le support standard se fait par email.' },
              { q: 'Le VIP est-il accessible aux mineurs ?', a: 'Non. Le VIP est strictement réservé aux personnes majeures (18+). Une vérification d\'âge est effectuée à l\'inscription chez le bookmaker partenaire.' },
            ].map((item, i) => (
              <details key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <summary className="text-sm font-bold text-[#F7F8FF] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5] rounded">
                  {item.q}
                </summary>
                <p className="text-sm text-[#A5ABC5] mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 15. Jeu responsable */}
        <section className="max-w-5xl mx-auto px-4 py-8 pb-12">
          <div className="p-5 rounded-2xl" style={{ backgroundColor: 'rgba(255, 113, 133, 0.06)', border: '1px solid rgba(255, 113, 133, 0.2)' }}>
            <h2 className="text-lg font-bold mb-3 text-[#FF7185]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              18+ · Jouer responsable
            </h2>
            <p className="text-sm text-[#A5ABC5] leading-relaxed mb-3">
              Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre. Si vous ressentez le besoin de parler à quelqu'un de votre pratique de jeu, contactez les ressources d'aide :
            </p>
            <ul className="text-sm text-[#A5ABC5] space-y-1 mb-3">
              <li>• France : Joueurs Info Service au 09 74 75 13 13 (appel non surtaxé)</li>
              <li>• Belgique : Aidersondepas.be</li>
              <li>• International : begambleaware.org</li>
            </ul>
            <a href="/jouer-responsable" className="inline-flex items-center gap-2 text-sm font-bold text-[#5146F5] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5] rounded">
              En savoir plus sur le jeu responsable →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
