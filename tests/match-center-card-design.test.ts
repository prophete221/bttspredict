import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const component = readFileSync('src/components/bttsbet/MatchCenter.tsx', 'utf8')
const styles = readFileSync('src/app/globals.css', 'utf8')

describe('homepage Match Center card design', () => {
  it('shows the Today and Upcoming groups with match status, kickoff, teams and picks', () => {
    expect(component).toContain('data-match-group="today"')
    expect(component).toContain('data-match-group="upcoming"')
    expect(component).toContain('className={`hp-mc-status ${statusClass}`}')
    expect(component).toContain('className="hp-mc-time-row"')
    expect(component).toContain('className="hp-mc-team-name"')
    expect(component).toContain('className="hp-pick__selection"')
    expect(component).toContain('className="hp-pick__confidence"')
  })

  it('keeps public verified predictions and limits logo substitutions to approved match slugs', () => {
    expect(component).toContain("fetch('/predictions.json')")
    expect(component).toContain('predictions: getGeminiPicks(item)')
    expect(component).toContain('resolveMatchPageLogos(matchSlug, m)')
  })

  it('publishes only Gemini picks and prioritizes those picks on French and English homepages', () => {
    expect(component).toContain('predictions: getGeminiPicks(item)')
    expect(component).toContain('selectUpcomingGeminiItems(items, dayDiff)')
    expect(component).toContain("if (lang !== 'fr' && lang !== 'en') return filteredPicks")
    expect(component).toContain('prioritizeMatchCenterItems(filteredPicks, dakarToday)')
    expect(component).not.toContain('selectFixtureOnlyItems')
    expect(component).not.toContain('pred?.fixtures')
    expect(component).not.toContain('isFixtureOnly')
    expect(component).not.toContain('no prediction available')
    expect(component).not.toContain('aucun pronostic disponible')
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
