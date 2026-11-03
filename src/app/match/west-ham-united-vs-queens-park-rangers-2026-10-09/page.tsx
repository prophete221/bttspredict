import type { Metadata } from 'next'
import verificationData from '@/data/match-verification-registry.json'
import retainedMatch from '@/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json'
import { MatchVerificationRegistrySchema } from '@/lib/match-verification-registry'

export const dynamic = 'force-static'

const registry = MatchVerificationRegistrySchema.parse(verificationData)
function getVerificationRecord() {
  const record = registry.records.find(entry => entry.id === retainedMatch.slug)
  if (!record) throw new Error(`Missing verification record for ${retainedMatch.slug}`)
  return record
}
const verification = getVerificationRecord()

export const metadata: Metadata = {
  title: 'West Ham United 1–1 Queens Park Rangers — résultat vérifié',
  description: 'Pronostic BTTS archivé, données du match et résultat final 1–1 vérifié par ESPN.',
  alternates: {
    canonical: 'https://bttspredict.com/match/west-ham-united-vs-queens-park-rangers-2026-10-09',
    languages: {},
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function WestHamQprRetainedMatchPage() {
  const snapshot = retainedMatch.record
  return (
    <main lang="fr">
      <article>
        <h1>West Ham United – Queens Park Rangers : 1–1</h1>
        <p>{verification.competition} · 9 octobre 2026</p>
        <p>
          Coup d’envoi : {verification.kickoff.time} ({verification.kickoff.timeZone}),
          soit {verification.display.time} à {verification.display.timeZone}.
        </p>
        <p>
          Le snapshot d’origine indique {verification.snapshot.time} sans fuseau documenté;
          cette heure n’est pas utilisée pour inférer son fuseau.
        </p>
        <section aria-labelledby="prediction-title">
          <h2 id="prediction-title">Pronostic archivé</h2>
          <p>BTTS : {snapshot.prediction} · {snapshot.bttsProbDisplay}</p>
          <p>Over 2,5 : Oui · {snapshot.over25ProbDisplay}</p>
          <p>
            Qualité des données : {snapshot.dataQuality} · {snapshot.matchCountHome} matchs
            analysés par équipe · xG : {snapshot.xgHome} – {snapshot.xgAway}
          </p>
          <p>{snapshot.analysis}</p>
        </section>
        <section aria-labelledby="verification-title">
          <h2 id="verification-title">Résultat vérifié</h2>
          <p>
            Score final : {verification.result.display} · Pronostic BTTS :
            {snapshot.status === 'WON' ? ' gagné' : ' statut à vérifier'}.
          </p>
          <p>
            Source : {verification.source} · Vérifié le {verification.verifiedAt}.
          </p>
          <p><a href={verification.sourceUrl}>Consulter la fiche ESPN du match</a></p>
        </section>
      </article>
    </main>
  )
}
