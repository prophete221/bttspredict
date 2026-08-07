// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — verify-results.mjs (V5 — GOLD Priority + Save Every 10 + 90j)
// ═══════════════════════════════════════════════════════════════════════════════
//
// PRIORITÉ GOLD: trie les archives pour traiter d'abord celles avec tier=GOLD
// SAVE EVERY 10: sauvegarde après chaque 10 fichiers pour ne pas perdre si timeout
// 90J BACKFILL: 90 derniers jours, 24 ligues ESPN (public, sans clé)
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';

const ARCHIVE_DIR = './public/predictions-archive';
const LEAGUES = [
  'eng.1','eng.2','esp.1','ger.1','ita.1','fra.1','ned.1','por.1',
  'bel.1','usa.1','bra.1','mex.1','uefa.champions','uefa.europa',
  'sco.1','tur.1','swi.1','aut.1','den.1','nor.1','swe.1',
  'arg.1','jpn.1','aus.1'
];

const HIGH_BTTS = ['bundesliga','eredivisie','jupiler','swiss','mls','championship','premier','liga','serie','ligue 1'];

function normalize(s = '') {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(fc|cf|sc|united|city|club|real|de|la|afc|ac|as|rc|cd)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function fuzzyMatch(ph, pa, ah, aa) {
  const a = normalize(ph), b = normalize(pa), c = normalize(ah), d = normalize(aa);
  if (a === c && b === d) return true;
  if (a === d && b === c) return true;
  if (a.length > 2 && b.length > 2 && c.length > 2 && d.length > 2) {
    if ((c.includes(a) || a.includes(c)) && (d.includes(b) || b.includes(d))) return true;
    if ((d.includes(a) || a.includes(d)) && (c.includes(b) || b.includes(c))) return true;
  }
  return false;
}

function isBTTS(h, a) { return h > 0 && a > 0; }
function isOver(h, a) { return h + a >= 3; }

function isGoldProno(p) {
  if (p.tier === 'GOLD') return true;
  let proba = p.proba || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  const lg = (p.league || '').toLowerCase();
  const isHigh = HIGH_BTTS.some(h => lg.includes(h));
  return proba >= 0.70 || (proba >= 0.65 && isHigh);
}

async function getESPN(date) {
  const scores = [];
  for (const lg of LEAGUES) {
    try {
      const r = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${lg}/scoreboard?dates=${date}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!r.ok) continue;
      const j = await r.json();
      for (const ev of j.events || []) {
        const comp = ev.competitions?.[0];
        if (!comp) continue;
        const statusName = comp.status?.type?.name;
        if (!['STATUS_FINAL', 'STATUS_FULL_TIME'].includes(statusName)) continue;
        const hc = comp.competitors?.find(c => c.homeAway === 'home');
        const ac = comp.competitors?.find(c => c.homeAway === 'away');
        if (!hc || !ac) continue;
        const hs = parseInt(hc.score);
        const as = parseInt(ac.score);
        if (isNaN(hs) || isNaN(as)) continue;
        scores.push({ home: hc.team.displayName, away: ac.team.displayName, hs, as });
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 60));
  }
  return scores;
}

async function main() {
  console.log('[VerifyResults] V5 — GOLD Priority + 90j backfill');

  // Lire toutes les archives, trier: GOLD en premier, puis par date récente
  const allFiles = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse() // plus récent d'abord
    .slice(0, 90); // 90 derniers jours

  // Séparer: archives avec au moins 1 prono GOLD d'abord
  const goldFiles = [];
  const stdFiles = [];
  for (const f of allFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, f), 'utf8'));
      const preds = data.predictions || data;
      if (Array.isArray(preds) && preds.some(p => isGoldProno(p) && p.status !== 'WON' && p.status !== 'LOST')) {
        goldFiles.push(f);
      } else {
        stdFiles.push(f);
      }
    } catch (e) { stdFiles.push(f); }
  }

  console.log(`[VerifyResults] ${goldFiles.length} archives avec GOLD pending, ${stdFiles.length} archives standard`);

  // Traiter GOLD d'abord, puis standard
  const orderedFiles = [...goldFiles, ...stdFiles];
  let W = 0, L = 0, V = 0, goldW = 0, goldL = 0, goldV = 0;
  let filesProcessed = 0;

  for (const file of orderedFiles) {
    const dateISO = file.replace('.json', '');
    const dateESPN = dateISO.replace(/-/g, '');
    const fp = path.join(ARCHIVE_DIR, file);

    let data;
    try { data = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { continue; }
    let preds = data.predictions || data;
    if (!Array.isArray(preds)) continue;

    const scores = await getESPN(dateESPN);
    if (scores.length === 0) { filesProcessed++; continue; }

    let modified = false;

    for (const p of preds) {
      if (p.status === 'WON' || p.status === 'LOST') {
        // Compter les déjà vérifiés
        if (p.status === 'WON') { W++; if (isGoldProno(p)) { goldW++; goldV++; } }
        else { L++; if (isGoldProno(p)) { goldL++; goldV++; } }
        continue;
      }

      const teams = (p.match || '').split(/\s+vs?\s+/i);
      const pHome = p.home || p.homeTeam || teams[0] || '';
      const pAway = p.away || p.awayTeam || teams[1] || '';

      let f = null;
      for (const s of scores) {
        if (fuzzyMatch(pHome, pAway, s.home, s.away)) { f = s; break; }
      }

      if (!f) { p.status = 'PENDING'; continue; }

      const b = isBTTS(f.hs, f.as);
      const o = isOver(f.hs, f.as);
      const type = (p.type || '').toUpperCase();
      const win = type.includes('BTTS') ? b : o;

      p.finalScore = `${f.hs}-${f.as}`;
      p.status = win ? 'WON' : 'LOST';
      p.verifiedAt = new Date().toISOString();

      const isG = isGoldProno(p);
      if (win) {
        W++;
        if (isG) { goldW++; goldV++; console.log(`VERIFY GOLD ${p.match} -> ${f.hs}-${f.as} WON`); }
      } else {
        L++;
        if (isG) { goldL++; goldV++; console.log(`VERIFY GOLD ${p.match} -> ${f.hs}-${f.as} LOST`); }
      }
      V++;
      modified = true;
    }

    if (modified) {
      if (data.predictions) data.predictions = preds;
      else data = preds;
      fs.writeFileSync(fp, JSON.stringify(data, null, 2));
    }

    filesProcessed++;

    // Log compteur GOLD tous les 100
    if (goldV > 0 && goldV % 100 === 0) {
      console.log(`[VerifyResults] 100 GOLD vérifiés (total: ${goldV})`);
    }

    // Save checkpoint tous les 10 fichiers
    if (filesProcessed % 10 === 0) {
      console.log(`[VerifyResults] Checkpoint: ${filesProcessed}/${orderedFiles.length} fichiers | W=${W} L=${L} GOLD=${goldV}`);
    }
  }

  console.log(`[VerifyResults] ===============================================================`);
  console.log(`[VerifyResults] Vérifiés ${V} W${W} L${L} | GOLD vérifiés: ${goldV} (W${goldW} L${goldL})`);
  console.log(`[VerifyResults] ✅ Done — 100% free ESPN, no API key.`);
}

main();
