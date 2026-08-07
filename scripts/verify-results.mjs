// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — verify-results.mjs (V3 — 100% Free, No API Key)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Sources 100% gratuites (aucune clé API):
//   1. ESPN scoreboard (public, sans clé) — 18 ligues
//   2. TheSportsDB eventsday (public, sans clé) — fallback
//
// Pipeline:
//   1. Pour chaque archive des 14 derniers jours
//   2. Récupère scores finaux (STATUS_FINAL / FT)
//   3. Matche par similarité de noms d'équipes (normalisation + Jaccard)
//   4. Évalue W/L:
//      - BTTS Oui: isWon = home>0 && away>0
//      - BTTS Non: isWon = !(home>0 && away>0)
//      - Over 2.5 Oui: isWon = home+away >= 3
//      - Over 2.5 Non: isWon = home+away < 3
//   5. Ajoute finalScore + status (WON/LOST/PENDING) + isWon
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARCHIVE_DIR = path.join(__dirname, '..', 'public', 'predictions-archive');

const LEAGUES = [
  'eng.1','eng.2','esp.1','ger.1','ita.1','fra.1','ned.1','por.1',
  'sco.1','bel.1','tur.1','usa.1','mex.1','bra.1','arg.1',
  'uefa.champions','uefa.europa','fifa.worldq'
];

// ─── Normalize team names ─────────────────────────────────────────────────
function normalize(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/\b(fc|cf|sc|ac|as|rc|cd|afc|united|city)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function tokenize(name) {
  return new Set(normalize(name).split(' ').filter(t => t.length > 2));
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const t of setA) if (setB.has(t)) intersection++;
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

// ─── Evaluation ────────────────────────────────────────────────────────────
function isBTTS(home, away) { return home > 0 && away > 0; }
function isOver25(home, away) { return home + away >= 3; }

function evaluatePrediction(prediction, type, home, away) {
  if (type === 'BTTS') {
    const btts = isBTTS(home, away);
    if (prediction === 'Oui') return btts;
    if (prediction === 'Non') return !btts;
  }
  if (type.includes('Over') || type.includes('OVER')) {
    const over = isOver25(home, away);
    if (prediction === 'Oui') return over;
    if (prediction === 'Non') return !over;
  }
  return false;
}

// ─── Split "Home vs Away" from match string ───────────────────────────────
function splitMatch(matchStr) {
  const teams = (matchStr || '').split(/\s+vs?\s+/i);
  return {
    home: teams[0]?.trim() || '',
    away: teams[1]?.trim() || '',
  };
}

// ─── ESPN scores ──────────────────────────────────────────────────────────
async function getESPNScores(dateStr) { // dateStr YYYYMMDD
  const allScores = new Map();
  for (const league of LEAGUES) {
    try {
      const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${dateStr}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTTSPredict/1.0)' },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const ev of data.events || []) {
        const comp = ev.competitions?.[0];
        if (!comp) continue;
        if (comp?.status?.type?.name !== 'STATUS_FINAL') continue;
        const home = comp.competitors.find(c => c.homeAway === 'home');
        const away = comp.competitors.find(c => c.homeAway === 'away');
        if (!home || !away) continue;
        const homeName = home.team?.displayName || '';
        const awayName = away.team?.displayName || '';
        const homeScore = parseInt(home.score, 10);
        const awayScore = parseInt(away.score, 10);
        if (isNaN(homeScore) || isNaN(awayScore)) continue;
        // Store by normalized name for fuzzy matching
        const key = `${normalize(homeName)}_vs_${normalize(awayName)}`;
        allScores.set(key, { home: homeScore, away: awayScore, source: 'espn' });
        // Also store reversed key
        allScores.set(`${normalize(awayName)}_vs_${normalize(homeName)}`, { home: awayScore, away: homeScore, source: 'espn' });
      }
    } catch (e) { continue; }
  }
  return allScores;
}

// ─── TheSportsDB scores ──────────────────────────────────────────────────
async function getSportsDBScores(dateISO) { // YYYY-MM-DD
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${dateISO}&s=Soccer`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTTSPredict/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return new Map();
    const data = await res.json();
    const map = new Map();
    for (const ev of data.events || []) {
      const status = ev.strStatus || '';
      const isFinished = /FT|Match Finished|Finished|Final/i.test(status);
      if (!isFinished && ev.intHomeScore == null) continue;
      const h = parseInt(ev.intHomeScore, 10);
      const a = parseInt(ev.intAwayScore, 10);
      if (isNaN(h) || isNaN(a)) continue;
      const key = `${normalize(ev.strHomeTeam)}_vs_${normalize(ev.strAwayTeam)}`;
      map.set(key, { home: h, away: a, source: 'thesportsdb' });
      map.set(`${normalize(ev.strAwayTeam)}_vs_${normalize(ev.strHomeTeam)}`, { home: a, away: h, source: 'thesportsdb' });
    }
    return map;
  } catch (e) { return new Map(); }
}

// ─── Match prediction with scores ─────────────────────────────────────────
function findScore(pred, scores) {
  const { home, away } = splitMatch(pred.match);
  const normHome = normalize(home);
  const normAway = normalize(away);

  // Exact match on normalized names
  const directKey = `${normHome}_vs_${normAway}`;
  if (scores.has(directKey)) return scores.get(directKey);

  const reverseKey = `${normAway}_vs_${normHome}`;
  if (scores.has(reverseKey)) return scores.get(reverseKey);

  // Fuzzy match (Jaccard > 0.5)
  const predHomeTokens = tokenize(home);
  const predAwayTokens = tokenize(away);
  let bestMatch = null;
  let bestScore = 0;
  for (const [key, score] of scores) {
    const parts = key.split('_vs_');
    const sHomeTokens = new Set(parts[0].split(' ').filter(t => t.length > 2));
    const sAwayTokens = new Set(parts[1].split(' ').filter(t => t.length > 2));
    const homeSim = jaccardSimilarity(predHomeTokens, sHomeTokens);
    const awaySim = jaccardSimilarity(predAwayTokens, sAwayTokens);
    const avg = (homeSim + awaySim) / 2;
    if (avg > bestScore && avg > 0.5) {
      bestScore = avg;
      bestMatch = score;
    }
  }
  return bestMatch;
}

// ═══ MAIN ═══════════════════════════════════════════════════════════════════

async function verifyResults() {
  console.log('[VerifyResults] Starting — 100% free (ESPN + TheSportsDB, no API key)');

  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.error(`[VerifyResults] ARCHIVE_DIR not found: ${ARCHIVE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .slice(-14); // Last 14 days

  console.log(`[VerifyResults] Processing ${files.length} archives`);

  let totalChecked = 0, won = 0, lost = 0, pending = 0;

  for (const file of files) {
    const dateISO = file.replace('.json', ''); // YYYY-MM-DD
    const dateStr = dateISO.replace(/-/g, '');  // YYYYMMDD
    console.log(`[VerifyResults] Vérif ${dateISO}...`);

    // Fetch scores from both free sources
    const espnScores = await getESPNScores(dateStr);
    const dbScores = await getSportsDBScores(dateISO);
    const merged = new Map([...espnScores, ...dbScores]);
    console.log(`[VerifyResults]   ESPN: ${espnScores.size} scores | TheSportsDB: ${dbScores.size} scores | Merged: ${merged.size}`);

    const filePath = path.join(ARCHIVE_DIR, file);
    const archive = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const preds = archive.predictions || [];
    let modified = false;

    for (const p of preds) {
      // Skip if already verified
      if (p.finalScore && p.status !== 'PENDING') {
        // Count existing verified
        if (p.status === 'WON') { won++; totalChecked++; }
        else if (p.status === 'LOST') { lost++; totalChecked++; }
        else { pending++; }
        continue;
      }

      const score = findScore(p, merged);
      if (!score) {
        p.status = 'PENDING';
        pending++;
        continue;
      }

      const { home: homeScore, away: awayScore } = score;
      const isWon = evaluatePrediction(p.prediction, p.type, homeScore, awayScore);

      p.finalScore = `${homeScore}-${awayScore}`;
      p.status = isWon ? 'WON' : 'LOST';
      p.isWon = isWon;
      p.verifiedSource = score.source;
      p.verifiedAt = new Date().toISOString();

      if (isWon) won++;
      else lost++;
      totalChecked++;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(archive, null, 2));
      console.log(`[VerifyResults]   ✓ Updated ${file}`);
    }
  }

  console.log(`[VerifyResults] ===============================================================`);
  console.log(`[VerifyResults] RÉSULTAT: ${won} W / ${lost} L / ${pending} PENDING / ${totalChecked} vérifiés`);
  console.log(`[VerifyResults] ✅ Done — 100% free, no API key used.`);
}

verifyResults().catch(err => {
  console.error('[VerifyResults] FATAL:', err);
  process.exit(1);
});
