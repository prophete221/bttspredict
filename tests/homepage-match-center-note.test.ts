import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Match Center explanatory-note cleanup', () => {
  it('removes the Gemini/Dakar notes from every locale without changing date or pick logic', () => {
    const home = readFileSync('src/app/page.tsx', 'utf8')
    const localizedHome = readFileSync('src/app/[locale]/page.tsx', 'utf8')
    const matchCenter = readFileSync('src/components/bttsbet/MatchCenter.tsx', 'utf8')
    const translations = readFileSync('src/lib/i18n.ts', 'utf8')

    expect(home).toContain('<MatchCenter />')
    expect(localizedHome).toContain('<MatchCenter initialLocale={locale} />')
    expect(matchCenter).not.toContain('showDayClassificationNote')
    expect(matchCenter).not.toContain('showGeminiValidationNote')

    for (const note of [
      'Today follows Dakar time; later fixtures are grouped under Upcoming.',
      'يُحتسب اليوم وفق توقيت داكار؛ وتُعرض المباريات اللاحقة ضمن القادمة.',
      '« Aujourd’hui » suit le jour de Dakar ; les rencontres ultérieures sont classées dans « À venir ». ',
      'Only validated Gemini picks are shown; today and later dates are separated below.',
      'تُعرض توقعات Gemini المعتمدة فقط؛ ويُفصل اليوم عن التواريخ اللاحقة أدناه.',
      'Seuls les pronostics Gemini validés sont affichés ; aujourd’hui et les dates à venir sont séparés ci-dessous.',
    ]) {
      expect(matchCenter).not.toContain(note)
    }

    expect(matchCenter).toContain('getDakarDayDiff')
    expect(matchCenter).toContain('getGeminiPicks')
    expect(translations).toContain("mcKickoff: 'Coup d’envoi', mcTz: 'GMT'")
    expect(translations).toContain("mcKickoff: 'Kick-off', mcTz: 'GMT'")
    expect(translations).toContain("mcKickoff: 'انطلاق المباراة', mcTz: 'GMT'")
    expect(translations).not.toContain('GMT · Dakar')
    expect(translations).not.toContain('GMT · داكار')
  })
})
