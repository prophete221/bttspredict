import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('neutral public editorial copy', () => {
  it('removes only the visible Gemini/Dakar implementation labels from shared UI copy', () => {
    const dashboard = readFileSync('src/components/bttsbet/BttsTodayDashboard.tsx', 'utf8')
    const freePredictions = readFileSync('src/components/bttsbet/FreePredictions.tsx', 'utf8')
    const competitionIndex = readFileSync('src/components/bttsbet/CompetitionIndexContent.tsx', 'utf8')
    const competitionPage = readFileSync('src/components/bttsbet/CompetitionPageContent.tsx', 'utf8')
    const hero = readFileSync('src/components/bttsbet/Hero.tsx', 'utf8')
    const share = readFileSync('src/components/bttsbet/ShareAnalysisButton.tsx', 'utf8')

    for (const oldCopy of [
      'Aucun pronostic Gemini validé aujourd’hui',
      'No Gemini-validated pick today',
      'ESPN-scheduled matches with no validated Gemini selection',
      'Seules les sélections Gemini validées sont reprises.',
      'Only validated Gemini picks are included.',
      'Les sélections proviennent exclusivement des analyses Gemini validées.',
      'Picks come exclusively from validated Gemini analyses.',
      'Aucune prochaine rencontre avec analyse Gemini validée',
      'Dakar time · GMT',
      'Heure de Dakar · GMT',
      'توقيت داكار · GMT',
      'Gemini · {pick.type}',
      'GMT (Dakar)',
    ]) {
      expect([dashboard, freePredictions, competitionIndex, competitionPage, hero, share].join('\n')).not.toContain(oldCopy)
    }

    expect(dashboard).toContain('Aucun pronostic disponible aujourd’hui')
    expect(freePredictions).toContain('aucun pronostic n’est disponible')
    expect(competitionPage).toContain("time: 'GMT'")
    expect(competitionPage).not.toMatch(/Gemini|Dakar|داكار/i)
    expect(hero).toContain('<span className="hp-hero__trust-v">GMT</span>')
    expect(share).toContain('${props.time} GMT`')
  })

  it('keeps the Over 2.5 SEO title/canonical and timezone calculation unchanged', () => {
    const page = readFileSync('src/app/over-2-5/predictions/today/page.tsx', 'utf8')
    expect(page).toContain("const TITLE = 'Pronostics Over 2,5 du jour'")
    expect(page).toContain("const DESCRIPTION = 'Pronostics Over 2,5 du jour sur des matchs internationaux : sélection statistique, dates de match et méthode documentée. 18+.'")
    expect(page).toContain("canonical: 'https://bttspredict.com/over-2-5/predictions/today'")
    expect(page).toContain("timeZone: 'Africa/Dakar'")
  })
})
