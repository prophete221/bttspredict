'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { localizedPath, type Locale } from '@/lib/i18n'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import VipWinHistory from './VipWinHistory'
import VipLockedPicks from './VipLockedPicks'
import './vip.css'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

/* ────────────────────────── Icônes inline ────────────────────────── */

const Icon = {
  shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10z" /></svg>
  ),
  eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  copy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
  ),
  lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  crown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 18h20M4 18l-1.5-9 5.5 4 4-7 4 7 5.5-4L20 18" /></svg>
  ),
  whatsapp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01-1.87-1.87-4.36-2.91-7.01-2.91zm0 1.67c2.2 0 4.27.86 5.82 2.42 1.56 1.56 2.42 3.63 2.42 5.82 0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.81-1.29-1.24-2.79-1.24-4.34 0-4.54 3.7-8.24 8.24-8.24z" /><path d="M9.1 7.3c-.2-.45-.42-.46-.6-.47l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24 0 1.32.96 2.6 1.1 2.78.13.18 1.88 3 4.6 4.09 2.27.9 2.73.72 3.23.68.5-.05 1.6-.65 1.82-1.29.23-.63.23-1.17.16-1.29-.07-.11-.25-.18-.52-.32-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.72-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.6-1.47-.83-2.01z" /></svg>
  ),
  spark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg>
  ),
  target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
  ),
  chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18" /><path d="M7 15l4-6 4 3 5-8" /></svg>
  ),
  users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
}

type VipPageText = {
  eyebrow: string; freeLink: string; trust1: string; trust2: string
  memberTop: string; memberKind: string; memberPerks: string; memberVerified: string
  benefitsEyebrow: string; benefitsTitle: string
  b1Title: string; b1Desc: string; b2Title: string; b2Desc: string
  b3Title: string; b3Desc: string; b4Title: string; b4Desc: string
  b5Title: string; b5Desc: string; b6Title: string; b6Desc: string
  trustEyebrow: string; trustTitle: string; trustDesc: string; trustLink: string
  faqTitle: string; faq1Q: string; faq1A: string; faq2Q: string; faq2A: string
  faq3Q: string; faq3A: string; faq4Q: string; faq4A: string; faq5Q: string; faq5A: string
  finalTitle: string; finalDesc: string; responsible: string; footerNote: string
}

const VIP_PAGE_COPY: Record<Locale, VipPageText> = {
  fr: {
    eyebrow: 'Accès VIP privé', freeLink: 'Pronostics gratuits', trust1: 'Scores vérifiés ESPN',
    trust2: 'Historique VIP',
    memberTop: 'BTTSPredict', memberKind: 'Discovery · 7 jours gratuits · VIP Pro sur abonnement',
    memberPerks: 'Pronostics · Statistiques complètes · Notifications · Alertes de signaux',
    memberVerified: 'Accès selon la formule active',
    benefitsEyebrow: 'Espace VIP',
    benefitsTitle: 'Discovery gratuit pendant 7 jours, puis VIP Pro sur abonnement : pronostics, statistiques et alertes',
    b1Title: 'Discovery — 7 jours gratuits', b1Desc: 'Un essai de découverte unique par compte, avec une durée limitée de 7 jours.',
    b2Title: 'Pronostics VIP', b2Desc: 'Les pronostics à venir restent masqués dans l’espace public et accessibles selon les droits actifs du compte.',
    b3Title: 'Statistiques complètes', b3Desc: 'Les statistiques complètes sont réservées aux comptes dont l’accès VIP est actif; aucun chiffre de performance n’est promis ici.',
    b4Title: 'Notifications', b4Desc: 'Les notifications sont réservées aux comptes dont l’accès VIP est actif.',
    b5Title: 'Alertes de signaux', b5Desc: 'Les alertes de signaux sont réservées aux comptes dont l’accès VIP est actif.',
    b6Title: 'Activation sécurisée', b6Desc: 'Les droits sont activés uniquement après authentification et vérification côté serveur.',
    trustEyebrow: 'Confiance & transparence', trustTitle: 'Vérifiable — pas des promesses',
    trustDesc: 'Les pronostics publics restent consultables avec leurs résultats. Aucun gain n’est garanti; les paris sportifs comportent des risques.', trustLink: 'Historique VIP',
    faqTitle: 'Questions fréquentes',
    faq1Q: 'Les offres sont-elles identiques partout ?', faq1A: 'Non. Les informations et conditions peuvent varier selon l’opérateur et le pays. Consulte le guide dédié et les informations actuelles de l’opérateur.',
    faq2Q: 'Où trouver le code promo ?', faq2A: 'Le code exact de chaque partenaire figure sur son guide dédié. Cette page VIP générale ne révèle pas de code.',
    faq3Q: 'Comment l’accès est-il activé ?', faq3A: 'Discovery sera activé une seule fois pour 7 jours. VIP Pro sera activé uniquement après confirmation serveur du paiement.',
    faq4Q: 'Faut-il un compte bookmaker ?', faq4A: 'Non. Le nouveau VIP fonctionnera avec un compte BTTSPredict. Aucun identifiant bookmaker, capture de dépôt ou mot de passe bookmaker ne sera demandé.',
    faq5Q: 'Des gains sont-ils garantis ?', faq5A: 'Non. Aucun résultat n’est garanti dans les paris sportifs. Ne mise jamais plus que ce que tu peux te permettre de perdre (18+).',
    finalTitle: 'Nouveau VIP en préparation', finalDesc: 'Discovery 7 jours et VIP Pro arrivent avec une authentification et une vérification de paiement sécurisées. Aucun dépôt bookmaker n’est demandé et aucun paiement n’est collecté depuis cette page pour le moment.',
    responsible: '18+ · Les paris sportifs comportent des risques. Aucun gain n’est garanti. Joue de manière responsable.',
    footerNote: 'BTTSPredict est un site d’information et d’affiliation : il ne prend pas de paris et ne collecte pas de fonds.',
  },
  en: {
    eyebrow: 'Private VIP access', freeLink: 'Free predictions', trust1: 'Scores checked against ESPN',
    trust2: 'VIP history',
    memberTop: 'BTTSPredict', memberKind: 'Discovery · 7 days free · VIP Pro subscription',
    memberPerks: 'VIP picks · Full stats · Notifications · Signal alerts',
    memberVerified: 'Access follows the active plan',
    benefitsEyebrow: 'VIP area',
    benefitsTitle: '7 days of free Discovery, followed by a paid VIP Pro subscription: picks, stats and alerts',
    b1Title: 'Discovery — 7 days free', b1Desc: 'One 7-day Discovery trial per account, with server-controlled expiry.',
    b2Title: 'VIP picks', b2Desc: 'Upcoming picks stay hidden from the public area and are available according to the account’s active entitlement.',
    b3Title: 'Full stats', b3Desc: 'Full statistics are reserved for accounts with an active VIP entitlement; no performance figures are promised here.',
    b4Title: 'Notifications', b4Desc: 'Notifications are reserved for accounts with active VIP access.',
    b5Title: 'Signal alerts', b5Desc: 'Signal alerts are reserved for accounts with active VIP access.',
    b6Title: 'Secure activation', b6Desc: 'Access is enabled only after authentication and server-side entitlement verification.',
    trustEyebrow: 'Trust & transparency', trustTitle: 'Verifiable, not promised',
    trustDesc: 'Public predictions and their results remain available to review. No win is guaranteed; sports betting carries risk.', trustLink: 'VIP history',
    faqTitle: 'Frequently asked questions',
    faq1Q: 'Are offers the same everywhere?', faq1A: 'No. Information and terms may vary by operator and country. Check the dedicated guide and the operator’s current information.',
    faq2Q: 'Where do I find the promo code?', faq2A: 'Each partner’s exact code is on its dedicated guide. This general VIP page does not reveal codes.',
    faq3Q: 'How is access activated?', faq3A: 'Discovery will be activated once for 7 days. VIP Pro will be enabled only after server-confirmed payment.',
    faq4Q: 'Do I need a bookmaker account?', faq4A: 'No. The new VIP will use a BTTSPredict account. No bookmaker ID, deposit screenshot or bookmaker password will be requested.',
    faq5Q: 'Are wins guaranteed?', faq5A: 'No. No sports betting result is guaranteed. Never bet more than you can afford to lose (18+).',
    finalTitle: 'New VIP access coming soon', finalDesc: 'Discovery 7 days and VIP Pro are being prepared with secure authentication and payment verification. No bookmaker deposit is required and no payment is collected from this page yet.',
    responsible: '18+ · Sports betting carries risk. No wins are guaranteed. Please play responsibly.',
    footerNote: 'BTTSPredict is an information and affiliate site: it does not accept bets or collect funds.',
  },
  ar: {
    eyebrow: 'وصول VIP خاص', freeLink: 'التوقعات المجانية', trust1: 'نتائج متحققة من ESPN',
    trust2: 'سجل VIP',
    memberTop: 'BTTSPredict', memberKind: 'Discovery · 7 أيام مجاناً · اشتراك VIP Pro',
    memberPerks: 'توقعات VIP · إحصاءات كاملة · إشعارات · تنبيهات الإشارات',
    memberVerified: 'الوصول حسب الخطة النشطة',
    benefitsEyebrow: 'مساحة VIP',
    benefitsTitle: 'اكتشف الخدمة مجاناً لمدة 7 أيام، ثم اشترك في VIP Pro للتوقعات والإحصاءات والتنبيهات',
    b1Title: 'Discovery — 7 أيام مجاناً', b1Desc: 'تجربة اكتشاف واحدة لكل حساب، لمدة 7 أيام مع انتهاء صلاحية من جهة الخادم.',
    b2Title: 'توقعات VIP', b2Desc: 'تبقى التوقعات القادمة مخفية عن المساحة العامة وتتاح وفق صلاحية الحساب النشطة.',
    b3Title: 'إحصاءات كاملة', b3Desc: 'الإحصاءات الكاملة مخصصة للحسابات التي لديها صلاحية VIP نشطة؛ لا نعد هنا بأرقام أداء.',
    b4Title: 'الإشعارات', b4Desc: 'الإشعارات مخصصة للحسابات التي لديها وصول VIP نشط.',
    b5Title: 'تنبيهات الإشارات', b5Desc: 'تنبيهات الإشارات مخصصة للحسابات التي لديها وصول VIP نشط.',
    b6Title: 'تفعيل آمن', b6Desc: 'يتم تفعيل الوصول فقط بعد التحقق من الهوية والصلاحية على الخادم.',
    trustEyebrow: 'الثقة والشفافية', trustTitle: 'قابل للتحقق — بلا وعود',
    trustDesc: 'يمكن مراجعة التوقعات العامة ونتائجها. لا توجد أرباح مضمونة؛ وتنطوي المراهنات الرياضية على مخاطر.', trustLink: 'سجل VIP',
    faqTitle: 'الأسئلة الشائعة',
    faq1Q: 'هل العروض متطابقة في كل مكان؟', faq1A: 'لا. قد تختلف المعلومات والشروط حسب المشغل والبلد. راجع الدليل المخصص والمعلومات الحالية لدى المشغل.',
    faq2Q: 'أين أجد الرمز الترويجي؟', faq2A: 'يوجد الرمز الدقيق لكل شريك في دليله المخصص. لا تكشف صفحة VIP العامة هذه الرموز.',
    faq3Q: 'كيف يتم تفعيل الوصول؟', faq3A: 'يتم تفعيل Discovery مرة واحدة لمدة 7 أيام. ولا يتم تفعيل VIP Pro إلا بعد تأكيد الدفع من الخادم.',
    faq4Q: 'هل أحتاج إلى حساب مراهنات؟', faq4A: 'لا. سيعمل VIP الجديد بحساب BTTSPredict. لن نطلب معرّف شركة مراهنات أو صورة إيداع أو كلمة مرور المراهنات.',
    faq5Q: 'هل الأرباح مضمونة؟', faq5A: 'لا. لا توجد نتيجة مضمونة في المراهنات الرياضية. لا تراهن بأكثر مما يمكنك تحمل خسارته (18+).',
    finalTitle: 'نظام VIP الجديد قيد الإعداد', finalDesc: 'نعمل على Discovery لمدة 7 أيام وVIP Pro مع مصادقة آمنة والتحقق من الدفع. لا يُطلب إيداع لدى شركة مراهنات ولا يتم تحصيل أي دفعة من هذه الصفحة حالياً.',
    responsible: '18+ · تنطوي المراهنات الرياضية على مخاطر. لا توجد أرباح مضمونة. العب بمسؤولية.',
    footerNote: 'BTTSPredict موقع معلومات وتسويق بالعمولة: لا يقبل الرهانات ولا يجمع الأموال.',
  },
}

/* ────────────── Plans Discovery / VIP Pro ────────────── */
type VipPlanCopy = {
  eyebrow: string; title: string; sub: string
  discoveryName: string; discoveryBadge: string; discoveryPrice: string; discoveryDesc: string
  discoveryFeatures: string[]
  proName: string; proBadge: string; proPrice: string; proDesc: string
  proFeatures: string[]
  statusTitle: string; statusText: string; unavailable: string
  heroCta: string; finalCta: string; note: string
}

const VIP_PLAN_COPY: Record<Locale, VipPlanCopy> = {
  fr: {
    eyebrow: 'Formules VIP', title: 'Choisis ton niveau d’accès',
    sub: 'Discovery permet de découvrir l’espace pendant 7 jours. VIP Pro donnera accès aux fonctionnalités premium avec un abonnement payant.',
    discoveryName: 'Discovery', discoveryBadge: '7 jours gratuits', discoveryPrice: 'Gratuit · 7 jours',
    discoveryDesc: 'Une période de découverte unique par compte BTTSPredict, avec expiration automatique.',
    discoveryFeatures: ['Découverte de l’espace VIP', 'Accès limité dans le temps', 'Aucun dépôt bookmaker demandé'],
    proName: 'VIP Pro', proBadge: 'Abonnement premium', proPrice: 'Tarif affiché avant paiement',
    proDesc: 'L’expérience complète pour les membres qui souhaitent conserver leur accès premium.',
    proFeatures: ['Pronostics et analyses VIP', 'Statistiques et historique premium', 'Notifications et alertes', 'Renouvellement et expiration gérés côté serveur'],
    statusTitle: 'Nouveau système en préparation',
    statusText: 'L’authentification, l’essai Discovery et la vérification sécurisée des paiements Pro doivent être activés avant l’ouverture des inscriptions.',
    unavailable: 'Bientôt disponible', heroCta: 'Voir les formules', finalCta: 'Ouverture prochaine',
    note: 'Aucun paiement n’est accepté pour le moment. Ne verse aucun dépôt à un bookmaker pour obtenir un accès BTTSPredict.',
  },
  en: {
    eyebrow: 'VIP plans', title: 'Choose your access level',
    sub: 'Discovery lets you explore the area for 7 days. VIP Pro will provide premium features through a paid subscription.',
    discoveryName: 'Discovery', discoveryBadge: '7 days free', discoveryPrice: 'Free · 7 days',
    discoveryDesc: 'One Discovery period per BTTSPredict account, with automatic expiry.',
    discoveryFeatures: ['Explore the VIP area', 'Time-limited access', 'No bookmaker deposit required'],
    proName: 'VIP Pro', proBadge: 'Premium subscription', proPrice: 'Price shown before payment',
    proDesc: 'The complete experience for members who want to keep premium access.',
    proFeatures: ['VIP picks and analysis', 'Premium statistics and history', 'Notifications and alerts', 'Server-managed renewal and expiry'],
    statusTitle: 'New system in preparation',
    statusText: 'Authentication, the Discovery trial and secure Pro payment verification must be enabled before registration opens.',
    unavailable: 'Coming soon', heroCta: 'View plans', finalCta: 'Opening soon',
    note: 'Payments are not accepted yet. Do not make a bookmaker deposit to obtain BTTSPredict access.',
  },
  ar: {
    eyebrow: 'خطط VIP', title: 'اختر مستوى الوصول',
    sub: 'تتيح لك Discovery استكشاف المساحة لمدة 7 أيام. وستوفر VIP Pro الميزات المميزة عبر اشتراك مدفوع.',
    discoveryName: 'Discovery', discoveryBadge: '7 أيام مجاناً', discoveryPrice: 'مجاناً · 7 أيام',
    discoveryDesc: 'فترة تجربة واحدة لكل حساب BTTSPredict مع انتهاء تلقائي للصلاحية.',
    discoveryFeatures: ['استكشاف مساحة VIP', 'وصول محدود المدة', 'لا حاجة إلى إيداع لدى شركة مراهنات'],
    proName: 'VIP Pro', proBadge: 'اشتراك مميز', proPrice: 'سيظهر السعر قبل الدفع',
    proDesc: 'التجربة الكاملة للأعضاء الذين يرغبون في الاحتفاظ بالوصول المميز.',
    proFeatures: ['توقعات وتحليلات VIP', 'إحصاءات وسجل مميز', 'إشعارات وتنبيهات', 'إدارة التجديد والانتهاء على الخادم'],
    statusTitle: 'النظام الجديد قيد الإعداد',
    statusText: 'يجب تفعيل المصادقة وتجربة Discovery والتحقق الآمن من مدفوعات Pro قبل فتح التسجيل.',
    unavailable: 'قريباً', heroCta: 'عرض الخطط', finalCta: 'الافتتاح قريباً',
    note: 'لا نقبل المدفوعات حالياً. لا تقم بإيداع لدى شركة مراهنات للحصول على وصول BTTSPredict.',
  },
}

export default function VipPage() {
  const { lang: detectedLang } = useLanguage()
  const lang: Locale = detectedLang

  const text = VIP_PAGE_COPY[lang]
  const flow = VIP_PLAN_COPY[lang]

  /* Mesure : 1 visite de la page VIP par session (visite ≠ clic ≠ inscription) */
  useEffect(() => {
    trackAffiliateAction('platform', 'vip_page_view', 'vip-page-visit')
  }, [])

  const openVipFlow = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()
    document.getElementById('vip-plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="vipx" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content">
        <div className="vipx-page-topline vipx-shell">
          <div className="vipx-page-topline__crumbs"><span>{text.memberTop}</span><span aria-hidden="true">/</span><strong>VIP</strong></div>
          <span className="vipx-page-topline__label"><i aria-hidden="true" />{text.eyebrow}</span>
        </div>

        {/* ═══════════ HERO ═══════════ */}
        <section className="vipx-hero">
          <div className="vipx-hero__aura" aria-hidden="true" />
          <div className="vipx-hero__grid vipx-shell">
            <div className="vipx-hero__copy">
              <span className="vipx-eyebrow"><i aria-hidden="true" />{text.eyebrow}</span>
              <AnimatedTitle as="h1" text={flow.title} accentColor="#E8C97A" />
              <p className="vipx-hero__sub">{flow.sub}</p>
              <div className="vipx-hero__cta">
                <a className="vipx-btn vipx-btn--gold" href="#vip-plans" onClick={openVipFlow}>{flow.heroCta}<span aria-hidden="true">→</span></a>
                <a className="vipx-btn vipx-btn--ghost" href="#historique-vip">{text.trustLink}<span aria-hidden="true">↘</span></a>
              </div>
              <a className="vipx-hero__free-link" href={localizedPath('/btts/predictions/today', lang)}>{text.freeLink}<span aria-hidden="true">↗</span></a>
              <p className="vipx-hero__note">{text.memberKind}</p>
              <ul className="vipx-hero__trust">
                <li><Icon.shield />{text.trust1}</li>
                <li><Icon.eye />{text.trust2}</li>
              </ul>
            </div>

            {/* La vidéo occupe le panneau hero encadré, juste avant l’aperçu VIP. */}
            <div className="vipx-hero__card">
              <video
                className="vipx-hero__video"
                controls
                preload="metadata"
                playsInline
                poster="/videos/vip-parcours-poster.jpg"
                aria-label={lang === 'fr' ? 'Vidéo du parcours VIP en français' : lang === 'en' ? 'French-language VIP walkthrough video' : 'فيديو شرح VIP باللغة الفرنسية'}
                data-testid="vip-hero-walkthrough-video"
              >
                <source src="/videos/vip-parcours.mp4" type="video/mp4" />
                {lang === 'ar' ? 'المتصفح لا يدعم تشغيل الفيديو.' : lang === 'en' ? 'Your browser does not support video playback.' : 'Ton navigateur ne prend pas en charge la lecture vidéo.'}
              </video>
            </div>
          </div>
        </section>

        <div className="vipx-content-grid vipx-shell">
          <div className="vipx-content-grid__main">
            <VipLockedPicks onViewPlans={openVipFlow} />
          </div>
          <aside className="vipx-content-grid__aside" aria-label={flow.eyebrow}>
        {/* ═══════════ DISCOVERY / VIP PRO PLANS ═══════════ */}
        <section id="vip-plans" className="vipx-flow vipx-flow--card" aria-labelledby="vip-flow-heading" style={{ scrollMarginTop: '96px' }}>
          <header className="vipx-section-head">
            <span className="vipx-eyebrow"><i aria-hidden="true" />{flow.eyebrow}</span>
            <h2 id="vip-flow-heading">{flow.title}</h2>
            <p>{flow.sub}</p>
          </header>

          <div className="vipx-flow__status" role="status">
            <Icon.lock />
            <div>
              <strong>{flow.statusTitle}</strong>
              <span>{flow.statusText}</span>
            </div>
          </div>

          <div className="vipx-plans-grid">
            <article className="vipx-plan-card">
              <div className="vipx-plan-card__top">
                <span className="vipx-plan-card__badge">{flow.discoveryBadge}</span>
                <Icon.spark />
              </div>
              <h3>{flow.discoveryName}</h3>
              <p className="vipx-plan-card__price">{flow.discoveryPrice}</p>
              <p className="vipx-plan-card__description">{flow.discoveryDesc}</p>
              <ul>
                {flow.discoveryFeatures.map((feature) => <li key={feature}><Icon.check />{feature}</li>)}
              </ul>
              <button type="button" className="vipx-btn vipx-btn--ghost vipx-btn--block" disabled>{flow.unavailable}</button>
            </article>

            <article className="vipx-plan-card vipx-plan-card--pro">
              <div className="vipx-plan-card__top">
                <span className="vipx-plan-card__badge">{flow.proBadge}</span>
                <Icon.crown />
              </div>
              <h3>{flow.proName}</h3>
              <p className="vipx-plan-card__price">{flow.proPrice}</p>
              <p className="vipx-plan-card__description">{flow.proDesc}</p>
              <ul>
                {flow.proFeatures.map((feature) => <li key={feature}><Icon.check />{feature}</li>)}
              </ul>
              <button type="button" className="vipx-btn vipx-btn--gold vipx-btn--block" disabled>{flow.unavailable}</button>
            </article>
          </div>
          <p className="vipx-plans__note">{flow.note}</p>
        </section>
          </aside>
        </div>

        {/* Historique passé uniquement; l’accès aux pronostics à venir reste verrouillé. */}
        <VipWinHistory onViewPlans={openVipFlow} />

        {/* ═══════════ BÉNÉFICES ═══════════ */}
        <section className="vipx-benefits vipx-shell">
          <header className="vipx-section-head">
            <span className="vipx-eyebrow"><i aria-hidden="true" />{text.benefitsEyebrow}</span>
            <h2>{text.benefitsTitle}</h2>
          </header>
          <div className="vipx-benefits__grid">
            <article><span className="vipx-benefits__icon"><Icon.spark /></span><h3>{text.b1Title}</h3><p>{text.b1Desc}</p></article>
            <article><span className="vipx-benefits__icon"><Icon.lock /></span><h3>{text.b2Title}</h3><p>{text.b2Desc}</p></article>
            <article><span className="vipx-benefits__icon"><Icon.target /></span><h3>{text.b3Title}</h3><p>{text.b3Desc}</p></article>
            <article><span className="vipx-benefits__icon"><Icon.eye /></span><h3>{text.b4Title}</h3><p>{text.b4Desc}</p></article>
            <article><span className="vipx-benefits__icon"><Icon.chart /></span><h3>{text.b5Title}</h3><p>{text.b5Desc}</p></article>
            <article><span className="vipx-benefits__icon"><Icon.users /></span><h3>{text.b6Title}</h3><p>{text.b6Desc}</p></article>
          </div>
        </section>

        {/* ═══════════ CONFIANCE ═══════════ */}
        <section className="vipx-trust vipx-shell">
          <div className="vipx-trust__card">
            <span className="vipx-eyebrow"><i aria-hidden="true" />{text.trustEyebrow}</span>
            <h2>{text.trustTitle}</h2>
            <p>{text.trustDesc}</p>
            <a className="vipx-btn vipx-btn--ghost" href="#historique-vip">{text.trustLink}<span aria-hidden="true">→</span></a>
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="vipx-faq vipx-shell">
          <header className="vipx-section-head">
            <h2>{text.faqTitle}</h2>
          </header>
          <div className="vipx-faq__list">
            <details>
              <summary>{text.faq1Q}</summary>
              <p>{text.faq1A}</p>
            </details>
            <details>
              <summary>{text.faq2Q}</summary>
              <p>{text.faq2A}</p>
            </details>
            <details>
              <summary>{text.faq3Q}</summary>
              <p>{text.faq3A}</p>
            </details>
            <details>
              <summary>{text.faq4Q}</summary>
              <p>{text.faq4A}</p>
            </details>
            <details>
              <summary>{text.faq5Q}</summary>
              <p>{text.faq5A}</p>
            </details>
          </div>
        </section>

        {/* ═══════════ CTA FINAL ═══════════ */}
        <section className="vipx-final">
          <div className="vipx-final__card vipx-shell">
            <h2>{text.finalTitle}</h2>
            <p>{text.finalDesc}</p>
            <a href="#vip-plans" className="vipx-btn vipx-btn--gold" onClick={openVipFlow}>{flow.finalCta}<span aria-hidden="true">→</span></a>
            <p className="vipx-final__responsible">{text.responsible}</p>
            <p className="vipx-final__note">{text.footerNote}</p>
          </div>
        </section>
      </main>

      <ErrorBoundary><Footer /></ErrorBoundary>
    </div>
  )
}
