type Lang = 'fr' | 'en' | 'ar'
type Bookmaker = 'linebet' | '1xbet' | 'melbet' | '888starz'

const BOOKMAKERS: Record<Bookmaker, { name: string; code: string }> = {
  linebet: { name: 'Linebet', code: 'VISION221' },
  '1xbet': { name: '1xBet', code: 'vipbtts' },
  melbet: { name: 'MelBet', code: 'Bttswin' },
  '888starz': { name: '888Starz', code: 'btts221' },
}

const COPY: Record<Lang, {
  offerTitle: string
  codeTitle: string
  intro: string
  conditions: string
  privacy: string
}> = {
  fr: {
    offerTitle: 'Avant d’utiliser cette offre',
    codeTitle: 'Comment vérifier le code',
    intro: 'Saisissez le code dans le champ prévu par le bookmaker. Ouvrir un lien ou télécharger une application ne confirme pas que le code a été appliqué.',
    conditions: 'Vérifiez auprès du bookmaker les règles applicables à votre pays et à votre compte : éligibilité, dépôt, plafond, exigences de mise et retraits. Les conditions peuvent varier.',
    privacy: 'Ne communiquez jamais votre mot de passe, votre PIN ou votre code de connexion.',
  },
  en: {
    offerTitle: 'Before using this offer',
    codeTitle: 'How to check the code',
    intro: 'Enter the code in the field provided by the bookmaker. Opening a link or downloading an app does not confirm that the code has been applied.',
    conditions: 'Check the rules for your country and account with the bookmaker, including eligibility, deposits, limits, wagering requirements and withdrawals. Terms may vary.',
    privacy: 'Never share your password, PIN or sign-in code.',
  },
  ar: {
    offerTitle: 'قبل استخدام هذا العرض',
    codeTitle: 'كيفية التحقق من الرمز',
    intro: 'أدخل الرمز في الحقل المخصص لدى شركة المراهنات. فتح رابط أو تنزيل تطبيق لا يؤكد تطبيق الرمز.',
    conditions: 'تحقق من الشروط الخاصة ببلدك وحسابك لدى الشركة، بما في ذلك الأهلية والإيداع والحدود ومتطلبات المراهنة والسحب. قد تختلف الشروط.',
    privacy: 'لا تشارك كلمة المرور أو رقم PIN أو رمز تسجيل الدخول مطلقًا.',
  },
}

export default function PromoVerificationGuide({ bookmaker, lang, variant = 'offer' }: {
  bookmaker: Bookmaker
  lang: Lang
  variant?: 'offer' | 'code'
}) {
  const copy = COPY[lang]
  const info = BOOKMAKERS[bookmaker]
  const heading = variant === 'code' ? copy.codeTitle : copy.offerTitle

  return (
    <section
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      aria-labelledby={`promo-check-${bookmaker}-${lang}`}
      data-promo-verification={`${bookmaker}-${lang}-${variant}`}
      className="mx-auto my-6 w-full max-w-3xl px-4 sm:px-6"
    >
      <div className="rounded-xl border border-white/10 bg-[#191919] p-4 sm:p-5">
        <p className="text-xs font-medium text-[#A4A4A4]">
          {info.name} · <bdi dir="ltr">{info.code}</bdi>
        </p>
        <h2 id={`promo-check-${bookmaker}-${lang}`} className="mt-2 text-base font-semibold text-white">
          {heading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#C5C5C5]">{copy.intro}</p>
        <p className="mt-2 text-sm leading-6 text-[#A4A4A4]">{copy.conditions}</p>
        <p className="mt-3 border-s-2 border-[#63D471] ps-3 text-xs leading-5 text-[#A4A4A4]">{copy.privacy}</p>
      </div>
    </section>
  )
}
