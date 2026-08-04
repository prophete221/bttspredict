import type { Metadata } from 'next'
import { AFFILIATE } from '@/lib/constants'

export const metadata: Metadata = {
  title: "Comparatif Linebet vs 888starz — Bonus, dépôts, cotes | BttsBet",
  description: "Comparaison détaillée des bookmakers Linebet et 888starz au Sénégal : bonus de bienvenue, méthodes de dépôt (Wave, Orange Money, Free Money), cotes, application mobile, code promo VISION221.",
  alternates: { canonical: 'https://bttspredict.com/bookmakers' },
  openGraph: {
    title: "Comparatif Linebet vs 888starz — BttsBet",
    description: "Bonus, dépôts Wave/Orange Money, cotes, app mobile. Code promo VISION221.",
    url: 'https://bttspredict.com/bookmakers',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Comparatif Linebet vs 888starz au Sénégal',
  url: 'https://bttspredict.com/bookmakers',
  description: "Comparaison détaillée des bookmakers Linebet et 888starz : bonus, dépôts, cotes, application mobile.",
  inLanguage: 'fr',
  isPartOf: { '@type': 'WebSite', name: 'BttsBet', url: 'https://bttspredict.com' },
}

type Row = {
  label: string
  linebet: string
  star888: string
  highlight?: 'linebet' | 'star888' | 'both'
}

const COMPARISON: Row[] = [
  {
    label: 'Bonus de bienvenue',
    linebet: '90 000 XOF (150$)',
    star888: '100% du 1er dépôt',
    highlight: 'both',
  },
  {
    label: 'Code promo',
    linebet: 'VISION221',
    star888: 'VISION221',
  },
  {
    label: 'Dépôt minimum',
    linebet: '1 000 XOF',
    star888: '1 000 XOF',
  },
  {
    label: 'Retrait minimum',
    linebet: '2 000 XOF',
    star888: '2 500 XOF',
    highlight: 'linebet',
  },
  {
    label: 'Wave',
    linebet: 'Oui',
    star888: 'Oui',
  },
  {
    label: 'Orange Money',
    linebet: 'Oui',
    star888: 'Oui',
  },
  {
    label: 'Free Money',
    linebet: 'Oui',
    star888: 'Non',
    highlight: 'linebet',
  },
  {
    label: 'Carte bancaire',
    linebet: 'Oui (Visa/Mastercard)',
    star888: 'Oui (Visa/Mastercard)',
  },
  {
    label: 'Crypto',
    linebet: 'Oui (BTC, ETH, USDT)',
    star888: 'Oui (BTC, ETH, USDT)',
  },
  {
    label: 'Application Android',
    linebet: 'Oui (APK direct)',
    star888: 'Oui (APK direct)',
  },
  {
    label: 'Application iOS',
    linebet: 'Via navigateur (PWA)',
    star888: 'Via navigateur (PWA)',
  },
  {
    label: 'Live streaming',
    linebet: 'Oui',
    star888: 'Oui',
  },
  {
    label: 'Cash-out',
    linebet: 'Oui',
    star888: 'Oui',
  },
  {
    label: 'Paris en direct',
    linebet: 'Oui',
    star888: 'Oui',
  },
  {
    label: 'Cotes FIFA / Esport',
    linebet: 'Très larges',
    star888: 'Larges',
    highlight: 'linebet',
  },
  {
    label: 'Aviator',
    linebet: 'Oui',
    star888: 'Oui',
  },
  {
    label: 'Support client FR',
    linebet: '24/7 (chat, Telegram)',
    star888: '24/7 (chat, Telegram)',
  },
  {
    label: 'Licence',
    linebet: 'Curaçao eGaming',
    star888: 'Curaçao eGaming',
  },
]

export default function BookmakersPage() {
  return (
    <div className="min-h-screen bg-midnight relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="stadium-glow-top" />
      <div className="stadium-glow-bottom-right" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <span className="eyebrow">🏆 Comparatif objectif</span>
          <h1 className="section-title mt-3 mb-4">
            Linebet vs <span className="text-star888">888starz</span>
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Les deux bookmakers acceptent le code promo <code>VISION221</code> au Sénégal.
            Voici comment choisir selon ton profil de parieur.
          </p>
        </header>

        {/* Two CTA cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
          {/* Linebet */}
          <div className="squircle-xl p-6 border-linebet/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-linebet to-transparent" />
            <div className="flex items-center gap-3 mb-4">
              <img src="/logos/linebet.svg" alt="Linebet" className="h-8 w-auto" loading="lazy" />
              <span className="badge badge-mint">Recommandé #1</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Linebet</h2>
            <p className="text-sm text-gray-400 mb-4">
              Bookmaker n°1 en Afrique de l'Ouest. Meilleur pour les dépôts mobiles (Wave, Orange, Free Money)
              et les cotes esport FIFA.
            </p>
            <div className="bg-midnight/50 rounded-lg p-3 mb-4 border border-edge">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Bonus exclusif</div>
              <div className="text-xl font-black text-linebet">90 000 XOF (150$)</div>
              <div className="text-[10px] text-gray-500">+ Free Money disponible</div>
            </div>
            <a
              href={AFFILIATE.linebet}
              rel={AFFILIATE.rel}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-3 btn-linebet cta-glow text-[#04150C] text-sm font-bold w-full"
            >
              S'inscrire sur Linebet →
            </a>
          </div>

          {/* 888starz */}
          <div className="squircle-xl p-6 border-star888/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-star888 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
              <img src="/logos/888starz.svg" alt="888starz" className="h-8 w-auto" loading="lazy" />
              <span className="badge badge-rose">Bonus 100%</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">888starz</h2>
            <p className="text-sm text-gray-400 mb-4">
              Nouveau partenaire. Idéal si tu veux un bonus égal à 100% de ton dépôt.
              Pas de Free Money, mais Wave et Orange Money disponibles.
            </p>
            <div className="bg-midnight/50 rounded-lg p-3 mb-4 border border-edge">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Bonus exclusif</div>
              <div className="text-xl font-black text-star888">100% du dépôt</div>
              <div className="text-[10px] text-gray-500">Wave + Orange Money</div>
            </div>
            <a
              href={AFFILIATE.star888}
              rel={AFFILIATE.rel}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-3 btn-star888 cta-glow text-[#1A0008] text-sm font-bold w-full"
            >
              S'inscrire sur 888starz →
            </a>
          </div>
        </div>

        {/* Comparison table */}
        <section className="squircle-xl p-5 sm:p-6 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">📋 Comparatif détaillé</h2>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th className="text-left py-3 px-2 text-gray-500 uppercase text-[10px] tracking-widest font-bold">Critère</th>
                  <th className="text-left py-3 px-2 text-linebet font-bold">
                    <span className="flex items-center gap-1.5">
                      <img src="/logos/linebet.svg" alt="" className="h-4 w-auto" loading="lazy" />
                      Linebet
                    </span>
                  </th>
                  <th className="text-left py-3 px-2 text-star888 font-bold">
                    <span className="flex items-center gap-1.5">
                      <img src="/logos/888starz.svg" alt="" className="h-4 w-auto" loading="lazy" />
                      888starz
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-edge/40 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-2 text-gray-400 font-medium">{row.label}</td>
                    <td className={`py-3 px-2 ${row.highlight === 'linebet' || row.highlight === 'both' ? 'text-linebet font-bold' : 'text-gray-200'}`}>
                      {row.linebet}
                      {row.highlight === 'linebet' && <span className="ml-1 text-[10px]">⭐</span>}
                    </td>
                    <td className={`py-3 px-2 ${row.highlight === 'star888' || row.highlight === 'both' ? 'text-star888 font-bold' : 'text-gray-200'}`}>
                      {row.star888}
                      {row.highlight === 'star888' && <span className="ml-1 text-[10px]">⭐</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendation */}
        <section className="squircle-xl p-6 sm:p-8 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">💡 Le verdict BttsBet</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-linebet/[0.04] border border-linebet/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-linebet text-xl">✓</span>
                <h3 className="font-bold text-white">Choisis Linebet si…</h3>
              </div>
              <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
                <li>Tu veux déposer via <strong className="text-linebet">Free Money</strong></li>
                <li>Tu paries sur <strong className="text-linebet">FIFA / esport</strong> (meilleures cotes)</li>
                <li>Tu veux un bonus fixe garanti (90 000 XOF)</li>
                <li>Tu cherches le bookmaker le plus populaire au Sénégal</li>
              </ul>
            </div>
            <div className="bg-star888/[0.04] border border-star888/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-star888 text-xl">✓</span>
                <h3 className="font-bold text-white">Choisis 888starz si…</h3>
              </div>
              <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
                <li>Tu veux un bonus <strong className="text-star888">100% de ton dépôt</strong></li>
                <li>Tu comptes déposer un gros montant dès le départ</li>
                <li>Tu utilises Wave ou Orange Money (pas Free Money)</li>
                <li>Tu veux découvrir un nouveau bookmaker</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="squircle p-4 bg-gold/[0.03] border-gold/20">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gold">⚠️ Jeu responsable :</strong> Les paris sportifs comportent des risques de perte financière.
            Ne joue que des sommes que tu peux te permettre de perdre. Les bonus sont soumis à des conditions de mise (rollover).
            18+ — begambleaware.org.
          </p>
        </div>
      </div>
    </div>
  )
}
