// ═══════════════════════════════════════════════════════════════════════════
// Libellés trilingues du système de pages « code promo » (fr / en / ar).
// i18n.ts étant gelé, ces clés vivent ici (même contrat que i18n-extras.ts).
// ═══════════════════════════════════════════════════════════════════════════

import type { Locale } from './i18n'

export interface PromoCopy {
  breadcrumbLabel: string
  eyebrow: string
  titlePrefix: string            // ex. « Code promo »
  titleSuffix: string            // ex. « Sénégal 2026 » ou « 2026 »
  genericBonus: string           // offre sans montant communiqué (ex. Melbet)
  introLine: string              // phrase sous le H1 (avec {brand} {code} {bonus})
  introLineGeneric: string       // variante quand aucun montant n'est communiqué
  offerBadge: string
  codeLabel: string
  codeCaseHint: (caps: boolean) => string
  copy: string
  copied: string
  signupCta: string              // « S'inscrire sur {brand} »
  apkCta: string                 // « Télécharger l'APK »
  instantCta: string             // bouton « Copier le code et s'inscrire »
  offerTitle: string
  offerDetails: { label: string; value: string }[]  // rempli par page (valeurs bookmaker)
  stepsTitle: string
  steps: { title: string; desc: string }[]
  whyTitle: string
  why: { title: string; desc: string }[]
  faqTitle: string
  faq: { q: string; a: string }[]
  responsible: string
  otherCodesTitle: string
  otherCodesSub: string
  verifiedNote: string
  payoutsLabel: string
  payouts: string[]
  depositsTitle: string
  depositsSub: string
}

const FR: PromoCopy = {
  breadcrumbLabel: 'Accueil',
  eyebrow: 'Code promo vérifié',
  titlePrefix: 'Code promo',
  titleSuffix: '2026',
  genericBonus: 'un bonus de bienvenue exclusif',
  introLine: 'Inscrivez-vous sur {brand} avec le code {code} : {bonus} et free spins sans condition de mise, dès {minDeposit} de dépôt.',
  introLineGeneric: 'Inscrivez-vous sur {brand} avec le code {code} pour activer l’offre de bienvenue affichée lors de votre premier dépôt (dès {minDeposit}).',
  offerBadge: 'Offre annoncée par la campagne',
  codeLabel: 'Code promo',
  codeCaseHint: (caps) => caps ? 'à saisir en majuscules — copiable' : 'à saisir exactement comme affiché — copiable',
  copy: 'Copier le code',
  copied: 'Code copié !',
  signupCta: 'S’inscrire sur {brand}',
  apkCta: 'Télécharger l’application (APK)',
  instantCta: 'Copier le code et s’inscrire',
  offerTitle: 'Détails de l’offre annoncée',
  offerDetails: [
    { label: 'Bonus de bienvenue', value: '{bonus} sur le premier dépôt' },
    { label: 'Free spins', value: '{freeSpins} offerts' },
    { label: 'Condition de mise', value: '{wagering}' },
    { label: 'Dépôt minimum', value: '{minDeposit}' },
    { label: 'Code promo', value: '{code}' },
  ],
  stepsTitle: 'Comment utiliser le code {code}',
  steps: [
    { title: 'Inscrivez-vous via notre lien', desc: 'Cliquez sur « S’inscrire sur {brand} ». La création du compte prend deux minutes, avec un e-mail ou un numéro de téléphone.' },
    { title: 'Saisissez le code {code}', desc: 'Pendant l’inscription (ou dans « Code promo » de votre compte), collez le code exactement comme affiché.' },
    { title: 'Effectuez votre premier dépôt', desc: 'Dès {minDeposit} via Mobile Money, Wave, Orange Money, carte bancaire ou crypto — selon les moyens disponibles dans votre pays.' },
    { title: 'Recevez le bonus + free spins', desc: 'Le bonus annoncé s’active sur votre premier dépôt. Les conditions exactes sont affichées par {brand} avant validation.' },
  ],
  whyTitle: 'Pourquoi choisir {brand} ?',
  why: [
    { title: 'Bonus doublé via le code', desc: 'Le code {code} active l’offre annoncée par la campagne partenaire — au lieu de vous inscrire sans code.' },
    { title: 'Dépôts locaux acceptés', desc: 'Mobile Money, Wave, Orange Money et cartes — déposez comme vous le faites déjà chaque jour.' },
    { title: 'Application Android & iOS', desc: 'L’APK officiel s’installe en deux minutes et l’application reste légère même sur petits téléphones.' },
    { title: 'Pronostics BTTSPredict inclus', desc: 'Chaque jour, nos sélections BTTS et Over 2.5 restent gratuites — utilisez-les directement sur {brand}.' },
  ],
  faqTitle: 'Questions fréquentes',
  faq: [
    { q: 'Où saisir le code promo {code} ?', a: 'Champ « Code promo » du formulaire d’inscription, ou section « Code promo » de votre compte {brand} après l’inscription. Copiez-le depuis cette page pour éviter toute erreur de saisie.' },
    { q: 'Le code {code} est-il gratuit ?', a: 'Oui. Le code ne coûte rien et ne vous engage à rien : il active simplement l’offre de bienvenue annoncée lors de votre premier dépôt.' },
    { q: 'Puis-je déposer via Orange Money ou Wave ?', a: '{brand} accepte selon le pays les dépôts Mobile Money, Wave, Orange Money, cartes bancaires et cryptomonnaies, dès {minDeposit}. La liste exacte s’affiche dans la caisse de votre compte.' },
    { q: 'Le bonus est-il garanti ?', a: 'Non. Le bonus, son montant et ses conditions sont déterminés et affichés par {brand}. Vérifiez toujours l’offre affichée par l’opérateur avant tout dépôt — les conditions commerciales peuvent changer.' },
  ],
  responsible: '18+ · Les paris sportifs comportent un risque de perte. Les offres partenaires sont annoncées par les opérateurs et peuvent changer : vérifiez les conditions affichées lors de votre inscription. Aucun résultat futur n’est garanti.',
  otherCodesTitle: 'Tous les codes promo BTTSPredict',
  otherCodesSub: 'Un code par bookmaker partenaire, vérifié manuellement. Linebet et 1xBet sont nos partenaires prioritaires.',
  verifiedNote: 'Code vérifié manuellement le',
  payoutsLabel: 'Retraits',
  payouts: ['Mobile Money', 'Wave', 'Orange Money', 'Carte bancaire', 'Crypto'],
  depositsTitle: 'Moyens de dépôt',
  depositsSub: 'Dès {minDeposit} — les moyens exacts dépendent de votre pays.',
}

const EN: PromoCopy = {
  breadcrumbLabel: 'Home',
  eyebrow: 'Verified promo code',
  titlePrefix: 'Promo code',
  titleSuffix: '2026',
  genericBonus: 'an exclusive welcome bonus',
  introLine: 'Sign up on {brand} with code {code}: {bonus} and free spins with no wagering requirements, from a {minDeposit} deposit.',
  introLineGeneric: 'Sign up on {brand} with code {code} to activate the welcome offer displayed on your first deposit (from {minDeposit}).',
  offerBadge: 'Offer announced by the campaign',
  codeLabel: 'Promo code',
  codeCaseHint: (caps) => caps ? 'type it in capitals — copyable' : 'type it exactly as shown — copyable',
  copy: 'Copy code',
  copied: 'Code copied!',
  signupCta: 'Sign up on {brand}',
  apkCta: 'Download the app (APK)',
  instantCta: 'Copy code & sign up',
  offerTitle: 'Announced offer details',
  offerDetails: [
    { label: 'Welcome bonus', value: '{bonus} on your first deposit' },
    { label: 'Free spins', value: '{freeSpins} included' },
    { label: 'Wagering requirement', value: '{wagering}' },
    { label: 'Minimum deposit', value: '{minDeposit}' },
    { label: 'Promo code', value: '{code}' },
  ],
  stepsTitle: 'How to use code {code}',
  steps: [
    { title: 'Sign up via our link', desc: 'Click “Sign up on {brand}”. Creating an account takes two minutes with an email or phone number.' },
    { title: 'Enter code {code}', desc: 'During sign-up (or in the “Promo code” section of your account), paste the code exactly as displayed.' },
    { title: 'Make your first deposit', desc: 'From {minDeposit} via Mobile Money, Wave, Orange Money, card or crypto — depending on what is available in your country.' },
    { title: 'Receive the bonus + free spins', desc: 'The announced bonus is activated on your first deposit. Exact terms are displayed by {brand} before confirmation.' },
  ],
  whyTitle: 'Why choose {brand}?',
  why: [
    { title: 'Boosted bonus via the code', desc: 'Code {code} activates the offer announced by the partner campaign — instead of signing up without a code.' },
    { title: 'Local deposit methods', desc: 'Mobile Money, Wave, Orange Money and cards — deposit the way you already do every day.' },
    { title: 'Android & iOS app', desc: 'The official APK installs in two minutes and stays light even on small phones.' },
    { title: 'BTTSPredict picks included', desc: 'Every day, our BTTS and Over 2.5 selections stay free — use them directly on {brand}.' },
  ],
  faqTitle: 'Frequently asked questions',
  faq: [
    { q: 'Where do I enter promo code {code}?', a: 'In the “Promo code” field of the sign-up form, or in the “Promo code” section of your {brand} account after registering. Copy it from this page to avoid typos.' },
    { q: 'Is code {code} free?', a: 'Yes. The code costs nothing and commits you to nothing: it simply activates the announced welcome offer on your first deposit.' },
    { q: 'Can I deposit with Orange Money or Wave?', a: '{brand} accepts, depending on the country, Mobile Money, Wave, Orange Money, bank cards and cryptocurrencies, from {minDeposit}. The exact list is shown in your account cashier.' },
    { q: 'Is the bonus guaranteed?', a: 'No. The bonus, its amount and its conditions are set and displayed by {brand}. Always check the offer displayed by the operator before depositing — commercial terms may change.' },
  ],
  responsible: '18+ · Sports betting carries a risk of loss. Partner offers are announced by the operators and may change: check the terms displayed at sign-up. No future result is guaranteed.',
  otherCodesTitle: 'All BTTSPredict promo codes',
  otherCodesSub: 'One code per partner bookmaker, verified manually. Linebet and 1xBet are our priority partners.',
  verifiedNote: 'Code manually verified on',
  payoutsLabel: 'Withdrawals',
  payouts: ['Mobile Money', 'Wave', 'Orange Money', 'Bank card', 'Crypto'],
  depositsTitle: 'Deposit methods',
  depositsSub: 'From {minDeposit} — exact methods depend on your country.',
}

const AR: PromoCopy = {
  breadcrumbLabel: 'الرئيسية',
  eyebrow: 'رمز ترويجي موثق',
  titlePrefix: 'الرمز الترويجي',
  titleSuffix: '2026',
  genericBonus: 'مكافأة ترحيب حصرية',
  introLine: 'سجّل في {brand} بالرمز {code}: مكافأة {bonus} ولفات مجانية بدون شروط مراهنة، بدءاً من إيداع {minDeposit}.',
  introLineGeneric: 'سجّل في {brand} بالرمز {code} لتفعيل عرض الترحيب المعروض عند أول إيداع (من {minDeposit}).',
  offerBadge: 'عرض معلن من الحملة',
  codeLabel: 'الرمز الترويجي',
  codeCaseHint: (caps) => caps ? 'يُكتب بأحرف كبيرة — قابل للنسخ' : 'يُكتب تماماً كما هو معروض — قابل للنسخ',
  copy: 'نسخ الرمز',
  copied: 'تم نسخ الرمز!',
  signupCta: 'التسجيل في {brand}',
  apkCta: 'تحميل التطبيق (APK)',
  instantCta: 'نسخ الرمز والتسجيل',
  offerTitle: 'تفاصيل العرض المعلن',
  offerDetails: [
    { label: 'مكافأة الترحيب', value: '{bonus} على أول إيداع' },
    { label: 'لفات مجانية', value: '{freeSpins} مجاناً' },
    { label: 'شرط المراهنة', value: '{wagering}' },
    { label: 'الحد الأدنى للإيداع', value: '{minDeposit}' },
    { label: 'الرمز الترويجي', value: '{code}' },
  ],
  stepsTitle: 'كيفية استخدام الرمز {code}',
  steps: [
    { title: 'سجّل عبر رابطنا', desc: 'اضغط على « التسجيل في {brand} ». إنشاء الحساب يستغرق دقيقتين بالبريد الإلكتروني أو رقم الهاتف.' },
    { title: 'أدخل الرمز {code}', desc: 'أثناء التسجيل (أو في قسم « الرمز الترويجي » في حسابك)، الصق الرمز تماماً كما هو معروض.' },
    { title: 'قم بأول إيداع', desc: 'من {minDeposit} عبر Mobile Money أو Wave أو Orange Money أو البطاقة البنكية أو العملات الرقمية — حسب المتاح في بلدك.' },
    { title: 'استلم المكافأة واللفات المجانية', desc: 'تُفعَّل المكافأة المعلنة على أول إيداع. الشروط الدقيقة يعرضها {brand} قبل التأكيد.' },
  ],
  whyTitle: 'لماذا تختار {brand}؟',
  why: [
    { title: 'مكافأة مضاعفة بالرمز', desc: 'الرمز {code} يفعّل العرض المعلن من الحملة الشريكة — بدلاً من التسجيل بدون رمز.' },
    { title: 'وسائل إيداع محلية', desc: 'Mobile Money وWave وOrange Money والبطاقات — أودع بالطريقة التي تستخدمها يومياً.' },
    { title: 'تطبيق أندرويد و iOS', desc: 'ملف APK الرسمي يُثبَّت في دقيقتين ويبقى خفيفاً حتى على الهواتف الصغيرة.' },
    { title: 'توقعات BTTSPredict مجانية', desc: 'كل يوم تبقى توقعاتنا BTTS وOver 2.5 مجانية — استخدمها مباشرة على {brand}.' },
  ],
  faqTitle: 'الأسئلة الشائعة',
  faq: [
    { q: 'أين أدخل الرمز الترويجي {code}؟', a: 'في حقل « الرمز الترويجي » بنموذج التسجيل، أو في قسم « الرمز الترويجي » في حسابك على {brand} بعد التسجيل. انسخه من هذه الصفحة لتجنب أي خطأ.' },
    { q: 'هل الرمز {code} مجاني؟', a: 'نعم. الرمز لا يكلفك شيئاً ولا يلزمك بأي التزام: يفعّل فقط عرض الترحيب المعلن على أول إيداع.' },
    { q: 'هل يمكنني الإيداع عبر Orange Money أو Wave؟', a: 'يقبل {brand} حسب البلد الإيداع عبر Mobile Money وWave وOrange Money والبطاقات البنكية والعملات الرقمية، من {minDeposit}. القائمة الدقيقة تظهر في صندوق حسابك.' },
    { q: 'هل المكافأة مضمونة؟', a: 'لا. المكافأة ومبلغها وشروطها تحددها ويعرضها {brand}. تحقق دائماً من العرض المعروض من المشغّل قبل الإيداع — الشروط التجارية قد تتغير.' },
  ],
  responsible: '18+ · المراهنات الرياضية تنطوي على خطر الخسارة. العروض الشريكة معلنة من المشغّلين وقد تتغير: تحقق من الشروط المعروضة عند التسجيل. لا ضمانات لأي نتيجة مستقبلية.',
  otherCodesTitle: 'جميع الرموز الترويجية من BTTSPredict',
  otherCodesSub: 'رمز واحد لكل مساعد رياضي شريك، موثق يدوياً. Linebet و1xBet شريكان ذو أولوية.',
  verifiedNote: 'رمز موثق يدوياً في',
  payoutsLabel: 'السحوبات',
  payouts: ['Mobile Money', 'Wave', 'Orange Money', 'بطاقة بنكية', 'عملات رقمية'],
  depositsTitle: 'وسائل الإيداع',
  depositsSub: 'من {minDeposit} — الوسائل الدقيقة تعتمد على بلدك.',
}

export const PROMO_I18N: Record<Locale, PromoCopy> = { fr: FR, en: EN, ar: AR }

/** Remplace les jetons {brand} {code} {bonus} {freeSpins} {wagering} {minDeposit}. */
export function fillTokens(
  template: string,
  vars: { brand: string; code: string; bonus: string; freeSpins: string; wagering: string; minDeposit: string },
): string {
  return template
    .replaceAll('{brand}', vars.brand)
    .replaceAll('{code}', vars.code)
    .replaceAll('{bonus}', vars.bonus)
    .replaceAll('{freeSpins}', vars.freeSpins)
    .replaceAll('{wagering}', vars.wagering)
    .replaceAll('{minDeposit}', vars.minDeposit)
}
