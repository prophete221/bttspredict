import fs from 'fs';
import path from 'path';

const DIR = './public/predictions-archive';
const OUT = './public/win-history.json';

function getTier(p) {
  if (p.tier && p.tier !== 'STANDARD') return p.tier.toUpperCase();
  let proba = p.proba || p.probability || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  if (!proba) proba = 0.6;
  const lg = (p.league || '').toLowerCase();
  const isHigh = ['bundesliga','eredivisie','jupiler','swiss','mls','championship'].some(h => lg.includes(h));
  if (proba >= 0.70) return 'GOLD';
  if (proba >= 0.65 && isHigh) return 'GOLD';
  return 'STANDARD';
}

function getType(p) {
  const t = (p.type || p.market || '').toUpperCase();
  if (t.includes('BTTS')) return 'btts';
  return 'over25';
}

function main() {
  const files = fs.readdirSync(DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .slice(-90);

  let won = 0, lost = 0, pending = 0;
  let gold = { won: 0, lost: 0 };
  let std = { won: 0, lost: 0 };
  let btts = { won: 0, lost: 0 };
  let over25 = { won: 0, lost: 0 };
  let daily = {};
  let all = [];

  for (const file of files) {
    const date = file.replace('.json', '');
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')); } catch (e) { continue; }

    let preds = data.predictions || data;
    if (!Array.isArray(preds)) continue;

    let dW = 0, dL = 0;

    for (const p of preds) {
      const tier = getTier(p);
      const type = getType(p);
      all.push({ ...p, date, tier });

      if (p.status === 'WON' || p.isWon === true) {
        won++; dW++;
        if (tier === 'GOLD') gold.won++; else std.won++;
        if (type === 'btts') btts.won++; else over25.won++;
      } else if (p.status === 'LOST' || p.isWon === false) {
        lost++; dL++;
        if (tier === 'GOLD') gold.lost++; else std.lost++;
        if (type === 'btts') btts.lost++; else over25.lost++;
      } else {
        pending++;
      }
    }

    if (dW + dL > 0) {
      daily[date] = { total: dW + dL, won: dW, lost: dL, rate: +(dW / (dW + dL) * 100).toFixed(1) };
    }
  }

  const total = won + lost;
  const rate = total > 0 ? +(won / total * 100).toFixed(1) : 0;
  const goldTotal = gold.won + gold.lost;
  const goldRate = goldTotal > 0 ? +(gold.won / goldTotal * 100).toFixed(1) : 0;
  const stdTotal = std.won + std.lost;
  const stdRate = stdTotal > 0 ? +(std.won / stdTotal * 100).toFixed(1) : 0;
  const bttsTotal = btts.won + btts.lost;
  const bttsRate = bttsTotal > 0 ? +(btts.won / bttsTotal * 100).toFixed(1) : 0;
  const overTotal = over25.won + over25.lost;
  const overRate = overTotal > 0 ? +(over25.won / overTotal * 100).toFixed(1) : 0;

  const trend = Object.entries(daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([d, v]) => ({ date: d, ...v }));

  const out = {
    generatedAt: new Date().toISOString(),
    stats: {
      total, won, lost, pending, rate,
      gold: {
        total: goldTotal,
        won: gold.won,
        lost: gold.lost,
        rate: goldRate,
        yield: goldTotal > 0 ? +(((gold.won * 1.75 - goldTotal) / goldTotal) * 100).toFixed(1) : 0,
      },
      standard: {
        total: stdTotal,
        won: std.won,
        lost: std.lost,
        rate: stdRate,
      },
      byType: {
        btts: { total: bttsTotal, won: btts.won, lost: btts.lost, rate: bttsRate },
        over25: { total: overTotal, won: over25.won, lost: over25.lost, rate: overRate },
      },
      trend14: trend,
    },
    history: all
      .filter(p => p.status === 'WON' || p.status === 'LOST' || p.isWon === true || p.isWon === false)
      .slice(-500)
      .reverse(),
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`ALL ${total} ${rate}% | GOLD ${goldTotal} ${goldRate}% | STANDARD ${stdTotal} ${stdRate}%`);
  console.log(`BTTS ${bttsTotal} ${bttsRate}% | O2.5 ${overTotal} ${overRate}%`);
  console.log(`Gold yield: ${goldTotal > 0 ? +(((gold.won * 1.75 - goldTotal) / goldTotal) * 100).toFixed(1) : 0}%`);
}

main();
