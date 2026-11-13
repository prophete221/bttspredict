#!/usr/bin/env python3
"""
BTTSPredict — Analyse AI des pronostics (stats → Gemini → décision)
===================================================================

Remplace l'ancien rôle « texte cosmétique autour du Poisson ».

Flux :
  1. Lit les matchs et statistiques observées par quick-update-predictions.mjs.
  2. Retire immédiatement tout pick préexistant et écrit un état sûr « ABSTAIN ».
  3. Envoie à Gemini uniquement les données empiriques (pas de λ Poisson).
  4. Publie un pick seulement si Gemini fournit une décision utilisable.
      Sinon, le match et ses données restent, sans sélection ni source inventée.

Variable : GEMINI_API_KEY
Sans clé, erreur fournisseur, JSON invalide ou abstention : aucun pick local.
"""

from __future__ import annotations

import json
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

# Identifiant stable du catalogue Gemini. Aucun alias « latest » et aucun modèle
# de secours : un 404 est un nom de modèle invalide, un 503 une surcharge, un 429 un quota.
MODEL_NAME = "gemini-3.5-flash-lite"
MODELS_TO_TRY = [MODEL_NAME]
PREDICTIONS_FILE = Path(__file__).parent.parent / "public" / "predictions.json"
MAX_RETRIES = 3  # 4 essais au total (1 + 3 retries) pour 503 persistants
RETRY_BASE_DELAY_S = 1.0
RATE_LIMIT_BASE_DELAY_S = 5.0
OVERLOAD_BASE_DELAY_S = 4.0  # 503/504: attendre plus longtemps qu'un simple 500
RETRY_MAX_DELAY_S = 45.0
RETRY_JITTER_MAX_S = 2.0
RETRY_JITTER_FRACTION = 0.25
RETRYABLE_HTTP_CODES = frozenset({408, 429, 500, 502, 503, 504})
CHUNK_SIZE = 4  # lots modestes : moins d'appels séquentiels, sans requêtes parallèles
MAX_OUTPUT_TOKENS = 8192
REQUEST_TIMEOUT_MS = 45_000
ENRICH_TIME_BUDGET_S = 300  # borne totale, en laissant marge au timeout final du job
PROBA_MIN = 0.48
PROBA_MAX = 0.78
MIN_SAMPLE = 4

try:
    from google import genai
    from google.genai import types as genai_types
    from google.genai.errors import APIError as GeminiAPIError
    import httpx
except ImportError:
    print("[analyze] google-genai not installed — no Gemini picks will be published")
    genai = None
    genai_types = None
    GeminiAPIError = None
    httpx = None


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or genai is None:
        print("[analyze] GEMINI_API_KEY missing or SDK absent — no Gemini picks will be published")
        return None
    # Une seule couche de retries, contrôlée ci-dessous; le SDK ne réessaie pas.
    http_options = genai_types.HttpOptions(
        timeout=REQUEST_TIMEOUT_MS,
        retry_options=genai_types.HttpRetryOptions(attempts=1),
    )
    return genai.Client(api_key=api_key, http_options=http_options)


def fmt_form(form):
    if not form:
        return None
    return {
        "last5": form.get("last5String"),
        "record": f"{form.get('wins', 0)}W-{form.get('draws', 0)}D-{form.get('losses', 0)}L",
        "goals_for": form.get("goalsFor"),
        "goals_against": form.get("goalsAgainst"),
        "btts_rate": form.get("bttsRate"),
        "over25_rate": form.get("over25Rate"),
    }


def build_match_payload(m: dict, idx: int) -> dict:
    """Paquet stats strict — aucune proba Poisson."""
    form_home = fmt_form(m.get("formHome") or (m.get("analysis") or {}).get("homeForm"))
    form_away = fmt_form(m.get("formAway") or (m.get("analysis") or {}).get("awayForm"))
    odds = m.get("odds") or {}
    return {
        "id": idx,
        "match": m.get("match") or f"{m.get('home')} vs {m.get('away')}",
        "league": m.get("league"),
        "date": m.get("date"),
        "home": m.get("home"),
        "away": m.get("away"),
        "sample_home": m.get("matchCountHome") or m.get("sampleHome"),
        "sample_away": m.get("matchCountAway") or m.get("sampleAway"),
        "data_quality": m.get("dataQuality"),
        "form_home": form_home,
        "form_away": form_away,
        "goals_avg_home": m.get("xgHome") or m.get("homeLambda"),
        "goals_avg_away": m.get("xgAway") or m.get("awayLambda"),
        "empirical_btts": m.get("empiricalBttsRate", m.get("bttsProb")),
        "empirical_over25": m.get("empiricalOver25Rate", m.get("over25Prob")),
        "formBTTS": m.get("formBTTS"),
        "standings_home": m.get("standingsHome"),
        "standings_away": m.get("standingsAway"),
        "odds": {
            "provider": odds.get("provider"),
            "home": odds.get("home"),
            "draw": odds.get("draw"),
            "away": odds.get("away"),
            "over25": odds.get("over25"),
        }
        if odds
        else None,
    }


def build_batch_prompt(matches: list, id_offset: int = 0) -> str:
    payload = [build_match_payload(m, id_offset + i) for i, m in enumerate(matches)]
    return f"""Tu es analyste football pour BTTSPredict.
Tu reçois UNIQUEMENT des statistiques observées (forme, taux BTTS/Over empiriques, buts moyens, cotes éventuelles).
Il n'y a PAS de modèle Poisson. Tu dois analyser ces stats et produire un pronostic honnête.

# MATCHS
{json.dumps(payload, ensure_ascii=False, indent=2)}

# TÂCHE
Pour chaque match, choisis :
- market: "BTTS" | "OVER_25" | "ABSTAIN"
- selection: "Yes" | "No" | null (null si ABSTAIN)
- probability: nombre entre {PROBA_MIN} et {PROBA_MAX} (estimation calibrée, pas 90%+)
- confidence: "low" | "medium" | "high"
- primary_reasons: 2 à 4 raisons appuyées UNIQUEMENT sur les stats fournies
- risks: 1 à 2 risques
- key_fact: fait clé ≤ 20 mots tiré des données
- analysis_fr: 3 à 5 phrases pro en français
- analysis_en: traduction anglaise fidèle
- form_summary_fr / form_summary_en: forme des deux équipes

# RÈGLES STRICTES
1. N'invente AUCUNE stat, blessure, composition, H2H ou source absente du JSON.
2. Si sample_home ou sample_away < {MIN_SAMPLE}, ou data_quality LOW avec signaux contradictoires → ABSTAIN.
3. Si les taux empiriques BTTS et Over sont tous deux < 0.45 sans autre signal fort → ABSTAIN.
4. Préfère ABSTAIN plutôt qu'un Oui faible.
5. Choisis un seul marché. Ne combine jamais BTTS et Over 2.5 à partir d'une seule probabilité.
6. probability doit être cohérente avec les taux empiriques (±0.15 max d'écart sauf justification dans reasons).
7. Réponds UNIQUEMENT un tableau JSON valide.

# FORMAT
[
  {{
    "id": 0,
    "market": "BTTS",
    "selection": "Yes",
    "probability": 0.62,
    "confidence": "medium",
    "primary_reasons": ["...", "..."],
    "risks": ["..."],
    "key_fact": "...",
    "analysis_fr": "...",
    "analysis_en": "...",
    "form_summary_fr": "...",
    "form_summary_en": "..."
  }}
]
"""


def clamp_proba(p) -> float | None:
    try:
        v = float(p)
    except (TypeError, ValueError):
        return None
    if v < 0.40 or v > 0.90:
        return None
    return max(PROBA_MIN, min(PROBA_MAX, round(v, 4)))


def selection_to_fr(sel) -> str | None:
    if sel is None:
        return None
    s = str(sel).strip().lower()
    if s in ("yes", "oui", "true", "1"):
        return "Oui"
    if s in ("no", "non", "false", "0"):
        return "Non"
    return None


def sample_ok(m: dict) -> bool:
    sh = m.get("matchCountHome")
    sa = m.get("matchCountAway")
    if sh is None:
        sh = m.get("sampleHome")
    if sa is None:
        sa = m.get("sampleAway")
    if sh is None or sa is None:
        return False
    try:
        sh, sa = int(sh), int(sa)
    except (TypeError, ValueError):
        return False
    return sh >= MIN_SAMPLE and sa >= MIN_SAMPLE


def mark_no_gemini_pick(match: dict) -> None:
    """Clear every current pick and mark an honest abstention before API calls."""
    if match.get("empiricalBttsRate") is None and match.get("bttsProb") is not None:
        match["empiricalBttsRate"] = match["bttsProb"]
    if match.get("empiricalOver25Rate") is None and match.get("over25Prob") is not None:
        match["empiricalOver25Rate"] = match["over25Prob"]

    pick_fields = (
        "prediction", "proba", "confidence", "predictions", "bttsProb", "over25Prob",
        "bttsProbDisplay", "over25ProbDisplay", "estimatedCote", "estimatedCoteOver",
        "estimatedCoteBTTS", "ai_source", "ai_model", "ai_response_status",
        "ai_market", "ai_abstain", "modelEngine",
        "ai_confidence", "ai_key_fact", "ai_key_fact_en", "ai_analysis", "ai_analysis_en",
        "ai_form_summary", "ai_form_summary_en", "ai_reasons", "ai_risks", "ai_exact_score",
        "exact_score_prob", "ai_btts_view", "ai_over25_view", "ai_btts_prob",
        "ai_over25_prob", "ai_winner", "ai_winner_prob", "winner", "winner_prob",
        "team_over15", "ai_team_over15", "double_chance", "ai_double_chance",
        "ai_main_prediction", "ai_risk", "ai_odds_insight", "ai_absences", "ai_absences_en",
    )
    for field in pick_fields:
        match.pop(field, None)
    match["ai_abstain"] = True
    match["ai_market"] = "ABSTAIN"


def apply_analysis(match: dict, item: dict) -> bool:
    """Applique une réponse Gemini structurée; seul un pick valide est publiable."""
    if not isinstance(item, dict) or item.get("id") is None:
        return False

    mark_no_gemini_pick(match)

    market = str(item.get("market") or "").strip().upper().replace("OVER25", "OVER_25")
    selection = selection_to_fr(item.get("selection"))
    proba = clamp_proba(item.get("probability"))
    explicit_abstention = market == "ABSTAIN" and "selection" in item and item["selection"] is None
    valid_market = market in ("BTTS", "OVER_25")
    valid_selection = selection in ("Oui", "Non")
    if not explicit_abstention and not (valid_market and valid_selection):
        return False
    response_status = "abstain" if explicit_abstention else "pick"
    if not explicit_abstention and (proba is None or not sample_ok(match)):
        response_status = "rejected"

    confidence = str(item.get("confidence") or "medium").lower()
    if confidence not in ("low", "medium", "high"):
        confidence = "medium"

    # Textes
    for src, dst in (
        ("key_fact", "ai_key_fact"),
        ("analysis_fr", "ai_analysis"),
        ("analysis_en", "ai_analysis_en"),
        ("form_summary_fr", "ai_form_summary"),
        ("form_summary_en", "ai_form_summary_en"),
    ):
        val = item.get(src)
        if isinstance(val, str) and val.strip():
            match[dst] = val.strip()
    if item.get("key_fact") and not match.get("ai_key_fact_en"):
        # optional en key fact
        pass
    if isinstance(item.get("analysis_en"), str):
        match["ai_analysis_en"] = item["analysis_en"].strip()

    reasons = item.get("primary_reasons") if isinstance(item.get("primary_reasons"), list) else []
    risks = item.get("risks") if isinstance(item.get("risks"), list) else []
    match["ai_reasons"] = [str(r) for r in reasons[:4] if r]
    match["ai_risks"] = [str(r) for r in risks[:3] if r]
    match["ai_confidence"] = confidence
    match["modelEngine"] = "gemini-stats-v1"
    match["ai_source"] = "gemini-stats-v1"
    match["ai_model"] = MODEL_NAME
    match["ai_response_status"] = response_status
    if response_status != "pick":
        match["ai_abstain"] = True
        match["ai_market"] = "ABSTAIN"
        return True

    match["ai_abstain"] = False
    match["ai_market"] = market

    conf_pct = int(round(proba * 100))

    def upsert_pred(typ: str, sel: str, p: float):
        preds = match.get("predictions")
        if not isinstance(preds, list):
            preds = []
            match["predictions"] = preds
        row = next((x for x in preds if str(x.get("type", "")).upper().startswith(typ[:4])), None)
        payload = {
            "type": "BTTS" if typ == "BTTS" else "Over 2.5",
            "prediction": sel,
            "confidence": conf_pct,
            "proba": p,
            "modelEngine": MODEL_NAME,
        }
        if typ == "BTTS":
            payload["bttsProb"] = p
        else:
            payload["over25Prob"] = p
        if row:
            row.update(payload)
        else:
            preds.append(payload)

    if market == "BTTS":
        upsert_pred("BTTS", selection, proba)
        match["bttsProb"] = proba
        match["type"] = "BTTS"
        match["prediction"] = selection
        match["proba"] = proba
        match["confidence"] = conf_pct

    if market == "OVER_25":
        upsert_pred("OVER", selection, proba)
        match["over25Prob"] = proba
        match["type"] = "Over 2.5"
        match["prediction"] = selection
        match["proba"] = proba
        match["confidence"] = int(round(proba * 100))

    return True


def _http_status_code(error: Exception) -> int | None:
    """Read the SDK's structured APIError.code; never infer status from text."""
    if GeminiAPIError is not None and isinstance(error, GeminiAPIError):
        code = error.code
    else:
        code = getattr(error, "code", None)
    if code is None:
        response = getattr(error, "response", None)
        code = getattr(response, "status_code", None)
    try:
        code = int(code)
    except (TypeError, ValueError):
        return None
    return code if 100 <= code <= 599 else None


def _is_retryable_error(error: Exception) -> bool:
    code = _http_status_code(error)
    if code in RETRYABLE_HTTP_CODES:
        return True
    if httpx is not None and isinstance(error, (httpx.TimeoutException, httpx.ConnectError)):
        return True
    return False


def _parse_retry_after(value, allow_http_date: bool = False) -> float | None:
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, (int, float)):
        return max(0.0, float(value))
    text = str(value).strip()
    if not text:
        return None
    try:
        return max(0.0, float(text))
    except ValueError:
        duration = re.fullmatch(r"(\d+(?:\.\d+)?)s", text, re.IGNORECASE)
        if duration:
            return max(0.0, float(duration.group(1)))
    if allow_http_date:
        try:
            retry_at = parsedate_to_datetime(text)
            if retry_at.tzinfo is None:
                retry_at = retry_at.replace(tzinfo=timezone.utc)
            return max(0.0, retry_at.timestamp() - time.time())
        except (TypeError, ValueError, OverflowError):
            pass
    return None


def _provider_retry_after_seconds(error: Exception) -> float | None:
    response = getattr(error, "response", None)
    headers = getattr(response, "headers", None)
    if headers is not None:
        try:
            delay = _parse_retry_after(headers.get("Retry-After"), allow_http_date=True)
        except (AttributeError, TypeError):
            delay = None
        if delay is not None:
            return delay

    details = getattr(error, "details", None)
    if not isinstance(details, dict):
        return None
    error_details = details.get("error", details)
    if not isinstance(error_details, dict):
        return None
    candidates = [error_details.get("retryDelay")]
    entries = error_details.get("details", [])
    if isinstance(entries, list):
        for entry in entries:
            if isinstance(entry, dict):
                candidates.append(entry.get("retryDelay"))
    for candidate in candidates:
        delay = _parse_retry_after(candidate)
        if delay is not None:
            return delay
    return None


def _retry_delay_seconds(retry_index: int, error: Exception) -> float:
    code = _http_status_code(error)
    base = RETRY_BASE_DELAY_S * (2 ** max(0, retry_index))
    if code == 429:
        base = max(base, RATE_LIMIT_BASE_DELAY_S * (2 ** max(0, retry_index)))
    elif code in (503, 504):
        # Surcharge fournisseur: backoff plus long que les 500 génériques, toujours plafonné.
        base = max(base, OVERLOAD_BASE_DELAY_S * (2 ** max(0, retry_index)))
    provider_delay = _provider_retry_after_seconds(error)
    if provider_delay is not None:
        base = max(base, provider_delay)
    base = min(RETRY_MAX_DELAY_S, max(0.0, base))
    jitter_limit = min(RETRY_JITTER_MAX_S, base * RETRY_JITTER_FRACTION)
    jitter = random.uniform(0.0, jitter_limit) if jitter_limit > 0 else 0.0
    return min(RETRY_MAX_DELAY_S, base + jitter)


def _call_gemini_chunk(
    client, matches: list, id_offset: int, provider_errors: list[tuple[str, int | None]] | None = None
) -> list:
    prompt = build_batch_prompt(matches, id_offset=id_offset)
    if client is None:
        return []

    for model_name in MODELS_TO_TRY:
        print(f"[analyze] model={model_name} chunk {id_offset+1}-{id_offset+len(matches)}")
        for attempt in range(MAX_RETRIES + 1):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={
                        "response_mime_type": "application/json",
                        "temperature": 0.25,
                        "max_output_tokens": MAX_OUTPUT_TOKENS,
                    },
                )
            except Exception as e:
                code = _http_status_code(e)
                label = f"HTTP {code}" if code is not None else type(e).__name__
                print(f"[analyze] error attempt {attempt+1}: {label}")
                if provider_errors is not None:
                    provider_errors.append((model_name, code))
                if code == 404:
                    print(f"[analyze] model/endpoint not found (404); verify exact model ID {model_name}; no retry")
                    break
                if code == 429:
                    print("[analyze] rate limit/quota response (429); check project quota and Retry-After")
                elif code == 503:
                    print("[analyze] service overloaded (503); bounded retry only")
                if not _is_retryable_error(e):
                    if code is None:
                        print("[analyze] non-retryable error; fixture remains a no-pick abstention")
                    else:
                        print(f"[analyze] non-retryable HTTP {code}; fixture remains a no-pick abstention")
                    break
                if attempt >= MAX_RETRIES:
                    print(
                        f"[analyze] transient HTTP {code}; retries exhausted "
                        f"after {attempt + 1} attempts"
                    )
                    break
                delay = _retry_delay_seconds(attempt, e)
                print(
                    f"[analyze] retrying transient HTTP {code} in {delay:.2f}s "
                    f"(attempt {attempt + 2}/{MAX_RETRIES + 1})"
                )
                time.sleep(delay)
                continue

            try:
                result = json.loads(response.text or "")
            except json.JSONDecodeError:
                print(f"[analyze] invalid JSON response from {model_name}; no retry")
                return []
            if isinstance(result, list) and result:
                print(f"[analyze] ✅ {len(result)} decisions from {model_name}")
                return result
            print(f"[analyze] unusable response from {model_name}; no retry")
            return []
    return []


def call_gemini_batch(
    client, matches: list, provider_errors: list[tuple[str, int | None]] | None = None
) -> list:
    if provider_errors is None:
        provider_errors = []
    started = time.monotonic()
    out = []
    chunk_starts = list(range(0, len(matches), CHUNK_SIZE))
    for chunk_number, i in enumerate(chunk_starts):
        if time.monotonic() - started >= ENRICH_TIME_BUDGET_S:
            print("[analyze] time budget reached — remaining matches stay no-pick abstentions")
            break
        chunk = matches[i : i + CHUNK_SIZE]
        errors_before_chunk = len(provider_errors)
        try:
            part = _call_gemini_chunk(client, chunk, id_offset=i, provider_errors=provider_errors)
        except Exception as exc:
            # Une erreur locale de lecture/parsing d'un lot ne doit pas effacer les
            # décisions déjà reçues des lots précédents. Le lot courant reste no-pick.
            print(
                f"[analyze] chunk {i+1}-{i+len(chunk)} failed locally "
                f"({type(exc).__name__}); keep earlier responses"
            )
            provider_errors.append((MODELS_TO_TRY[0], _http_status_code(exc)))
            part = []
        expected_ids = set(range(i, i + len(chunk)))
        for item in part:
            if not isinstance(item, dict):
                print(f"[analyze] invalid response item in chunk {i+1}; skip")
                continue
            try:
                response_id = int(item.get("id"))
            except (TypeError, ValueError):
                print(f"[analyze] response item without integer id in chunk {i+1}; skip")
                continue
            if response_id not in expected_ids:
                print(f"[analyze] out-of-chunk Gemini id={response_id}; expected {sorted(expected_ids)}; skip")
                continue
            item["id"] = response_id
            out.append(item)
        chunk_errors = provider_errors[errors_before_chunk:]
        if any(code in {400, 401, 403, 404} for _, code in chunk_errors):
            print("[analyze] permanent API/model error; stop remaining chunks without retrying them")
            break
        if chunk_number < len(chunk_starts) - 1:
            # Cooldown uniquement entre les lots, jamais après le dernier.
            if part:
                time.sleep(1.5)
            else:
                cooldown = 12.0
                print(f"[analyze] chunk empty — cooldown {cooldown:.0f}s before next lot")
                time.sleep(cooldown)
    return out


def save_payload(data: dict, matches: list[dict]) -> None:
    data["free"] = matches
    data["predictions"] = matches
    tmp = PREDICTIONS_FILE.with_suffix(PREDICTIONS_FILE.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, PREDICTIONS_FILE)


def main():
    print("[analyze] BTTSPredict Gemini stats analysis v1 (no Poisson)")

    if not PREDICTIONS_FILE.exists():
        print(f"[analyze] {PREDICTIONS_FILE} not found — skip")
        sys.exit(0)

    with open(PREDICTIONS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    free_matches = data.get("free") or data.get("predictions") or []
    if not isinstance(free_matches, list) or not free_matches:
        print("[analyze] no matches")
        return

    # Fail closed before network access. If Gemini times out or the process is
    # interrupted, the workflow still sees a valid no-pick payload, never local picks.
    for match in free_matches:
        if isinstance(match, dict):
            mark_no_gemini_pick(match)
    data["analysisEngine"] = "unavailable"
    save_payload(data, free_matches)

    client = get_client()
    provider_errors: list[tuple[str, int | None]] = []
    response_count = 0
    if client is not None:
        try:
            enrichments = call_gemini_batch(client, free_matches, provider_errors)
        except Exception as exc:  # a provider/SDK failure must not restore local picks
            print(f"[analyze] Gemini batch failed ({type(exc).__name__}); all unmatched fixtures remain abstentions")
            enrichments = []
            provider_errors.append((MODELS_TO_TRY[0], None))

        response_by_index = {}
        duplicate_indices = set()
        for item in enrichments:
            if not isinstance(item, dict):
                continue
            try:
                idx = int(item.get("id"))
            except (TypeError, ValueError):
                continue
            if not 0 <= idx < len(free_matches):
                continue
            if idx in duplicate_indices:
                continue
            if idx in response_by_index:
                duplicate_indices.add(idx)
                response_by_index.pop(idx, None)
                print(f"[analyze] duplicate Gemini response id={idx}; candidate stays no-pick")
                continue
            response_by_index[idx] = item

        for idx, item in response_by_index.items():
            apply_analysis(free_matches[idx], item)
            if free_matches[idx].get("ai_response_status") in {"pick", "abstain", "rejected"}:
                response_count += 1
                print(
                    f"  [{idx+1}] {free_matches[idx].get('match')} → "
                    f"{free_matches[idx].get('ai_response_status')}"
                )

        picks = sum(1 for match in free_matches if match.get("ai_response_status") == "pick")
        abstentions = sum(1 for match in free_matches if match.get("ai_response_status") == "abstain")
        rejected = sum(1 for match in free_matches if match.get("ai_response_status") == "rejected")
        no_response = len(free_matches) - response_count
        print(f"[analyze] Gemini responses={response_count}/{len(free_matches)}")
        print(
            f"[analyze] Gemini picks={picks}; explicit abstentions={abstentions}; "
            f"guardrail rejections={rejected}; no valid response={no_response}"
        )
    else:
        print("[analyze] no Gemini client — all fixtures remain no-pick abstentions")
    picks = sum(1 for match in free_matches if match.get("ai_response_status") == "pick")
    abstentions = sum(1 for match in free_matches if match.get("ai_response_status") == "abstain")
    rejected = sum(1 for match in free_matches if match.get("ai_response_status") == "rejected")
    no_response = len(free_matches) - response_count
    if client is None:
        print(f"[analyze] Gemini responses={response_count}/{len(free_matches)}")
        print(
            f"[analyze] Gemini picks={picks}; explicit abstentions={abstentions}; "
            f"guardrail rejections={rejected}; no valid response={no_response}"
        )
    data["analysisEngine"] = "gemini-stats-v1" if response_count > 0 else "unavailable"
    save_payload(data, free_matches)
    print(f"[analyze] saved {PREDICTIONS_FILE}")
    if no_response:
        failed_models = ", ".join(dict.fromkeys(model for model, _ in provider_errors)) or MODEL_NAME
        error_codes = sorted({str(code) for _, code in provider_errors if code is not None})
        code_summary = f"; HTTP codes: {', '.join(error_codes)}" if error_codes else ""
        print(
            f"::warning::Gemini coverage incomplete: {response_count}/{len(free_matches)} candidates "
            f"have a structured Gemini response{code_summary}; fixtures without a verified pick or explicit abstention "
            f"will be excluded from the current public feed. Continuing with verified responses only."
        )
    print("[analyze] done.")


if __name__ == "__main__":
    main()
