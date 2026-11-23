import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const component = readFileSync('src/components/bttsbet/MatchCenter.tsx', 'utf8')
const styles = readFileSync('src/app/globals.css', 'utf8')
const redesignStyles = readFileSync('src/app/refonte-2026.css', 'utf8')

describe('homepage Match Center card design', () => {
  it('shows the Today and Upcoming groups with match status, kickoff, teams and picks', () => {
    expect(component).toContain('data-match-group="today"')
    expect(component).toContain('data-match-group="upcoming"')
    expect(component).toContain('className={`hp-mc-status ${statusClass}`}')
    expect(component).toContain('className="hp-mc-time-row"')
    expect(component).toContain('className="hp-mc-team-name"')
    expect(component).toContain('className="hp-pick__selection"')
    // Maquette A « Stadium Signal » validée : la confiance du pick est portée
    // par la jauge circulaire (valueClassName) et les tuiles complémentaires.
    expect(component).toContain('valueClassName="hp-pick__confidence"')
    expect(component).toContain('className="hp-pick__confidence btx-prob__value"')
  })

  it('keeps date and countdown out of a narrow center column and pluralizes one match correctly', () => {
    expect(component).toContain('className="btp-match-card__countdown"')
    expect(component).toContain("count === 1 ? 'match' : 'matches'")
    expect(redesignStyles).toContain('grid-template-columns: minmax(0, 1fr) minmax(max-content, auto) minmax(0, 1fr)')
    expect(redesignStyles).toContain('#main-content .btp-match-card__fixture > .hp-mc-time-row { grid-column: 1 / -1; grid-row: 2; width: 100%; }')
    expect(redesignStyles).toContain('white-space: nowrap;')
  })

  it('keeps both crests centered and long team names fully readable at desktop and mobile widths', () => {
    const finalFix = redesignStyles.slice(redesignStyles.lastIndexOf('/* MatchCenter — alignement équipe/logo'))
    expect(finalFix).toContain('grid-template-columns: minmax(0, 1fr) minmax(70px, max-content) minmax(0, 1fr)')
    expect(finalFix).toContain('grid-column: 1 / -1;')
    expect(finalFix).toContain('flex-direction: column !important;')
    expect(finalFix).toContain('width: 48px !important;')
    expect(finalFix).toContain('white-space: normal !important;')
    expect(finalFix).toContain('-webkit-line-clamp: unset !important;')
    expect(finalFix).toContain('overflow-wrap: anywhere;')
    expect(finalFix).toContain('@media (max-width: 639px)')
  })

  it('keeps public verified predictions and limits logo substitutions to approved match slugs', () => {
    expect(component).toContain("fetch('/predictions.json')")
    expect(component).toContain('predictions: getGeminiPicks(item)')
    expect(component).toContain('resolveMatchPageLogos(matchSlug, m)')
  })

  it('publishes only Gemini picks and prioritizes those picks on French and English homepages', () => {
    expect(component).toContain('predictions: getGeminiPicks(item)')
    expect(component).toContain('selectUpcomingGeminiItems(items, date => getDakarDayDiff(date, new Date(nowTs)))')
    expect(component).toContain("if (lang !== 'fr' && lang !== 'en') return filteredPicks")
    expect(component).toContain('prioritizeMatchCenterItems(filteredPicks, dakarToday)')
    expect(component).not.toContain('selectFixtureOnlyItems')
    expect(component).not.toContain('pred?.fixtures')
    expect(component).not.toContain('isFixtureOnly')
    expect(component).not.toContain('no prediction available')
    expect(component).not.toContain('aucun pronostic disponible')
    expect(component).not.toContain('m.xgTotal')
    expect(component).not.toContain('Total xG')
  })

  it('applies the validated ESPN logo override to both card crests', () => {
    expect(component).toContain("import { resolveTeamLogoSrc } from '@/lib/teamLogoOverrides'")
    expect(component).toContain('const homeLogo = resolveTeamLogoSrc(resolvedLogos?.homeLogo ?? m.homeLogo)')
    expect(component).toContain('const awayLogo = resolveTeamLogoSrc(resolvedLogos?.awayLogo ?? m.awayLogo)')
  })

  it('scopes the redesign styles to the home Match Center', () => {
    expect(styles).toContain('#matchs .hp-mc-card--approved')
  })
})
