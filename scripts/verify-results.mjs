import fs from 'fs';
import path from 'path';

const ARCHIVE_DIR = './public/predictions-archive';
const LEAGUES = [
  'eng.1','eng.2','esp.1','ger.1','ita.1','fra.1','ned.1','por.1',
  'bel.1','usa.1','bra.1','mex.1','uefa.champions','uefa.europa',
  'sco.1','tur.1','swi.1','aut.1','den.1','nor.1','swe.1',
  'arg.1','jpn.1','aus.1'
];

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
    await new Promise(r => setTimeout(r, 60)); // rate limit
  }
  return scores;
}

async function main() {
  const files = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .slice(-90); // 90 derniers jours

  let W = 0, L = 0, V = 0;

  for (const file of files) {
    const dateISO = file.replace('.json', '');
    const dateESPN = dateISO.replace(/-/g, '');
    const fp = path.join(ARCHIVE_DIR, file);

    let data;
    try { data = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { continue; }

    let preds = data.predictions || data;
    if (!Array.isArray(preds)) continue;

    const scores = await getESPN(dateESPN);
    if (scores.length === 0) continue;

    let modified = false;

    for (const p of preds) {
      // Skip already verified
      if (p.status === 'WON' || p.status === 'LOST') continue;

      // Extract home/away from match string if needed
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

      if (win) W++; else L++;
      V++;
      modified = true;
    }

    if (modified) {
      // Write back in same format (data.predictions or data directly)
      if (data.predictions) data.predictions = preds;
      else data = preds;
      fs.writeFileSync(fp, JSON.stringify(data, null, 2));
    }
  }

  console.log(`Vérifiés ${V} W${W} L${L}`);
}

main();
