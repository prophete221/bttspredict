import { describe, expect, it } from 'vitest'
import { LOCALE_META } from '@/lib/i18n'
import { matchMetricLabels } from '@/lib/matchMetricLabels'

describe('human match-card metrics', () => {
  it('explains recent goals and the combined average in plain French', () => {
    const labels = matchMetricLabels('fr')
    expect(labels.teamGoals).toBe('Buts marqués/match · domicile / extérieur')
    expect(labels.combinedGoals).toBe('Total des moyennes de buts')
    expect(labels.teamGoalsDescription).toContain('Buts marqués récemment')
    expect(labels.combinedGoalsDescription).toContain('Addition des moyennes')
    expect(labels.recentBtts).toBe('Les deux équipes ont marqué récemment')
    expect(labels.recentBttsDescription).toContain('cinq derniers matchs')
  })

  it('provides concise English and Arabic equivalents', () => {
    expect(matchMetricLabels('en').teamGoals).toBe('Goals scored per game · home / away')
    expect(matchMetricLabels('en').recentBtts).toBe('Both teams scored recently')
    expect(matchMetricLabels('ar').teamGoals).toBe('متوسط الأهداف المسجلة · المضيف / الضيف')
    expect(matchMetricLabels('ar').combinedGoals).toBe('مجموع متوسطات الأهداف')
    expect(matchMetricLabels('ar').recentBtts).toContain('سجّل الفريقان')
  })

  it('keeps Arabic configured as a right-to-left locale', () => {
    expect(LOCALE_META.ar.direction).toBe('rtl')
  })
})
