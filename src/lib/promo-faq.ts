/**
 * Source unique des FAQ visibles et JSON-LD des pages promotionnelles.
 * Les réponses distinguent les avantages communiqués des conditions propres
 * au compte et au pays, qui doivent être confirmées par chaque opérateur.
 * Aucun minimum de dépôt, plafond, délai ou exigence de mise n'est inventé.
 */
export type PromoBookmakerId = 'linebet' | '1xbet' | 'melbet' | '888starz'
export type PromoLang = 'fr' | 'en' | 'ar'
export type PromoFaqItem = { q: string; a: string }

type PromoFaqByLang = Record<PromoLang, PromoFaqItem[]>

const FAQ: Record<PromoBookmakerId, PromoFaqByLang> = {
  linebet: {
    fr: [
      { q: 'Quel est le code promo Linebet ?', a: 'Le code exact présenté par BTTSPredict est VISION221 (respectez les majuscules).' },
      { q: 'Quels avantages sont associés à VISION221 ?', a: 'L’offre présentée comprend un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires. Les conditions détaillées doivent être vérifiées auprès de Linebet.' },
      { q: 'Le code VISION221 est-il réservé au Sénégal ?', a: 'Non. VISION221 est présenté comme une offre internationale. Linebet détermine toutefois la disponibilité et l’éligibilité applicables à chaque pays et à chaque compte.' },
      { q: 'Comment utiliser le code VISION221 ?', a: 'Copiez VISION221 exactement, consultez l’offre sur Linebet et vérifiez que les conditions et le code sont bien reconnus avant tout dépôt. BTTSPredict ne peut pas appliquer le code à votre compte.' },
      { q: 'Que faire si Linebet refuse le code ?', a: 'Vérifiez l’orthographe et les majuscules, puis contrôlez l’éligibilité de votre pays et de votre compte auprès de Linebet. Si l’offre reste incertaine, contactez son assistance avant de déposer.' },
    ],
    en: [
      { q: 'What is the Linebet promo code?', a: 'The exact code presented by BTTSPredict is VISION221 (case-sensitive). The code VISION221 is offered worldwide, subject to Linebet’s availability and eligibility rules for each country and account; check the local terms directly with Linebet before depositing.' },
      { q: 'What benefits are associated with VISION221?', a: 'The offer presented includes a 300% worldwide deposit bonus, cashback and weekly bonuses. Check the detailed terms with Linebet.' },
      { q: 'Is VISION221 only for Senegal?', a: 'No. VISION221 is presented as an international offer. Linebet still determines availability and eligibility for each country and account.' },
      { q: 'How do I use the VISION221 code?', a: 'Copy VISION221 exactly, review the offer on Linebet and make sure the code and terms are recognised before depositing. BTTSPredict cannot apply a code to your account.' },
      { q: 'What if Linebet rejects the code?', a: 'Check the spelling and capital letters, then confirm your country and account eligibility with Linebet. If the offer is unclear, contact its support before depositing.' },
    ],
    ar: [
      { q: 'ما هو رمز Linebet الترويجي؟', a: 'الرمز الدقيق الذي تعرضه BTTSPredict هو VISION221 (مع مراعاة الأحرف الكبيرة).' },
      { q: 'ما المزايا المرتبطة بالرمز VISION221؟', a: 'يشمل العرض المعروض مكافأة إيداع عالمية بنسبة 300% واستردادًا نقديًا ومكافآت أسبوعية. تحقق من الشروط التفصيلية لدى Linebet.' },
      { q: 'هل يقتصر الرمز VISION221 على السنغال؟', a: 'لا. يُعرض VISION221 بوصفه عرضًا دوليًا، لكن Linebet هي التي تحدد التوافر والأهلية لكل بلد وحساب.' },
      { q: 'كيف أستخدم الرمز VISION221؟', a: 'انسخ VISION221 كما هو، وراجع العرض لدى Linebet، وتأكد من قبول الرمز وظهور الشروط قبل أي إيداع. لا تستطيع BTTSPredict تطبيق الرمز على حسابك.' },
      { q: 'ماذا أفعل إذا رفضت Linebet الرمز؟', a: 'تحقق من كتابة الرمز والأحرف الكبيرة، ثم اسأل Linebet عن أهلية بلدك وحسابك. إذا لم تكن الشروط واضحة، فتواصل مع الدعم قبل الإيداع.' },
    ],
  },
  '1xbet': {
    fr: [
      { q: 'Quel est le code promo 1xBet ?', a: 'Le code exact présenté pour 1xBet est vipbtts, en minuscules.' },
      { q: 'Quels avantages comprend l’offre 1xBet ?', a: 'L’offre présentée comprend un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires. Les modalités détaillées restent à confirmer auprès de 1xBet.' },
      { q: 'Le code vipbtts donne-t-il un pari gratuit sans dépôt ?', a: 'Non. Les informations disponibles décrivent un bonus de dépôt, du cashback et des bonus hebdomadaires ; elles ne confirment pas un pari gratuit distinct ou une offre sans dépôt.' },
      { q: 'Comment utiliser vipbtts ?', a: 'Copiez vipbtts en minuscules, ouvrez 1xBet et suivez les indications affichées pour le code. Vérifiez que l’offre correspondante apparaît et lisez ses conditions avant de déposer.' },
      { q: 'Pourquoi le code 1xBet peut-il être refusé ?', a: 'Une erreur de saisie, l’éligibilité du compte ou les conditions locales peuvent empêcher son application. Vérifiez ces points auprès de 1xBet avant tout dépôt.' },
    ],
    en: [
      { q: 'What is the 1xBet promo code?', a: 'The exact code presented for 1xBet is vipbtts, in lowercase.' },
      { q: 'What does the 1xBet offer include?', a: 'The offer presented includes a 300% worldwide deposit bonus, cashback and weekly bonuses. Confirm the detailed terms with 1xBet.' },
      { q: 'Does vipbtts provide a no-deposit free bet?', a: 'No. The available information describes a deposit bonus, cashback and weekly bonuses; it does not confirm a separate free bet or no-deposit offer.' },
      { q: 'How do I use vipbtts?', a: 'Copy vipbtts in lowercase, open 1xBet and follow the instructions shown for the code. Check that the matching offer appears and read its terms before depositing.' },
      { q: 'Why might 1xBet reject the code?', a: 'A typing error, account eligibility or local terms may prevent the code from being applied. Check these points with 1xBet before depositing.' },
    ],
    ar: [
      { q: 'ما هو رمز 1xBet الترويجي؟', a: 'الرمز الدقيق المعروض لـ 1xBet هو vipbtts بالأحرف الصغيرة.' },
      { q: 'ما الذي يتضمنه عرض 1xBet؟', a: 'يشمل العرض المعروض مكافأة إيداع عالمية بنسبة 300% واستردادًا نقديًا ومكافآت أسبوعية. تحقق من الشروط التفصيلية لدى 1xBet.' },
      { q: 'هل يمنح الرمز vipbtts رهانًا مجانيًا دون إيداع؟', a: 'لا. المعلومات المتاحة تصف مكافأة إيداع واستردادًا نقديًا ومكافآت أسبوعية؛ ولا تؤكد رهانًا مجانيًا منفصلًا أو عرضًا دون إيداع.' },
      { q: 'كيف أستخدم الرمز vipbtts؟', a: 'انسخ vipbtts بالأحرف الصغيرة، وافتح 1xBet، واتبع التعليمات الظاهرة للرمز. تأكد من ظهور العرض المطابق واقرأ شروطه قبل الإيداع.' },
      { q: 'لماذا قد ترفض 1xBet الرمز؟', a: 'قد يمنع خطأ الكتابة أو أهلية الحساب أو الشروط المحلية تطبيق الرمز. تحقق من هذه الأمور لدى 1xBet قبل الإيداع.' },
    ],
  },
  melbet: {
    fr: [
      { q: 'Quel est le code promo Melbet ?', a: 'Le code exact présenté pour Melbet est Bttswin, avec un B majuscule.' },
      { q: 'Quels avantages comprend l’offre Bttswin ?', a: 'L’offre présentée comprend un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires. Les conditions détaillées sont à vérifier auprès de Melbet.' },
      { q: 'Bttswin inclut-il un pari gratuit distinct ?', a: 'Aucun pari gratuit distinct ni bonus sans dépôt n’est confirmé ici. Les avantages présentés sont un bonus de dépôt, du cashback et des bonus hebdomadaires.' },
      { q: 'Comment utiliser le code Bttswin ?', a: 'Copiez Bttswin en respectant le B majuscule, consultez l’offre sur Melbet et vérifiez que le code est reconnu et que les conditions vous conviennent avant de déposer.' },
      { q: 'Que faire si Bttswin ne fonctionne pas ?', a: 'Vérifiez le B majuscule et l’absence d’espace, puis demandez à Melbet de confirmer l’éligibilité de votre compte et les conditions applicables.' },
    ],
    en: [
      { q: 'What is the Melbet promo code?', a: 'The exact code presented for Melbet is Bttswin, with an initial capital B.' },
      { q: 'What does the Bttswin offer include?', a: 'The offer presented includes a 300% worldwide deposit bonus, cashback and weekly bonuses. Check the detailed terms with Melbet.' },
      { q: 'Does Bttswin include a separate free bet?', a: 'No separate free bet or no-deposit bonus is confirmed here. The benefits presented are a deposit bonus, cashback and weekly bonuses.' },
      { q: 'How do I use the Bttswin code?', a: 'Copy Bttswin with its initial capital B, review the offer on Melbet and confirm that the code is recognised and the terms suit you before depositing.' },
      { q: 'What if Bttswin does not work?', a: 'Check the capital B and remove any extra spaces, then ask Melbet to confirm your account eligibility and the applicable terms.' },
    ],
    ar: [
      { q: 'ما هو رمز Melbet الترويجي؟', a: 'الرمز الدقيق المعروض لـ Melbet هو Bttswin ويبدأ بحرف B كبير.' },
      { q: 'ما الذي يتضمنه عرض Bttswin؟', a: 'يشمل العرض المعروض مكافأة إيداع عالمية بنسبة 300% واستردادًا نقديًا ومكافآت أسبوعية. تحقق من الشروط التفصيلية لدى Melbet.' },
      { q: 'هل يتضمن Bttswin رهانًا مجانيًا منفصلًا؟', a: 'لا يوجد هنا تأكيد لرهان مجاني منفصل أو مكافأة دون إيداع. المزايا المعروضة هي مكافأة إيداع واسترداد نقدي ومكافآت أسبوعية.' },
      { q: 'كيف أستخدم رمز Bttswin؟', a: 'انسخ Bttswin مع كتابة الحرف الأول B كبيرًا، وراجع العرض لدى Melbet، وتأكد من قبول الرمز وملاءمة الشروط لك قبل الإيداع.' },
      { q: 'ماذا أفعل إذا لم يعمل Bttswin؟', a: 'تحقق من الحرف B الكبير واحذف أي مسافات إضافية، ثم اطلب من Melbet تأكيد أهلية حسابك والشروط المطبقة.' },
    ],
  },
  '888starz': {
    fr: [
      { q: 'Quel est le code promo 888Starz ?', a: 'Le code exact présenté pour 888Starz est btts221, en minuscules.' },
      { q: 'Quels avantages comprend l’offre 888Starz ?', a: 'L’offre présentée comprend un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions détaillées auprès de 888Starz.' },
      { q: 'Le code btts221 garantit-il un pari gratuit ?', a: 'Aucun pari gratuit distinct ni bonus sans dépôt n’est confirmé ici. Le pourcentage du bonus ne précise pas à lui seul les plafonds ou les conditions de retrait.' },
      { q: 'Comment vérifier que btts221 est appliqué ?', a: 'Copiez btts221, consultez l’interface officielle de 888Starz et vérifiez qu’un champ de code ou une offre correspondante est bien affiché. Un clic sur un lien ou un téléchargement ne prouve pas l’activation.' },
      { q: 'Que faire si 888Starz ne reconnaît pas btts221 ?', a: 'Vérifiez la saisie exacte et demandez à l’assistance officielle si le code est disponible pour votre pays et votre compte. Ne déposez pas uniquement dans l’espoir de l’activer.' },
    ],
    en: [
      { q: 'What is the 888Starz promo code?', a: 'The exact code presented for 888Starz is btts221, in lowercase.' },
      { q: 'What does the 888Starz offer include?', a: 'The offer presented includes a 300% worldwide deposit bonus, cashback and weekly bonuses. Check the detailed terms with 888Starz.' },
      { q: 'Does btts221 guarantee a free bet?', a: 'No separate free bet or no-deposit bonus is confirmed here. The bonus percentage alone does not specify caps or withdrawal terms.' },
      { q: 'How can I check whether btts221 was applied?', a: 'Copy btts221, open the official 888Starz interface and check whether a promo-code field or matching offer is displayed. Clicking a link or downloading an app does not prove activation.' },
      { q: 'What if 888Starz does not recognise btts221?', a: 'Check the exact spelling and ask official support whether the code is available for your country and account. Do not deposit solely in the hope of activating it.' },
    ],
    ar: [
      { q: 'ما هو الرمز الترويجي لـ 888Starz؟', a: 'الرمز الدقيق المعروض لـ 888Starz هو btts221 بالأحرف الصغيرة.' },
      { q: 'ما المزايا التي يتضمنها عرض 888Starz؟', a: 'يشمل العرض المعروض مكافأة إيداع عالمية بنسبة 300% واستردادًا نقديًا ومكافآت أسبوعية. تحقق من الشروط التفصيلية لدى 888Starz.' },
      { q: 'هل يضمن الرمز btts221 رهانًا مجانيًا؟', a: 'لا يوجد هنا تأكيد لرهان مجاني منفصل أو مكافأة دون إيداع. نسبة المكافأة وحدها لا تحدد السقف أو شروط السحب.' },
      { q: 'كيف أتحقق من تطبيق الرمز btts221؟', a: 'انسخ btts221 وافتح واجهة 888Starz الرسمية، ثم تحقق من ظهور حقل للرمز أو عرض مطابق. فتح الرابط أو تنزيل التطبيق لا يثبت تفعيل الرمز.' },
      { q: 'ماذا أفعل إذا لم يتعرف 888Starz على btts221؟', a: 'تحقق من كتابة الرمز بدقة، واسأل الدعم الرسمي عما إذا كان متاحًا لبلدك وحسابك. لا تودع المال لمجرد الأمل في تفعيله.' },
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
