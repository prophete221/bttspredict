export type MatchMetricLocale = 'fr' | 'en' | 'ar'

export interface MatchMetricLabels {
  teamGoals: string
  combinedGoals: string
  recentBtts: string
  teamGoalsDescription: string
  combinedGoalsDescription: string
  recentBttsDescription: string
}

/**
 * Plain-language labels for the match-card statistics currently stored in the
 * legacy xg* fields. Those values are recent goals-scored averages, not provider
 * xG. formBTTS is the mean of the available teams' recent BTTS rates.
 */
export function matchMetricLabels(locale: MatchMetricLocale): MatchMetricLabels {
  if (locale === 'en') {
    return {
      teamGoals: 'Goals scored per game · home / away',
      combinedGoals: 'Combined goals average',
      recentBtts: 'Both teams scored recently',
      teamGoalsDescription: 'Each team’s recent goals-scored average, home or away when available.',
      combinedGoalsDescription: 'The two recent goals-scored averages added together.',
      recentBttsDescription: 'Average share of each team’s five most recent games in which both teams scored.',
    }
  }

  if (locale === 'ar') {
    return {
      teamGoals: 'متوسط الأهداف المسجلة · المضيف / الضيف',
      combinedGoals: 'مجموع متوسطات الأهداف',
      recentBtts: 'سجّل الفريقان في المباريات الأخيرة',
      teamGoalsDescription: 'متوسط الأهداف التي سجلها كل فريق مؤخراً، في ملعبه أو خارجه عند توفر البيانات.',
      combinedGoalsDescription: 'مجموع متوسطات الأهداف المسجلة حديثاً للفريقين.',
      recentBttsDescription: 'متوسط نسبة المباريات الخمس الأخيرة لكل فريق التي سجل فيها الفريقان.',
    }
  }

  return {
    teamGoals: 'Buts marqués/match · domicile / extérieur',
    combinedGoals: 'Total des moyennes de buts',
    recentBtts: 'Les deux équipes ont marqué récemment',
    teamGoalsDescription: 'Buts marqués récemment par chaque équipe, à domicile ou à l’extérieur quand disponible.',
    combinedGoalsDescription: 'Addition des moyennes récentes de buts marqués par les deux équipes.',
    recentBttsDescription: 'Moyenne de la part des cinq derniers matchs de chaque équipe où les deux équipes ont marqué.',
  }
}
