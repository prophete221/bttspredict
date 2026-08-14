export const SUPPORTED_LOCALES = ['fr', 'en', 'ar'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_META: Record<Locale, {
  label: string
  nativeLabel: string
  flag: string
  htmlLang: string
  direction: 'ltr' | 'rtl'
}> = {
  fr: { label: 'French', nativeLabel: 'Français', flag: '🇫🇷', htmlLang: 'fr-SN', direction: 'ltr' },
  en: { label: 'English', nativeLabel: 'English', flag: '🇬🇧', htmlLang: 'en', direction: 'ltr' },
  ar: { label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦', htmlLang: 'ar', direction: 'rtl' },
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'fr' || value === 'en' || value === 'ar'
}

export function localeFromPathname(pathname: string | null | undefined): Locale {
  const segment = pathname?.split('/').filter(Boolean)[0]
  return isLocale(segment) ? segment : DEFAULT_LOCALE
}

/** Keep existing French URLs canonical; only non-default locales receive a prefix. */
export function localizedPath(pathname: string, locale: Locale): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const withoutLocale = cleanPath.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
  return locale === DEFAULT_LOCALE ? withoutLocale : `/${locale}${withoutLocale === '/' ? '' : withoutLocale}`
}

export const TRANSLATIONS = {
  fr: {
    nav: {
      today: 'Tableau du jour', history: 'Historique', statistics: 'Statistiques', methodology: 'Méthode',
      menu: 'Menu', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', home: 'Accueil', predictions: 'Pronos', vip: 'VIP',
      changeLanguage: 'Changer de langue', moreLanguages: 'Langues disponibles',
    },
    hero: {
      badge: 'Plateforme mondiale de prédictions BTTS', title: 'La plateforme mondiale de référence pour les prédictions BTTS.',
      subtitle: 'Sélections BTTS, Over 2,5 et score exact sur des matchs internationaux, avec données horodatées, historique public et méthode documentée.',
      commandCenter: 'Market command center', liveData: 'Données en direct', btts: 'Les deux marquent', goals: 'Total de buts', exact: 'Projection exacte', active: 'Analyse active',
      cta: 'Pronostic du jour', timezone: 'Heure officielle Africa/Dakar',
    },
    predictions: {
      all: 'Tous', today: 'Auj.', tomorrow: 'Dem.', leagues: 'Toutes', noMatches: 'Aucun match sous ce filtre', seeAll: 'Voir tous les pronostics du jour',
      aiPick: 'Pronostic IA', predictedScore: 'Score prédit', betMatch: 'Parier sur ce match', analysis: "Voir l’analyse", bttsYes: 'Oui', bttsNo: 'Non',
      updated: 'Mis à jour quotidiennement', noCombo: 'Aucun combo disponible aujourd’hui.',
    },
    legal: {
      eighteen: '18+', risk: 'Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que vous ne pouvez perdre.',
      responsible: 'Jouer de manière responsable', learnMore: 'En savoir plus', noGuarantee: 'Aucun résultat futur n’est garanti.',
      affiliation: 'Site informatif et d’affiliation. Nous ne prenons pas de paris et ne collectons pas de fonds.',
    },
    common: { home: 'Accueil', quickLinks: 'Liens rapides', methodology: 'Méthodologie', statistics: 'Statistiques', verifiedHistory: 'Historique vérifié', publicData: 'Données publiques' },
  },
  en: {
    nav: {
      today: 'Today’s board', history: 'History', statistics: 'Statistics', methodology: 'Methodology',
      menu: 'Menu', openMenu: 'Open menu', closeMenu: 'Close menu', home: 'Home', predictions: 'Predictions', vip: 'VIP',
      changeLanguage: 'Change language', moreLanguages: 'Available languages',
    },
    hero: {
      badge: 'Global BTTS prediction platform', title: 'The global reference platform for BTTS predictions.',
      subtitle: 'BTTS, Over 2.5 and exact-score selections for international matches, with time-stamped data, a public history and a documented method.',
      commandCenter: 'Market command center', liveData: 'Live data', btts: 'Both teams to score', goals: 'Total goals', exact: 'Exact-score projection', active: 'Analysis active',
      cta: 'Today’s predictions', timezone: 'Official Africa/Dakar time',
    },
    predictions: {
      all: 'All', today: 'Today', tomorrow: 'Tomorrow', leagues: 'All leagues', noMatches: 'No match under this filter', seeAll: 'See all today’s predictions',
      aiPick: 'AI pick', predictedScore: 'Predicted score', betMatch: 'Bet on this match', analysis: 'View analysis', bttsYes: 'Yes', bttsNo: 'No',
      updated: 'Updated daily', noCombo: 'No combo is available today.',
    },
    legal: {
      eighteen: '18+', risk: 'Sports betting carries a risk of loss. Never bet more than you can afford to lose.',
      responsible: 'Play responsibly', learnMore: 'Learn more', noGuarantee: 'No future result is guaranteed.',
      affiliation: 'Informational and affiliate website. We do not take bets or hold funds.',
    },
    common: { home: 'Home', quickLinks: 'Quick links', methodology: 'Methodology', statistics: 'Statistics', verifiedHistory: 'Verified history', publicData: 'Public data' },
  },
  ar: {
    nav: {
      today: 'لوحة اليوم', history: 'السجل', statistics: 'الإحصائيات', methodology: 'المنهجية',
      menu: 'القائمة', openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة', home: 'الرئيسية', predictions: 'التوقعات', vip: 'VIP',
      changeLanguage: 'تغيير اللغة', moreLanguages: 'اللغات المتاحة',
    },
    hero: {
      badge: 'منصة عالمية لتوقعات BTTS', title: 'المنصة العالمية المرجعية لتوقعات BTTS.',
      subtitle: 'اختيارات BTTS وOver 2.5 والنتيجة الدقيقة للمباريات الدولية، مع بيانات مؤرخة وسجل عام ومنهجية موثقة.',
      commandCenter: 'مركز الأسواق', liveData: 'بيانات مباشرة', btts: 'كلا الفريقين يسجلان', goals: 'إجمالي الأهداف', exact: 'توقع النتيجة الدقيقة', active: 'التحليل نشط',
      cta: 'توقعات اليوم', timezone: 'التوقيت الرسمي: إفريقيا/داكار',
    },
    predictions: {
      all: 'الكل', today: 'اليوم', tomorrow: 'غداً', leagues: 'كل البطولات', noMatches: 'لا توجد مباراة ضمن هذا الفلتر', seeAll: 'عرض كل توقعات اليوم',
      aiPick: 'توقع الذكاء الاصطناعي', predictedScore: 'النتيجة المتوقعة', betMatch: 'المراهنة على المباراة', analysis: 'عرض التحليل', bttsYes: 'نعم', bttsNo: 'لا',
      updated: 'يتم التحديث يومياً', noCombo: 'لا توجد تركيبة متاحة اليوم.',
    },
    legal: {
      eighteen: '18+', risk: 'المراهنات الرياضية تنطوي على خطر الخسارة. لا تراهن أبداً بأكثر مما يمكنك تحمل خسارته.',
      responsible: 'العب بمسؤولية', learnMore: 'معرفة المزيد', noGuarantee: 'لا توجد ضمانات لأي نتيجة مستقبلية.',
      affiliation: 'موقع معلومات وتسويق بالعمولة. لا نقبل الرهانات ولا نحتفظ بالأموال.',
    },
    common: { home: 'الرئيسية', quickLinks: 'روابط سريعة', methodology: 'المنهجية', statistics: 'الإحصائيات', verifiedHistory: 'سجل موثق', publicData: 'بيانات عامة' },
  },
} as const

export type TranslationSet = (typeof TRANSLATIONS)[Locale]
export function translationsFor(locale: Locale): TranslationSet {
  return TRANSLATIONS[locale]
}
