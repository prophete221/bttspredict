import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(__dirname, '..')

describe('Global BTTSPredict design system', () => {
  it('uses the approved navy, analytical blue, VIP gold and semantic success palette', () => {
    const css = readFileSync(resolve(ROOT, 'src/app/football-intelligence.css'), 'utf8')

    expect(css).toContain('--fi-bg: #070B12;')
    expect(css).toContain('--fi-panel: #0F1622;')
    expect(css).toContain('--fi-panel-raised: #121A26;')
    expect(css).toContain('--fi-teal: #3B82F6;')
    expect(css).toContain('--fi-gold: #E8C97A;')
    expect(css).toContain('--fi-success: #22C55E;')
    expect(css).toContain('.fi-status-dot.is-fresh { background: var(--fi-success);')
  })

  it('sets browser chrome to dark mode while preserving the canonical homepage', () => {
    const layout = readFileSync(resolve(ROOT, 'src/app/layout.tsx'), 'utf8')

    expect(layout).toContain('themeColor: "#070B12"')
    expect(layout).toContain('colorScheme: "dark"')
    expect(layout).toContain('canonical: "https://bttspredict.com/"')
  })
})

describe('Shared footer visual and RTL consistency', () => {
  it('uses the global dark surface tokens and logical text alignment', () => {
    const footer = readFileSync(resolve(ROOT, 'src/components/bttsbet/Footer.tsx'), 'utf8')

    expect(footer).toContain("backgroundColor: '#0F1622'")
    expect(footer).toContain("border: '1px solid #283548'")
    expect(footer).toContain('text-start')
    expect(footer).toContain("lang === 'ar' ? 'قانوني'")
  })
})
