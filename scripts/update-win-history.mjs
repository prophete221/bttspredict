// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — update-win-history V8 (New Tracking Period)
// ═══════════════════════════════════════════════════════════════════════════════
// Calcule 2 buckets :
//  - newStats     : pronos publiés depuis tracking-period.startDate (PUBLIC)
//  - legacyStats  : pronos publiés avant startDate (PRIVÉ, non affiché publiquement)
// Source unique de vérité : public/win-history.json
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';

const DIR = './public/predictions-archive';
const OUT = './public/win-history.json';
const TRACKING_PERIOD_FILE = './public/tracking-period.json';
const AVG_ODDS = 1.90;

let TRACKING_START = '2026-08-08';
try {
  const tp = JSON.parse(fs.readFileSync(TRACKING_PERIOD_FILE, 'utf8'));
  TRACKING_START = tp.startDate || TRACKING_START;
} catch (e) {
  console.warn(`[update-win-history] tracking-period.json non trouvé, fallback ${TRACKING_START}`);
}

const TRACKING_START_TS = new Date(TRACKING_START + 'T00:00:00Z').getTime();
console.log(`[update-win-history] Nouveau suivi depuis ${TRACKING_START}`);

const HIGH_BTTS_KEYWORDS = [
  'bundesliga','eredivisie','jupiler','swiss','mls','championship',
  'premier league','liga portugal','austrian','scottish',
];

function getTier(p) {
  if (p.tier && p.tier.toUpperCase() === 'GOLD') return 'GOLD';
  let proba = p.proba || p.probability || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  if (!proba) proba = 0.62;
  const lg = (p.league || '').toLowerCase();
  const isHigh = HIGH_BTTS_KEYWORDS.some(h => lg.includes(h));
  const market = (p.type || p.market || '').toLowerCase();
  const isBttsYes = market.includes('btts') && (p.prediction || '').toLowerCase() !== 'non';
  if (proba >= 0.75) return 'GOLD';
  if (proba >= 0.70 && isHigh && isBttsYes) return 'GOLD';
  return 'STANDARD';
}

function getType(p) {
  const t = (p.type || p.market || '').toUpperCase();
  if (t.includes('BTTS')) return 'btts';
  return 'over25';
}

function calcProfit(isWon, ods) {
  return isWon ? (ods - 1) : -1;
}

function emptyBucket() {
  return {
    won: 0, lost: 0, pending: 0,
    gold: { won: 0, lost: 0, profit: 0 },
    std: { won: 0, lost: 0, profit: 0 },
    btts: { won: 0, lost: 0 },
    over25: { won: 0, lost: 0 },
    daily: {},
    all: [],
    totalProfit: 0,
    goldProfit: 0,
    oddsSum: 0, oddsCount: 0,
    goldOddsSum: 0, goldOddsCount: 0,
    archivedTotal: 0,
  };
}

function processFile(file, bucket) {
  const date = file.replace('.json', '');
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')); } catch (e) { return; }
  let preds = data.predictions || data;
  if (!Array.isArray(preds)) return;

  bucket.archivedTotal += preds.length;
  let dW = 0, dL = 0, dProfit = 0;

  for (const p of preds) {
    const tier = getTier(p);
    const type = getType(p);
    const ods = p.coteProposee || p.odds || AVG_ODDS;
    const isWon = p.status === 'WON' || p.isWon === true;
    const isLost = p.status === 'LOST' || p.isWon === false;
    const isVerified = isWon || isLost;
    const profit = isVerified ? calcProfit(isWon, ods) : 0;

    if (isWon) {
      bucket.won++; dW++;
      bucket.totalProfit += profit; dProfit += profit;
      bucket.oddsSum += ods; bucket.oddsCount++;
      if (tier === 'GOLD') { bucket.gold.won++; bucket.gold.profit += profit; bucket.goldOddsSum += ods; bucket.goldOddsCount++; }
      else { bucket.std.won++; bucket.std.profit += profit; }
      if (type === 'btts') bucket.btts.won++; else bucket.over25.won++;
    } else if (isLost) {
      bucket.lost++; dL++;
      bucket.totalProfit += profit; dProfit += profit;
      bucket.oddsSum += ods; bucket.oddsCount++;
      if (tier === 'GOLD') { bucket.gold.lost++; bucket.gold.profit += profit; bucket.goldOddsSum += ods; bucket.goldOddsCount++; }
      else { bucket.std.lost++; bucket.std.profit += profit; }
      if (type === 'btts') bucket.btts.lost++; else bucket.over25.lost++;
    } else {
      bucket.pending++;
    }

    if (isVerified) {
      bucket.all.push({
        date, match: p.match || '', league: p.league || '',
        market: type, tier,
        proba: p.proba || (p.confidence ? p.confidence / 100 : 0.62),
        coteProposee: ods, coteCloture: p.coteCloture || null,
        bookmaker: p.bookmaker || 'Linebet',
        status: isWon ? 'WON' : 'LOST',
        finalScore: p.finalScore || p.score || '-',
        profit: +profit.toFixed(2),
        verifiedAt: p.verifiedAt || '',
        source: 'ESPN public',
      });
    }
  }

  if (dW + dL > 0) {
    bucket.daily[date] = { total: dW + dL, won: dW, lost: dL, rate: +(dW / (dW + dL) * 100).toFixed(1), profit: +dProfit.toFixed(2) };
  }
}

function buildStats(bucket, periodFrom, periodTo, daysCount) {
  const total = bucket.won + bucket.lost;
  const rate = total > 0 ? +(bucket.won / total * 100).toFixed(1) : 0;
  const avgOdds = bucket.oddsCount > 0 ? +(bucket.oddsSum / bucket.oddsCount).toFixed(2) : 0;
  const roi = total > 0 ? +((bucket.totalProfit / total) * 100).toFixed(1) : 0;

  const goldTotal = bucket.gold.won + bucket.gold.lost;
  const goldRate = goldTotal > 0 ? +(bucket.gold.won / goldTotal * 100).toFixed(1) : 0;
  const goldAvgOdds = bucket.goldOddsCount > 0 ? +(bucket.goldOddsSum / bucket.goldOddsCount).toFixed(2) : 0;
  const goldRoi = goldTotal > 0 ? +((bucket.gold.profit / goldTotal) * 100).toFixed(1) : 0;

  const stdTotal = bucket.std.won + bucket.std.lost;
  const stdRate = stdTotal > 0 ? +(bucket.std.won / stdTotal * 100).toFixed(1) : 0;

  const bttsTotal = bucket.btts.won + bucket.btts.lost;
  const bttsRate = bttsTotal > 0 ? +(bucket.btts.won / bttsTotal * 100).toFixed(1) : 0;
  const overTotal = bucket.over25.won + bucket.over25.lost;
  const overRate = overTotal > 0 ? +(bucket.over25.won / overTotal * 100).toFixed(1) : 0;

  let cumProfit = 0;
  const trend = Object.entries(bucket.daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([d, v]) => { cumProfit += v.profit; return { date: d, ...v, equity: +cumProfit.toFixed(2) }; });

  let peak = 0, maxDD = 0;
  cumProfit = 0;
  for (const t of trend) { cumProfit += t.profit; if (cumProfit > peak) peak = cumProfit; const dd = peak - cumProfit; if (dd > maxDD) maxDD = dd; }

  return {
    total, won: bucket.won, lost: bucket.lost, pending: bucket.pending,
    archivedTotal: bucket.archivedTotal,
    rate, avgOdds, profit: +bucket.totalProfit.toFixed(2), roi, yield: roi,
    gold: {
      total: goldTotal, won: bucket.gold.won, lost: bucket.gold.lost, rate: goldRate,
      avgOdds: goldAvgOdds, profit: +bucket.gold.profit.toFixed(2), roi: goldRoi, yield: goldRoi,
    },
    standard: { total: stdTotal, won: bucket.std.won, lost: bucket.std.lost, rate: stdRate },
    byType: {
      btts: { total: bttsTotal, won: bucket.btts.won, lost: bucket.btts.lost, rate: bttsRate },
      over25: { total: overTotal, won: bucket.over25.won, lost: bucket.over25.lost, rate: overRate },
    },
    trend14: trend,
    maxDrawdown: +maxDD.toFixed(2),
    period: { from: periodFrom, to: periodTo, days: daysCount },
  };
}

function main() {
  if (!fs.existsSync(DIR)) {
    console.warn(`[update-win-history] ${DIR} introuvable`);
    return;
  }
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
  const allFiles = files.slice(-90);

  const newBucket = emptyBucket();
  const legacyBucket = emptyBucket();

  let newPeriodFrom = null, newPeriodTo = null, newDaysCount = 0;
  let legacyPeriodFrom = null, legacyPeriodTo = null, legacyDaysCount = 0;

  for (const file of allFiles) {
    const date = file.replace('.json', '');
    const dateTs = new Date(date + 'T00:00:00Z').getTime();

    if (dateTs >= TRACKING_START_TS) {
      if (!newPeriodFrom) newPeriodFrom = date;
      newPeriodTo = date;
      newDaysCount++;
      processFile(file, newBucket);
    } else {
      if (!legacyPeriodFrom) legacyPeriodFrom = date;
      legacyPeriodTo = date;
      legacyDaysCount++;
      processFile(file, legacyBucket);
    }
  }

  const newStats = buildStats(newBucket, newPeriodFrom, newPeriodTo, newDaysCount);
  const legacyStats = buildStats(legacyBucket, legacyPeriodFrom, legacyPeriodTo, legacyDaysCount);

  const out = {
    generatedAt: new Date().toISOString(),
    trackingPeriod: {
      startDate: TRACKING_START,
      isPublicPeriod: true,
      disclaimer: "Nouvelle période de suivi lancée le " + TRACKING_START + ". Les résultats sont publiés et vérifiés progressivement. Le volume actuel est encore insuffisant pour évaluer statistiquement la performance du modèle. Aucun résultat futur n'est garanti.",
      insufficientVolume: newStats.total < 30,
    },
    stats: newStats,
    history: newBucket.all.slice(-500).reverse(),
    legacyStats: {
      ...legacyStats,
      history: legacyBucket.all.slice(-200).reverse(),
      isPrivate: true,
      note: "Archives antérieures au nouveau suivi (avant " + TRACKING_START + "). Non affiché publiquement. Conservé pour audit technique et conformité.",
    },
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));

  console.log(`[update-win-history] ─────────────────────────────────────────`);
  console.log(`[update-win-history] NEW (public) ${newStats.total} vérifiés | ${newStats.rate}% | ROI ${newStats.roi}% | ${newStats.archivedTotal} archivés | ${newStats.pending} en attente`);
  console.log(`[update-win-history]   GOLD ${newStats.gold.total} ${newStats.gold.rate}% | ROI ${newStats.gold.roi}%`);
  console.log(`[update-win-history]   Period ${newPeriodFrom || '—'} → ${newPeriodTo || '—'} (${newDaysCount}j)`);
  console.log(`[update-win-history] LEGACY (privé) ${legacyStats.total} vérifiés | ${legacyStats.rate}% | ROI ${legacyStats.roi}%`);
  console.log(`[update-win-history]   Period ${legacyPeriodFrom || '—'} → ${legacyPeriodTo || '—'} (${legacyDaysCount}j)`);
  console.log(`[update-win-history] ─────────────────────────────────────────`);
  if (newStats.total < 30) {
    console.log(`[update-win-history] ⚠ Volume nouveau suivi insuffisant (${newStats.total}/30). Affichage public restreint.`);
  }
}

main();
