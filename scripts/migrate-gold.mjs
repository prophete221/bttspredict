import fs from 'fs';
import path from 'path';

const DIR = './public/predictions-archive';
const HIGH = ['bundesliga','eredivisie','jupiler','belgium','swiss','championship','premier league','liga'];

function tierOf(p) {
  // Force re-evaluation: ignore existing tier, always recalculate
  let proba = p.proba || p.probability || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  if (!proba) proba = 0.6;

  const league = (p.league || '').toLowerCase();
  const isHigh = HIGH.some(h => league.includes(h));

  // Check if this is a BTTS Oui prediction
  const market = (p.type || p.market || '').toLowerCase();
  const isBttsYes = market.includes('btts') && (p.prediction || '').toLowerCase() !== 'non';

  // GOLD = only BTTS Oui in high-scoring leagues + very high proba
  if (proba >= 0.75) return 'GOLD';
  if (proba >= 0.70 && isHigh && isBttsYes) return 'GOLD';
  return 'STANDARD';
}

let totalGold = 0, totalStandard = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const fp = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { continue; }
  const preds = data.predictions || data;
  if (!Array.isArray(preds)) continue;
  let changed = false;
  for (const p of preds) {
    const t = tierOf(p);
    if (p.tier !== t) { p.tier = t; changed = true; }
    if (t === 'GOLD') totalGold++;
    else totalStandard++;
  }
  if (changed) fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}
console.log(`Migration GOLD OK — ${totalGold} GOLD / ${totalStandard} STANDARD`);
