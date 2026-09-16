'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import type { Locale } from '@/lib/i18n'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import './vip.css'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipUnlockModal = dynamic(() => import('@/components/bttsbet/VipUnlockModal'), { loading: () => null })

/* ═══ Partenaires — codes promo et labels INTACTS ═══ */
const BRAND = {
  linebet: { label: 'Linebet', code: 'VISION221' },
  '888starz': { label: '888Starz', code: 'btts221' },
} as const

type Bookmaker = keyof typeof BRAND

type ComboLeg = {
  eventId: string
  home: string
  away: string
  league: string
  kickoff: string
  bookmaker?: string
  market?: string
  selection?: string
  odds?: number
}

type VipCombo = {
  legs: ComboLeg[]
  totalOdds?: number | null
}

type PredictionFixture = {
  id?: string
  home?: string
  away?: string
  league?: string
  date?: string
  time?: string
  kickoff?: string
}

type WinHistoryPayload = {
  stats?: {
    total?: number
    won?: number
    rate?: number
    gold?: { rate?: number }
    period?: { from?: string }
  }
}

/* Valeurs réelles au 16/09/2026 (win-history.json) — remplacées en direct par le fetch */
const FALLBACK_STATS = { total: 86, won: 56, rate: 65.1, goldRate: 68.6, since: '2026-08-08' }

/* ─── Helpers (inchangés — logique préservée) ─── */
function dakarDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Dakar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function formatKickoff(value: string, lang: Locale) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR', {
    timeZone: 'Africa/Dakar',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function hasFutureLegs(combo?: VipCombo | null): combo is VipCombo {
  if (!combo?.legs?.length) return false
  return combo.legs.every((leg) => {
    const kickoff = Date.parse(leg.kickoff)
    return Number.isFinite(kickoff) && kickoff > Date.now()
  })
}

function fixtureKickoff(fixture: PredictionFixture) {
  const raw = fixture.kickoff || (fixture.date && fixture.time ? `${fixture.date}T${fixture.time}:00Z` : '')
  const timestamp = Date.parse(raw)
  return { raw, timestamp }
}

function buildMatchOnlyCombos(payload: { free?: PredictionFixture[]; vipPreview?: PredictionFixture[]; predictions?: PredictionFixture[] } | null) {
  const rows = [...(payload?.free || []), ...(payload?.vipPreview || []), ...(payload?.predictions || [])]
  const seen = new Set<string>()
  const fixtures = rows.filter((fixture) => {
    const home = fixture.home?.trim()
    const away = fixture.away?.trim()
    const { timestamp } = fixtureKickoff(fixture)
    if (!home || !away || !Number.isFinite(timestamp) || timestamp <= Date.now()) return false
    const key = `${home.toLowerCase()}|${away.toLowerCase()}|${timestamp}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const toCombo = (target: 3 | 5): VipCombo | null => {
    const selected = fixtures.slice(0, target)
    if (selected.length < target) return null
    return {
      totalOdds: null,
      legs: selected.map((fixture, index) => {
        const { raw } = fixtureKickoff(fixture)
        return {
          eventId: fixture.id || `fixture-${target}-${index}-${raw}`,
          home: fixture.home!.trim(),
          away: fixture.away!.trim(),
          league: fixture.league?.trim() || 'Football',
          kickoff: raw,
        }
      }),
    }
  }
  return { target3: toCombo(3), target5: toCombo(5) }
}

/* ─── Icônes SVG inline ─── */
const ICONS = {
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  lock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  unlock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>,
  copy: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  arrow: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  crown: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2 7l4.5 4L12 4l5.5 7L22 7l-1.8 12H3.8L2 7z" /></svg>,
  ticket: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6z" /><line x1="13" y1="5" x2="13" y2="19" strokeDasharray="2 3" /></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>,
  medal: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" /></svg>,
  whatsapp: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9.5 8.3 8.6 8.6 0 0 1-3.9-1.3L3 20l1.6-4.5a8.3 8.3 0 0 1-1.1-4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" /><path d="M9 9.5c.5 3 2.5 5 5.5 5.5l1-1.5-2-1-.9.7a6 6 0 0 1-1.8-1.8l.7-.9-1-2-1.5 1z" /></svg>,
  refresh: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10" /></svg>,
  history: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13a9 9 0 1 0 .5-5L3 8" /><polyline points="12 7 12 12 15 15" /></svg>,
  method: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
  verified: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>,
  nodata: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="9" y1="12" x2="15" y2="12" /></svg>,
  license: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6" /><path d="M8.5 14L7 22l5-2.5L17 22l-1.5-8" /></svg>,
}

const copy = {
  fr: {
    topbar: 'Accès privé — sélections publiées avant le coup d’envoi',
    badge: 'Espace VIP · Sur invitation',
    titleA: 'Le combiné VIP du jour',
    titleB: 'est déjà prêt.',
    sub: 'Rejoins l’espace VIP BTTSPredict : chaque jour, un combiné de 3 à 5 matchs BTTS et Over 2,5 choisi par notre modèle Poisson + xG, envoyé sur WhatsApp avant les coups d’envoi. Ton accès est offert avec le code partenaire — tu ne paies rien sur ce site.',
    ctaPrimary: 'Débloquer mon accès VIP',
    ctaSecondary: 'Voir le combiné du jour',
    chipOfficial: 'Partenaires officiels licenciés',
    chipVerified: 'Résultats vérifiés publiquement',
    chip18: '18+ · Jeu responsable',
    cardTier: 'Membre VIP',
    cardHolder: 'Membre',
    cardSince: 'Accès actif',
    cardPill: 'Sélections avant coup d’envoi',
    proofEyebrow: 'Preuves avant promesses',
    proofTitle: 'Des résultats publics, vérifiés score par score',
    proofSub: 'Chaque pronostic est horodaté avant le coup d’envoi, puis marqué WIN ou LOST contre le score final (source ESPN). Tu peux tout vérifier — c’est voulu.',
    statVerified: 'Pronostics vérifiés',
    statWon: 'Gagnants',
    statRate: 'Taux de réussite',
    statGold: 'Réussite tier GOLD',
    proofLink: 'Vérifier l’historique complet',
    proofNoteA: 'Suivi public depuis le',
    proofNoteB: 'Les performances passées ne garantissent aucun résultat futur — parie de manière responsable.',
    combosEyebrow: 'Aujourd’hui',
    combosTitle: 'Le combiné VIP du jour',
    combosIntro: 'Les matchs du jour sont visibles. Le marché, la sélection et la cote restent verrouillés jusqu’à l’activation de ton accès VIP.',
    comboVipToday: 'Combiné VIP du jour',
    combo5: 'Combiné VIP · 5 matchs',
    matchOnlyBadge: 'VIP',
    comboLegs: 'matchs',
    lockedBadge: 'Verrouillé',
    legsNote: 'Sélection masquée',
    unlockSmall: 'Débloquer',
    unavailable: 'Le combiné VIP du jour sera disponible après la prochaine mise à jour.',
    benEyebrow: 'Ce que tu reçois',
    benTitle: 'Six raisons d’activer ton accès',
    b1t: 'Combiné VIP quotidien',
    b1d: '3 à 5 matchs sélectionnés chaque jour, avec marché et cote, publiés avant le coup d’envoi.',
    b2t: 'Modèle Poisson + xG',
    b2d: 'Des probabilités calculées sur les expected goals, la forme récente et les données publiques ESPN — pas sur du ressenti.',
    b3t: 'Tiers de fiabilité',
    b3d: 'Chaque sélection est notée GOLD, SILVER ou STANDARD selon sa probabilité, pour que tu choisisses en connaissance de cause.',
    b4t: 'Livraison WhatsApp',
    b4d: 'Tes sélections arrivent directement sur WhatsApp. Aucune application supplémentaire, aucun compte à créer ici.',
    b5t: 'Mises à jour toutes les 4 h',
    b5d: 'Le dataset est recalculé quatre fois par jour jusqu’au coup d’envoi : probabilités, fiabilité, horodatage.',
    b6t: 'Historique transparent',
    b6d: 'Gagnant ou perdu, chaque pronostic reste consultable dans l’historique public. La confiance se vérifie.',
    stepEyebrow: 'Activation en 3 étapes',
    stepTitle: 'Moins de 5 minutes pour rejoindre le VIP',
    s1t: 'Choisis ton partenaire',
    s1d: 'Sélectionne Linebet ou 888Starz ci-dessous. Ton code promo est copié automatiquement — utilise-le à l’inscription.',
    s2t: 'Inscris-toi et dépose',
    s2d: 'Crée ton compte avec le code, puis fais le premier dépôt demandé par le partenaire (à partir de 3 000 F via Wave, Orange Money, MTN ou Moov).',
    s3t: 'Valide ton ID sur WhatsApp',
    s3d: 'Ouvre le déblocage, saisis ton ID joueur et envoie la demande. Le support active ton accès après vérification des conditions.',
    accEyebrow: 'Ton accès VIP',
    accTitle: 'Choisis ton bookmaker partenaire',
    accSub: 'Deux opérateurs licenciés, un seul parcours : code promo copié, inscription, dépôt, puis demande WhatsApp.',
    codeNoteLinebet: 'Code en MAJUSCULES',
    codeNoteStar: 'Code en minuscules',
    codeLabel: 'Ton code promo (copié automatiquement)',
    copy: 'Copier',
    copied: 'Copié ✓',
    signup: 'M’inscrire sur',
    download: 'Télécharger l’application',
    privacy: 'Ton ID reste dans le message WhatsApp que tu choisis d’envoyer. BTTSPredict ne le reçoit pas.',
    responsible: '18+ · Aucun gain n’est garanti. Vérifie toujours les conditions du partenaire.',
    trustEyebrow: 'Confiance vérifiable',
    trustTitle: 'Pourquoi faire confiance à BTTSPredict',
    t1t: 'Méthode documentée',
    t1d: 'Le modèle Poisson + xG, ses sources et ses limites sont expliqués publiquement.',
    t1l: 'Lire la méthodologie',
    t2t: 'Résultats vérifiés',
    t2d: 'Chaque statut WIN/LOST est validé contre le score final ESPN, horodatage inclus.',
    t2l: 'Voir les résultats vérifiés',
    t3t: 'Zéro donnée personnelle',
    t3d: 'Ton ID joueur ne transite que dans le message WhatsApp que tu envoies toi-même.',
    t4t: 'Partenaires licenciés',
    t4d: 'Linebet et 888Starz sont des opérateurs sous licence. L’accès est réservé aux 18+.',
    faqEyebrow: 'Questions fréquentes',
    faqTitle: 'Tout ce qu’il faut savoir avant de demander l’accès',
    q1: 'L’accès VIP est-il payant ?',
    a1: 'Non. BTTSPredict ne vend rien : l’accès est offert via ton inscription chez un partenaire officiel avec le code promo affiché. Le dépôt effectué reste sur ton compte bookmaker, pas sur ce site.',
    q2: 'Combien de temps avant d’être activé ?',
    a2: 'Moins de 5 minutes : inscription avec le code, premier dépôt, puis demande WhatsApp avec ton ID joueur. Le support confirme l’activation après vérification des conditions du partenaire.',
    q3: 'Quels moyens de paiement sont acceptés ?',
    a3: 'Les moyens locaux du partenaire : Wave, Orange Money, MTN MoMo, Moov et les autres options disponibles sur la plateforme choisie, à partir de 3 000 F.',
    q4: 'Comment vais-je recevoir les sélections ?',
    a4: 'Sur WhatsApp. Le combiné VIP du jour (3 à 5 matchs) est envoyé avant les coups d’envoi, avec le marché, la sélection et le niveau de fiabilité.',
    q5: 'Les gains sont-ils garantis ?',
    a5: 'Non — personne ne peut garantir un gain, et qui le prétend te ment. Nos résultats vérifiés sont publics : regarde-les, compare-les, puis décide. 18+ · Joue de façon responsable.',
    finalTitle: 'Prêt à débloquer le combiné VIP ?',
    finalSub: 'Choisis ton partenaire, utilise le code promo et envoie ta demande. Ton accès est activé après vérification — et le combiné du jour t’attend déjà.',
    finalBtn: 'Débloquer mon accès VIP',
    finalNote: '18+ · Aucun gain n’est garanti · Jeu responsable',
    modalTitle: 'Prépare ta demande VIP',
  },
  en: {
    topbar: 'Private access — picks published before kick-off',
    badge: 'VIP space · Invitation only',
    titleA: 'Today’s VIP combo',
    titleB: 'is already locked in.',
    sub: 'Join the BTTSPredict VIP space: every day, a 3–5 leg BTTS & Over 2.5 combo selected by our Poisson + xG model, delivered on WhatsApp before kick-off. Your access is free with the partner code — you pay nothing on this site.',
    ctaPrimary: 'Unlock my VIP access',
    ctaSecondary: 'See today’s combo',
    chipOfficial: 'Licensed official partners',
    chipVerified: 'Publicly verified results',
    chip18: '18+ · Gamble responsibly',
    cardTier: 'VIP member',
    cardHolder: 'Member',
    cardSince: 'Access active',
    cardPill: 'Picks before kick-off',
    proofEyebrow: 'Proof before promises',
    proofTitle: 'Public results, verified score by score',
    proofSub: 'Every pick is time-stamped before kick-off, then marked WIN or LOST against the final score (ESPN source). You can verify everything — that’s the point.',
    statVerified: 'Verified picks',
    statWon: 'Winners',
    statRate: 'Win rate',
    statGold: 'GOLD-tier win rate',
    proofLink: 'Verify the full history',
    proofNoteA: 'Public tracking since',
    proofNoteB: 'Past performance guarantees nothing — bet responsibly.',
    combosEyebrow: 'Today',
    combosTitle: 'Today’s VIP combo',
    combosIntro: 'Today’s matches are visible. The market, the selection and the odds stay locked until your VIP access is active.',
    comboVipToday: 'Today’s VIP combo',
    combo5: 'VIP combo · 5 matches',
    matchOnlyBadge: 'VIP',
    comboLegs: 'matches',
    lockedBadge: 'Locked',
    legsNote: 'Selection hidden',
    unlockSmall: 'Unlock',
    unavailable: 'Today’s VIP combo will be available after the next update.',
    benEyebrow: 'What you get',
    benTitle: 'Six reasons to activate your access',
    b1t: 'Daily VIP combo',
    b1d: '3–5 matches selected every day with market and odds, published before kick-off.',
    b2t: 'Poisson + xG model',
    b2d: 'Probabilities built on expected goals, recent form and public ESPN data — not gut feeling.',
    b3t: 'Reliability tiers',
    b3d: 'Every pick is rated GOLD, SILVER or STANDARD by probability, so you decide with full information.',
    b4t: 'WhatsApp delivery',
    b4d: 'Your picks land straight on WhatsApp. No extra app, no account to create here.',
    b5t: '4-hour updates',
    b5d: 'The dataset is recomputed four times a day until kick-off: probabilities, reliability, timestamps.',
    b6t: 'Transparent history',
    b6d: 'Winner or loser, every past pick stays public. Trust is meant to be checked.',
    stepEyebrow: 'Activation in 3 steps',
    stepTitle: 'Under 5 minutes to join the VIP',
    s1t: 'Pick your partner',
    s1d: 'Select Linebet or 888Starz below. Your promo code is copied automatically — use it at sign-up.',
    s2t: 'Register and deposit',
    s2d: 'Create your account with the code, then make the first deposit requested by the partner (from 3,000 F via Wave, Orange Money, MTN or Moov).',
    s3t: 'Validate your ID on WhatsApp',
    s3d: 'Open the unlock flow, enter your player ID and send the request. Support activates your access after checking the terms.',
    accEyebrow: 'Your VIP access',
    accTitle: 'Choose your partner bookmaker',
    accSub: 'Two licensed operators, one path: code copied, sign-up, deposit, then WhatsApp request.',
    codeNoteLinebet: 'Uppercase code',
    codeNoteStar: 'Lowercase code',
    codeLabel: 'Your promo code (copied automatically)',
    copy: 'Copy',
    copied: 'Copied ✓',
    signup: 'Sign up on',
    download: 'Download the app',
    privacy: 'Your ID stays in the WhatsApp message you choose to send. BTTSPredict does not receive it.',
    responsible: '18+ · No profit is guaranteed. Always check the partner’s terms.',
    trustEyebrow: 'Verifiable trust',
    trustTitle: 'Why trust BTTSPredict',
    t1t: 'Documented method',
    t1d: 'The Poisson + xG model, its sources and its limits are explained publicly.',
    t1l: 'Read the methodology',
    t2t: 'Verified results',
    t2d: 'Every WIN/LOST status is validated against the final ESPN score, timestamps included.',
    t2l: 'See verified results',
    t3t: 'Zero personal data',
    t3d: 'Your player ID only travels inside the WhatsApp message you send yourself.',
    t4t: 'Licensed partners',
    t4d: 'Linebet and 888Starz are licensed operators. Access is 18+ only.',
    faqEyebrow: 'FAQ',
    faqTitle: 'Everything to know before requesting access',
    q1: 'Is VIP access paid?',
    a1: 'No. BTTSPredict sells nothing: access is offered through sign-up with an official partner using the displayed promo code. Your deposit stays in your bookmaker account, not on this site.',
    q2: 'How long until I’m activated?',
    a2: 'Under 5 minutes: register with the code, make the first deposit, then send the WhatsApp request with your player ID. Support confirms activation after checking the partner’s terms.',
    q3: 'Which payment methods are accepted?',
    a3: 'The partner’s local options: Wave, Orange Money, MTN MoMo, Moov and others available on the chosen platform, from 3,000 F.',
    q4: 'How do I receive the picks?',
    a4: 'On WhatsApp. The daily VIP combo (3–5 matches) is sent before kick-off with the market, the selection and the reliability tier.',
    q5: 'Are winnings guaranteed?',
    a5: 'No — nobody can guarantee winnings, and anyone who claims otherwise is lying. Our verified results are public: look at them, compare, then decide. 18+ · Gamble responsibly.',
    finalTitle: 'Ready to unlock today’s VIP combo?',
    finalSub: 'Choose your partner, use the promo code and send your request. Your access is activated after verification — today’s combo is already waiting.',
    finalBtn: 'Unlock my VIP access',
    finalNote: '18+ · No profit is guaranteed · Gamble responsibly',
    modalTitle: 'Prepare your VIP request',
  },
  ar: {
    topbar: 'وصول خاص — الاختيارات تُنشر قبل انطلاق المباريات',
    badge: 'مساحة VIP · بالدعوة فقط',
    titleA: 'مركّب VIP اليوم',
    titleB: 'جاهز بالفعل.',
    sub: 'انضم إلى مساحة VIP من BTTSPredict: كل يوم، مركّب من 3 إلى 5 مباريات BTTS وOver 2.5 مختار من نموذج Poisson + xG، يُرسل عبر واتساب قبل انطلاق المباريات. وصولك مجاني بالرمز الشريك — لا تدفع أي شيء على هذا الموقع.',
    ctaPrimary: 'افتح وصولي إلى VIP',
    ctaSecondary: 'شاهد مركّب اليوم',
    chipOfficial: 'شركاء رسميون مرخّصون',
    chipVerified: 'نتائج موثقة علناً',
    chip18: '+18 · راهن بمسؤولية',
    cardTier: 'عضو VIP',
    cardHolder: 'عضو',
    cardSince: 'الوصول مفعّل',
    cardPill: 'اختيارات قبل الانطلاق',
    proofEyebrow: 'الإثبات قبل الوعد',
    proofTitle: 'نتائج علنية موثقة مباراة بمباراة',
    proofSub: 'كل توقع يُسجَّل بتاريخ ووقت قبل الانطلاق، ثم يُعلَّم WIN أو LOST مقابل النتيجة النهائية (مصدر ESPN). يمكنك التحقق من كل شيء — وهذا هو الهدف.',
    statVerified: 'توقعات موثقة',
    statWon: 'رابحة',
    statRate: 'نسبة النجاح',
    statGold: 'نجاح فئة GOLD',
    proofLink: 'تحقق من السجل الكامل',
    proofNoteA: 'تتبع علني منذ',
    proofNoteB: 'الأداء السابق لا يضمن أي نتيجة مستقبلية — راهن بمسؤولية.',
    combosEyebrow: 'اليوم',
    combosTitle: 'مركّب VIP لليوم',
    combosIntro: 'مباريات اليوم ظاهرة. يبقى السوق والاختيار والمعامل مقفلين حتى يصبح وصول VIP الخاص بك نشطاً.',
    comboVipToday: 'مركّب VIP لليوم',
    combo5: 'مركّب VIP · 5 مباريات',
    matchOnlyBadge: 'VIP',
    comboLegs: 'مباريات',
    lockedBadge: 'مقفل',
    legsNote: 'اختيار مخفي',
    unlockSmall: 'فتح',
    unavailable: 'سيكون مركّب VIP لليوم متاحاً بعد التحديث القادم.',
    benEyebrow: 'ماذا تتلقى',
    benTitle: 'ستة أسباب لتفعيل وصولك',
    b1t: 'مركّب VIP يومي',
    b1d: 'من 3 إلى 5 مباريات مختارة كل يوم مع السوق والمعامل، تُنشر قبل الانطلاق.',
    b2t: 'نموذج Poisson + xG',
    b2d: 'احتمالات مبنية على الأهداف المتوقعة والفورمة الأخيرة وبيانات ESPN العلنية — وليس على الحدس.',
    b3t: 'مستويات موثوقية',
    b3d: 'كل اختيار يُقيّم GOLD أو SILVER أو STANDARD حسب الاحتمال، لتقرر بمعرفة كاملة.',
    b4t: 'توصيل عبر واتساب',
    b4d: 'اختياراتك تصل مباشرة إلى واتساب. لا تطبيق إضافي ولا حساب هنا.',
    b5t: 'تحديثات كل 4 ساعات',
    b5d: 'تُعاد حسابات البيانات أربع مرات يومياً حتى الانطلاق: الاحتمالات والموثوقية والطوابع الزمنية.',
    b6t: 'سجل شفاف',
    b6d: 'رابحاً كان أم خاسراً، يبقى كل توقع سابق متاحاً للعموم. الثقة تُفحص.',
    stepEyebrow: 'التفعيل في 3 خطوات',
    stepTitle: 'أقل من 5 دقائق للانضمام إلى VIP',
    s1t: 'اختر شريكك',
    s1d: 'اختر Linebet أو 888Starz أدناه. يُنسخ رمزك الترويجي تلقائياً — استخدمه عند التسجيل.',
    s2t: 'سجّل وأودع',
    s2d: 'أنشئ حسابك بالرمز، ثم أجرِ الإيداع الأول الذي يطلبه الشريك (ابتداءً من 3,000 فرنك عبر Wave أو Orange Money أو MTN أو Moov).',
    s3t: 'أكّد معرفك عبر واتساب',
    s3d: 'افتح مسار الفتح، أدخل معرف اللاعب وأرسل الطلب. يفعّل الدعم وصولك بعد التحقق من الشروط.',
    accEyebrow: 'وصولك إلى VIP',
    accTitle: 'اختر شركة المراهنات الشريكة',
    accSub: 'مشغّلان مرخّصان، مسار واحد: رمز منسوخ، تسجيل، إيداع، ثم طلب عبر واتساب.',
    codeNoteLinebet: 'رمز بأحرف كبيرة',
    codeNoteStar: 'رمز بأحرف صغيرة',
    codeLabel: 'رمزك الترويجي (منسوخ تلقائياً)',
    copy: 'نسخ',
    copied: 'تم النسخ ✓',
    signup: 'التسجيل في',
    download: 'تحميل التطبيق',
    privacy: 'يبقى معرفك داخل رسالة واتساب التي تختار إرسالها. لا تستلمه BTTSPredict.',
    responsible: '+18 · لا يوجد ربح مضمون. تحقق دائماً من شروط الشريك.',
    trustEyebrow: 'ثقة قابلة للتحقق',
    trustTitle: 'لماذا تثق في BTTSPredict',
    t1t: 'منهجية موثقة',
    t1d: 'نموذج Poisson + xG ومصادره وحدوده مشروحة علناً.',
    t1l: 'اقرأ المنهجية',
    t2t: 'نتائج موثقة',
    t2d: 'كل حالة WIN/LOST تُصادق على النتيجة النهائية من ESPN مع الطوابع الزمنية.',
    t2l: 'شاهد النتائج الموثقة',
    t3t: 'صفر بيانات شخصية',
    t3d: 'معرف اللاعب يسافر فقط داخل رسالة واتساب التي ترسلها بنفسك.',
    t4t: 'شركاء مرخّصون',
    t4d: 'Linebet و888Starz مشغّلان مرخّصان. الوصول +18 فقط.',
    faqEyebrow: 'أسئلة متكررة',
    faqTitle: 'كل ما تحتاج معرفته قبل طلب الوصول',
    q1: 'هل وصول VIP مدفوع؟',
    a1: 'لا. BTTSPredict لا يبيع شيئاً: الوصول مجاني عبر تسجيلك لدى شريك رسمي بالرمز الترويجي المعروض. يبقى إيداعك في حسابك لدى الشركة، وليس على هذا الموقع.',
    q2: 'كم من الوقت يستغرق التفعيل؟',
    a2: 'أقل من 5 دقائق: سجّل بالرمز، أجرِ الإيداع الأول، ثم أرسل طلب واتساب بمعرف اللاعب. يؤكد الدعم التفعيل بعد التحقق من شروط الشريك.',
    q3: 'ما وسائل الدفع المقبولة؟',
    a3: 'الخيارات المحلية للشريك: Wave وOrange Money وMTN MoMo وMoov وغيرها المتوفرة على المنصة المختارة، ابتداءً من 3,000 فرنك.',
    q4: 'كيف أستلم الاختيارات؟',
    a4: 'عبر واتساب. يُرسل مركّب VIP اليومي (3–5 مباريات) قبل الانطلاق مع السوق والاختيار ومستوى الموثوقية.',
    q5: 'هل الأرباح مضمونة؟',
    a5: 'لا — لا أحد يضمن أرباحاً، ومن يدّعي ذلك يكذب. نتائجنا الموثقة علنية: انظر إليها وقارن ثم قرر. +18 · راهن بمسؤولية.',
    finalTitle: 'جاهز لفتح مركّب VIP اليوم؟',
    finalSub: 'اختر شريكك، استخدم الرمز الترويجي وأرسل طلبك. يُفعَّل وصولك بعد التحقق — ومركّب اليوم ينتظرك بالفعل.',
    finalBtn: 'افتح وصولي إلى VIP',
    finalNote: '+18 · لا يوجد ربح مضمون · راهن بمسؤولية',
    modalTitle: 'جهّز طلب VIP',
  },
} as const

export default function VipPage({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const text = copy[lang]
  const [bookmaker, setBookmaker] = useState<Bookmaker>('linebet')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [matchOnlyCombos, setMatchOnlyCombos] = useState<{ target3: VipCombo | null; target5: VipCombo | null } | null>(null)
  const [realStats, setRealStats] = useState<typeof FALLBACK_STATS | null>(null)

  const selected = BRAND[bookmaker]
  const signupLink = bookmaker === 'linebet' ? AFFILIATE.linebet : AFFILIATE.star888
  const downloadLink = bookmaker === 'linebet' ? AFFILIATE.linebetDownload : AFFILIATE.star888Download
  const code = selected.code
  const today = dakarDate()
  const todaySlash = today.split('-').reverse().join('/')
  const stats = realStats ?? FALLBACK_STATS

  const localeTag = lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR'
  const numFmt = (value: number) =>
    new Intl.NumberFormat(localeTag, { maximumFractionDigits: 1 }).format(value)
  const longDate = (iso: string) => {
    const d = new Date(`${iso}T00:00:00Z`)
    return Number.isNaN(d.getTime())
      ? iso
      : new Intl.DateTimeFormat(localeTag, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d)
  }

  const availableCombos = [
    hasFutureLegs(matchOnlyCombos?.target3)
      ? { key: 'target3' as const, combo: matchOnlyCombos.target3, title: text.comboVipToday }
      : null,
    hasFutureLegs(matchOnlyCombos?.target5)
      ? { key: 'target5' as const, combo: matchOnlyCombos.target5, title: text.combo5 }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    let cancelled = false
    fetch('/predictions.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() as Promise<{ date?: string; free?: PredictionFixture[]; vipPreview?: PredictionFixture[]; predictions?: PredictionFixture[] }> : null)
      .then((payload) => {
        if (!cancelled && payload?.date === dakarDate()) setMatchOnlyCombos(buildMatchOnlyCombos(payload))
      })
      .catch(() => {
        if (!cancelled) setMatchOnlyCombos(null)
      })
    return () => { cancelled = true }
  }, [])

  /* Stats réelles — win-history.json est régénéré à chaque pipeline (vérification ESPN) */
  useEffect(() => {
    let cancelled = false
    const clean = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)
    fetch('/win-history.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() as Promise<WinHistoryPayload> : null)
      .then((payload) => {
        if (cancelled || !payload?.stats) return
        setRealStats({
          total: clean(payload.stats.total, FALLBACK_STATS.total),
          won: clean(payload.stats.won, FALLBACK_STATS.won),
          rate: clean(payload.stats.rate, FALLBACK_STATS.rate),
          goldRate: clean(payload.stats.gold?.rate, FALLBACK_STATS.goldRate),
          since: payload.stats.period?.from || FALLBACK_STATS.since,
        })
      })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [])

  const openUnlock = () => {
    trackAffiliateAction(bookmaker, 'vip_unlock_open', 'vip-access-page')
    setShowModal(true)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(textarea)
    }
    trackAffiliateCodeCopy(bookmaker, 'vip-access-code')
    setCopied(true)
    setToast(`${code} · ${text.copied}`)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const chooseBookmaker = (next: Bookmaker) => {
    setBookmaker(next)
    setCopied(false)
    trackAffiliateAction(next, 'promo_view', 'vip-access-page')
    const nextCode = BRAND[next].code
    navigator.clipboard?.writeText(nextCode).catch(() => undefined)
    trackAffiliateCodeCopy(next, 'vip-access-auto-copy')
  }

  const benefits = [
    { icon: ICONS.ticket, t: text.b1t, d: text.b1d },
    { icon: ICONS.chart, t: text.b2t, d: text.b2d },
    { icon: ICONS.medal, t: text.b3t, d: text.b3d },
    { icon: ICONS.whatsapp, t: text.b4t, d: text.b4d },
    { icon: ICONS.refresh, t: text.b5t, d: text.b5d },
    { icon: ICONS.history, t: text.b6t, d: text.b6d },
  ]

  const steps = [
    { n: '1', t: text.s1t, d: text.s1d },
    { n: '2', t: text.s2t, d: text.s2d },
    { n: '3', t: text.s3t, d: text.s3d },
  ]

  const trusts: { icon: React.ReactNode; t: string; d: string; href?: string; l?: string }[] = [
    { icon: ICONS.method, t: text.t1t, d: text.t1d, href: '/methodologie', l: text.t1l },
    { icon: ICONS.verified, t: text.t2t, d: text.t2d, href: '/resultats-verifies', l: text.t2l },
    { icon: ICONS.nodata, t: text.t3t, d: text.t3d },
    { icon: ICONS.license, t: text.t4t, d: text.t4d },
  ]

  const faqs = [
    { q: text.q1, a: text.a1 },
    { q: text.q2, a: text.a2 },
    { q: text.q3, a: text.a3 },
    { q: text.q4, a: text.a4 },
    { q: text.q5, a: text.a5 },
  ]

  return (
    <div className="vipx" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="vipx-main">
        {toast && <div className="vipx-toast" role="status">{toast}</div>}

        {/* ═══ HERO ═══ */}
        <section className="vipx-hero" aria-labelledby="vipx-title">
          <div className="vipx-hero__glow" aria-hidden="true" />
          <div className="vipx-shell vipx-hero__grid">
            <div className="vipx-hero__copy">
              <p className="vipx-topbar"><span aria-hidden="true" />{text.topbar}</p>
              <span className="vipx-badge">{ICONS.crown}{text.badge}</span>
              <h1 id="vipx-title">{text.titleA} <span className="vipx-gold">{text.titleB}</span></h1>
              <p className="vipx-hero__sub">{text.sub}</p>
              <div className="vipx-hero__cta">
                <a href="#vipx-access" className="vipx-btn vipx-btn--gold">{text.ctaPrimary}{ICONS.arrow}</a>
                <a href="#vipx-combos" className="vipx-btn vipx-btn--ghost">{text.ctaSecondary}</a>
              </div>
              <ul className="vipx-chips">
                <li>{ICONS.check}{text.chipOfficial}</li>
                <li>{ICONS.shield}{text.chipVerified}</li>
                <li>{ICONS.lock}{text.chip18}</li>
              </ul>
            </div>
            <div className="vipx-hero__visual">
              <div className="vipx-card" aria-hidden="true">
                <div className="vipx-card__shine" />
                <div className="vipx-card__head">
                  <span className="vipx-card__tier">{text.cardTier}</span>
                  <span className="vipx-card__crown">{ICONS.crown}</span>
                </div>
                <div className="vipx-card__chip" />
                <p className="vipx-card__number">•••• &nbsp;•••• &nbsp;•••• &nbsp;<span>VIP</span></p>
                <div className="vipx-card__foot">
                  <div><small>{text.cardHolder}</small><strong>BTTSPREDICT</strong></div>
                  <div><small>{text.cardSince}</small><strong>{todaySlash}</strong></div>
                </div>
              </div>
              <div className="vipx-card__pill" aria-hidden="true">{ICONS.unlock}{text.cardPill}</div>
            </div>
          </div>
        </section>

        {/* ═══ PREUVES (stats réelles vérifiées) ═══ */}
        <section className="vipx-proof" aria-labelledby="vipx-proof-title">
          <div className="vipx-shell">
            <div className="vipx-proof__head">
              <div>
                <p className="vipx-eyebrow">{text.proofEyebrow}</p>
                <h2 id="vipx-proof-title">{text.proofTitle}</h2>
              </div>
              <a className="vipx-proof__link" href="/resultats-verifies">{text.proofLink}{ICONS.arrow}</a>
            </div>
            <p className="vipx-proof__sub">{text.proofSub}</p>
            <dl className="vipx-stats">
              <div className="vipx-stat"><dt>{text.statVerified}</dt><dd>{numFmt(stats.total)}</dd></div>
              <div className="vipx-stat"><dt>{text.statWon}</dt><dd>{numFmt(stats.won)}</dd></div>
              <div className="vipx-stat vipx-stat--gold"><dt>{text.statRate}</dt><dd>{numFmt(stats.rate)}<small>%</small></dd></div>
              <div className="vipx-stat vipx-stat--gold"><dt>{text.statGold}</dt><dd>{numFmt(stats.goldRate)}<small>%</small></dd></div>
            </dl>
            <p className="vipx-proof__note">
              {text.proofNoteA} <strong>{longDate(stats.since)}</strong>. {text.proofNoteB}
            </p>
          </div>
        </section>

        {/* ═══ COMBINÉS DU JOUR (verrouillés) ═══ */}
        <section id="vipx-combos" className="vipx-section vipx-shell" aria-labelledby="vipx-combos-title">
          <div className="vipx-section__head">
            <p className="vipx-eyebrow">{text.combosEyebrow} · {todaySlash}</p>
            <h2 id="vipx-combos-title">{text.combosTitle}</h2>
            <p className="vipx-section__sub">{text.combosIntro}</p>
          </div>
          {availableCombos.length > 0 ? (
            <div className="vipx-combos">
              {availableCombos.map(({ key, combo, title }) => (
                <article key={key} className={`vipx-combo ${key === 'target5' ? 'vipx-combo--featured' : ''}`}>
                  <header className="vipx-combo__head">
                    <div>
                      <p className="vipx-combo__name">{title}</p>
                      <strong className="vipx-combo__count">{text.matchOnlyBadge} · {combo.legs.length} {text.comboLegs}</strong>
                    </div>
                    <span className="vipx-combo__lock">{ICONS.lock}{text.lockedBadge}</span>
                  </header>
                  <div className="vipx-combo__legs">
                    {combo.legs.map((leg) => (
                      <div className="vipx-leg" key={`${key}-${leg.eventId}`}>
                        <div className="vipx-leg__teams">
                          <small>{leg.league}</small>
                          <strong>{leg.home} <em>vs</em> {leg.away}</strong>
                        </div>
                        <div className="vipx-leg__right">
                          <span className="vipx-leg__masked">{text.legsNote}</span>
                          <time dateTime={leg.kickoff}>{formatKickoff(leg.kickoff, lang)}</time>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={openUnlock} className="vipx-combo__unlock" data-cta="vip-access-combo-unlock">
                    {ICONS.unlock}{text.unlockSmall}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="vipx-empty" role="status"><p>{text.unavailable}</p></div>
          )}
        </section>

        {/* ═══ AVANTAGES ═══ */}
        <section className="vipx-section vipx-shell" aria-labelledby="vipx-ben-title">
          <div className="vipx-section__head">
            <p className="vipx-eyebrow">{text.benEyebrow}</p>
            <h2 id="vipx-ben-title">{text.benTitle}</h2>
          </div>
          <div className="vipx-bens">
            {benefits.map((b) => (
              <article className="vipx-ben" key={b.t}>
                <span className="vipx-ben__icon">{b.icon}</span>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ═══ PARCOURS 3 ÉTAPES ═══ */}
        <section className="vipx-section vipx-shell" aria-labelledby="vipx-step-title">
          <div className="vipx-section__head">
            <p className="vipx-eyebrow">{text.stepEyebrow}</p>
            <h2 id="vipx-step-title">{text.stepTitle}</h2>
          </div>
          <ol className="vipx-steps">
            {steps.map((s) => (
              <li className="vipx-step" key={s.n}>
                <span className="vipx-step__num">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ═══ BLOC DE CONVERSION — PARTENAIRE + CODE ═══ */}
        <section id="vipx-access" className="vipx-section" aria-labelledby="vipx-acc-title">
          <div className="vipx-shell">
            <div className="vipx-access">
              <div className="vipx-access__head">
                <p className="vipx-eyebrow">{text.accEyebrow}</p>
                <h2 id="vipx-acc-title">{text.accTitle}</h2>
                <p className="vipx-section__sub">{text.accSub}</p>
              </div>

              <div className="vipx-partners" role="group" aria-label={text.accTitle}>
                {(Object.keys(BRAND) as Bookmaker[]).map((key) => {
                  const brand = BRAND[key]
                  const isSelected = bookmaker === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => chooseBookmaker(key)}
                      className={`vipx-partner ${isSelected ? 'is-selected' : ''}`}
                      aria-pressed={isSelected}
                    >
                      <span className="vipx-partner__logo">
                        <img src={key === 'linebet' ? '/logos/linebet-provided.jpg' : '/logos/888starz-provided.webp'} alt={`${brand.label} logo`} />
                      </span>
                      <span className="vipx-partner__body">
                        <strong>{brand.label}</strong>
                        <small>{key === 'linebet' ? text.codeNoteLinebet : text.codeNoteStar}</small>
                      </span>
                      <span className="vipx-partner__check" aria-hidden="true">{ICONS.check}</span>
                    </button>
                  )
                })}
              </div>

              <div className="vipx-code">
                <div className="vipx-code__text">
                  <span>{text.codeLabel}</span>
                  <strong>{code}</strong>
                </div>
                <button type="button" onClick={copyCode} className="vipx-code__copy" aria-label={`${text.copy} ${code}`}>
                  {copied ? ICONS.check : ICONS.copy}
                  <span>{copied ? text.copied : text.copy}</span>
                </button>
              </div>

              <div className="vipx-actions">
                <a
                  href={signupLink}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  onClick={() => trackAffiliateAction(bookmaker, 'signup', 'vip-access-page')}
                  className="vipx-btn vipx-btn--gold vipx-btn--big"
                  data-cta="vip-access-signup"
                >
                  {text.signup} {selected.label}{ICONS.arrow}
                </a>
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  onClick={() => trackAffiliateAction(bookmaker, 'download', 'vip-access-page')}
                  className="vipx-btn vipx-btn--outline vipx-btn--big"
                  data-cta="vip-access-download"
                >
                  {ICONS.download}{text.download}
                </a>
              </div>

              <p className="vipx-access__privacy">{ICONS.shield}{text.privacy}</p>
              <p className="vipx-access__responsible">{text.responsible}</p>
            </div>
          </div>
        </section>

        {/* ═══ CONFIANCE ═══ */}
        <section className="vipx-section vipx-shell" aria-labelledby="vipx-trust-title">
          <div className="vipx-section__head">
            <p className="vipx-eyebrow">{text.trustEyebrow}</p>
            <h2 id="vipx-trust-title">{text.trustTitle}</h2>
          </div>
          <div className="vipx-trusts">
            {trusts.map((item) => (
              <article className="vipx-trust" key={item.t}>
                <span className="vipx-trust__icon">{item.icon}</span>
                <h3>{item.t}</h3>
                <p>{item.d}</p>
                {item.href && <a href={item.href}>{item.l}{ICONS.arrow}</a>}
              </article>
            ))}
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="vipx-section vipx-shell vipx-faq" aria-labelledby="vipx-faq-title">
          <div className="vipx-section__head">
            <p className="vipx-eyebrow">{text.faqEyebrow}</p>
            <h2 id="vipx-faq-title">{text.faqTitle}</h2>
          </div>
          <div className="vipx-faq__list">
            {faqs.map((f) => (
              <details className="vipx-faq__item" key={f.q}>
                <summary>{f.q}<span className="vipx-faq__plus" aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="vipx-section vipx-shell" aria-labelledby="vipx-final-title">
          <div className="vipx-final">
            <h2 id="vipx-final-title">{text.finalTitle}</h2>
            <p>{text.finalSub}</p>
            <button type="button" onClick={openUnlock} className="vipx-btn vipx-btn--dark vipx-btn--big" data-cta="vip-access-unlock">
              {text.finalBtn}{ICONS.arrow}
            </button>
            <p className="vipx-final__note">{text.finalNote}</p>
          </div>
        </section>

      </main>

      <ErrorBoundary><Footer /></ErrorBoundary>

      <VipUnlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={text.modalTitle}
      />
    </div>
  )
}
