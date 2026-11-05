/**
 * Source unique des FAQ visibles et JSON-LD des pages promotionnelles.
 * Les codes exacts, le bonus 300% worldwide, le cashback supérieur et les bonus hebdomadaires sont confirmés par le propriétaire.
 * Aucun montant, mécanisme ni condition n'est ajouté.
 */
export type PromoBookmakerId = 'linebet' | '1xbet' | 'melbet' | '888starz'
export type PromoLang = 'fr' | 'en' | 'ar'
export type PromoFaqItem = { q: string; a: string }

type PromoFaqByLang = Record<PromoLang, PromoFaqItem[]>

const FAQ: Record<PromoBookmakerId, PromoFaqByLang> = {
  linebet: {
    fr: [
      { q: 'Quel est le code promo Linebet ?', a: 'Le code promo Linebet est VISION221' },
      { q: 'Quelle est l’offre Linebet ?', a: '300% worldwide, avec davantage de cashback et des bonus hebdomadaires.' },
    ],
    en: [
      { q: 'What is the Linebet promo code?', a: 'The Linebet promo code is VISION221' },
      { q: 'What is the Linebet offer?', a: '300% worldwide, with more cashback and weekly bonuses.' },
    ],
    ar: [
      { q: 'ما هو رمز Linebet الترويجي؟', a: 'رمز Linebet الترويجي هو VISION221' },
      { q: 'ما عرض Linebet؟', a: '300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية.' },
    ],
  },
  '1xbet': {
    fr: [
      { q: 'Quel est le code promo 1xBet ?', a: 'Le code promo 1xBet est vipbtts' },
      { q: 'Quelle est l’offre 1xBet ?', a: '300% worldwide, avec davantage de cashback et des bonus hebdomadaires.' },
    ],
    en: [
      { q: 'What is the 1xBet promo code?', a: 'The 1xBet promo code is vipbtts' },
      { q: 'What is the 1xBet offer?', a: '300% worldwide, with more cashback and weekly bonuses.' },
    ],
    ar: [
      { q: 'ما هو رمز 1xBet الترويجي؟', a: 'رمز 1xBet الترويجي هو vipbtts' },
      { q: 'ما عرض 1xBet؟', a: '300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية.' },
    ],
  },
  melbet: {
    fr: [
      { q: 'Quel est le code promo Melbet ?', a: 'Le code promo Melbet est Bttswin' },
      { q: 'Quelle est l’offre Melbet ?', a: '300% worldwide, avec davantage de cashback et des bonus hebdomadaires.' },
    ],
    en: [
      { q: 'What is the Melbet promo code?', a: 'The Melbet promo code is Bttswin' },
      { q: 'What is the Melbet offer?', a: '300% worldwide, with more cashback and weekly bonuses.' },
    ],
    ar: [
      { q: 'ما هو رمز Melbet الترويجي؟', a: 'رمز Melbet الترويجي هو Bttswin' },
      { q: 'ما عرض Melbet؟', a: '300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية.' },
    ],
  },
  '888starz': {
    fr: [
      { q: 'Quel est le code promo 888Starz ?', a: 'Le code promo 888Starz est btts221' },
      { q: 'Quelle est l’offre 888Starz ?', a: '300% worldwide, avec davantage de cashback et des bonus hebdomadaires.' },
    ],
    en: [
      { q: 'What is the 888Starz promo code?', a: 'The 888Starz promo code is btts221' },
      { q: 'What is the 888Starz offer?', a: '300% worldwide, with more cashback and weekly bonuses.' },
    ],
    ar: [
      { q: 'ما هو الرمز الترويجي لـ 888Starz؟', a: 'الرمز الترويجي لـ 888Starz هو btts221' },
      { q: 'ما عرض 888Starz؟', a: '300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية.' },
    ],
  },
}

export function getPromoFaq(bookmaker: PromoBookmakerId, lang: PromoLang): PromoFaqItem[] {
  return FAQ[bookmaker][lang]
}

/** JSON-LD FAQPage object aligned with visible FAQ. */
export function buildPromoFaqJsonLd(bookmaker: PromoBookmakerId, lang: PromoLang) {
  const items = getPromoFaq(bookmaker, lang)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}
