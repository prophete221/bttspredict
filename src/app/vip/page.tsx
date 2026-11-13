'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { localizedPath, type Locale } from '@/lib/i18n'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import VipWinHistory from './VipWinHistory'
import VipLockedPicks from './VipLockedPicks'
import VipJourneyModal from './VipJourneyModal'
import './vip.css'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

/* ─────────── Parcours VIP — quatre partenaires, deux prioritaires ─────
   L’inscription et les conditions sont consultées sur les guides promo
   dédiés; l’accès VIP fait ensuite l’objet d’une validation manuelle.
   ──────────────────────────────────────────────────────────────────── */
type VipBook = '1xbet' | 'linebet' | 'melbet' | '888starz'

const VIP_PARTNERS: Record<VipBook, { brand: string; guide: string }> = {
  '1xbet': { brand: '1xBet', guide: '/code-promo-1xbet' },
  linebet: { brand: 'Linebet', guide: '/code-promo-linebet-senegal' },
  melbet: { brand: 'MelBet', guide: '/code-promo-melbet' },
  '888starz': { brand: '888Starz', guide: '/bonus-888starz-btts221' },
}
const VIP_BOOKS: VipBook[] = ['1xbet', 'linebet', 'melbet', '888starz']
const VIP_LOGOS: Record<VipBook, string> = {
  '1xbet': '/logos/1xbet-logo.png',
  linebet: '/logos/linebet-logo.jpg',
  melbet: '/logos/melbet-logo.jpg',
  '888starz': '/logos/888starz-logo.jpg',
}

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
    memberVerified: 'Verrouillé jusqu’à validation',
    benefitsEyebrow: 'Espace VIP',
    benefitsTitle: 'Discovery gratuit pendant 7 jours, puis VIP Pro sur abonnement : pronostics, statistiques et alertes',
    b1Title: 'Discovery — 7 jours gratuits', b1Desc: 'Un essai de découverte unique par compte, avec une durée limitée de 7 jours.',
    b2Title: 'Pronostics VIP', b2Desc: 'Les pronostics à venir restent cachés dans l’espace public et verrouillés jusqu’à validation.',
    b3Title: 'Statistiques complètes', b3Desc: 'Les statistiques complètes sont réservées à l’accès VIP approuvé; aucun chiffre de performance n’est promis ici.',
    b4Title: 'Notifications', b4Desc: 'Les notifications sont réservées aux membres dont l’accès VIP a été approuvé.',
    b5Title: 'Alertes de signaux', b5Desc: 'Les alertes de signaux sont réservées aux membres dont l’accès VIP a été approuvé.',
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
    memberVerified: 'Locked until approved',
    benefitsEyebrow: 'VIP area',
    benefitsTitle: '7 days of free Discovery, followed by a paid VIP Pro subscription: picks, stats and alerts',
    b1Title: 'Discovery — 7 days free', b1Desc: 'One 7-day Discovery trial per account, with server-controlled expiry.',
    b2Title: 'VIP picks', b2Desc: 'Upcoming picks remain hidden from the public area and locked until approval.',
    b3Title: 'Full stats', b3Desc: 'Full statistics are reserved for approved VIP access; no performance figures are promised here.',
    b4Title: 'Notifications', b4Desc: 'Notifications are reserved for members whose VIP access has been approved.',
    b5Title: 'Signal alerts', b5Desc: 'Signal alerts are reserved for members whose VIP access has been approved.',
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
    memberVerified: 'مقفل حتى الموافقة',
    benefitsEyebrow: 'مساحة VIP',
    benefitsTitle: 'اكتشف الخدمة مجاناً لمدة 7 أيام، ثم اشترك في VIP Pro للتوقعات والإحصاءات والتنبيهات',
    b1Title: 'Discovery — 7 أيام مجاناً', b1Desc: 'تجربة اكتشاف واحدة لكل حساب، لمدة 7 أيام مع انتهاء صلاحية من جهة الخادم.',
    b2Title: 'توقعات VIP', b2Desc: 'تبقى التوقعات القادمة مخفية عن المساحة العامة ومقفلة حتى الموافقة.',
    b3Title: 'إحصاءات كاملة', b3Desc: 'الإحصاءات الكاملة مخصصة لوصول VIP الموافق عليه؛ لا نعد هنا بأرقام أداء.',
    b4Title: 'الإشعارات', b4Desc: 'الإشعارات مخصصة للأعضاء الذين تمت الموافقة على وصولهم إلى VIP.',
    b5Title: 'تنبيهات الإشارات', b5Desc: 'تنبيهات الإشارات مخصصة للأعضاء الذين تمت الموافقة على وصولهم إلى VIP.',
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

/* ────────────── Parcours VIP — quatre étapes ordonnées ────────────── */
type VipFlowCopy = {
  eyebrow: string; title: string; sub: string
  guidePanelTitle: string; guidePanelText: string
  accessPanelTitle: string; accessPanelText: string; deliveryText: string
  heroCta: string; finalCta: string; statusTitle: string; statusText: string; wizardStart: string
  wizardSteps: { title: string; body: string }[]
}

const VIP_FLOW: Record<Locale, VipFlowCopy> = {
  fr: {
    eyebrow: 'Parcours d’accès', title: 'Accès VIP à vie — validation manuelle',
    sub: 'Dépôt minimum de 3 $ sur le compte bookmaker, puis validation manuelle par le propriétaire.',
    guidePanelTitle: 'Guides promo — codes et conditions',
    guidePanelText: 'Les codes exacts et les liens existants se trouvent sur les guides dédiés. Vérifie les conditions actuelles auprès de l’opérateur avant toute action.',
    accessPanelTitle: 'Accès à vie après approbation',
    accessPanelText: 'Suis le parcours en quatre étapes et utilise Telegram pour le suivi. Le propriétaire examine chaque demande manuellement; aucun document d’identité ni identifiant secret n’est requis.',
    deliveryText: 'Après approbation manuelle : accès à vie aux pronostics VIP, statistiques complètes, notifications et alertes de signaux. Aucun résultat n’est garanti.',
    heroCta: 'Débloquer le VIP', finalCta: 'Demander mon accès VIP',
    statusTitle: 'Accès verrouillé',
    statusText: 'Aucun clic, formulaire ou dépôt ne débloque le VIP automatiquement. Le propriétaire confirme chaque accès personnellement.',
    wizardStart: 'Ouvrir la procédure en 4 étapes',
    wizardSteps: [
      { title: '1. Choisir un bookmaker', body: 'Sélectionne l’un des quatre bookmakers ci-dessous.' },
      { title: '2. Utiliser le code du guide', body: 'Ouvre le guide du partenaire choisi et inscris-toi avec son code exact. Vérifie les conditions actuelles auprès de l’opérateur.' },
      { title: '3. Confirmer l’inscription et le dépôt', body: 'Confirme ton inscription et un dépôt d’au moins 3 $ sur ton compte bookmaker. BTTSPredict ne collecte aucun fonds et ne vérifie pas automatiquement le compte.' },
      { title: '4. Envoyer la preuve et les identifiants', body: 'Dans le parcours, ajoute la capture du dépôt, l’identifiant du compte bookmaker et ton identifiant Telegram. N’envoie jamais de pièce d’identité, mot de passe, PIN ou code OTP; le propriétaire vérifie ensuite la demande manuellement.' },
    ],
  },
  en: {
    eyebrow: 'Access process', title: 'Lifetime VIP access — manual approval',
    sub: 'Minimum deposit of $3 on your bookmaker account, then the owner approves access manually.',
    guidePanelTitle: 'Promo guides — codes and terms',
    guidePanelText: 'Exact codes and existing links are on the dedicated guides. Check the operator’s current terms before taking action.',
    accessPanelTitle: 'Lifetime access after approval',
    accessPanelText: 'Follow the four-step process and use Telegram for follow-up. The owner reviews each request manually; no identity document or secret credential is required.',
    deliveryText: 'After manual approval: lifetime access to VIP picks, full stats, notifications and signal alerts. No result is guaranteed.',
    heroCta: 'Unlock VIP', finalCta: 'Request VIP access',
    statusTitle: 'Access locked',
    statusText: 'No click, form or deposit automatically unlocks VIP. The owner personally confirms every access request.',
    wizardStart: 'Open the 4-step process',
    wizardSteps: [
      { title: '1. Choose a bookmaker', body: 'Select one of the four bookmakers below.' },
      { title: '2. Use the guide’s code', body: 'Open the selected partner’s guide and register with its exact code. Check the operator’s current terms.' },
      { title: '3. Confirm registration and deposit', body: 'Confirm your registration and a deposit of at least $3 on your bookmaker account. BTTSPredict does not collect funds or automatically verify the account.' },
      { title: '4. Send your proof and identifiers', body: 'In the process, add a deposit screenshot, your bookmaker account ID, and your Telegram username. Never send an identity document, password, PIN or OTP; the owner then reviews the request manually.' },
    ],
  },
  ar: {
    eyebrow: 'إجراءات الوصول', title: 'وصول VIP مدى الحياة — بموافقة يدوية',
    sub: 'حد أدنى للإيداع 3 دولارات في حساب شركة المراهنات، ثم يوافق المالك على الوصول يدوياً.',
    guidePanelTitle: 'أدلة العروض — الرموز والشروط',
    guidePanelText: 'توجد الرموز الدقيقة والروابط الحالية في الأدلة المخصصة. تحقق من الشروط الحالية لدى المشغل قبل أي إجراء.',
    accessPanelTitle: 'وصول مدى الحياة بعد الموافقة',
    accessPanelText: 'اتبع الخطوات الأربع واستخدم تيليجرام للمتابعة. يراجع المالك كل طلب يدوياً؛ ولا تُطلب وثيقة هوية أو بيانات اعتماد سرية.',
    deliveryText: 'بعد الموافقة اليدوية: وصول مدى الحياة إلى توقعات VIP والإحصاءات الكاملة والإشعارات وتنبيهات الإشارات. لا توجد نتيجة مضمونة.',
    heroCta: 'افتح VIP', finalCta: 'اطلب الوصول إلى VIP',
    statusTitle: 'الوصول مقفل',
    statusText: 'لا يؤدي أي نقر أو نموذج أو إيداع إلى فتح VIP تلقائياً. يؤكد المالك كل طلب شخصياً.',
    wizardStart: 'افتح الإجراءات في 4 خطوات',
    wizardSteps: [
      { title: '1. اختر شركة مراهنات', body: 'اختر إحدى شركات المراهنات الأربع أدناه.' },
      { title: '2. استخدم رمز الدليل', body: 'افتح دليل الشريك المختار وسجّل باستخدام رمزه الدقيق. تحقق من الشروط الحالية لدى المشغل.' },
      { title: '3. أكّد التسجيل والإيداع', body: 'أكّد التسجيل وإيداعاً لا يقل عن 3 دولارات في حساب شركة المراهنات. لا تجمع BTTSPredict الأموال ولا تتحقق تلقائياً من الحساب.' },
      { title: '4. أرسل الإثبات والمعرّفات', body: 'أرفق صورة الإيداع ومعرّف حساب شركة المراهنات واسم المستخدم على تيليجرام. لا ترسل وثيقة هوية أو كلمة مرور أو PIN أو رمز OTP؛ ثم يراجع المالك الطلب يدوياً.' },
    ],
  },
}

const FLOW_HEADING: Record<Locale, string> = {
  fr: 'La procédure, étape par étape',
  en: 'The procedure, step by step',
  ar: 'الإجراءات خطوة بخطوة',
}

export default function VipPage() {
  const { lang: detectedLang } = useLanguage()
  const lang: Locale = detectedLang
  const [vipFlowOpen, setVipFlowOpen] = useState(false)

  const text = VIP_PAGE_COPY[lang]
  const flow = VIP_FLOW[lang]

  /* Mesure : 1 visite de la page VIP par session (visite ≠ clic ≠ inscription) */
  useEffect(() => {
    trackAffiliateAction('platform', 'vip_page_view', 'vip-page-visit')
  }, [])

  const openVipFlow = (event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event?.preventDefault()
    setVipFlowOpen(true)
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
                <a className="vipx-btn vipx-btn--gold" href="#vip-application" onClick={openVipFlow}>{flow.heroCta}<span aria-hidden="true">→</span></a>
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
            <VipLockedPicks onRequestReview={openVipFlow} />
          </div>
          <aside className="vipx-content-grid__aside" aria-label={flow.eyebrow}>
        {/* ═══════════ PARCOURS VIP — 4 ÉTAPES DANS L'ORDRE ═══════════ */}
        <section id="parcours" className="vipx-flow vipx-flow--card" aria-labelledby="vip-flow-heading" style={{ scrollMarginTop: '96px' }}>
          <header className="vipx-section-head">
            <span className="vipx-eyebrow"><i aria-hidden="true" />{flow.eyebrow}</span>
            <h2 id="vip-flow-heading">{FLOW_HEADING[lang]}</h2>
            <p>{flow.sub}</p>
          </header>

          <div className="vipx-flow__status" role="note">
            <Icon.lock />
            <div>
              <strong>{flow.statusTitle}</strong>
              <span>{flow.statusText}</span>
            </div>
          </div>

          <a href="#vip-application" onClick={openVipFlow} className="vipx-btn vipx-btn--gold vipx-flow__start">
            {flow.wizardStart}<span aria-hidden="true">→</span>
          </a>

          <ol className="vipx-flow__steps vipx-flow__steps--full">
            {flow.wizardSteps.map((step, index) => (
              <li className="vipx-flow__step" key={step.title}>
                <span className="vipx-flow__num" aria-hidden="true">{index + 1}</span>
                <div className="vipx-flow__body">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  {index === 0 && (
                    <div className="vipx-flow__actions vipx-flow__partner-guides">
                      {VIP_BOOKS.map((id, partnerIndex) => (
                        <a
                          key={id}
                          href={localizedPath(VIP_PARTNERS[id].guide, lang)}
                          className="vipx-flow__guide"
                          aria-label={`${VIP_PARTNERS[id].brand} — ${lang === 'en' ? 'promo guide' : lang === 'ar' ? 'دليل العرض' : 'guide promo'}`}
                          data-cta={`vip-guide-${id}`}
                        >
                          <img src={VIP_LOGOS[id]} alt="" width={64} height={26} loading="lazy" />
                          <span>{VIP_PARTNERS[id].brand}</span>
                          {partnerIndex < 2 && <small className="vipx-flow__priority">{lang === 'en' ? 'Priority' : lang === 'ar' ? 'أولوية' : 'Prioritaire'}</small>}
                          <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* Deux blocs distincts : guides promo d'un côté, accès VIP de l'autre */}
          <div className="vipx-flow__panels">
            <article className="vipx-flow__panel">
              <h3><Icon.target />{flow.guidePanelTitle}</h3>
              <p>{flow.guidePanelText}</p>
              <ul className="vipx-flow__links">
                {VIP_BOOKS.map((id) => (
                  <li key={id}>
                    <a href={localizedPath(VIP_PARTNERS[id].guide, lang)}>
                      {VIP_PARTNERS[id].brand}<span aria-hidden="true"> →</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
            <article className="vipx-flow__panel vipx-flow__panel--accent">
              <h3><Icon.crown />{flow.accessPanelTitle}</h3>
              <p>{flow.accessPanelText}</p>
              <p className="vipx-flow__delivery"><Icon.spark />{flow.deliveryText}</p>
              <a href="#vip-application" className="vipx-btn vipx-btn--gold vipx-btn--sm" onClick={openVipFlow} data-cta="vip-panel-procedure">
                {flow.wizardStart}<span aria-hidden="true">→</span>
              </a>
            </article>
          </div>
        </section>
          </aside>
        </div>

        {/* Historique passé uniquement; l’accès aux pronostics à venir reste verrouillé. */}
        <VipWinHistory onUnlock={openVipFlow} />

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
            <a href="#vip-application" className="vipx-btn vipx-btn--gold" onClick={openVipFlow}>{flow.finalCta}<span aria-hidden="true">→</span></a>
            <p className="vipx-final__responsible">{text.responsible}</p>
            <p className="vipx-final__note">{text.footerNote}</p>
          </div>
        </section>
      </main>

      <ErrorBoundary><Footer /></ErrorBoundary>
      <VipJourneyModal isOpen={vipFlowOpen} onClose={() => setVipFlowOpen(false)} />
    </div>
  )
}
