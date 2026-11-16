import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FreePredictions from '@/components/bttsbet/FreePredictions'
import { getDakarDateString } from '@/lib/dakar-date'
import { GEMINI_MODEL_ID } from '@/lib/gemini-predictions'

vi.mock('framer-motion', async () => {
  const React = await import('react')
  const motion = new Proxy({}, {
    get: (_target, element: string) => React.forwardRef((props: Record<string, unknown>, ref) => {
      const {
        children, initial: _initial, animate: _animate, exit: _exit,
        transition: _transition, variants: _variants, whileInView: _whileInView,
        whileHover: _whileHover, whileTap: _whileTap, viewport: _viewport,
        ...rest
      } = props
      return React.createElement(element, { ...rest, ref }, children as never)
    }),
  })
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  }
})
vi.mock('@/hooks/useAnimations', () => ({ useScrollAnimation: () => [null, true] }))
vi.mock('@/components/bttsbet/LanguageSwitcher', () => ({ useLanguage: () => ({ lang: 'fr' }) }))
vi.mock('@/components/bttsbet/BookmakerCardLinks', () => ({ default: () => null }))
vi.mock('@/components/bttsbet/VipMarketTeaser', () => ({ default: () => null }))
vi.mock('@/components/bttsbet/MissingMarketVipLink', () => ({ default: () => null }))
vi.mock('@/lib/affiliateTracking', () => ({ trackAffiliateAction: vi.fn() }))
vi.mock('@/lib/teamLogos', () => ({ resolveTeamLogo: () => '' }))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function futureDate() {
  return getDakarDateString(new Date(Date.now() + 48 * 60 * 60 * 1000))
}

function stubFeed(row: Record<string, unknown>) {
  const fetchMock = vi.fn(async () => ({ json: async () => ({ free: [row], predictions: [row], fixtures: [] }) }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function validGeminiRow() {
  return {
    match: 'Audit Gemini Home vs Audit Gemini Away',
    home: 'Audit Gemini Home',
    away: 'Audit Gemini Away',
    league: 'Audit Test League',
    date: futureDate(),
    time: '18:00',
    ai_source: 'gemini-stats-v1',
    ai_abstain: false,
    ai_model: GEMINI_MODEL_ID,
    ai_response_status: 'pick',
    ai_market: 'BTTS',
    modelEngine: 'gemini-stats-v1',
    type: 'BTTS',
    prediction: 'Oui',
    proba: 0.63,
    matchCountHome: 1,
    matchCountAway: 0,
    predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.63, modelEngine: GEMINI_MODEL_ID }],
    // Deliberately distinctive legacy/local-model fields: none may be rendered as a pick or metric.
    xgHome: 1.234,
    xgAway: 4.321,
    xgTotal: 5.555,
    homeLambda: 9.876,
    awayLambda: 8.765,
    bttsProb: 0.99,
    over25Prob: 0.98,
    source: 'empirical-form-data',
  }
}

describe('FreePredictions rendered UI ignores legacy local-model fields', () => {
  it('renders the validated Gemini selection and observed counts, not xG/lambda or empirical probabilities', async () => {
    stubFeed(validGeminiRow())
    const { container } = render(<FreePredictions initialLocale="fr" />)

    await waitFor(() => expect(container.textContent).toContain('Audit Gemini Home'))
    const analysis = container.querySelector('.prediction-match-card__analysis')
    expect(analysis?.textContent).toContain('BTTS')
    expect(analysis?.textContent).toContain('Oui')
    expect(analysis?.textContent).toContain('Matchs observés : 1 + 0')
    expect(analysis?.textContent).not.toContain('insuffisant')
    for (const forbidden of ['xG', '1.234', '4.321', '5.555', '9.876', '8.765', '99%', '98%']) {
      expect(container.textContent).not.toContain(forbidden)
    }
  })

  it('does not turn xG/lambda-only legacy data into an Over 2.5 card or probability', async () => {
    const legacyOnly = {
      match: 'Legacy Local Home vs Legacy Local Away',
      home: 'Legacy Local Home',
      away: 'Legacy Local Away',
      league: 'Audit Test League',
      date: futureDate(),
      time: '18:00',
      source: 'poisson-v92-real-data',
      modelEngine: 'local-poisson',
      type: 'Over 2.5',
      prediction: 'Oui',
      proba: 0.72,
      xgHome: 2.222,
      xgAway: 3.333,
      xgTotal: 5.555,
      homeLambda: 6.666,
      awayLambda: 7.777,
      over25Prob: 0.72,
    }
    stubFeed(legacyOnly)
    const { container } = render(<FreePredictions initialLocale="fr" marketFilter="over25" />)

    await screen.findByText('Aucun pick Over 2,5 à venir n’est disponible pour le moment.')
    expect(container.textContent).not.toContain('Legacy Local Home')
    for (const forbidden of ['72%', '2.222', '3.333', '5.555', '6.666', '7.777', 'xG']) {
      expect(container.textContent).not.toContain(forbidden)
    }
  })
})
