import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('homepage Match Center note', () => {
  it('hides only the Dakar classification sentence on the homepage', () => {
    const home = readFileSync('src/app/page.tsx', 'utf8')
    const localizedHome = readFileSync('src/app/[locale]/page.tsx', 'utf8')
    const matchCenter = readFileSync('src/components/bttsbet/MatchCenter.tsx', 'utf8')

    expect(home).toContain('<MatchCenter showDayClassificationNote={false} />')
    expect(localizedHome).toContain('<MatchCenter initialLocale={locale} />')
    expect(localizedHome).not.toContain('showDayClassificationNote={false}')
    expect(matchCenter).toContain('showDayClassificationNote = true')
    expect(matchCenter).toContain('{showDayClassificationNote && (')
    expect(matchCenter).toContain('« Aujourd’hui » suit le jour de Dakar ; les rencontres ultérieures sont classées dans « À venir ». ')
  })
})
