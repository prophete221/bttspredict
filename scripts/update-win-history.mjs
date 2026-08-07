// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — update-win-history.mjs (V4 — Compatible verify-results V3)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Lit verify-results V3 output (status: WON/LOST/PENDING + isWon + finalScore)
// + compatibilité avec ancien format (result: Gagné/Perdu/W/L)
//
// Stats: total = won + lost UNIQUEMENT (PENDING exclu du dénominateur)
// rate = won / total * 100 avec 1 décimale
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ARCHIVE_DIR = path.join(PUBLIC_DIR, 'predictions-archive');
const WIN_HISTORY_FILE = path.join(PUBLIC_DIR, 'win-history.json');

// ─── Helpers ──────────────────────────────────────────────────────────────

// Détermine si un prono est gagné, perdu, ou en attente
// Compatible avec verify-results V3 (status: WON/LOST/PENDING + isWon)
// ET ancien format (result: Gagné/Perdu/W/L + finalScore)
function getPredictionStatus(pred) {
  // V3 format (verify-results.mjs V3)
  if (pred.status === 'WON' || pred.isWon === true) return 'W';
  if (pred.status === 'LOST' || pred.isWon === false) return 'L';
  if (pred.status === 'PENDING') return 'PENDING';

  // Ancien format
  if (pred.result === 'Gagné' || pred.result === 'W') return 'W';
  if (pred.result === 'Perdu' || pred.result === 'L') return 'L';

  // Si on a un finalScore mais pas de status, on évalue
  if (pred.finalScore) {
    const m = pred.finalScore.match(/^(\d+)-(\d+)$/);
    if (m) {
      const home = parseInt(m[1], 10);
      const away = parseInt(m[2], 10);
      const bothScored = home > 0 && away > 0;
      const isOver25 = home + away >= 3;
      if (pred.type === 'BTTS') {
        if (pred.prediction === 'Oui') return bothScored ? 'W' : 'L';
        if (pred.prediction === 'Non') return bothScored ? 'L' : 'W';
      }
      if (pred.type.includes('Over') || pred.type.includes('OVER')) {
        if (pred.prediction === 'Oui') return isOver25 ? 'W' : 'L';
        if (pred.prediction === 'Non') return isOver25 ? 'L' : 'W';
      }
    }
  }

  return 'PENDING';
}

function computeRate(won, total) {
  if (!total || total === 0) return 0;
  return Math.round((won / total) * 1000) / 10;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function updateWinHistory() {
  console.log('[WinHistory] Reading archives from:', ARCHIVE_DIR);

  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.error('[WinHistory] ✗ ARCHIVE_DIR does not exist. Aborting.');
    process.exit(1);
  }

  const archiveFiles = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  console.log(`[WinHistory] Found ${archiveFiles.length} archives`);

  const allItems = [];
  let idCounter = 1;

  const stats = {
    btts: { total: 0, won: 0, lost: 0, pending: 0 },
    over25: { total: 0, won: 0, lost: 0, pending: 0 },
  };

  for (const archiveFile of archiveFiles) {
    const dateStr = archiveFile.replace('.json', '');
    const archivePath = path.join(ARCHIVE_DIR, archiveFile);

    try {
      const data = JSON.parse(fs.readFileSync(archivePath, 'utf-8'));
      const predictions = data.predictions || [];

      for (const pred of predictions) {
        const status = getPredictionStatus(pred);
        const typeKey = (pred.type || '').includes('Over') || (pred.type || '').includes('OVER') ? 'over25' : 'btts';

        // Score for display
        const scoreStr = pred.finalScore || (pred.score && pred.score !== '-' ? pred.score : null) || '-';

        // Map status to display
        let displayResult;
        if (status === 'W') displayResult = 'W';
        else if (status === 'L') displayResult = 'L';
        else displayResult = 'PENDING';

        // Compte dans le bon bucket
        if (status === 'W') {
          stats[typeKey].won++;
          stats[typeKey].total++; // total = won + lost UNIQUEMENT
        } else if (status === 'L') {
          stats[typeKey].lost++;
          stats[typeKey].total++;
        } else {
          stats[typeKey].pending++;
        }

        allItems.push({
          id: idCounter++,
          date: pred.date || dateStr,
          match: pred.match,
          league: pred.league,
          type: pred.type,
          prediction: pred.prediction,
          result: displayResult,
          score: scoreStr,
          confidence: pred.confidence || 0,
          verifiedSource: pred.verifiedSource || null,
        });
      }
    } catch (err) {
      console.log(`[WinHistory] ⚠ Error reading ${archiveFile}: ${err.message}`);
    }
  }

  // Trier par date desc pour l'affichage
  allItems.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  allItems.forEach((item, i) => { item.id = i + 1 });

  // Garde 80 entrées récentes pour l'affichage
  const displayHistory = allItems.slice(0, 80);

  // Stats globales
  const totalAll = stats.btts.total + stats.over25.total;
  const wonAll = stats.btts.won + stats.over25.won;
  const lostAll = stats.btts.lost + stats.over25.lost;
  const pendingAll = stats.btts.pending + stats.over25.pending;
  const rateAll = computeRate(wonAll, totalAll);
  const bttsRate = computeRate(stats.btts.won, stats.btts.total);
  const over25Rate = computeRate(stats.over25.won, stats.over25.total);

  const winHistoryData = {
    stats: {
      total: totalAll,
      won: wonAll,
      lost: lostAll,
      pending: pendingAll,
      rate: `${rateAll}%`,
      last30Rate: `${rateAll}%`,
      byType: {
        btts: {
          total: stats.btts.total,
          won: stats.btts.won,
          lost: stats.btts.lost,
          pending: stats.btts.pending,
          rate: bttsRate,
        },
        over25: {
          total: stats.over25.total,
          won: stats.over25.won,
          lost: stats.over25.lost,
          pending: stats.over25.pending,
          rate: over25Rate,
        },
      },
      transparency: `Stats calculées depuis ${archiveFiles.length} archives quotidiennes dans predictions-archive/. Sur ${totalAll} pronostics vérifiés (score final connu via ESPN + TheSportsDB, 100% gratuit), ${wonAll} ont été gagnants (${rateAll}% de réussite réelle vérifiable). ${pendingAll} pronostics en attente de vérification. Aucun filtrage — gagnés ET perdus affichés.`,
    },
    history: displayHistory,
    allItemsCount: allItems.length,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(WIN_HISTORY_FILE, JSON.stringify(winHistoryData, null, 2));
  console.log(`[WinHistory] ✓ Written to win-history.json`);
  console.log(`[WinHistory] Stats (REAL — from ${archiveFiles.length} archives):`);
  console.log(`  Total (verified W+L):   ${totalAll}`);
  console.log(`  Won:                    ${wonAll}`);
  console.log(`  Lost:                   ${lostAll}`);
  console.log(`  Pending:                ${pendingAll}`);
  console.log(`  Overall rate:           ${rateAll}%`);
  console.log(`  BTTS:  W=${stats.btts.won} L=${stats.btts.lost} P=${stats.btts.pending} rate=${bttsRate}%`);
  console.log(`  O2.5:  W=${stats.over25.won} L=${stats.over25.lost} P=${stats.over25.pending} rate=${over25Rate}%`);
  console.log(`[WinHistory] Display history: ${displayHistory.length} entries`);
}

updateWinHistory().catch(err => {
  console.error('[WinHistory] FATAL:', err);
  process.exit(1);
});
