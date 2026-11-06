import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => readFileSync(path, 'utf8')

describe('affiliate link consolidation', () => {
  it('keeps one dashboard rail and removes per-match affiliate rows', () => {
    const dashboard = source('src/components/bttsbet/BttsTodayDashboard.tsx')
    expect(dashboard).toContain('placement="dashboard-partner-rail"')
    expect(dashboard).not.toContain('placement="dashboard-match-card"')

    const matchCenter = source('src/components/bttsbet/MatchCenter.tsx')
    expect(matchCenter).toContain('placement="match-center-partner-rail"')
    expect(matchCenter).not.toContain('placement="home-match-card"')

    const predictions = source('src/components/bttsbet/FreePredictions.tsx')
    expect(predictions).toContain('placement="free-predictions-partner-rail"')
    expect(predictions).not.toContain('placement="free-prediction-card"')

    const exactScores = source('src/app/ai-correct-score-predictions/page.tsx')
    expect(exactScores).toContain('placement="exact-score-partner-rail"')
    expect(exactScores).not.toContain('placement="exact-score-card"')
  })

  it('uses an internal guide rather than repeating affiliate buttons in the widget', () => {
    const widget = source('src/components/bttsbet/FreePredictionsWidget.tsx')
    expect(widget).toContain("localizedPath('/code-promo-1xbet', locale)")
    expect(widget).not.toContain('BookmakerCardLinks')
  })

  it('shows a partner logo on each active VIP modal signup button', () => {
    const modal = source('src/components/bttsbet/VipLevelModal.tsx')
    expect(modal).toContain('src="/logos/1xbet-logo.png"')
    expect(modal).toContain('src="/logos/linebet-logo.jpg"')
    expect(modal).toContain('src="/logos/888starz-logo.jpg"')
  })

  it('shows both the partner logo and Google Play icon in APK CTAs', () => {
    const sharedPromo = source('src/components/bttsbet/PromoLandingShell.tsx')
    expect(sharedPromo).toContain('<img src={p.logo}')
    expect(sharedPromo).toContain('src="/logos/google-play.svg"')

    const star888 = source('src/components/bttsbet/Star888PromoClient.tsx')
    expect(star888).toContain('<Image src={LOGO}')
    expect(star888).toContain('src="/logos/google-play.svg"')
  })
})
