const LOGO_URL_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  'https://a.espncdn.com/i/teamlogos/soccer/500/131876.png': 'https://a.espncdn.com/i/teamlogos/soccer/500/179.png',
  'https://a.espncdn.com/i/teamlogos/soccer/500/20109.png': 'https://a.espncdn.com/i/teamlogos/soccer/500/575.png',
  'https://a.espncdn.com/i/teamlogos/soccer/500/131632.png': 'https://a.espncdn.com/i/teamlogos/soccer/500/438.png',
  'https://a.espncdn.com/i/teamlogos/soccer/500/22328.png': 'https://a.espncdn.com/i/teamlogos/soccer/500/165.png',
  'https://a.espncdn.com/i/teamlogos/soccer/500/131297.png': 'https://a.espncdn.com/i/teamlogos/soccer/500/175.png',
})

export function resolveTeamLogoSrc(src?: string): string | undefined {
  if (!src) return undefined
  return LOGO_URL_OVERRIDES[src] ?? src
}
