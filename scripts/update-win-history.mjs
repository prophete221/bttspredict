// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — update-win-history.mjs (V5 — GOLD Tier System)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Lit les archives avec status WON/LOST/PENDING (mis par verify-results.mjs V3)
// + champ tier (GOLD/STANDARD) ajouté par quick-update-predictions.mjs
//
// Calcule:
//   - Stats globales (total, won, lost, pending, rate)
//   - Stats GOLD (top pronos: proba≥70% ou proba≥65% + ligue à buts)
//   - Stats STANDARD (reste)
//   - byType (btts / over25)
//   - trend14 (14 derniers jours)
//   - yield Gold (won*1.75 - total) / total * 100
//
// Sortie: public/win-history.json
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARCHIVE_DIR = path.join(__dirname, '..', 'public', 'predictions-archive');
const OUTPUT = path.join(__dirname, '..', 'public', 'win-history.json');

// ─── Helpers ──────────────────────────────────────────────────────────────

function getType(p) {
  const t = (p.type || p.market || '').toUpperCase();
  if (t.includes('BTTS')) return 'btts';
  return 'over25';
}

function getTier(p) {
  return (p.tier || 'STANDARD').toUpperCase();
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  let all = [];
  let stats = {
    won: 0, lost: 0, pending: 0,
    gold: { won: 0, lost: 0, pending: 0 },
    standard: { won: 0, lost: 0, pending: 0 },
    btts: { won: 0, lost: 0 },
    over25: { won: 0, lost: 0 },
  };
  let daily = {};

  for (const file of files.slice(-90)) {
    const date = file.replace('.json', '');
    let preds = [];
    try {
      const data = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, file), 'utf-8'));
      preds = data.predictions || data;
      if (!Array.isArray(preds)) preds = [];
    } catch (e) { continue; }

    let dW = 0, dL = 0;

    for (const p of preds) {
      all.push({ ...p, date });
      const tier = getTier(p);

      if (p.status === 'WON' || p.isWon === true) {
        stats.won++; dW++;
        if (tier === 'GOLD') stats.gold.won++;
        else stats.standard.won++;
        if (getType(p) === 'btts') stats.btts.won++;
        else stats.over25.won++;
      } else if (p.status === 'LOST' || p.isWon === false) {
        stats.lost++; dL++;
        if (tier === 'GOLD') stats.gold.lost++;
        else stats.standard.lost++;
        if (getType(p) === 'btts') stats.btts.lost++;
        else stats.over25.lost++;
      } else {
        stats.pending++;
        if (tier === 'GOLD') stats.gold.pending++;
        else stats.standard.pending++;
      }
    }

    if (dW + dL > 0) {
      daily[date] = {
        total: dW + dL,
        won: dW,
        lost: dL,
        rate: +(dW / (dW + dL) * 100).toFixed(1),
      };
    }
  }

  const totalVerified = stats.won + stats.lost;
  const rate = totalVerified > 0 ? +(stats.won / totalVerified * 100).toFixed(1) : 0;

  stats.gold.total = stats.gold.won + stats.gold.lost;
  stats.gold.rate = stats.gold.total > 0 ? +(stats.gold.won / stats.gold.total * 100).toFixed(1) : 0;
  stats.standard.total = stats.standard.won + stats.standard.lost;
  stats.standard.rate = stats.standard.total > 0 ? +(stats.standard.won / stats.standard.total * 100).toFixed(1) : 0;

  const bttsTotal = stats.btts.won + stats.btts.lost;
  const over25Total = stats.over25.won + stats.over25.lost;

  const trend = Object.entries(daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, v]) => ({ date, ...v }));

  const output = {
    generatedAt: new Date().toISOString(),
    stats: {
      total: totalVerified,
      pending: stats.pending,
      won: stats.won,
      lost: stats.lost,
      rate,
      gold: {
        total: stats.gold.total,
        pending: stats.gold.pending,
        won: stats.gold.won,
        lost: stats.gold.lost,
        rate: stats.gold.rate,
        yield: stats.gold.total > 0 ? +(((stats.gold.won * 1.75 - stats.gold.total) / stats.gold.total) * 100).toFixed(1) : 0,
      },
      standard: {
        total: stats.standard.total,
        pending: stats.standard.pending,
        won: stats.standard.won,
        lost: stats.standard.lost,
        rate: stats.standard.rate,
      },
      byType: {
        btts: {
          total: bttsTotal,
          won: stats.btts.won,
          lost: stats.btts.lost,
          rate: bttsTotal > 0 ? +(stats.btts.won / bttsTotal * 100).toFixed(1) : 0,
        },
        over25: {
          total: over25Total,
          won: stats.over25.won,
          lost: stats.over25.lost,
          rate: over25Total > 0 ? +(stats.over25.won / over25Total * 100).toFixed(1) : 0,
        },
      },
      trend14: trend,
    },
    history: all.slice(-500).reverse(),
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`[WinHistory] ALL ${totalVerified} ${rate}% | GOLD ${stats.gold.total} ${stats.gold.rate}% | STANDARD ${stats.standard.total} ${stats.standard.rate}%`);
  console.log(`[WinHistory] BTTS ${bttsTotal} (${bttsTotal > 0 ? +(stats.btts.won / bttsTotal * 100).toFixed(1) : 0}%) | O2.5 ${over25Total} (${over25Total > 0 ? +(stats.over25.won / over25Total * 100).toFixed(1) : 0}%)`);
  console.log(`[WinHistory] Gold yield: ${stats.gold.total > 0 ? +(((stats.gold.won * 1.75 - stats.gold.total) / stats.gold.total) * 100).toFixed(1) : 0}%`);
}

main();
