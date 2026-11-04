/**
 * Source unique FAQ visibles ↔ JSON-LD pages promo.
 * Textes FR alignés sur buildFaqJsonLd des page.tsx existantes.
 * EN/AR : traductions fidèles (mêmes faits, mêmes codes, sans condition inventée).
 */
import { PROMO_CURRENT_YEAR } from './promo-build-date.generated'

export type PromoBookmakerId = 'linebet' | '1xbet' | 'melbet' | '888starz'
export type PromoLang = 'fr' | 'en' | 'ar'
export type PromoFaqItem = { q: string; a: string }

const YEAR = PROMO_CURRENT_YEAR

const FR: Record<PromoBookmakerId, PromoFaqItem[]> = {
  linebet: [
    {
      q: 'Quel est le code promo Linebet ?',
      a: "Le code promo Linebet est VISION221 — à saisir en majuscules lors de l'inscription ou dans la section « Code Promo » de ton compte. La disponibilité du code et de l'offre dépend du pays, du compte et des conditions affichées par Linebet.",
    },
    {
      q: `Que donne le code VISION221 en ${YEAR} ?`,
      a: "Le code VISION221 donne 300% de bonus et 100 free spins, sans condition de mise, dès 1 € de dépôt — offre annoncée par la campagne partenaire. Vérifie l'offre affichée par Linebet pour ton pays avant tout dépôt.",
    },
    {
      q: 'Comment déposer avec Wave ou Orange Money sur Linebet ?',
      a: "Si Wave ou Orange Money est disponible pour ton pays, sélectionne-le dans la section Dépôt de Linebet, dépose à partir de 1 € puis vérifie les conditions affichées avant de confirmer.",
    },
    {
      q: 'Le bonus est-il valable dans tous les pays ?',
      a: "La disponibilité du code et de l'offre dépend du pays, du compte et de la période. Vérifiez votre éligibilité et les conditions actuellement affichées par Linebet avant toute inscription ou dépôt.",
    },
    {
      q: '1xbet ou Linebet : quel code promo choisir ?',
      a: "Les deux sont nos partenaires officiels et annoncent la même offre : 300% de bonus + 100 free spins sans condition de mise, avec vipbtts (1xbet) comme avec VISION221 (Linebet, dès 1 € de dépôt). Choisis selon le bookmaker que tu préfères utiliser.",
    },
  ],
  '1xbet': [
    {
      q: 'Quel est le code promo 1xbet ?',
      a: "Le code promo 1xbet est vipbtts — à recopier exactement tel quel lors de l'inscription ou dans la section « Code Promo » de ton compte 1xbet.",
    },
    {
      q: `Que donne le code vipbtts en ${YEAR} ?`,
      a: "Le code vipbtts donne 300% de bonus + 100 free spins, sans condition de mise — offre annoncée par la campagne partenaire. Vérifie l'offre affichée par 1xbet pour ton pays avant tout dépôt.",
    },
    {
      q: 'Où saisir le code vipbtts sur 1xbet ?',
      a: "Saisis vipbtts dans le champ « Code promo » du formulaire d'inscription 1xbet, ou plus tard dans ton compte, section « Code Promo ». Respecte la casse exacte.",
    },
    {
      q: '1xbet ou Linebet : quel code promo choisir ?',
      a: "Les deux sont nos partenaires officiels et annoncent la même offre : 300% de bonus + 100 free spins sans condition de mise, avec vipbtts (1xbet) comme avec VISION221 (Linebet, dès 1 € de dépôt). Choisis selon le bookmaker que tu préfères utiliser.",
    },
    {
      q: 'Le bonus 1xbet est-il valable dans tous les pays ?',
      a: "La disponibilité du code et de l'offre dépend du pays, du compte et de la période. Vérifie ton éligibilité et les conditions actuellement affichées par 1xbet avant toute inscription ou dépôt.",
    },
  ],
  melbet: [
    {
      q: 'Quel est le code promo Melbet ?',
      a: "Le code promo Melbet est Bttswin — à recopier exactement tel quel lors de l'inscription ou dans la section « Code Promo » de ton compte Melbet.",
    },
    {
      q: `Que donne le code Bttswin en ${YEAR} ?`,
      a: "Le code Bttswin donne 300% de bonus + 100 free spins, sans condition de mise — offre annoncée par la campagne Melbet. Vérifie l'offre affichée par Melbet pour ton pays avant tout dépôt.",
    },
    {
      q: 'Où saisir le code Bttswin sur Melbet ?',
      a: "Saisis Bttswin dans le champ « Code promo » du formulaire d'inscription Melbet, ou plus tard dans ton compte, section « Code Promo ». Respecte la casse exacte.",
    },
    {
      q: 'Melbet ou 1xbet : quel code promo choisir ?',
      a: "Les deux sont nos partenaires officiels et annoncent la même offre : 300% de bonus + 100 free spins sans condition de mise, avec Bttswin (Melbet) comme avec vipbtts (1xbet). Choisis le bookmaker que tu préfères utiliser.",
    },
    {
      q: 'Le bonus Melbet est-il valable dans tous les pays ?',
      a: "La disponibilité du code et de l'offre dépend du pays, du compte et de la période. Vérifie ton éligibilité et les conditions actuellement affichées par Melbet avant toute inscription ou dépôt.",
    },
  ],
  '888starz': [
    {
      q: 'Quel est le code promo 888Starz ?',
      a: "Le code promo 888Starz présenté sur cette page est btts221, à saisir exactement en minuscules pendant l'inscription ou dans la section « Code Promo ».",
    },
    {
      q: `Que donne le code btts221 en ${YEAR} ?`,
      a: "Le code btts221 donne 300% de bonus et 100 free spins, sans condition de mise, dès 1 € de dépôt — offre annoncée par la campagne partenaire. Vérifie les conditions affichées par 888Starz pour ton pays avant tout dépôt.",
    },
    {
      q: 'Quel est le dépôt minimum avec btts221 ?',
      a: "Le dépôt minimum annoncé est de 1 €. Vérifie le montant réellement affiché par 888Starz et les moyens de paiement disponibles dans ton pays avant de confirmer.",
    },
    {
      q: 'Le code fonctionne-t-il dans tous les pays ?',
      a: "La disponibilité peut dépendre du pays, du compte et de la période. Vérifiez votre éligibilité directement auprès de 888Starz avant de déposer.",
    },
  ],
}

const EN: Record<PromoBookmakerId, PromoFaqItem[]> = {
  linebet: [
    { q: 'What is the Linebet promo code?', a: 'The Linebet promo code is VISION221 — enter it in uppercase during sign-up or in the Promo Code section of your account.' },
    { q: `What does code VISION221 give in ${YEAR}?`, a: 'VISION221 is announced as 300% bonus and 100 free spins, no wagering requirement, from a €1 deposit — as stated by the partner campaign. Always check the offer shown by Linebet for your country before depositing.' },
    { q: 'How do I deposit with Wave or Orange Money on Linebet?', a: 'If Wave or Orange Money is available in your country, select it in Linebet Deposit, deposit from €1, then check the terms shown before confirming.' },
    { q: 'Is the bonus available in every country?', a: 'Code and offer availability depend on country, account and period. Check your eligibility and the terms currently shown by Linebet before signing up or depositing.' },
    { q: '1xbet or Linebet: which promo code should I choose?', a: 'Both are official partners and announce the same offer: 300% bonus + 100 free spins with no wagering requirement — vipbtts (1xbet) or VISION221 (Linebet, from €1). Choose the bookmaker you prefer.' },
  ],
  '1xbet': [
    { q: 'What is the 1xbet promo code?', a: 'The 1xbet promo code is vipbtts — copy it exactly during sign-up or in the Promo Code section of your 1xbet account.' },
    { q: `What does code vipbtts give in ${YEAR}?`, a: 'vipbtts is announced as 300% bonus + 100 free spins, no wagering requirement — partner campaign. Check the offer shown by 1xbet for your country before depositing.' },
    { q: 'Where do I enter code vipbtts on 1xbet?', a: 'Enter vipbtts in the Promo code field on the 1xbet registration form, or later in your account under Promo Code. Respect the exact case.' },
    { q: '1xbet or Linebet: which promo code should I choose?', a: 'Both are official partners and announce the same offer: 300% + 100 free spins with no wagering — vipbtts (1xbet) or VISION221 (Linebet, from €1). Choose the bookmaker you prefer.' },
    { q: 'Is the 1xbet bonus available in every country?', a: 'Availability depends on country, account and period. Check eligibility and the terms currently shown by 1xbet before signing up or depositing.' },
  ],
  melbet: [
    { q: 'What is the Melbet promo code?', a: 'The Melbet promo code is Bttswin — copy it exactly during sign-up or in the Promo Code section of your Melbet account.' },
    { q: `What does code Bttswin give in ${YEAR}?`, a: 'Bttswin is announced as 300% bonus + 100 free spins, no wagering requirement — Melbet campaign. Check the offer shown by Melbet for your country before depositing.' },
    { q: 'Where do I enter code Bttswin on Melbet?', a: 'Enter Bttswin in the Promo code field on Melbet registration, or later in your account under Promo Code. Respect the exact case.' },
    { q: 'Melbet or 1xbet: which promo code should I choose?', a: 'Both are official partners and announce the same offer: 300% + 100 free spins with no wagering — Bttswin (Melbet) or vipbtts (1xbet). Choose the bookmaker you prefer.' },
    { q: 'Is the Melbet bonus available in every country?', a: 'Availability depends on country, account and period. Check eligibility and the terms currently shown by Melbet before signing up or depositing.' },
  ],
  '888starz': [
    { q: 'What is the 888Starz promo code?', a: 'The 888Starz promo code on this page is btts221 — enter it exactly in lowercase during sign-up or in the Promo Code section.' },
    { q: `What does code btts221 give in ${YEAR}?`, a: 'btts221 is announced as 300% bonus and 100 free spins, no wagering requirement, from a €1 deposit — partner campaign. Check terms shown by 888Starz for your country before depositing.' },
    { q: 'What is the minimum deposit with btts221?', a: 'The announced minimum deposit is €1. Check the amount and payment methods actually shown by 888Starz in your country before confirming.' },
    { q: 'Does the code work in every country?', a: 'Availability may depend on country, account and period. Verify eligibility directly with 888Starz before depositing.' },
  ],
}

const AR: Record<PromoBookmakerId, PromoFaqItem[]> = {
  linebet: [
    { q: 'ما هو رمز Linebet الترويجي؟', a: 'رمز Linebet هو VISION221 — أدخله بأحرف كبيرة عند التسجيل أو في قسم الرمز الترويجي بحسابك.' },
    { q: `ماذا يمنح الرمز VISION221 في ${YEAR}؟`, a: 'يُعلن عن VISION221 كبونص 300% و100 لفة مجانية بدون شرط رهان من إيداع 1 يورو — حسب حملة الشريك. تحقق من العرض الذي يظهره Linebet لبلدك قبل الإيداع.' },
    { q: 'كيف أودع عبر Wave أو Orange Money على Linebet؟', a: 'إذا كان Wave أو Orange Money متاحًا في بلدك، اختره في قسم الإيداع، أودع من 1 يورو ثم راجع الشروط المعروضة قبل التأكيد.' },
    { q: 'هل البونص متاح في كل البلدان؟', a: 'يعتمد توافر الرمز والعرض على البلد والحساب والفترة. تحقق من الأهلية والشروط المعروضة حاليًا من Linebet قبل التسجيل أو الإيداع.' },
    { q: '1xbet أم Linebet: أي رمز أختار؟', a: 'كلاهما شريكان رسميان ويعلنان نفس العرض: 300% + 100 لفة بدون شرط رهان — vipbtts (1xbet) أو VISION221 (Linebet من 1 يورو). اختر ما تفضّل.' },
  ],
  '1xbet': [
    { q: 'ما هو رمز 1xbet الترويجي؟', a: 'رمز 1xbet هو vipbtts — انسخه بدقة عند التسجيل أو في قسم الرمز الترويجي بحساب 1xbet.' },
    { q: `ماذا يمنح الرمز vipbtts في ${YEAR}؟`, a: 'يُعلن عن vipbtts كبونص 300% + 100 لفة مجانية بدون شرط رهان — حملة الشريك. تحقق من عرض 1xbet لبلدك قبل الإيداع.' },
    { q: 'أين أُدخل الرمز vipbtts على 1xbet؟', a: 'أدخل vipbtts في حقل الرمز الترويجي بنموذج التسجيل أو لاحقًا في حسابك. احترم حالة الأحرف.' },
    { q: '1xbet أم Linebet: أي رمز أختار؟', a: 'كلاهما شريكان رسميان ويعرضان 300% + 100 لفة بدون شرط رهان — vipbtts أو VISION221. اختر ما تفضّل.' },
    { q: 'هل بونص 1xbet متاح في كل البلدان؟', a: 'يعتمد التوافر على البلد والحساب والفترة. تحقق من شروط 1xbet الحالية قبل التسجيل أو الإيداع.' },
  ],
  melbet: [
    { q: 'ما هو رمز Melbet الترويجي؟', a: 'رمز Melbet هو Bttswin — انسخه بدقة عند التسجيل أو في قسم الرمز الترويجي.' },
    { q: `ماذا يمنح الرمز Bttswin في ${YEAR}؟`, a: 'يُعلن عن Bttswin كبونص 300% + 100 لفة بدون شرط رهان — حملة Melbet. تحقق من العرض قبل الإيداع.' },
    { q: 'أين أُدخل الرمز Bttswin على Melbet؟', a: 'أدخل Bttswin في حقل الرمز الترويجي عند التسجيل أو لاحقًا في الحساب مع احترام حالة الأحرف.' },
    { q: 'Melbet أم 1xbet: أي رمز أختار؟', a: 'كلاهما شريكان رسميان ويعرضان 300% + 100 لفة بدون شرط رهان — Bttswin أو vipbtts. اختر ما تفضّل.' },
    { q: 'هل بونص Melbet متاح في كل البلدان؟', a: 'يعتمد التوافر على البلد والحساب والفترة. تحقق من شروط Melbet قبل التسجيل أو الإيداع.' },
  ],
  '888starz': [
    { q: 'ما هو رمز 888Starz الترويجي؟', a: 'الرمز في هذه الصفحة هو btts221 — أدخله بأحرف صغيرة بدقة عند التسجيل أو في قسم الرمز.' },
    { q: `ماذا يمنح الرمز btts221 في ${YEAR}؟`, a: 'يُعلن عن btts221 كبونص 300% و100 لفة بدون شرط رهان من إيداع 1 يورو — حملة الشريك. تحقق من شروط 888Starz قبل الإيداع.' },
    { q: 'ما الحد الأدنى للإيداع مع btts221؟', a: 'الحد المعلن هو 1 يورو. تحقق من المبلغ ووسائل الدفع التي يعرضها 888Starz في بلدك قبل التأكيد.' },
    { q: 'هل يعمل الرمز في كل البلدان؟', a: 'قد يعتمد التوافر على البلد والحساب والفترة. تحقق من الأهلية مباشرة لدى 888Starz قبل الإيداع.' },
  ],
}

export function getPromoFaq(bookmaker: PromoBookmakerId, lang: PromoLang): PromoFaqItem[] {
  if (lang === 'en') return EN[bookmaker]
  if (lang === 'ar') return AR[bookmaker]
  return FR[bookmaker]
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
