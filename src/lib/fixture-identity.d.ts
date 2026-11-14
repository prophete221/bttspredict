export interface FixtureIdentitySource {
  date?: unknown
  league?: unknown
  home?: unknown
  away?: unknown
}

export function publicFixtureKey(row: FixtureIdentitySource | Record<string, unknown> | null | undefined): string | null
