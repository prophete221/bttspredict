import type { Metadata } from 'next'
import ArabicMatchPopup from '@/components/bttsbet/ArabicMatchPopup'
import legacyArMatchSlugs from '@/data/legacy-ar-match-slugs.json'
import { getDynamicMatchSlugs } from '@/lib/match-page-ssg'
import { getVerifiedHistoryForMatch, loadAllMatches } from '@/lib/matches'
import { loadTeamContext } from '@/lib/team-context'

export const dynamic = 'force-static'
export const metadata: Metadata = {
  title: 'ملفات مباريات BTTS | BTTSPredict',
  description: 'ملفات مباريات كرة القدم باللغة العربية، مع التوقعات والبيانات المنشورة ومصادرها.',
  alternates: {},
  robots: { index: true, follow: true },
}

export default function ArabicMatchRoute() {
  const allMatches = loadAllMatches(90)
  const rows = [...allMatches.values()]
  const selectedSlugs = new Set([...getDynamicMatchSlugs(rows), ...legacyArMatchSlugs])
  const matches = [...selectedSlugs]
    .map(slug => allMatches.get(slug))
    .filter((match): match is NonNullable<typeof match> => Boolean(match))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time?.localeCompare(b.time || '') || a.slug.localeCompare(b.slug))
    .map(match => ({ ...match, verifiedHistory: getVerifiedHistoryForMatch(match.home, match.away, match.date) }))

  const teamContext = loadTeamContext()
  const teamNames = new Set(matches.flatMap(match => [match.home, match.away]))
  const contextTeams = Object.fromEntries([...teamNames].flatMap(name => {
    const team = teamContext?.teams[name]
    return team ? [[name, team] as const] : []
  }))

  return <ArabicMatchPopup matches={matches} contextTeams={contextTeams} />
}
