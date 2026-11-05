'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { localizedPath, type Locale } from '@/lib/i18n'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import './vip.css'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

/* ────────────────── Parcours VIP — 1xBet ou Linebet ───────────────────
   L’inscription et les conditions sont consultées sur les guides promo
   dédiés; l’accès VIP fait ensuite l’objet d’une validation manuelle.
   ──────────────────────────────────────────────────────────────────── */
type VipBook = '1xbet' | 'linebet'

const VIP_PARTNERS: Record<VipBook, { brand: string; guide: string }> = {
  '1xbet': { brand: '1xBet', guide: '/code-promo-1xbet' },
  linebet: { brand: 'Linebet', guide: '/code-promo-linebet-senegal' },
}
const VIP_BOOKS: VipBook[] = ['1xbet', 'linebet'] // ordre de priorité d'affichage
const VIP_LOGOS: Record<VipBook, string> = {
  '1xbet': '/logos/1xbet-logo.png',
  linebet: '/logos/linebet-logo.jpg',
}
const WHATSAPP_NUMBER = '15406704172' // inchangé

/* Effet 3D : inclinaison douce au survol / au doigt (désactivée si prefers-reduced-motion) */
/* Le ref est créé dans le composant (pattern standard) et passé en paramètre :
   aucune propriété de ref n'est exposée dans l'objet retourné (react-hooks/refs). */
function useTilt(
  ref: React.RefObject<HTMLDivElement | null>,
  max = 8,
) {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg)`
  }, [ref, max])
  const onPointerLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [ref])
  return { onPointerMove, onPointerLeave }
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
  eyebrow: string; freeLink: string; trust1: string; trust2: string; trust3: string
  memberTop: string; memberKind: string; memberPerks: string; memberVerified: string; selected: string
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
    trust2: 'Historique public', trust3: 'Pronos publiés avant le coup d’envoi',
    memberTop: 'BTTSPredict', memberKind: 'Demande à approuver', memberPerks: 'BTTS · Over 2.5 · Score exact', memberVerified: 'Accès verrouillé', selected: 'Sélectionné',
    benefitsEyebrow: 'Espace VIP', benefitsTitle: 'Contenu réservé après approbation du propriétaire',
    b1Title: 'Pronostics VIP', b1Desc: 'Les pronostics VIP ne sont accessibles qu’après confirmation personnelle du propriétaire.',
    b2Title: 'Sélections', b2Desc: 'Aucune sélection, cote ou signal VIP n’est diffusé dans cette page publique.',
    b3Title: 'Indicateurs', b3Desc: 'Les métriques sont présentées avec leur définition et selon les données disponibles.',
    b4Title: 'Historique transparent', b4Desc: 'Consulte l’historique public des pronostics et de leurs résultats.',
    b5Title: 'Tu gardes le contrôle', b5Desc: 'La demande d’accès ne passe aucun pari et ne collecte aucun fonds.',
    b6Title: 'Contact', b6Desc: 'La demande de revue manuelle se fait sur WhatsApp; l’approbation reste une décision du propriétaire.',
    trustEyebrow: 'Confiance & transparence', trustTitle: 'Vérifiable — pas des promesses',
    trustDesc: 'Les pronostics publics restent consultables avec leurs résultats. Aucun gain n’est garanti; les paris sportifs comportent des risques.', trustLink: 'Historique public',
    faqTitle: 'Questions fréquentes',
    faq1Q: 'Les offres sont-elles identiques partout ?', faq1A: 'Non. Les informations et conditions peuvent varier selon l’opérateur et le pays. Consulte le guide dédié et les informations actuelles de l’opérateur.',
    faq2Q: 'Où trouver le code promo ?', faq2A: 'Les codes exacts figurent uniquement sur les guides promo dédiés de 1xBet et Linebet. Cette page VIP générale ne publie pas de codes.',
    faq3Q: 'Qui décide de l’accès VIP ?', faq3A: 'Le propriétaire examine chaque demande et doit confirmer personnellement. Après approbation, les coupons VIP sont envoyés chaque jour par email ou WhatsApp.',
    faq4Q: 'Faut-il fournir un ID joueur ou une pièce d’identité ?', faq4A: 'Non. N’envoie ni ID joueur ni document d’identité pour demander l’accès VIP.',
    faq5Q: 'Des gains sont-ils garantis ?', faq5A: 'Non. Aucun résultat n’est garanti dans les paris sportifs. Ne mise jamais plus que ce que tu peux te permettre de perdre (18+).',
    finalTitle: 'Demander l’accès VIP', finalDesc: 'Suis les étapes, puis attends la décision personnelle du propriétaire. Le VIP reste verrouillé tant qu’il n’a pas confirmé.',
    responsible: '18+ · Les paris sportifs comportent des risques : endettement, isolement, dépendance. Pour être aidé : 09 74 75 13 13 (gratuit, France) ou begambleaware.org. Aucun gain n’est garanti.',
    footerNote: 'BTTSPredict est un site informatif et d’affiliation : nous ne prenons pas de paris et ne collectons aucun fonds.',
  },
  en: {
    eyebrow: 'Private VIP access', freeLink: 'Free predictions', trust1: 'ESPN-verified scores',
    trust2: 'Public history', trust3: 'Picks published before kick-off',
    memberTop: 'BTTSPredict', memberKind: 'Request pending review', memberPerks: 'BTTS · Over 2.5 · Exact score', memberVerified: 'Access locked', selected: 'Selected',
    benefitsEyebrow: 'VIP area', benefitsTitle: 'Content reserved until owner approval',
    b1Title: 'VIP predictions', b1Desc: 'VIP predictions are available only after the owner personally confirms access.',
    b2Title: 'Selections', b2Desc: 'No VIP selections, odds or signals are distributed on this public page.',
    b3Title: 'Indicators', b3Desc: 'Metrics are shown with their definitions and according to available data.',
    b4Title: 'Transparent history', b4Desc: 'Review the public history of predictions and their results.',
    b5Title: 'You stay in control', b5Desc: 'An access request does not place bets or collect funds.',
    b6Title: 'Contact', b6Desc: 'Request a manual review on WhatsApp; approval remains the owner’s decision.',
    trustEyebrow: 'Trust & transparency', trustTitle: 'Verifiable — not promises',
    trustDesc: 'Public predictions remain available with their results. No wins are guaranteed; sports betting carries risks.', trustLink: 'Public history',
    faqTitle: 'Frequently asked questions',
    faq1Q: 'Are offers the same everywhere?', faq1A: 'No. Information and terms can vary by operator and country. Check the dedicated guide and the operator’s current information.',
    faq2Q: 'Where can I find the promo code?', faq2A: 'Exact codes are only on the dedicated 1xBet and Linebet promo guides. This general VIP page does not publish codes.',
    faq3Q: 'Who decides VIP access?', faq3A: 'The owner reviews each request and must personally confirm it. After approval, VIP coupons are sent daily by email or WhatsApp.',
    faq4Q: 'Do I need to provide a player ID or identity document?', faq4A: 'No. Do not send a player ID or identity document when requesting VIP access.',
    faq5Q: 'Are wins guaranteed?', faq5A: 'No. No result is guaranteed in sports betting. Never stake more than you can afford to lose (18+).',
    finalTitle: 'Request VIP access', finalDesc: 'Follow the steps, then wait for the owner’s personal decision. VIP stays locked until the owner confirms.',
    responsible: '18+ · Sports betting carries risks including debt, isolation and addiction. For help: begambleaware.org. No wins are guaranteed.',
    footerNote: 'BTTSPredict is an informational and affiliate site: we do not take bets or collect funds.',
  },
  ar: {
    eyebrow: 'وصول VIP خاص', freeLink: 'التوقعات المجانية', trust1: 'نتائج موثقة من ESPN',
    trust2: 'سجل عام', trust3: 'تُنشر التوقعات قبل انطلاق المباراة',
    memberTop: 'BTTSPredict', memberKind: 'طلب بانتظار المراجعة', memberPerks: 'BTTS · Over 2.5 · النتيجة الدقيقة', memberVerified: 'الوصول مقفل', selected: 'تم الاختيار',
    benefitsEyebrow: 'مساحة VIP', benefitsTitle: 'محتوى محجوز حتى موافقة المالك',
    b1Title: 'توقعات VIP', b1Desc: 'لا تتاح توقعات VIP إلا بعد تأكيد المالك الوصول شخصياً.',
    b2Title: 'الاختيارات', b2Desc: 'لا تُنشر اختيارات VIP أو الاحتمالات أو الإشارات في هذه الصفحة العامة.',
    b3Title: 'المؤشرات', b3Desc: 'تُعرض المقاييس مع تعريفاتها وحسب البيانات المتاحة.',
    b4Title: 'سجل شفاف', b4Desc: 'راجع السجل العام للتوقعات ونتائجها.',
    b5Title: 'أنت من يقرر', b5Desc: 'طلب الوصول لا يضع رهانات ولا يجمع أموالاً.',
    b6Title: 'التواصل', b6Desc: 'يُطلب إجراء المراجعة اليدوية عبر واتساب؛ وتبقى الموافقة قراراً للمالك.',
    trustEyebrow: 'الثقة والشفافية', trustTitle: 'قابل للتحقق — لا وعود',
    trustDesc: 'تبقى التوقعات العامة متاحة مع نتائجها. لا يوجد ربح مضمون؛ وتنطوي المراهنات الرياضية على مخاطر.', trustLink: 'السجل العام',
    faqTitle: 'الأسئلة الشائعة',
    faq1Q: 'هل العروض متطابقة في كل مكان؟', faq1A: 'لا. قد تختلف المعلومات والشروط حسب المشغل والبلد. راجع الدليل المخصص والمعلومات الحالية لدى المشغل.',
    faq2Q: 'أين أجد الرمز الترويجي؟', faq2A: 'توجد الرموز الدقيقة فقط في دليلي العرض المخصصين لـ 1xBet وLinebet. لا تنشر صفحة VIP العامة هذه أي رموز.',
    faq3Q: 'من يقرر الوصول إلى VIP؟', faq3A: 'يراجع المالك كل طلب ويجب أن يؤكد الموافقة شخصياً. بعد الموافقة، تُرسل قسائم VIP يومياً عبر البريد الإلكتروني أو واتساب.',
    faq4Q: 'هل يجب تقديم رقم لاعب أو وثيقة هوية؟', faq4A: 'لا. لا ترسل رقم لاعب أو وثيقة هوية عند طلب الوصول إلى VIP.',
    faq5Q: 'هل الأرباح مضمونة؟', faq5A: 'لا. لا توجد نتيجة مضمونة في المراهنات الرياضية. لا تراهن بأكثر مما يمكنك تحمل خسارته (18+).',
    finalTitle: 'اطلب الوصول إلى VIP', finalDesc: 'اتبع الخطوات ثم انتظر القرار الشخصي من المالك. يبقى VIP مقفلاً حتى يؤكد المالك الموافقة.',
    responsible: '18+ · تنطوي المراهنات الرياضية على مخاطر تشمل الديون والعزلة والإدمان. للمساعدة: begambleaware.org. لا يوجد ربح مضمون.',
    footerNote: 'BTTSPredict موقع معلوماتي وتسويق بالعمولة: لا نقبل الرهانات ولا نجمع الأموال.',
  },
}

function makeCodeFreeCopy(_brand: string, lang: Locale): VipPageText {
  return VIP_PAGE_COPY[lang]
}

/* ────────────── Parcours VIP — 3 étapes, ordre explicite ──────────────
   Les codes et les conditions restent sur les pages promo dédiées.
   La demande d'accès se fait sur WhatsApp, validée manuellement.
   ──────────────────────────────────────────────────────────────────── */
type VipFlowCopy = {
  eyebrow: string
  title: string
  sub: string
  step1Title: string
  step1Text: string
  step1Note: string
  step2Title: string
  step2Text: string
  step2Note: string
  step2Action: string
  choosePartner: string
  step3Title: string
  step3Text: string
  step3Action: string
  step3Note: string
  guidePanelTitle: string
  guidePanelText: string
  accessPanelTitle: string
  accessPanelText: string
  panelCta: string
  deliveryText: string
  previewEyebrow: string
  previewTitle: string
  previewSub: string
  previewCta: string
  heroCta: string
  finalCta: string
  statusTitle: string
  statusText: string
  wizardStart: string
  wizardTitle: string
  wizardProgress: string
  wizardSteps: { title: string; body: string }[]
  wizardBack: string
  wizardContinue: string
  wizardClose: string
  wizardGuide: string
  wizardRequest: string
  wizardPending: string
}

const VIP_FLOW: Record<Locale, VipFlowCopy> = {
  fr: {
    eyebrow: 'Parcours d’accès',
    title: 'Demander l’accès VIP en 4 étapes',
    sub: 'Choisis un partenaire, consulte son guide promo, crée un nouveau compte avec le code exact, puis demande la revue du propriétaire. Le VIP reste fermé jusqu’à sa confirmation personnelle.',
    step1Title: 'Choisis ton bookmaker',
    step1Text: 'Deux partenaires seulement : 1xBet ou Linebet. Ouvre la page promo du partenaire : le code exact et les conditions à jour y sont publiés.',
    step1Note: 'Les codes ne sont pas affichés sur cette page VIP.',
    step2Title: 'Crée un nouveau compte avec le code exact',
    step2Text: 'L’inscription doit être un nouveau compte chez ce partenaire. Recopie le code tel qu’il apparaît sur la page promo, sans le modifier.',
    step2Note: 'La création d’un compte ne donne pas accès au VIP.',
    step2Action: 'Ouvrir le guide {brand}',
    choosePartner: 'Partenaire choisi',
    step3Title: 'Demande la validation de ton accès',
    step3Text: 'Envoie ton bookmaker sur WhatsApp et confirme que tu as créé un nouveau compte avec le code exact de la page promo. Le propriétaire valide la demande manuellement.',
    step3Action: 'Demander la validation sur WhatsApp',
    step3Note: 'Aucune pièce d’identité n’est demandée.',
    guidePanelTitle: 'Guides promo — code et conditions',
    guidePanelText: 'Le code exact et les conditions de chaque opérateur figurent sur ces pages dédiées. Vérifie-les avant de t’inscrire.',
    accessPanelTitle: 'Accès VIP — demande et validation',
    accessPanelText: 'La demande d’accès se fait sur WhatsApp, puis validation manuelle par le propriétaire. Aucun document d’identité n’est demandé.',
    panelCta: 'Ouvrir WhatsApp',
    deliveryText: 'Après validation, les coupons VIP arrivent chaque jour par email ou WhatsApp.',
    previewEyebrow: 'Contenu VIP protégé',
    previewTitle: 'Aucun pronostic VIP n’est publié sur cette page',
    previewSub: 'Les sélections, cotes et signaux VIP ne sont pas inclus dans les fichiers publics. Ils restent inaccessibles tant que tu n’as pas reçu la confirmation personnelle du propriétaire.',
    previewCta: 'Voir la procédure',
    heroCta: 'Commencer la procédure',
    finalCta: 'Demander mon accès VIP',
    statusTitle: 'Accès verrouillé',
    statusText: 'Aucun clic ni formulaire ne débloque le VIP automatiquement. Seul le propriétaire ouvre l’accès après avoir confirmé personnellement ta demande.',
    wizardStart: 'Ouvrir la procédure interactive',
    wizardTitle: 'Demande d’accès VIP',
    wizardProgress: 'Étape {current} sur 4',
    wizardSteps: [
      { title: '1. Choisir le bookmaker', body: 'Seuls 1xBet et Linebet sont éligibles. Choisis le partenaire concerné. Ce choix ne crée pas de compte et ne déverrouille rien.' },
      { title: '2. Consulter le guide promo', body: 'Ouvre la page promo dédiée au partenaire choisi. Elle contient le code exact et les informations à jour. Cette page VIP générale ne révèle aucun code.' },
      { title: '3. Créer un nouveau compte', body: 'Sur le site du partenaire, crée un nouveau compte en suivant son guide et en utilisant exactement le code qui y est affiché. Le site BTTSPredict ne vérifie pas cette action et elle ne donne pas accès au VIP.' },
      { title: '4. Demander une revue et attendre', body: 'Envoie une demande sur WhatsApp en précisant le partenaire et que tu as créé un nouveau compte avec le code du guide. Ne transmets ni ID joueur ni document d’identité. Le propriétaire examine la demande et doit confirmer personnellement; jusque-là, le VIP reste verrouillé.' },
    ],
    wizardBack: 'Retour',
    wizardContinue: 'Continuer',
    wizardClose: 'Fermer',
    wizardGuide: 'Ouvrir le guide {brand}',
    wizardRequest: 'Demander une revue sur WhatsApp',
    wizardPending: 'Après l’envoi de la demande, attends la décision personnelle du propriétaire. Cette page ne confirme pas l’envoi et ne peut pas déverrouiller le VIP.',
  },
  en: {
    eyebrow: 'Access path',
    title: 'Request VIP access in 4 steps',
    sub: 'Choose a partner, read its promo guide, create a new account with the exact code, then request the owner’s review. VIP stays closed until the owner personally confirms.',
    step1Title: 'Pick your bookmaker',
    step1Text: 'Two partners only: 1xBet or Linebet. Open the partner promo page: the exact code and current terms are published there.',
    step1Note: 'Codes are not displayed on this VIP page.',
    step2Title: 'Create a new account with the exact code',
    step2Text: 'Registration must be a new account with that partner. Copy the code exactly as shown on the promo page, without changing it.',
    step2Note: 'Creating an account does not grant VIP access.',
    step2Action: 'Open the {brand} guide',
    choosePartner: 'Selected partner',
    step3Title: 'Request access validation',
    step3Text: 'Send your bookmaker on WhatsApp and confirm you created a new account with the exact code from the promo page. The owner validates the request manually.',
    step3Action: 'Request validation on WhatsApp',
    step3Note: 'No identity document is required.',
    guidePanelTitle: 'Promo guides — code and terms',
    guidePanelText: 'Each operator’s exact code and terms are on these dedicated pages. Check them before signing up.',
    accessPanelTitle: 'VIP access — request and validation',
    accessPanelText: 'Access requests go through WhatsApp, then manual validation by the owner. No identity document is requested.',
    panelCta: 'Open WhatsApp',
    deliveryText: 'Once validated, VIP coupons arrive every day by email or WhatsApp.',
    previewEyebrow: 'Protected VIP content',
    previewTitle: 'No VIP picks are published on this page',
    previewSub: 'VIP selections, odds and signals are not included in public files. They stay inaccessible until you receive the owner’s personal confirmation.',
    previewCta: 'View the procedure',
    heroCta: 'Start the procedure',
    finalCta: 'Request my VIP access',
    statusTitle: 'Access locked',
    statusText: 'No click or form automatically unlocks VIP. Only the owner opens access after personally confirming your request.',
    wizardStart: 'Open the interactive procedure',
    wizardTitle: 'VIP access request',
    wizardProgress: 'Step {current} of 4',
    wizardSteps: [
      { title: '1. Choose a bookmaker', body: 'Only 1xBet and Linebet are eligible. Choose the partner concerned. This choice does not create an account or unlock anything.' },
      { title: '2. Read the promo guide', body: 'Open the dedicated promo page for your chosen partner. It contains the exact code and current information. This general VIP page does not reveal any code.' },
      { title: '3. Create a new account', body: 'On the partner’s site, create a new account by following its guide and using the exact code shown there. BTTSPredict does not verify this action and it does not grant VIP access.' },
      { title: '4. Request a review and wait', body: 'Send a WhatsApp request stating the partner and that you created a new account with the guide’s code. Do not send a player ID or identity document. The owner reviews the request and must personally confirm; until then VIP remains locked.' },
    ],
    wizardBack: 'Back',
    wizardContinue: 'Continue',
    wizardClose: 'Close',
    wizardGuide: 'Open the {brand} guide',
    wizardRequest: 'Request a review on WhatsApp',
    wizardPending: 'After sending the request, wait for the owner’s personal decision. This page cannot confirm the request was sent or unlock VIP.',
  },
  ar: {
    eyebrow: 'مسار الوصول',
    title: 'طلب الوصول إلى VIP في 4 خطوات',
    sub: 'اختر شريكاً، وراجع دليل العرض، وأنشئ حساباً جديداً بالرمز الدقيق، ثم اطلب مراجعة المالك. يبقى VIP مغلقاً حتى يؤكد المالك ذلك شخصياً.',
    step1Title: 'اختر شركة المراهنات',
    step1Text: 'شريكان فقط: 1xBet أو Linebet. افتح صفحة العرض الخاصة بالشريك: يُنشر فيها الرمز الدقيق والشروط الحالية.',
    step1Note: 'لا تُعرض الرموز في صفحة VIP هذه.',
    step2Title: 'أنشئ حساباً جديداً بالرمز الدقيق',
    step2Text: 'يجب أن يكون التسجيل حساباً جديداً لدى هذا الشريك. انسخ الرمز كما يظهر في صفحة العرض دون تغييره.',
    step2Note: 'إنشاء حساب لا يمنح الوصول إلى VIP.',
    step2Action: 'افتح دليل {brand}',
    choosePartner: 'الشريك المختار',
    step3Title: 'اطلب التحقق من وصولك',
    step3Text: 'أرسل اسم شركة المراهنات عبر واتساب وأكّد أنك أنشأت حساباً جديداً بالرمز الدقيق من صفحة العرض. يوافق المالك على الطلب يدوياً.',
    step3Action: 'اطلب التحقق عبر واتساب',
    step3Note: 'لا يُطلب أي مستند هوية.',
    guidePanelTitle: 'أدلة العروض — الرمز والشروط',
    guidePanelText: 'الرمز الدقيق وشروط كل مشغل موجودة في هذه الصفحات المخصصة. راجعها قبل التسجيل.',
    accessPanelTitle: 'الوصول إلى VIP — الطلب والتحقق',
    accessPanelText: 'يُقدَّم طلب الوصول عبر واتساب، ثم تحقق يدوي من المالك. لا يُطلب أي مستند هوية.',
    panelCta: 'افتح واتساب',
    deliveryText: 'بعد التحقق، تصل تركيبات VIP كل يوم عبر البريد الإلكتروني أو واتساب.',
    previewEyebrow: 'محتوى VIP محمي',
    previewTitle: 'لا تُنشر توقعات VIP في هذه الصفحة',
    previewSub: 'لا تُضمّن اختيارات VIP أو الاحتمالات أو الإشارات في الملفات العامة. وتبقى غير متاحة حتى تتلقى تأكيداً شخصياً من المالك.',
    previewCta: 'اعرض الإجراءات',
    heroCta: 'ابدأ الإجراءات',
    finalCta: 'اطلب وصولي إلى VIP',
    statusTitle: 'الوصول مقفل',
    statusText: 'لا تفتح أي ضغطة أو نموذج الوصول إلى VIP تلقائياً. المالك وحده يفتح الوصول بعد تأكيد طلبك شخصياً.',
    wizardStart: 'افتح الإجراءات التفاعلية',
    wizardTitle: 'طلب الوصول إلى VIP',
    wizardProgress: 'الخطوة {current} من 4',
    wizardSteps: [
      { title: '1. اختر شركة المراهنات', body: 'الشريكان المؤهلان فقط هما 1xBet وLinebet. اختر الشريك المعني. هذا الاختيار لا ينشئ حساباً ولا يفتح أي محتوى.' },
      { title: '2. راجع دليل العرض', body: 'افتح صفحة العرض المخصصة للشريك المختار. تحتوي على الرمز الدقيق والمعلومات الحالية. لا تكشف صفحة VIP العامة أي رمز.' },
      { title: '3. أنشئ حساباً جديداً', body: 'على موقع الشريك، أنشئ حساباً جديداً باتباع دليله واستخدام الرمز نفسه كما هو معروض. لا يتحقق موقع BTTSPredict من هذه الخطوة ولا تمنح الوصول إلى VIP.' },
      { title: '4. اطلب المراجعة وانتظر', body: 'أرسل طلباً عبر واتساب واذكر الشريك وأنك أنشأت حساباً جديداً باستخدام رمز الدليل. لا ترسل رقم لاعب أو وثيقة هوية. يراجع المالك الطلب ويجب أن يؤكد شخصياً؛ وحتى ذلك الحين يبقى VIP مقفلاً.' },
    ],
    wizardBack: 'رجوع',
    wizardContinue: 'متابعة',
    wizardClose: 'إغلاق',
    wizardGuide: 'افتح دليل {brand}',
    wizardRequest: 'اطلب المراجعة عبر واتساب',
    wizardPending: 'بعد إرسال الطلب، انتظر القرار الشخصي من المالك. لا تؤكد هذه الصفحة إرسال الطلب ولا يمكنها فتح VIP.',
  },
}

/* ────────────────────────── Page ────────────────────────── */

/* Titre de la section procédure : distinct du titre du hero pour éviter un
   doublon de H1/H2 identiques dans la page. */
const FLOW_HEADING: Record<Locale, string> = {
  fr: 'La procédure, étape par étape',
  en: 'The procedure, step by step',
  ar: 'الإجراءات خطوة بخطوة',
}

export default function VipPage() {
  const { lang: detectedLang } = useLanguage()
  const lang: Locale = detectedLang

  /* Partenaire sélectionné — 1xBet ou Linebet. */
  const [book, setBook] = useState<VipBook>('1xbet')
  const [partnerChosen, setPartnerChosen] = useState(false)
  const partner = VIP_PARTNERS[book]
  const text = useMemo(() => makeCodeFreeCopy(partner.brand, lang), [partner, lang])
  const flow = VIP_FLOW[lang]

  const [toast, setToast] = useState('')
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | null>(null)

  const memberCardRef = useRef<HTMLDivElement | null>(null)
  const wizardRef = useRef<HTMLDivElement | null>(null)
  const memberTilt = useTilt(memberCardRef, 9)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  /* Mesure : 1 visite de la page VIP par session (visite ≠ clic ≠ inscription) */
  useEffect(() => {
    trackAffiliateAction('platform', 'vip_page_view', 'vip-page-visit')
  }, [])

  useEffect(() => {
    if (wizardStep === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFirst = () => wizardRef.current?.querySelector<HTMLElement>('button:not([disabled]), a[href]')?.focus()
    const focusTimer = window.setTimeout(focusFirst, 0)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setWizardStep(null)
      }
      if (event.key !== 'Tab' || !wizardRef.current) return
      const items = [...wizardRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [wizardStep])

  /* Le choix du partenaire ne copie ni ne révèle de code sur cette page. */
  const selectPartner = (target: VipBook) => {
    setBook(target)
    setPartnerChosen(true)
    trackAffiliateAction(target, 'partner_select', 'vip-page')
    setToast(`${VIP_PARTNERS[target].brand} — ${text.selected}`)
  }

  const openWizard = (step: 1 | 2 | 3 | 4 = 1) => setWizardStep(step)

  /* Bouton de vérification → redirection WhatsApp (message pré-rempli) */
  const openVerification = () => {
    trackAffiliateAction(book, 'whatsapp_click', 'vip-verify')
    const message =
      lang === 'en'
        ? `Hello BTTSPredict, I would like to request a manual review of my VIP access. Partner: ${partner.brand}. I created a new account using the exact code from its promo guide. VIP access remains locked until the owner personally approves this request.`
        : lang === 'ar'
          ? `مرحباً BTTSPredict، أود طلب مراجعة يدوية لوصولي إلى VIP. الشريك: ${partner.brand}. أنشأت حساباً جديداً بالرمز الدقيق من دليل العرض. يبقى الوصول إلى VIP مقفلاً حتى موافقة المالك شخصياً.`
          : `Bonjour BTTSPredict, je demande une revue manuelle de mon accès VIP. Partenaire : ${partner.brand}. J’ai créé un nouveau compte avec le code exact de son guide promo. L’accès VIP reste verrouillé jusqu’à votre approbation personnelle.`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="vipx" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ErrorBoundary><Navbar /></ErrorBoundary>

      {toast && <div className="vipx-toast" role="status"><Icon.check /> {toast}</div>}

      <main id="main-content">
        {/* ═══════════ HERO ═══════════ */}
        <section className="vipx-hero">
          <div className="vipx-hero__aura" aria-hidden="true" />
          <div className="vipx-hero__grid vipx-shell">
            <div className="vipx-hero__copy">
              <span className="vipx-eyebrow"><i aria-hidden="true" />{text.eyebrow}</span>
              <AnimatedTitle as="h1" text={flow.title} accentColor="#29D4B0" />
              <p className="vipx-hero__sub">{flow.sub}</p>
              <div className="vipx-hero__cta">
                <button type="button" className="vipx-btn vipx-btn--gold" onClick={() => openWizard(1)}>{flow.heroCta}<span aria-hidden="true">→</span></button>
                <a className="vipx-btn vipx-btn--ghost" href={localizedPath('/btts/predictions/today', lang)}>{text.freeLink}</a>
              </div>
              <ul className="vipx-hero__trust">
                <li><Icon.shield />{text.trust1}</li>
                <li><Icon.eye />{text.trust2}</li>
                <li><Icon.clock />{text.trust3}</li>
              </ul>
            </div>

            {/* Carte membre 3D */}
            <div className="vipx-hero__card">
              <div className="vipx-scene">
                <div className="vipx-member vipx-tilt" ref={memberCardRef} onPointerMove={memberTilt.onPointerMove} onPointerLeave={memberTilt.onPointerLeave}>
                  <div className="vipx-member__row">
                    <strong>{text.memberTop}</strong>
                    <span className="vipx-member__crown"><Icon.crown />VIP</span>
                  </div>
                  <div className="vipx-member__chip" aria-hidden="true" />
                  <div className="vipx-member__middle">
                    <span>{text.memberKind}</span>
                    <small>{text.memberPerks}</small>
                  </div>
                  <div className="vipx-member__row vipx-member__row--bottom">
                    <span className="vipx-member__verified"><Icon.crown />{text.memberVerified}</span>
                    <span className="vipx-member__stars" aria-hidden="true">★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

                {/* ═══════════ PARCOURS VIP — 3 ÉTAPES DANS L'ORDRE ═══════════ */}
        <section id="parcours" className="vipx-flow vipx-shell">
          <header className="vipx-section-head">
            <span className="vipx-eyebrow"><i aria-hidden="true" />{flow.eyebrow}</span>
            <h2>{FLOW_HEADING[lang]}</h2>
            <p>{flow.sub}</p>
          </header>

          <div className="vipx-flow__status" role="note">
            <Icon.lock />
            <div>
              <strong>{flow.statusTitle}</strong>
              <span>{flow.statusText}</span>
            </div>
          </div>

          <button type="button" className="vipx-btn vipx-btn--gold vipx-flow__start" onClick={() => openWizard(1)}>
            {flow.wizardStart}<span aria-hidden="true">→</span>
          </button>

          <ol className="vipx-flow__steps">
            <li className="vipx-flow__step">
              <span className="vipx-flow__num" aria-hidden="true">1</span>
              <div className="vipx-flow__body">
                <h3>{flow.step1Title}</h3>
                <p>{flow.step1Text}</p>
                <p className="vipx-flow__note"><Icon.shield />{flow.step1Note}</p>
                <div className="vipx-flow__actions">
                  {VIP_BOOKS.map((id) => (
                    <a
                      key={id}
                      href={localizedPath(VIP_PARTNERS[id].guide, lang)}
                      className="vipx-flow__guide"
                      data-cta={`vip-guide-${id}`}
                    >
                      <img src={VIP_LOGOS[id]} alt="" width={64} height={26} loading="lazy" />
                      <span>{VIP_PARTNERS[id].brand}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </li>

            <li className="vipx-flow__step">
              <span className="vipx-flow__num" aria-hidden="true">2</span>
              <div className="vipx-flow__body">
                <h3>{flow.step2Title}</h3>
                <p>{flow.step2Text}</p>
                <p className="vipx-flow__note vipx-flow__note--warn"><Icon.lock />{flow.step2Note}</p>
                <div className="vipx-flow__switch" role="group" aria-label={flow.choosePartner}>
                  {VIP_BOOKS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={partnerChosen && book === id}
                      className={`vipx-flow__chip${partnerChosen && book === id ? ' is-on' : ''}`}
                      onClick={() => selectPartner(id)}
                    >
                      {VIP_PARTNERS[id].brand}
                    </button>
                  ))}
                </div>
                <div className="vipx-flow__actions">
                  <a
                    href={localizedPath(partner.guide, lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vipx-btn vipx-btn--gold vipx-btn--sm"
                    data-cta="vip-step2-guide"
                  >
                    {flow.step2Action.replace('{brand}', partner.brand)}<span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </li>

            <li className="vipx-flow__step vipx-flow__step--accent">
              <span className="vipx-flow__num" aria-hidden="true">3</span>
              <div className="vipx-flow__body">
                <h3>{flow.step3Title}</h3>
                <p>{flow.step3Text}</p>
                <button
                  type="button"
                  className="vipx-btn vipx-btn--wa vipx-btn--block"
                  onClick={() => openWizard(1)}
                  data-cta="vip-verify-whatsapp"
                >
                  <Icon.whatsapp />{flow.step3Action}
                </button>
                <p className="vipx-flow__note"><Icon.clock />{flow.step3Note}</p>
              </div>
            </li>
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
              <button type="button" className="vipx-btn vipx-btn--gold vipx-btn--sm" onClick={() => openWizard(1)} data-cta="vip-panel-procedure">
                {flow.wizardStart}<span aria-hidden="true">→</span>
              </button>
            </article>
          </div>
        </section>

        {/* ═══════════ APERÇU DES MATCHS VIP ═══════════ */}
        <section className="vipx-preview vipx-shell">
          <header className="vipx-section-head">
            <span className="vipx-eyebrow"><i aria-hidden="true" />{flow.previewEyebrow}</span>
            <h2>{flow.previewTitle}</h2>
            <p>{flow.previewSub}</p>
          </header>
          <div className="vipx-preview__card">
            <div className="vipx-matches__locked" role="status">
              <Icon.lock />
              <span>{flow.wizardPending}</span>
              <button type="button" className="vipx-btn vipx-btn--gold vipx-btn--sm" onClick={() => openWizard(1)}>{flow.previewCta}</button>
            </div>
          </div>
        </section>

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
            <a className="vipx-btn vipx-btn--ghost" href={localizedPath('/historique', lang)}>{text.trustLink}<span aria-hidden="true">→</span></a>
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
            <button type="button" className="vipx-btn vipx-btn--gold" onClick={() => openWizard(1)}>{flow.finalCta}<span aria-hidden="true">→</span></button>
            <p className="vipx-final__responsible">{text.responsible}</p>
            <p className="vipx-final__note">{text.footerNote}</p>
          </div>
        </section>
      </main>

      {wizardStep !== null && (
        <div
          className="vipx-wizard"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setWizardStep(null) }}
        >
          <section
            className="vipx-wizard__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vipx-wizard-title"
            aria-describedby="vipx-wizard-body"
            ref={wizardRef}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <button type="button" className="vipx-wizard__close" onClick={() => setWizardStep(null)} aria-label={flow.wizardClose}>×</button>
            <p className="vipx-wizard__progress-label">{flow.wizardProgress.replace('{current}', String(wizardStep))}</p>
            <div className="vipx-wizard__progress" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={wizardStep} aria-label={flow.wizardProgress.replace('{current}', String(wizardStep))}>
              <i style={{ width: `${wizardStep * 25}%` }} />
            </div>

            <h2 id="vipx-wizard-title">{flow.wizardTitle}</h2>
            <div className="vipx-wizard__content" id="vipx-wizard-body" aria-live="polite">
              <h3>{flow.wizardSteps[wizardStep - 1].title}</h3>
              <p>{flow.wizardSteps[wizardStep - 1].body}</p>

              {wizardStep === 1 && (
                <div className="vipx-flow__switch" role="group" aria-label={flow.choosePartner}>
                  {VIP_BOOKS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={partnerChosen && book === id}
                      className={`vipx-flow__chip${partnerChosen && book === id ? ' is-on' : ''}`}
                      onClick={() => selectPartner(id)}
                    >
                      <img src={VIP_LOGOS[id]} alt="" width={56} height={24} />
                      {VIP_PARTNERS[id].brand}
                    </button>
                  ))}
                </div>
              )}

              {(wizardStep === 2 || wizardStep === 3) && (
                <a
                  className="vipx-btn vipx-btn--gold vipx-btn--block"
                  href={localizedPath(partner.guide, lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta={`vip-wizard-guide-step-${wizardStep}`}
                >
                  {flow.wizardGuide.replace('{brand}', partner.brand)}<span aria-hidden="true">↗</span>
                </a>
              )}

              {wizardStep === 4 && (
                <>
                  <button type="button" className="vipx-btn vipx-btn--wa vipx-btn--block" onClick={openVerification} data-cta="vip-wizard-whatsapp">
                    <Icon.whatsapp />{flow.wizardRequest}
                  </button>
                  <p className="vipx-wizard__pending"><Icon.lock />{flow.wizardPending}</p>
                </>
              )}
            </div>

            <div className="vipx-wizard__footer">
              <button type="button" className="vipx-btn vipx-btn--ghost" onClick={() => wizardStep === 1 ? setWizardStep(null) : setWizardStep((wizardStep - 1) as 1 | 2 | 3)}>
                {wizardStep === 1 ? flow.wizardClose : flow.wizardBack}
              </button>
              {wizardStep < 4 ? (
                <button
                  type="button"
                  className="vipx-btn vipx-btn--gold"
                  disabled={wizardStep === 1 && !partnerChosen}
                  onClick={() => setWizardStep((wizardStep + 1) as 2 | 3 | 4)}
                >
                  {flow.wizardContinue}<span aria-hidden="true">→</span>
                </button>
              ) : (
                <button type="button" className="vipx-btn vipx-btn--ghost" onClick={() => setWizardStep(null)}>{flow.wizardClose}</button>
              )}
            </div>
          </section>
        </div>
      )}

      <ErrorBoundary><Footer /></ErrorBoundary>
    </div>
  )
}
