import fs from 'fs';
import path from 'path';

const DIR = './public/predictions-archive';
const OUT = './public/win-history.json';
const AVG_ODDS = 1.90; // cote moyenne réelle observée (pas en dur si cote réelle dispo)

function getTier(p) {
  if (p.tier && p.tier !== 'STANDARD') return p.tier.toUpperCase();
  let proba = p.proba || p.probability || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  if (!proba) proba = 0.6;
  const lg = (p.league || '').toLowerCase();
  const isHigh = ['bundesliga','eredivisie','jupiler','swiss','mls','championship'].some(h => lg.includes(h));
  if (proba >= 0.72) return 'GOLD';
  if (proba >= 0.68 && isHigh) return 'GOLD';
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

function main() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
  const allFiles = files.slice(-90);

  let won = 0, lost = 0, pending = 0, archivedTotal = 0;
  let gold = { won: 0, lost: 0, profit: 0 };
  let std = { won: 0, lost: 0, profit: 0 };
  let btts = { won: 0, lost: 0 };
  let over25 = { won: 0, lost: 0 };
  let daily = {};
  let all = [];
  let totalProfit = 0;
  let goldProfit = 0;
  let oddsSum = 0, oddsCount = 0;
  let goldOddsSum = 0, goldOddsCount = 0;

  // Period
  let periodFrom = null, periodTo = null;

  for (const file of allFiles) {
    const date = file.replace('.json', '');
    if (!periodFrom) periodFrom = date;
    periodTo = date;

    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')); } catch (e) { continue; }
    let preds = data.predictions || data;
    if (!Array.isArray(preds)) continue;

    archivedTotal += preds.length;
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
        won++; dW++;
        totalProfit += profit; dProfit += profit;
        oddsSum += ods; oddsCount++;
        if (tier === 'GOLD') { gold.won++; gold.profit += profit; goldOddsSum += ods; goldOddsCount++; }
        else { std.won++; std.profit += profit; }
        if (type === 'btts') btts.won++; else over25.won++;
      } else if (isLost) {
        lost++; dL++;
        totalProfit += profit; dProfit += profit;
        oddsSum += ods; oddsCount++;
        if (tier === 'GOLD') { gold.lost++; gold.profit += profit; goldOddsSum += ods; goldOddsCount++; }
        else { std.lost++; std.profit += profit; }
        if (type === 'btts') btts.lost++; else over25.lost++;
      } else {
        pending++;
      }

      if (isVerified) {
        all.push({
          date, match: p.match || '', league: p.league || '',
          market: type, tier, proba: p.confidence || 0,
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
      daily[date] = { total: dW + dL, won: dW, lost: dL, rate: +(dW / (dW + dL) * 100).toFixed(1), profit: +dProfit.toFixed(2) };
    }
  }

  const total = won + lost;
  const rate = total > 0 ? +(won / total * 100).toFixed(1) : 0;
  const avgOdds = oddsCount > 0 ? +(oddsSum / oddsCount).toFixed(2) : 0;
  const roi = total > 0 ? +((totalProfit / total) * 100).toFixed(1) : 0;
  const yieldPct = total > 0 ? +((totalProfit / total) * 100).toFixed(1) : 0;

  const goldTotal = gold.won + gold.lost;
  const goldRate = goldTotal > 0 ? +(gold.won / goldTotal * 100).toFixed(1) : 0;
  const goldAvgOdds = goldOddsCount > 0 ? +(goldOddsSum / goldOddsCount).toFixed(2) : 0;
  const goldRoi = goldTotal > 0 ? +((gold.profit / goldTotal) * 100).toFixed(1) : 0;

  const stdTotal = std.won + std.lost;
  const stdRate = stdTotal > 0 ? +(std.won / stdTotal * 100).toFixed(1) : 0;

  const bttsTotal = btts.won + btts.lost;
  const bttsRate = bttsTotal > 0 ? +(btts.won / bttsTotal * 100).toFixed(1) : 0;
  const overTotal = over25.won + over25.lost;
  const overRate = overTotal > 0 ? +(over25.won / overTotal * 100).toFixed(1) : 0;

  // Equity curve (cumulative profit)
  let cumProfit = 0;
  const trend = Object.entries(daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([d, v]) => { cumProfit += v.profit; return { date: d, ...v, equity: +cumProfit.toFixed(2) }; });

  // Drawdown max
  let peak = 0, maxDD = 0;
  cumProfit = 0;
  for (const t of trend) { cumProfit += t.profit; if (cumProfit > peak) peak = cumProfit; const dd = peak - cumProfit; if (dd > maxDD) maxDD = dd; }

  const out = {
    generatedAt: new Date().toISOString(),
    period: { from: periodFrom, to: periodTo, days: allFiles.length },
    stats: {
      total, won, lost, pending, archivedTotal,
      rate, avgOdds, profit: +totalProfit.toFixed(2), roi, yield: yieldPct,
      gold: {
        total: goldTotal, won: gold.won, lost: gold.lost, rate: goldRate,
        avgOdds: goldAvgOdds, profit: +gold.profit.toFixed(2), roi: goldRoi, yield: goldRoi,
      },
      standard: { total: stdTotal, won: std.won, lost: std.lost, rate: stdRate },
      byType: {
        btts: { total: bttsTotal, won: btts.won, lost: btts.lost, rate: bttsRate },
        over25: { total: overTotal, won: over25.won, lost: over25.lost, rate: overRate },
      },
      trend14: trend,
      maxDrawdown: +maxDD.toFixed(2),
    },
    history: all.slice(-500).reverse(),
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`ALL ${total} ${rate}% | ROI ${roi}% | Profit ${totalProfit.toFixed(1)}u | AvgOdds ${avgOdds} | DD ${maxDD.toFixed(1)}u`);
  console.log(`GOLD ${goldTotal} ${goldRate}% | ROI ${goldRoi}% | Profit ${gold.profit.toFixed(1)}u`);
  console.log(`Archived ${archivedTotal} | Pending ${pending} | Period ${periodFrom}→${periodTo}`);
}

main();
