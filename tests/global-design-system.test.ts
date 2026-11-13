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

describe('Legacy theme override protection', () => {
  it('keeps the final rendered shell dark and the active/VIP navigation on brand', () => {
    const css = readFileSync(resolve(ROOT, 'src/app/football-intelligence.css'), 'utf8')
    const finalTheme = css.slice(css.lastIndexOf('/* 2026-11-13 — final authority'))

    expect(finalTheme).toContain('color-scheme: dark !important')
    expect(finalTheme).toContain('background: #070B12 !important')
    expect(finalTheme).toContain('background: #3B82F6 !important')
    expect(finalTheme).toContain('color: #E8C97A !important')
    expect(finalTheme).not.toContain('color-scheme: light !important')
  })
})

describe('Partner navigation state', () => {
  it('marks the current partner guide in both navigation renderings', () => {
    const navigation = readFileSync(resolve(ROOT, 'src/components/bttsbet/Navbar.tsx'), 'utf8')

    expect(navigation).toContain("aria-current={isActive(partnerRoutes[id]) ? 'page' : undefined}")
  })
})
