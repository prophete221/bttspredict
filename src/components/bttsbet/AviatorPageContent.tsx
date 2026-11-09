import dynamic from 'next/dynamic'
import { ArrowUpRight, Eye, Plane, ScanLine } from 'lucide-react'
import { localizedPath, type Locale } from '@/lib/i18n'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })

export const AVIATOR_PAGE_COPY: Record<Locale, {
  eyebrow: string; title: string; intro: string; badge: string
  sectionTitle: string; sectionIntro: string
  steps: Array<{ title: string; body: string }>
  explains: string; explainsBody: string; limits: string; limitsBody: string
  sourceLabel: string; sourceBody: string; sourceLink: string; responsible: string
}> = {
  fr: {
    eyebrow: 'Aviator · lecture simple',
    title: 'Aviator, le jeu expliqué en clair',
    intro: 'Un avion décolle, le multiplicateur monte, puis la manche s’arrête. Le joueur choisit s’il retire avant cet arrêt. Découvrez comment lire une manche et comprendre les informations affichées.',
    badge: 'Comprendre · Observer · Lire',
    sectionTitle: 'Trois repères pour lire une manche',
    sectionIntro: 'Le multiplicateur, l’arrêt de la manche et l’historique : une lecture simple des informations du jeu.',
    steps: [
      { title: 'Suivre le multiplicateur', body: 'Il évolue pendant la manche. Le joueur peut choisir de retirer avant son arrêt.' },
      { title: 'Lire un résultat', body: 'Un résultat publié décrit la fin d’une manche déjà jouée. Sa source et sa date permettent de le situer.' },
      { title: 'Replacer dans son contexte', body: 'Un historique aide à parcourir les manches passées; il ne révèle pas le prochain multiplicateur.' },
    ],
    explains: 'Ce que cette lecture peut montrer',
    explainsBody: 'Un résumé lisible de résultats déjà publiés, avec leur source et leur date, si un flux autorisé devient disponible.',
    limits: 'Ce qu’elle ne prétend pas faire',
    limitsBody: 'Elle ne prédit pas le prochain multiplicateur, ne garantit aucun gain et ne lit jamais les comptes des joueurs.',
    sourceLabel: 'Fonctionnement du jeu',
    sourceBody: 'SPRIBE décrit une courbe croissante qui peut s’arrêter à tout moment : le multiplicateur augmente et le joueur doit retirer avant que l’avion disparaisse. Cette page ne reçoit aucune donnée de manche et n’affiche donc aucun résultat.',
    sourceLink: 'Voir la page officielle de SPRIBE',
    responsible: '18+ · Jouer dans le respect de ses limites.',
  },
  en: {
    eyebrow: 'Aviator · a simple read',
    title: 'Aviator, clearly explained',
    intro: 'A plane takes off, the multiplier rises, then the round ends. A player chooses whether to cash out before that point. Explore how to read a round and understand the information on screen.',
    badge: 'Understand · Observe · Read',
    sectionTitle: 'Three pointers for reading a round',
    sectionIntro: 'The multiplier, the end of a round and its history: a simple reading of the game’s information.',
    steps: [
      { title: 'Follow the multiplier', body: 'It changes throughout a round. A player can choose to cash out before the round ends.' },
      { title: 'Read an outcome', body: 'A published outcome describes a round already played. Its source and date put it in context.' },
      { title: 'Keep the context', body: 'A history helps you explore past rounds; it does not reveal the next multiplier.' },
    ],
    explains: 'What this reading can show',
    explainsBody: 'A clear summary of already published outcomes, with their source and date, if an authorized feed becomes available.',
    limits: 'What it does not claim to do',
    limitsBody: 'It does not predict the next multiplier, promise a win, or read player accounts.',
    sourceLabel: 'How the game works',
    sourceBody: 'SPRIBE describes an increasing curve that can crash at any time: the multiplier grows, and a player must cash out before the plane flies away. This page receives no round data and therefore displays no outcomes.',
    sourceLink: 'View SPRIBE’s official page',
    responsible: '18+ · Keep play within your limits.',
  },
  ar: {
    eyebrow: 'Aviator · قراءة مبسطة',
    title: 'Aviator: شرح واضح للعبة',
    intro: 'تقلع الطائرة ويرتفع المضاعف ثم تنتهي الجولة. يختار اللاعب ما إذا كان سيصرف قبل تلك اللحظة. تعرّف إلى طريقة قراءة الجولة وفهم المعلومات المعروضة.',
    badge: 'فهم · ملاحظة · قراءة',
    sectionTitle: 'ثلاث نقاط لفهم الجولة',
    sectionIntro: 'المضاعف ونهاية الجولة والسجل: قراءة بسيطة للمعلومات التي تعرضها اللعبة.',
    steps: [
      { title: 'متابعة المضاعف', body: 'يتغير المضاعف خلال الجولة. يستطيع اللاعب اختيار الصرف قبل انتهائها.' },
      { title: 'قراءة النتيجة', body: 'تصف النتيجة المنشورة جولة لُعبت بالفعل. ويساعد مصدرها وتاريخها على وضعها في سياقها.' },
      { title: 'فهم السياق', body: 'يساعد السجل على استعراض الجولات السابقة، لكنه لا يكشف المضاعف التالي.' },
    ],
    explains: 'ما الذي يمكن أن تعرضه القراءة',
    explainsBody: 'ملخص واضح لنتائج منشورة سابقاً مع مصدرها وتاريخها، إذا توفر تدفق بيانات مصرح به.',
    limits: 'ما الذي لا تدّعيه',
    limitsBody: 'لا تتنبأ بالمضاعف التالي، ولا تضمن الربح، ولا تطّلع على حسابات اللاعبين.',
    sourceLabel: 'آلية اللعبة',
    sourceBody: 'تصف SPRIBE منحنى متزايداً قد يتوقف في أي وقت: يرتفع المضاعف، ويجب على اللاعب الصرف قبل اختفاء الطائرة. لا تتلقى هذه الصفحة بيانات للجولات، ولذلك لا تعرض نتائج.',
    sourceLink: 'عرض صفحة SPRIBE الرسمية',
    responsible: '18+ · التزم بحدودك عند اللعب.',
  },
}

const STEP_ICONS = [Eye, ScanLine, Plane]

export function aviatorMeta(locale: Locale) {
  const path = '/aviator'
  const canonical = `https://bttspredict.com${localizedPath(path, locale)}`
  const title = locale === 'fr'
    ? 'Aviator : fonctionnement du jeu et lecture des manches'
    : locale === 'en'
      ? 'Aviator: how the game works and how to read a round'
      : 'Aviator: آلية اللعبة وفهم الجولات'
  const description = locale === 'fr'
    ? 'Découvrez le fonctionnement d’Aviator et les repères d’une manche. Aucun résultat de manche ni pronostic n’est affiché.'
    : locale === 'en'
      ? 'Explore how Aviator works and the key parts of a round. No round outcomes or predictions are displayed.'
      : 'تعرّف إلى آلية Aviator ومعلومات الجولة. لا تعرض الصفحة نتائج للجولات أو توقعات.'
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: 'https://bttspredict.com/aviator',
        en: 'https://bttspredict.com/en/aviator',
        ar: 'https://bttspredict.com/ar/aviator',
        'x-default': 'https://bttspredict.com/aviator',
      },
    },
    openGraph: { title, description, url: canonical, siteName: 'BTTSPredict', type: 'website' as const },
  }
}

export default function AviatorPageContent({ locale }: { locale: Locale }) {
  const copy = AVIATOR_PAGE_COPY[locale]
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F14] text-[#F2F6FA]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-7 sm:pt-10 pb-14">
          <section className="relative overflow-hidden rounded-3xl border p-6 sm:p-9 md:p-11" style={{ background: 'radial-gradient(ellipse at 85% 12%, rgba(47,125,255,.2), transparent 38%), linear-gradient(145deg,#111B27,#0C121A 65%)', borderColor: '#223041' }}>
            <div className="absolute -end-7 top-5 opacity-[.08]" aria-hidden="true"><Plane size={180} strokeWidth={0.8} /></div>
            <div className="relative z-10 max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-[#7FB2FF]" style={{ borderColor: 'rgba(74,144,255,.35)', backgroundColor: 'rgba(47,125,255,.08)' }}>{copy.eyebrow}</p>
              <h1 className="mt-5 max-w-3xl text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">{copy.title}</h1>
              <p className="mt-4 max-w-3xl text-sm sm:text-base leading-7 text-[#B7C4D3]">{copy.intro}</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold text-[#B7D6FF]" style={{ borderColor: 'rgba(74,144,255,.25)', backgroundColor: 'rgba(47,125,255,.09)' }}>
                <Plane size={14} aria-hidden="true" /> {copy.badge}
              </div>
            </div>
          </section>

          <section className="mt-8" aria-labelledby="aviator-steps-heading">
            <div className="max-w-2xl">
              <h2 id="aviator-steps-heading" className="text-2xl sm:text-3xl font-bold">{copy.sectionTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[#9DABBB]">{copy.sectionIntro}</p>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {copy.steps.map((step, index) => {
                const StepIcon = STEP_ICONS[index]
                return (
                  <article key={step.title} className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: '#223041', background: 'linear-gradient(145deg,#141C25,#10161E)' }}>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border text-[#7FB2FF]" style={{ borderColor: 'rgba(74,144,255,.28)', backgroundColor: 'rgba(47,125,255,.08)' }}><StepIcon size={18} aria-hidden="true" /></span>
                    <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#A9B7C7]">{step.body}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3" aria-label={copy.sectionTitle}>
            <details className="group rounded-2xl border p-5" style={{ borderColor: '#223041', backgroundColor: '#111821' }}>
              <summary className="cursor-pointer list-none text-base font-bold marker:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90FF]">{copy.explains}<span className="float-end text-[#5BA9FF]" aria-hidden="true">＋</span></summary>
              <p className="mt-3 text-sm leading-6 text-[#A9B7C7]">{copy.explainsBody}</p>
            </details>
            <details className="group rounded-2xl border p-5" style={{ borderColor: '#223041', backgroundColor: '#111821' }}>
              <summary className="cursor-pointer list-none text-base font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90FF]">{copy.limits}<span className="float-end text-[#5BA9FF]" aria-hidden="true">＋</span></summary>
              <p className="mt-3 text-sm leading-6 text-[#A9B7C7]">{copy.limitsBody}</p>
            </details>
          </section>

          <section className="mt-5 rounded-2xl border p-5 sm:p-6" style={{ borderColor: '#223041', background: 'radial-gradient(ellipse at 10% 0%, rgba(47,125,255,.1), transparent 42%), #101720' }}>
            <h2 className="text-lg font-bold">{copy.sourceLabel}</h2>
            <p className="mt-2 text-sm leading-6 text-[#A9B7C7]">{copy.sourceBody}</p>
            <a href="https://spribe.co/games/aviator" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7FB2FF] hover:text-white">{copy.sourceLink}<ArrowUpRight size={15} aria-hidden="true" /></a>
          </section>

          <p className="mt-5 text-center text-xs text-[#718398]">{copy.responsible}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
