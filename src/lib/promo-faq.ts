/**
 * Source unique des FAQ visibles et JSON-LD des pages promotionnelles.
 * Les faits affichés sont définis par bookmaker; la disponibilité locale n’est pas supposée.
 * Aucun montant, mécanisme ni condition commerciale n'est ajouté.
 */
export type PromoBookmakerId = 'linebet' | '1xbet' | 'melbet' | '888starz'
export type PromoLang = 'fr' | 'en' | 'ar'
export type PromoFaqItem = { q: string; a: string }

type PromoFaqByLang = Record<PromoLang, PromoFaqItem[]>

const FAQ: Record<PromoBookmakerId, PromoFaqByLang> = {
  linebet: {
    fr: [
      { q: 'Quel est le code promo Linebet ?', a: 'Le code promo Linebet est VISION221' },
      { q: 'Le code VISION221 est-il réservé au Sénégal ?', a: 'Non. Le code VISION221 fonctionne dans le monde entier ; vérifiez les conditions locales directement auprès de Linebet.' },
    ],
    en: [
      { q: 'What is the Linebet promo code?', a: 'The Linebet promo code is VISION221' },
      { q: 'Is VISION221 only for Senegal?', a: 'We have not verified which countries can use VISION221; check the current terms directly with Linebet.' },
    ],
    ar: [
      { q: 'ما هو رمز Linebet الترويجي؟', a: 'رمز Linebet الترويجي هو VISION221' },
      { q: 'هل يقتصر رمز VISION221 على السنغال؟', a: 'لا. يعمل الرمز VISION221 حول العالم؛ تحقق من الشروط المحلية مباشرة لدى Linebet.' },
    ],
  },
  '1xbet': {
    fr: [
      { q: 'Quel est le code promo 1xBet ?', a: 'Le code promo 1xBet est vipbtts et fonctionne dans le monde entier.' },
      { q: 'Quels avantages comprend l’offre 1xBet ?', a: 'Un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires.' },
    ],
    en: [
      { q: 'What is the 1xBet promo code?', a: 'The 1xBet promo code is vipbtts and works worldwide.' },
      { q: 'What does the 1xBet offer include?', a: 'A 300% worldwide deposit bonus, cashback and weekly bonuses.' },
    ],
    ar: [
      { q: 'ما هو رمز 1xBet الترويجي؟', a: 'رمز 1xBet الترويجي هو vipbtts ويعمل حول العالم.' },
      { q: 'ما الذي يتضمنه عرض 1xBet؟', a: 'مكافأة إيداع عالمية بنسبة 300%، واسترداد نقدي ومكافآت أسبوعية.' },
    ],
  },
  melbet: {
    fr: [
      { q: 'Quel est le code promo Melbet ?', a: 'Le code promo Melbet est Bttswin et fonctionne dans le monde entier.' },
      { q: 'Quels avantages comprend l’offre Melbet ?', a: 'Un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires.' },
      { q: 'Un pari gratuit distinct est-il inclus avec Bttswin ?', a: 'L’offre comprend un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires. Aucun pari gratuit distinct ni montant de cashback n’est précisé ici.' },
    ],
    en: [
      { q: 'What is the Melbet promo code?', a: 'The Melbet promo code is Bttswin and works worldwide.' },
      { q: 'Which benefits does the Melbet offer include?', a: 'A 300% worldwide deposit bonus, cashback and weekly bonuses.' },
      { q: 'Is a separate free bet included with Bttswin?', a: 'The offer includes a 300% worldwide deposit bonus, cashback and weekly bonuses. No separate free bet or cashback amount is specified here.' },
    ],
    ar: [
      { q: 'ما هو رمز Melbet الترويجي؟', a: 'رمز Melbet الترويجي هو Bttswin ويعمل حول العالم.' },
      { q: 'ما المزايا التي يتضمنها عرض Melbet؟', a: 'مكافأة إيداع عالمية بنسبة 300%، واسترداد نقدي ومكافآت أسبوعية.' },
      { q: 'هل يتضمن Bttswin رهانًا مجانيًا منفصلًا؟', a: 'يشمل العرض مكافأة إيداع عالمية بنسبة 300%، واستردادًا نقديًا ومكافآت أسبوعية. لا يُذكر هنا رهان مجاني منفصل أو مبلغ للاسترداد النقدي.' },
    ],
  },
  '888starz': {
    fr: [
      { q: 'Quel est le code promo 888Starz ?', a: 'Le code promo 888Starz est btts221 et fonctionne dans le monde entier.' },
      { q: 'Quels avantages comprend l’offre 888Starz ?', a: 'Un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires.' },
    ],
    en: [
      { q: 'What is the 888Starz promo code?', a: 'The 888Starz promo code is btts221 and works worldwide.' },
      { q: 'Which benefits does the 888Starz offer include?', a: 'A 300% worldwide deposit bonus, cashback and weekly bonuses.' },
    ],
    ar: [
      { q: 'ما هو الرمز الترويجي لـ 888Starz؟', a: 'الرمز الترويجي لـ 888Starz هو btts221 ويعمل حول العالم.' },
      { q: 'ما المزايا التي يتضمنها عرض 888Starz؟', a: 'مكافأة إيداع عالمية بنسبة 300%، واسترداد نقدي ومكافآت أسبوعية.' },
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
