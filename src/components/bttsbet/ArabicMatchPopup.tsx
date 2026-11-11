'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useEffect, useMemo, useSyncExternalStore } from 'react'
import type { MatchData, VerifiedHistoryEntry } from '@/lib/matches'
import type { TeamContextEntry } from '@/lib/team-context'
import styles from './ArabicMatchPopup.module.css'

type PopupMatch = MatchData & { verifiedHistory: VerifiedHistoryEntry[] }
type Props = { matches: PopupMatch[]; contextTeams: Record<string, TeamContextEntry> }
type Row = [string, unknown]

const COPY = {
  title: 'ملف المباراة',
  emptyTitle: 'بيانات المباراة غير متاحة',
  emptyText: 'لا توجد معلومات منشورة لهذا الرابط حالياً. لم تتم إضافة بيانات بديلة.',
  calendar: 'العودة إلى التقويم',
  upcoming: 'مباريات BTTS',
  intro: 'اختر مباراة لفتح ملفها المنشور. الروابط العربية القديمة تفتح الملف نفسه في نافذة واحدة.',
  league: 'المسابقة', date: 'التاريخ', time: 'الوقت',
  predictions: 'التوقعات والحالة', form: 'مستوى الفريقين والترتيب', last5: 'آخر خمس مباريات',
  model: 'التقديرات وجودة البيانات', odds: 'أسعار السوق', analysis: 'التحليل ومعلومات التشكيلة',
  context: 'سياق الفريقين', verification: 'النتائج المؤكدة', data: 'مصدر البيانات',
  home: 'الفريق المضيف', away: 'الفريق الضيف', btts: 'تسجيل الفريقين', over: 'أكثر من 2.5',
  xg: 'أهداف مقدرة', total: 'المجموع المقدر', rank: 'الترتيب', points: 'النقاط', played: 'المباريات',
  goals: 'الأهداف', goalsFor: 'الأهداف المسجلة', goalsAgainst: 'الأهداف المستقبلة',
  clean: 'شباك نظيفة', failed: 'دون تسجيل', reliability: 'الموثوقية', quality: 'جودة البيانات',
  source: 'المصدر', status: 'الحالة', finalScore: 'النتيجة المؤكدة', verifiedAt: 'تاريخ التحقق',
  selection: 'الاختيار', probability: 'الاحتمال المنشور', confidence: 'الثقة', tier: 'الفئة',
  provider: 'شركة المراهنات', homeOdds: '1', drawOdds: 'تعادل', awayOdds: '2',
  keyFact: 'معلومة مهمة', absences: 'التشكيلة والغيابات', oddsInsight: 'قراءة الأسعار', statAnalysis: 'تحليل إحصائي',
  win: 'فاز', draw: 'تعادل', loss: 'خسر', venueHome: 'مضيف', venueAway: 'ضيف',
  won: 'فاز', lost: 'خسر', pending: 'قيد الانتظار', yes: 'نعم', no: 'لا',
  verified: 'مؤكد', news: 'أخبار حديثة', checked: 'تاريخ مراجعة المصادر',
  photoCredit: 'حقوق الصورة', license: 'الترخيص', official: 'الموقع الرسمي',
  published: 'آخر تحديث منشور', noNews: 'لا توجد أخبار حديثة في المصادر المحفوظة لهذا الفريق.',
  sourceNote: 'المعلومات المعروضة مأخوذة من سجل المباراة ومصادره المنشورة. لا توجد نتيجة مستقبلية مضمونة. 18+.',
}

function text(value: unknown): string {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'boolean') return value ? COPY.yes : COPY.no
  if (typeof value === 'number') return new Intl.NumberFormat('ar', { maximumFractionDigits: 2 }).format(value)
  if (typeof value === 'string') return value
  return ''
}
function dateText(value?: string): string {
  if (!value) return ''
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value)
  if (!Number.isFinite(date.getTime())) return value
  return new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
}
function percent(value?: number): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return ''
  const normalized = value <= 1 ? value * 100 : value
  return `${new Intl.NumberFormat('ar', { maximumFractionDigits: 1 }).format(normalized)}٪`
}
function localizedStatus(value?: string): string {
  const status = (value || '').toUpperCase()
  if (status === 'WON') return COPY.won
  if (status === 'LOST') return COPY.lost
  if (status === 'PENDING') return COPY.pending
  return value || ''
}
function resultLabel(value?: string): string {
  if (value === 'W') return COPY.win
  if (value === 'D') return COPY.draw
  if (value === 'L') return COPY.loss
  return value || ''
}
function getRouteSlugSnapshot(): string | null {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/^\/ar\/match\/([^/]+)\/?$/)
  if (!match) return null
  try { return decodeURIComponent(match[1]) } catch { return match[1] }
}
function subscribeRouteSlug(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}
function FieldGrid({ rows }: { rows: Row[] }) {
  const visible = rows.filter(([, value]) => value !== undefined && value !== null && value !== '')
  if (!visible.length) return null
  return <dl className={styles.fieldGrid}>{visible.map(([label, value]) => <div className={styles.field} key={label}><dt>{label}</dt><dd>{text(value)}</dd></div>)}</dl>
}
function Section({ title, meta, open = false, children }: { title: string; meta?: string; open?: boolean; children: React.ReactNode }) {
  return <details className={styles.section} open={open}><summary><span>{title}</span>{meta && <small>{meta}</small>}</summary><div className={styles.sectionBody}>{children}</div></details>
}
function TeamContextCard({ team }: { team: TeamContextEntry }) {
  const unavailable = ['error', 'failed', 'unavailable'].includes(team.newsStatus.toLowerCase())
  const image = team.image
  return <article className={styles.contextCard}>
    <h4>{team.name}</h4>
    {image && <figure className={styles.contextFigure}><img src={image.url} alt={image.caption} loading="lazy" /><figcaption>
      <p>{image.caption}</p><p>{COPY.photoCredit}: {image.author}{image.date ? ` · ${dateText(image.date)}` : ''}</p>
      <p><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">Commons</a> · <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{COPY.license}: {image.license}</a></p>
    </figcaption></figure>}
    <h5>{COPY.news}</h5>
    {unavailable ? <p>{COPY.emptyText}</p> : team.news.length === 0 ? <p>{COPY.noNews}</p> : <ul className={styles.newsList}>{team.news.slice(0, 3).map((item, index) => {
      const title = item.source === 'GDELT' ? 'مقال خارجي' : item.source === 'Official' ? 'منشور رسمي' : item.title
      const date = item.source === 'GDELT' ? item.seenAt : item.publishedAt
      const creditUrl = item.source === 'Official' ? (item.attributionUrl || item.url) : (item.licenseUrl || item.url)
      return <li key={`${item.url}-${index}`}><a href={item.url} target="_blank" rel="noopener noreferrer">{title}</a><small>{item.publisher || item.source}{date ? ` · ${dateText(date)}` : ''}</small>{creditUrl && <a className={styles.creditLink} href={creditUrl} target="_blank" rel="noopener noreferrer">{item.source === 'GDELT' ? 'فهرسة GDELT' : item.source === 'Official' ? 'المصدر الرسمي' : `${COPY.license}: ${item.license || item.source}`}</a>}</li>
    })}</ul>}
    {team.officialUrl && <p><a href={team.officialUrl} target="_blank" rel="noopener noreferrer">{COPY.official}</a></p>}
    {team.entityUrl && <p><a href={team.entityUrl} target="_blank" rel="noopener noreferrer">Wikidata</a></p>}
    {team.checkedAt && <small>{COPY.checked}: {dateText(team.checkedAt)}</small>}
  </article>
}

function MatchDetails({ match, contextTeams }: { match: PopupMatch; contextTeams: Record<string, TeamContextEntry> }) {
  const odds = match.odds
  const formRows = (form: MatchData['formHome']): Row[] => form ? [
    ['آخر النتائج', form.last5String], ['الانتصارات', form.wins], ['التعادلات', form.draws], ['الهزائم', form.losses],
    [COPY.goalsFor, form.goalsFor], [COPY.goalsAgainst, form.goalsAgainst], ['BTTS', typeof form.bttsRate === 'number' ? percent(form.bttsRate) : undefined],
    ['Over 2.5', typeof form.over25Rate === 'number' ? percent(form.over25Rate) : undefined], [COPY.clean, form.cleanSheets], [COPY.failed, form.failedToScore], ['عدد المباريات', form.count],
  ] : []
  const standingsRows = (standing: MatchData['standingsHome']): Row[] => standing ? [
    [COPY.rank, standing.rank], [COPY.points, standing.points], [COPY.played, standing.played], [COPY.goals, standing.gf != null && standing.ga != null ? `${standing.gf}:${standing.ga}` : undefined], ['ملاحظة', standing.note],
  ] : []
  const context = [contextTeams[match.home], contextTeams[match.away]].filter((item): item is TeamContextEntry => Boolean(item))

  return <>
    {match.predictions.length > 0 && <Section title={COPY.predictions} meta={`${match.predictions.length} أسواق`} open>
      <div className={styles.cardGrid}>{match.predictions.map((prediction, index) => <article className={styles.infoCard} key={`${prediction.type}-${index}`}>
        <h4>{prediction.type || prediction.market}</h4>
        <FieldGrid rows={[[COPY.selection, prediction.prediction], [COPY.probability, percent(prediction.proba)], [COPY.confidence, typeof prediction.confidence === 'number' ? `${text(prediction.confidence)}٪` : undefined], [COPY.tier, prediction.tier], [COPY.status, localizedStatus(prediction.status)], [COPY.finalScore, prediction.finalScore], [COPY.verifiedAt, dateText(prediction.verifiedAt)], [COPY.source, prediction.source]]} />
      </article>)}</div>
    </Section>}

    {(match.formHome || match.formAway || match.standingsHome || match.standingsAway || match.formBtts != null) && <Section title={COPY.form} open>
      <div className={styles.cardGrid}>{[[match.home, formRows(match.formHome), standingsRows(match.standingsHome)], [match.away, formRows(match.formAway), standingsRows(match.standingsAway)]].map(([name, form, standing], index) => <article className={styles.infoCard} key={`${name}-${index}`}>
        <h4>{String(name)} · {index === 0 ? COPY.home : COPY.away}</h4><FieldGrid rows={form as Row[]} />{(standing as Row[]).length > 0 && <div className={styles.standing}><strong>الترتيب</strong><FieldGrid rows={standing as Row[]} /></div>}
      </article>)}</div>
      {match.formBtts != null && <p className={styles.description}>متوسط BTTS المنشور: {text(match.formBtts)}٪</p>}
    </Section>}

    {(Boolean(match.last5Home?.length) || Boolean(match.last5Away?.length)) && <Section title={COPY.last5}>
      <div className={styles.cardGrid}>{[[match.home, match.last5Home || []], [match.away, match.last5Away || []]].map(([name, records], index) => <article className={styles.infoCard} key={`${name}-${index}`}>
        <h4>{String(name)}</h4><ul className={styles.recentList}>{(records as NonNullable<MatchData['last5Home']>).map((record, recordIndex) => <li key={`${record.date}-${recordIndex}`}><span>{dateText(record.date)}</span><span>{record.venue === 'H' ? COPY.venueHome : COPY.venueAway}</span><strong>{record.opponent}</strong><b>{record.score}</b><span>{resultLabel(record.result)}</span></li>)}</ul>
      </article>)}</div>
    </Section>}

    {(match.homeLambda != null || match.awayLambda != null || match.xgTotal != null || match.bttsProb != null || match.over25Prob != null || match.aiExactScore || match.exactScoreProb || match.dataQuality || match.dataSource || match.aiRisk || match.reliabilityScore != null || match.matchCountHome != null || match.matchCountAway != null || match.lastUpdated || match.aiSource || match.aiAbstain !== undefined) && <Section title={COPY.model}>
      <FieldGrid rows={[[`${COPY.xg} · ${match.home}`, match.homeLambda], [`${COPY.xg} · ${match.away}`, match.awayLambda], [COPY.total, match.xgTotal], [COPY.btts, percent(match.bttsProb)], [COPY.over, percent(match.over25Prob)], ['BTTS إضافي منشور', match.aiBttsProb], ['Over 2.5 إضافي منشور', match.aiOver25Prob], ['النتيجة الدقيقة المنشورة', match.aiExactScore], ['احتمال النتيجة الدقيقة', match.exactScoreProb], [`${COPY.home} · عدد المباريات`, match.matchCountHome], [`${COPY.away} · عدد المباريات`, match.matchCountAway], [COPY.reliability, match.reliabilityScore != null ? `${text(match.reliabilityScore)}٪` : undefined], [COPY.quality, match.dataQuality], [COPY.data, match.dataSource], ['مصدر الذكاء الاصطناعي', match.aiSource], ['مستوى الحذر', match.aiRisk], ['امتناع النموذج', match.aiAbstain], [COPY.published, dateText(match.lastUpdated)]]} />
    </Section>}

    {odds && Object.values(odds).some(value => value !== undefined && value !== null) && <Section title={COPY.odds}>
      <FieldGrid rows={[[COPY.provider, odds.provider], [COPY.homeOdds, odds.home], [COPY.drawOdds, odds.draw], [COPY.awayOdds, odds.away], ['Over 2.5', odds.over25], ['Under 2.5', odds.under25]]} />
    </Section>}

    {[['معلومة مهمة', match.aiKeyFact], ['التشكيلة والغيابات', match.aiAbsences], ['قراءة الأسعار', match.aiOddsInsight], ['تحليل إحصائي', match.aiAnalysis], ['النص الإنجليزي المنشور · معلومة', match.aiKeyFactEn], ['النص الإنجليزي المنشور · غيابات', match.aiAbsencesEn], ['النص الإنجليزي المنشور · الأسعار', match.aiOddsInsightEn], ['النص الإنجليزي المنشور · تحليل', match.aiAnalysisEn]].some(([, value]) => typeof value === 'string' && value.trim()) && <Section title={COPY.analysis}>
      <div className={styles.textCards}>{[['معلومة مهمة', match.aiKeyFact], ['التشكيلة والغيابات', match.aiAbsences], ['قراءة الأسعار', match.aiOddsInsight], ['تحليل إحصائي', match.aiAnalysis], ['النص الإنجليزي المنشور · معلومة', match.aiKeyFactEn], ['النص الإنجليزي المنشور · غيابات', match.aiAbsencesEn], ['النص الإنجليزي المنشور · الأسعار', match.aiOddsInsightEn], ['النص الإنجليزي المنشور · تحليل', match.aiAnalysisEn]].filter(([, value]) => typeof value === 'string' && value.trim()).map(([label, value]) => <article className={styles.infoCard} key={String(label)}><h4>{String(label)}</h4><p>{String(value)}</p></article>)}</div>
    </Section>}

    {context.length > 0 && <Section title={COPY.context}><div className={styles.cardGrid}>{context.map(team => <TeamContextCard key={team.name} team={team} />)}</div></Section>}

    {match.verifiedHistory.length > 0 && <Section title={COPY.verification} meta={`${match.verifiedHistory.length} نتائج`}>
      <div className={styles.cardGrid}>{match.verifiedHistory.map((entry, index) => <article className={styles.infoCard} key={`${entry.market || entry.type || 'verified'}-${index}`}>
        <h4>{entry.market || entry.type || COPY.verified}</h4><FieldGrid rows={[[COPY.status, localizedStatus(entry.status || (entry.isWon === true ? 'WON' : entry.isWon === false ? 'LOST' : undefined))], [COPY.finalScore, entry.finalScore || entry.score], [COPY.verifiedAt, dateText(entry.verifiedAt)], [COPY.source, entry.source]]} />
      </article>)}</div>
    </Section>}
  </>
}

export default function ArabicMatchPopup({ matches, contextTeams }: Props) {
  const routeSlug = useSyncExternalStore(subscribeRouteSlug, getRouteSlugSnapshot, () => null)
  const matchBySlug = useMemo(() => new Map(matches.map(match => [match.slug, match])), [matches])
  const selected = routeSlug ? matchBySlug.get(routeSlug) : undefined
  const open = routeSlug !== null

  useEffect(() => {
    if (!routeSlug) return
    const previousTitle = document.title
    const title = selected ? `${selected.home} ضد ${selected.away} | ${COPY.title}` : COPY.emptyTitle
    document.title = title
    const canonicalUrl = `${window.location.origin}${window.location.pathname.replace(/\/+$/, '')}`
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = canonicalUrl
    let jsonLd = document.getElementById('ar-match-popup-jsonld') as HTMLScriptElement | null
    if (selected) {
      if (!jsonLd) { jsonLd = document.createElement('script'); jsonLd.id = 'ar-match-popup-jsonld'; jsonLd.type = 'application/ld+json'; document.head.appendChild(jsonLd) }
      jsonLd.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'SportsEvent', name: `${selected.home} vs ${selected.away}`, sport: 'Football', startDate: `${selected.date}T${selected.time || '00:00'}`, location: { '@type': 'Place', name: selected.league }, homeTeam: { '@type': 'SportsTeam', name: selected.home, logo: selected.homeLogo }, awayTeam: { '@type': 'SportsTeam', name: selected.away, logo: selected.awayLogo } })
    } else if (jsonLd) jsonLd.remove()
    return () => { document.title = previousTitle }
  }, [routeSlug, selected])

  const listed = matches.slice(0, 60)
  const close = () => { window.location.assign('/ar/btts/predictions/today') }

  return <main data-ar-match-shared-popup="true" className={styles.page} dir="rtl">
    <div className={styles.shell}>
      <header className={styles.header}><a href="/ar" className={styles.brand}><span className={styles.brandMark}>B</span><span>BTTSPredict <small>Match Intelligence</small></span></a><a href="/ar/btts/predictions/today" className={styles.navLink}>التقويم</a></header>
      <section className={styles.intro}><p className={styles.kicker}>ملفات المباريات · الأرشيف المنشور</p><h1>{COPY.upcoming}</h1><p>{COPY.intro}</p></section>
      <section className={styles.grid} aria-label={COPY.upcoming}>{listed.map(match => <a className={styles.fixture} key={match.slug} href={`/ar/match/${encodeURIComponent(match.slug)}`}>
        <small>{match.league || COPY.title} · {dateText(match.date)}</small><strong>{match.home} <span>VS</span> {match.away}</strong><span>فتح الملف ←</span>
      </a>)}</section>
    </div>

    <DialogPrimitive.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen && open) close() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content className={styles.dialog} aria-describedby="ar-match-popup-description" dir="rtl">
          <div className={styles.topline} />
          <div className={styles.dialogInner}>
            <header className={styles.dialogHeader}>
              <div><p className={styles.dialogKicker}><span />ملف المباراة · البيانات المنشورة</p><DialogPrimitive.Title className={styles.dialogTitle}>{selected ? `${selected.home} ضد ${selected.away}` : COPY.emptyTitle}</DialogPrimitive.Title>{selected && <p className={styles.league}>{selected.league}</p>}</div>
              <DialogPrimitive.Close className={styles.close} aria-label="إغلاق النافذة">×</DialogPrimitive.Close>
            </header>
            {selected ? <>
              <div className={styles.scoreboard}>
                <div className={styles.club}>{selected.homeLogo ? <img src={selected.homeLogo} alt="" /> : <span>{selected.home.slice(0, 2)}</span>}<strong>{selected.home}</strong></div>
                <div className={styles.matchCenter}><b>VS</b><small>{selected.date}{selected.time ? ` · ${selected.time}` : ''}</small></div>
                <div className={styles.club}>{selected.awayLogo ? <img src={selected.awayLogo} alt="" /> : <span>{selected.away.slice(0, 2)}</span>}<strong>{selected.away}</strong></div>
              </div>
              <div className={styles.meta}><span>{COPY.date}: {dateText(selected.date)}</span>{selected.time && <span>{COPY.time}: {selected.time}</span>}{selected.league && <span>{COPY.league}: {selected.league}</span>}</div>
              <div className={styles.sections}><MatchDetails match={selected} contextTeams={contextTeams} /></div>
              <DialogPrimitive.Description id="ar-match-popup-description" className={styles.finePrint}>{COPY.sourceNote}</DialogPrimitive.Description>
            </> : <DialogPrimitive.Description id="ar-match-popup-description" className={styles.empty}>{COPY.emptyText}</DialogPrimitive.Description>}
            <footer className={styles.footer}><span>{selected?.lastUpdated ? `${COPY.published}: ${dateText(selected.lastUpdated)}` : COPY.sourceNote}</span><button type="button" onClick={close}>{COPY.calendar}</button></footer>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  </main>
}
