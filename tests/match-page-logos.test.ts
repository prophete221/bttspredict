import { describe, expect, it } from 'vitest'
import { resolveMatchPageLogos } from '@/lib/matchPageLogos'

const brokenBrondbyLogos = {
  homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/20109.png',
  awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/131632.png',
}

const brokenNantesLogos = {
  homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/22328.png',
  awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/131297.png',
}

describe('logos des pages Match ciblées', () => {
  it('remplace les deux anciennes URLs ESPN de Brondby–Rosenborg par les URL déjà validées', () => {
    expect(resolveMatchPageLogos('brondby-vs-rosenborg-2026-11-11', brokenBrondbyLogos)).toEqual({
      homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/575.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/438.png',
    })
  })

  it('remplace les deux anciennes URLs ESPN de Nantes–Lens par les URL déjà validées', () => {
    expect(resolveMatchPageLogos('nantes-vs-lens-2026-11-13', brokenNantesLogos)).toEqual({
      homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/165.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/175.png',
    })
  })

  it('ne modifie aucun autre slug Match', () => {
    expect(resolveMatchPageLogos('unrelated-vs-match-2026-11-14', brokenBrondbyLogos)).toBe(brokenBrondbyLogos)
  })

  it('ne modifie aucune source de données absente', () => {
    expect(resolveMatchPageLogos('brondby-vs-rosenborg-2026-11-11', null)).toBeNull()
  })
})
