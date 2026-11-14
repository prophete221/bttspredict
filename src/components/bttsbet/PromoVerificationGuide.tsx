/** Server-rendered help, imported only by the zero-click routes audited on 2026-11-10.
 * No offer validation date, operator-specific eligibility or bonus terms are inferred.
 * Existing shared promo clients and their protected consumers remain untouched.
 */
type Lang = 'fr' | 'en' | 'ar'
type Bookmaker = 'linebet' | '1xbet' | 'melbet' | '888starz'

const BOOKMAKERS = {
  linebet: { name: 'Linebet', code: 'VISION221' },
  '1xbet': { name: '1xBet', code: 'vipbtts' },
  melbet: { name: 'Melbet', code: 'Bttswin' },
  '888starz': { name: '888Starz', code: 'btts221' },
} as const

const FOCUS: Record<Bookmaker, Record<Lang, { title: string; body: string }>> = {
  linebet: {
    fr: { title: 'Code promo Linebet VISION221 : Afrique et international', body: 'Ce guide s’adresse aux lecteurs d’Afrique, d’Europe et d’autres régions, sans limiter le code au Sénégal. Le code VISION221 est international dans les pays où Linebet l’accepte. L’éligibilité et les modalités restent celles fixées par Linebet pour le pays du joueur ; vérifiez-les auprès du bookmaker. Les pays d’où viennent nos lecteurs ne constituent pas une liste de pays admissibles. Aucun moyen de paiement local, montant de retrait ou autorisation locale n’est confirmé ici.' },
    en: { title: 'VISION221 and the Senegal context', body: 'The Linebet code shown here is VISION221 for Linebet. A worldwide offer does not replace checking the rules and availability that apply in your country. This guide does not verify local payment methods, withdrawal amounts or legal availability.' },
    ar: { title: 'رمز VISION221 في إفريقيا وعلى الصعيد الدولي', body: 'هذا الدليل موجّه إلى القراء في إفريقيا وأوروبا ومناطق أخرى، ولا يحصر الرمز في السنغال. الرمز VISION221 دولي في البلدان التي تقبله فيها Linebet. تظل الأهلية والشروط كما تحددها Linebet لبلد اللاعب؛ تحقق منها لدى المشغّل. بلدان قرائنا ليست قائمة بالبلدان المؤهلة. لا يؤكد هذا الدليل وسائل دفع محلية أو مبالغ سحب أو ترخيصًا محليًا.' },
  },
  '1xbet': {
    fr: { title: 'vipbtts concerne 1xBet, pas 1xBit', body: 'Le code de cette page est vipbtts pour 1xBet. Il ne faut pas le confondre avec une offre 1xBit. Copier le code, ouvrir le site et télécharger l’APK sont des actions différentes : le téléchargement seul ne prouve pas qu’un bonus est activé. Cette page ne présente pas de pari gratuit sans dépôt.' },
    en: { title: '1xBet promo code vipbtts: site, APK and bonus type', body: 'The code on this page is vipbtts for 1xBet, not 1xBit. Copying the code, opening the website and downloading an APK are separate actions. An app download alone does not confirm bonus activation. The offer described here is a deposit bonus, not a verified no-deposit free bet.' },
    ar: { title: 'الرمز vipbtts يخص 1xBet وليس 1xBit', body: 'الرمز المعروض في هذه الصفحة هو vipbtts لـ 1xBet وليس عرضًا لـ 1xBit. نسخ الرمز وفتح الموقع وتنزيل APK إجراءات مختلفة؛ التنزيل وحده لا يثبت تفعيل المكافأة. لا تعرض هذه الصفحة رهانًا مجانيًا مؤكدًا دون إيداع.' },
  },
  melbet: {
    fr: { title: 'Bttswin : distinguer le code et le type de bonus', body: 'Recopiez Bttswin avec son B initial majuscule, sans espace ajouté. L’offre présentée concerne un bonus de dépôt, du cashback et des bonus hebdomadaires ; ce n’est pas la confirmation d’un pari gratuit distinct ou sans dépôt. Le magasin de codes Melbet est un autre dispositif : ses règles ne prouvent pas celles du code Bttswin en particulier.' },
    en: { title: 'Bttswin: the code and the bonus are not the same thing', body: 'Copy Bttswin with its initial capital B and no added spaces. The offer described here concerns a deposit bonus, cashback and weekly bonuses, not a separately verified free bet or no-deposit offer. Melbet’s promo code store is a separate feature; its rules do not establish the terms of the Bttswin code specifically.' },
    ar: { title: 'برومو كود Melbet Bttswin: مكافأة إيداع وليست رهانًا مجانيًا', body: 'انسخ Bttswin بحرف B كبير في البداية ومن دون مسافات إضافية. العرض الموصوف هنا يشمل مكافأة إيداع واستردادًا نقديًا ومكافآت أسبوعية، وليس تأكيدًا لرهان مجاني مستقل أو عرض دون إيداع. متجر رموز Melbet خدمة مختلفة؛ قواعده لا تثبت شروط الرمز Bttswin تحديدًا.' },
  },
  '888starz': {
    fr: { title: 'Code promo 888Starz btts221 : comprendre l’offre', body: 'Le code présenté est btts221 pour 888Starz. Le pourcentage du bonus ne donne pas, à lui seul, un plafond, un montant retirable ou une condition de mise. Ces informations dépendent des modalités de l’offre et ne sont pas précisées ici. Les règles générales 888Starz ne constituent pas une validation de ce code particulier.' },
    en: { title: 'Understand the 888Starz offer before using it', body: 'The code shown is btts221 for 888Starz. A bonus percentage alone does not specify a cap, a withdrawable amount or wagering conditions. Those details depend on the offer terms and are not stated here. General 888Starz bonus rules do not validate this particular code.' },
    ar: { title: 'برومو كود 888Starz btts221 : فهم العرض', body: 'الرمز المعروض هو btts221 الخاص بـ 888Starz. نسبة المكافأة وحدها لا تحدد سقفًا أو مبلغًا قابلًا للسحب أو شروط مراهنة. هذه التفاصيل تعتمد على شروط العرض ولم تُذكر هنا. القواعد العامة لمكافآت 888Starz لا تثبت صلاحية هذا الرمز بعينه.' },
  },
}

const CODE_FOCUS: Record<Lang, { title: string; body: string }> = {
  fr: { title: 'Code promo 888Starz btts221 : vérifier son utilisation', body: 'Cette page est consacrée au code btts221, et non à une seconde offre 888Starz. Copiez le code exact puis vérifiez dans l’interface officielle si un champ de code est proposé et si l’offre correspondante apparaît. Si aucun champ n’est proposé, demandez à l’assistance officielle où et quand le code peut être utilisé ; ne supposez pas qu’un lien ou un téléchargement l’a appliqué.' },
  en: { title: '888Starz promo code btts221: how to apply the code', body: 'This page explains the btts221 code; it is not a second 888Starz offer. Copy the exact code, then check the official interface for a promo-code field and a matching offer. If no field is available, ask official support where and when the code can be used. Do not assume that following a link or downloading an app applied it.' },
  ar: { title: 'btts221: التحقق من طريقة تطبيق الرمز', body: 'تشرح هذه الصفحة الرمز btts221 ولا تعرض مكافأة ثانية من 888Starz. انسخ الرمز بدقة ثم تحقق من وجود حقل للرمز وعرض مطابق في الواجهة الرسمية. إذا لم يظهر الحقل، اسأل الدعم الرسمي عن موضع الرمز ووقت استخدامه؛ لا تفترض أن فتح رابط أو تنزيل التطبيق يطبقه تلقائيًا.' },
}

const COPY = {
  fr: {
    before: 'Les vérifications à faire avant tout dépôt',
    checks: [
      ['Éligibilité', 'Le code est international dans les pays où le bookmaker l’accepte. Vérifiez auprès de lui la disponibilité et les modalités pour votre pays et votre compte.'],
      ['Activation', 'Demandez si le code et une activation de l’offre sont nécessaires. Copier le texte n’active rien dans votre compte.'],
      ['Conditions financières', 'Vérifiez, si elles s’appliquent, le dépôt, le plafond, les exigences de mise et les règles de retrait. Aucun chiffre supplémentaire n’est confirmé ici.'],
      ['Délais et cumul', 'Vérifiez les échéances et la compatibilité du bonus avec le cashback et les bonus hebdomadaires. Ne présumez pas qu’ils se cumulent automatiquement.'],
    ],
    trouble: 'Si le code n’est pas accepté',
    steps: ['Comparez le texte saisi au code affiché, y compris les lettres et les espaces.', 'Conservez le message affiché et consultez l’assistance officielle pour votre pays et votre compte.', 'Si l’offre ou ses conditions ne sont pas claires, ne déposez pas uniquement dans l’espoir d’activer le code.'],
    distinction: 'Code, lien et application : trois choses différentes',
    distinctionBody: 'Le code est le texte à vérifier dans l’interface de l’opérateur. Un lien affilié sert aussi au suivi d’une référence ; l’ouvrir ne démontre pas que le code est appliqué. Un bouton APK lance un parcours de téléchargement distinct. Vérifiez la provenance de l’application avant toute installation.',
    limits: 'L’offre affichée est celle présentée par BTTSPredict. Ses modalités détaillées pour votre compte et votre pays ne sont pas vérifiées ici. BTTSPredict ne peut ni activer un bonus ni consulter votre compte bookmaker. Ne communiquez jamais mot de passe, PIN ou code de connexion pour demander de l’aide.',
    sources: 'Repères officiels, sans validation de ce code',
    sourceNote: 'Ces sources expliquent des mécanismes généraux ; elles ne confirment pas les conditions de l’offre affichée.',
    related: 'Voir la présentation de l’offre 888Starz',
  },
  en: {
    before: 'What to check before making a deposit',
    checks: [
      ['Eligibility', 'The code is international in countries where the bookmaker accepts it. Ask the operator about availability and terms for your country and account.'],
      ['Activation', 'Ask whether a code and an offer opt-in are required. Copying text does not activate anything in your account.'],
      ['Financial terms', 'Where applicable, check the deposit, cap, wagering requirements and withdrawal rules. No additional figures are verified here.'],
      ['Deadlines and combinations', 'Check expiry dates and whether the bonus can be combined with cashback and weekly bonuses. Do not assume automatic stacking.'],
    ],
    trouble: 'If the code is not accepted',
    steps: ['Compare the entered text with the displayed code, including letters and spaces.', 'Keep the displayed message and ask official support about your country and account.', 'If the offer or its terms are unclear, do not deposit solely in the hope of activating the code.'],
    distinction: 'Code, link and app: three different things',
    distinctionBody: 'A code is text to check in the operator’s interface. An affiliate link also tracks a referral; opening it does not establish that a code was applied. An APK button starts a separate download process. Check the application’s source before installing it.',
    limits: 'The displayed offer is the one presented by BTTSPredict. Its detailed terms for your account and country are not verified here. BTTSPredict cannot activate a bonus or inspect your bookmaker account. Never share a password, PIN or sign-in code when asking for help.',
    sources: 'Official background, not validation of this code',
    sourceNote: 'These sources describe general mechanisms; they do not confirm the terms of the displayed offer.',
    related: 'See the 888Starz offer overview',
  },
  ar: {
    before: 'ما الذي يجب التحقق منه قبل أي إيداع؟',
    checks: [
      ['الأهلية', 'الرمز دولي في البلدان التي يقبله فيها المشغّل. تحقق لدى المشغّل من التوافر والشروط الخاصة ببلدك وحسابك.'],
      ['التفعيل', 'اسأل إن كان الرمز وتفعيل العرض مطلوبين. نسخ النص لا يفعّل شيئًا في حسابك.'],
      ['الشروط المالية', 'تحقق، إن كانت مطبقة، من الإيداع والسقف وشروط المراهنة وقواعد السحب. لا توجد أرقام إضافية مؤكدة هنا.'],
      ['المهل والجمع بين العروض', 'تحقق من المواعيد وإمكانية الجمع بين المكافأة والاسترداد النقدي والمكافآت الأسبوعية. لا تفترض الجمع التلقائي.'],
    ],
    trouble: 'إذا لم يُقبل الرمز',
    steps: ['قارن النص المُدخل بالرمز المعروض، بما في ذلك الحروف والمسافات.', 'احتفظ بالرسالة الظاهرة واسأل الدعم الرسمي عن بلدك وحسابك.', 'إذا لم يكن العرض أو شروطه واضحين، فلا تودع المال لمجرد الأمل في تفعيل الرمز.'],
    distinction: 'الرمز والرابط والتطبيق أشياء مختلفة',
    distinctionBody: 'الرمز نص يُتحقق منه في واجهة المشغّل. يساعد رابط الإحالة أيضًا في تتبع الإحالة؛ فتحه لا يثبت تطبيق الرمز. زر APK يبدأ مسار تنزيل منفصلًا. تحقق من مصدر التطبيق قبل تثبيته.',
    limits: 'العرض المعروض هو ما تقدمه BTTSPredict. لم تُتحقق هنا شروطه التفصيلية لحسابك وبلدك. لا يمكن لـ BTTSPredict تفعيل مكافأة أو الاطلاع على حسابك لدى المشغّل. لا تشارك كلمة المرور أو PIN أو رمز تسجيل الدخول لطلب المساعدة.',
    sources: 'مراجع رسمية عامة، وليست إثباتًا لهذا الرمز',
    sourceNote: 'تشرح هذه المصادر آليات عامة ولا تؤكد شروط العرض المعروض.',
    related: 'عرض ملخص مكافأة 888Starz',
  },
} as const

const SOURCES: Partial<Record<Bookmaker, { href: string; label: string }[]>> = {
  '1xbet': [{ href: 'https://1x.partners/', label: '1x Partners' }],
  melbet: [{ href: 'https://melbet.com/en/promo', label: 'Melbet — Promo code store' }],
  '888starz': [
    { href: 'https://888starz.bet/en/bonus/rules', label: '888Starz — Bonus rules' },
    { href: 'https://888starz.partners/', label: '888Starz Partners' },
  ],
}

export default function PromoVerificationGuide({ bookmaker, lang, variant = 'offer' }: {
  bookmaker: Bookmaker
  lang: Lang
  variant?: 'offer' | 'code'
}) {
  const copy = COPY[lang]
  const info = BOOKMAKERS[bookmaker]
  const focus = bookmaker === '888starz' && variant === 'code' ? CODE_FOCUS[lang] : FOCUS[bookmaker][lang]
  const headingId = `promo-verification-${bookmaker}-${lang}`
  const sources = SOURCES[bookmaker] ?? []
  return (
    <section lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} aria-labelledby={headingId}
      data-promo-verification={`${bookmaker}-${lang}-${variant}`}
      className="relative z-10 mx-auto my-5 w-full max-w-4xl px-4 text-[#F5F5F5] sm:px-6">
      <div className="rounded-xl border border-[#303030] bg-[#191919] p-4 sm:p-5">
        <p className="mb-2 text-xs font-semibold text-[#63D471]">{info.name} · <bdi dir="ltr">{info.code}</bdi></p>
        <h2 id={headingId} className="text-lg font-bold sm:text-xl">{focus.title}</h2>
        <p className="mt-2 text-xs leading-5 text-[#A4A4A4]">{focus.body}</p>
        <details className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-white">
            {lang === 'fr' ? 'Conditions et vérifications' : lang === 'en' ? 'Terms and checks' : 'الشروط والتحقق'}
          </summary>
          <div className="border-t border-white/10 p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-white">{copy.before}</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {copy.checks.map(([title, body]: readonly [string, string]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-[#1B1B1B] p-3">
                  <dt className="text-sm font-semibold text-white">{title}</dt>
                  <dd className="mt-1 text-xs leading-5 text-[#A4A4A4]">{body}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-5 text-sm font-semibold text-white">{copy.distinction}</h3>
            <p className="mt-2 text-xs leading-5 text-[#A4A4A4]">{copy.distinctionBody}</p>
            <h3 className="mt-5 text-sm font-semibold text-white">{copy.trouble}</h3>
            <ol className="mt-2 list-decimal space-y-1 ps-5 text-xs leading-5 text-[#A4A4A4]">
              {copy.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p className="mt-4 border-s-2 border-[#63D471] ps-3 text-xs leading-5 text-[#A4A4A4]">{copy.limits}</p>
            {sources.length > 0 && (
              <aside className="mt-5 border-t border-white/10 pt-4" aria-label={copy.sources}>
                <h3 className="text-xs font-semibold text-white">{copy.sources}</h3>
                <p className="mt-1 text-xs leading-5 text-[#A4A4A4]">{copy.sourceNote}</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                  {sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="text-[#63D471] underline underline-offset-4">{source.label}</a></li>)}
                </ul>
              </aside>
            )}
          </div>
        </details>
        {bookmaker === '888starz' && variant === 'code' && (
          <a href={`${lang === 'fr' ? '' : `/${lang}`}/bonus-888starz`} className="mt-4 inline-block text-sm font-semibold text-[#63D471] underline underline-offset-4">{copy.related}</a>
        )}
      </div>
    </section>
  )
}
