// @vitest-environment jsdom
import fs from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { assessPickRisk } from '../workers/vip-api/src/vip-risk.js'

const html = fs.readFileSync(path.join(process.cwd(), 'public/vip-admin/admin.html'), 'utf8')
const script = fs.readFileSync(path.join(process.cwd(), 'public/vip-admin/admin.js'), 'utf8')

function historicCandidate(overrides: Record<string, unknown> = {}) {
  const candidate = {
    candidateKey: 'b'.repeat(64), materialHash: 'c'.repeat(64),
    home: 'Crystal Palace', away: 'Liverpool', league: 'Premier League',
    date: '2026-11-08', time: '14:00', market: 'BTTS', selection: 'NO',
    probability: 0.75, aiConfidence: 'high', sourceModel: 'gemini-3.5-flash-lite',
    probabilitySource: 'gemini-estimate', homeSelectionRate: 0.8, awaySelectionRate: 0.8,
    empiricalSelectionRate: 0.8, formCountHome: 5, formCountAway: 5,
    matchCountHome: 8, matchCountAway: 8, dataSource: 'ESPN_TEAM_SCHEDULE',
    dataQuality: 'HIGH', qualityTier: 'vip', sourceStatus: 'STATUS_SCHEDULED',
    matchState: 'PENDING', analyzedAt: '2026-11-08T13:01:59.163Z',
    riskLevel: 'MODÉRÉ', riskPolicy: 'risk-v1', riskReasons: ['Probabilité modèle : 80 % — ancien libellé erroné.'],
    reasons: ['Crystal Palace has a low BTTS rate of 0.2 in recent form.'],
    risks: ['La forme récente peut évoluer.'], status: 'ineligible',
    ineligibleReason: 'not_in_current_eligible_source', isCurrent: false, canReview: false,
    reviewBlockedReason: 'historical_snapshot', ...overrides,
  }
  const risk = assessPickRisk(candidate, Date.parse('2026-11-08T14:00:00Z'))
  return { ...candidate, displayRisk: Object.hasOwn(overrides, 'displayRisk') ? overrides.displayRisk
    : { level: risk?.level ?? null, reasons: risk?.reasons ?? [], policy: risk?.policy ?? null,
      assessedAt: '2026-11-08T14:00:00Z', evidenceStatus: risk ? 'reconciled_snapshot_only' : 'insufficient_or_stale_evidence' } }
}

async function renderAdmin(candidates: unknown[], latestSync: Record<string, unknown> = {}) {
  document.documentElement.innerHTML = html.replace(/<!doctype html>/i, '').replace(/<\/?html[^>]*>/g, '')
  sessionStorage.setItem('bttspredict-vip-production-admin-token-v1', 'a'.repeat(64))
  const fetchMock = vi.fn(async (url: string, options: RequestInit = {}) => {
    if (options.method && options.method !== 'GET') throw new Error('mutation_not_allowed_in_presentation_test')
    if (url.endsWith('/admin/requests')) return Response.json({ ok: true, requests: [] })
    if (url.endsWith('/admin/candidates')) return Response.json({
      ok: true, candidates, publicationEnabled: false,
      latestSync: { syncId: 'github:latest:1', acceptedCount: 0, inputRows: 30,
        eligibleBeforeFreeExclusion: 1, excludedAlreadyFree: 1, excludedDuplicateKey: 0,
        generatedAt: '2026-11-08T13:50:30.253Z', ...latestSync },
    })
    throw new Error('unexpected_request')
  })
  vi.stubGlobal('fetch', fetchMock)
  new Function(script)()
  await vi.waitFor(() => expect(document.querySelector('#admin-candidate-outcome')?.textContent).toContain('Cartes affichées'))
  return fetchMock
}

function field(label: string) {
  return Array.from(document.querySelectorAll('dt')).find(el => el.textContent === label)?.nextElementSibling?.textContent
}

afterEach(() => {
  sessionStorage.clear()
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('private candidate presentation: exact selection and current snapshot', () => {
  it('separates zero current candidates from one historical ineligible card without approval controls', async () => {
    const fetchMock = await renderAdmin([historicCandidate()])
    const outcome = document.querySelector('#admin-candidate-outcome')?.textContent || ''
    expect(outcome).toContain('0 candidat(s) retenu(s) après exclusions')
    expect(outcome).toContain('Choix admissibles avant exclusions : 1')
    expect(outcome).toContain('Déjà proposés gratuitement, donc exclus : 1')
    expect(outcome).toContain('0 de la dernière analyse, 1 historique(s)')
    expect(outcome).not.toContain('aujourd’hui')
    expect(outcome).not.toContain('aucun message n’a été envoyé')
    const history = document.querySelector<HTMLDetailsElement>('.admin-candidate-history')
    expect(history?.open).toBe(false)
    expect(history?.querySelector('.admin-candidate')?.getAttribute('data-historical')).toBe('true')
    expect(field('Statut enregistré')).toBe('Inéligible')
    expect(document.querySelectorAll('.admin-candidate .admin-approve')).toHaveLength(0)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('keeps model probability, BTTS-NO frequencies and complementary BTTS-YES rates distinct, with the actual risk', async () => {
    await renderAdmin([historicCandidate()])
    expect(field('Marché et sélection exacts')).toBe('BTTS Non')
    expect(field('Estimation du modèle pour BTTS Non — non garantie')).toContain('75 %')
    expect(field('Fréquence récente de BTTS Non — Crystal Palace')).toBe('80 % (4/5 matchs)')
    expect(field('Fréquence récente de BTTS Non — Liverpool')).toBe('80 % (4/5 matchs)')
    expect(field('Lecture des taux BTTS Oui / Non')).toContain('BTTS Oui : 20 % / 20 %')
    expect(field('Raisons du modèle — texte d’origine')).toContain('BTTS rate of 0.2')
    expect(field('Risque recalculé sur cet instantané')).toContain('MODÉRÉ')
    expect(field('Justification du niveau de risque')).toContain('5 points')
    expect(field('Justification du niveau de risque')).toContain('Probabilité modèle : 75 %')
    expect(document.body.textContent).not.toContain('Probabilité modèle : 80 %')
    expect(field('Pick gratuit associé dans cet instantané')).not.toBe('Aucun pick gratuit')
  })

  it.each([
    [0.001, '0,1 %'], [0.999, '99,9 %'], [0.00001, '<0,01 %'], [0.99999, '>99,99 %'],
  ])('does not round the supported model probability %s to an impossible certainty', async (probability, displayed) => {
    await renderAdmin([historicCandidate({ probability })])
    expect(field('Estimation du modèle pour BTTS Non — non garantie')).toContain(displayed)
  })

  it('does not turn missing probabilities or rates into zero or invented confidence/risk', async () => {
    await renderAdmin([historicCandidate({ probability: null, aiConfidence: null, riskLevel: null,
      empiricalSelectionRate: null, homeSelectionRate: null, awaySelectionRate: null })])
    expect(field('Estimation du modèle pour BTTS Non — non garantie')).toBe('Non documenté · confiance déclarée : non documentée')
    expect(field('Fréquence récente de BTTS Non — Crystal Palace')).toBe('Non documenté')
    expect(field('Risque recalculé sur cet instantané')).toContain('Non documenté')
    expect(field('Lecture des taux BTTS Oui / Non')).not.toContain('0 %')
  })

  it('shows manual decision buttons only for a current card expressly revalidated by the server', async () => {
    await renderAdmin([historicCandidate({ isCurrent: true, canReview: true,
      status: 'pending_owner_approval', ineligibleReason: null, reviewBlockedReason: null })], { acceptedCount: 1 })
    expect(document.querySelectorAll('.admin-candidate .admin-approve')).toHaveLength(1)
    expect(document.querySelector('.admin-candidate-history')).toBeNull()
    expect(document.querySelector('#admin-candidate-outcome')?.textContent).toContain('1 candidat(s) retenu(s)')
  })

  it('reports a one-match shortfall and calls out a genuine lower-probability estimate as higher risk', async () => {
    await renderAdmin([historicCandidate({ probability: 0.65, riskLevel: 'ÉLEVÉ', isCurrent: true,
      canReview: true, status: 'pending_owner_approval', ineligibleReason: null, reviewBlockedReason: null })],
    { acceptedCount: 1, minimumTargetFixtures: 2, maximumSelectedFixtures: 5, selectedDistinctFixtures: 1, shortfall: 1 })
    const outcome = document.querySelector('#admin-candidate-outcome')?.textContent || ''
    expect(outcome).toContain('2 à 5 matchs distincts')
    expect(outcome).toContain('il manque 1 match(s) étayé(s)')
    expect(field('Estimation du modèle pour BTTS Non — non garantie')).toContain('65 %')
    expect(field('Avertissement pour cette estimation')).toContain('risque ÉLEVÉ')
    expect(field('Risque recalculé sur cet instantané')).toContain('ÉLEVÉ')
  })

  it('never repeats an unreconciled legacy explanation that mislabeled the empirical rate as model probability', async () => {
    await renderAdmin([historicCandidate({ displayRisk: undefined })])
    expect(field('Risque recalculé sur cet instantané')).toContain('non revalidé')
    expect(field('Justification du niveau de risque')).toContain('Ancien calcul non revalidé')
    expect(document.body.textContent).not.toContain('Probabilité modèle : 80 %')
  })

  it('fails closed for a legacy card with no current-snapshot or reviewability evidence', async () => {
    await renderAdmin([historicCandidate({ isCurrent: undefined, canReview: undefined, status: 'pending_owner_approval' })])
    expect(document.querySelectorAll('.admin-candidate .admin-approve')).toHaveLength(0)
  })
})
