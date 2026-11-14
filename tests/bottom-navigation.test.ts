import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { translationsFor } from '@/lib/i18n'

const component = readFileSync(resolve(process.cwd(), 'src/components/bttsbet/BottomNavigation.tsx'), 'utf8')
const styles = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')

describe('responsive bottom navigation', () => {
  it('uses full, localized labels for the three tabs', () => {
    expect(translationsFor('fr').nav.predictions).toBe('Pronostics')
    expect(translationsFor('en').nav.predictions).toBe('Predictions')
    expect(translationsFor('ar').nav.predictions).toBe('التوقعات')
    expect(component).toContain('t.nav.home')
    expect(component).toContain('t.nav.predictions')
    expect(component).toContain('t.nav.vip')
    expect(component).toContain('localizedPath(tab.href, lang)')
    expect(component).toContain('aria-current={isActive ?')
  })

  it('sets Arabic RTL and keeps text crisp against the black-and-gold background', () => {
    expect(component).toContain("dir={lang === 'ar' ? 'rtl' : 'ltr'}")
    expect(component).toContain('text-[12px] font-semibold')
    expect(styles).toContain('.bottomnav-shell')
    expect(styles).toContain('color: #F2D28C !important')
    expect(styles).toContain('color: #F4F6F8 !important')
    expect(styles).toContain('text-shadow: none !important')
  })
})
