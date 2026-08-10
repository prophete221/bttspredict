#!/usr/bin/env python3
"""
BTTSPredict — Enrichissement AI des pronostics (BATCH MODE, Marque Blanche)
=============================================================================

UN SEUL appel API pour enrichir TOUS les matchs (Free + VIP)
en une seule requête — évite les timeouts et les erreurs 429.

Génère pour chaque match :
  - ai_exact_score : le score exact prédit (ex: "2-1")
  - ai_key_fact   : une statistique clé percutante (max 15 mots)
  - ai_analysis    : une analyse statistique de 2 phrases max

Marque blanche 100% BTTSPredict AI — aucune mention d'API tierce.

Utilisation :
  GEMINI_API_KEY=your_key python3 scripts/enrich_predictions.py

En l'absence de GEMINI_API_KEY, le script s'arrête proprement sans modifier
le fichier (mode dry-run silencieux — le build CI ne doit pas casser).
"""

import json
import os
import sys
import time
from pathlib import Path

# ─── Constants ──────────────────────────────────────────────────────────────
MODELS_TO_TRY = [
    "gemini-flash-lite-latest",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-2.5-flash",
]
PREDICTIONS_FILE = Path(__file__).parent.parent / "public" / "predictions.json"
MAX_RETRIES = 2
RETRY_DELAY = 5  # seconds between retries
RATE_LIMIT_WAIT = 20  # seconds on 429

# ─── Gemini SDK ────────────────────────────────────────────────────────────
try:
    from google import genai
except ImportError:
    print("[enrich] google-genai not installed — skipping enrichment")
    sys.exit(0)


def get_client():
    """Initialize Gemini client from environment variable."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("[enrich] GEMINI_API_KEY not set — skipping enrichment (dry-run)")
        return None
    return genai.Client(api_key=api_key)


def build_batch_prompt(all_matches: list) -> str:
    """Build a single batch prompt for ALL matches at once."""
    matches_summary = []
    for i, m in enumerate(all_matches):
        home = m.get("home", "Unknown")
        away = m.get("away", "Unknown")
        league = m.get("league", "Unknown")
        xg_home = m.get("xgHome", m.get("homeLambda", 0))
        xg_away = m.get("xgAway", m.get("awayLambda", 0))
        btts_prob = m.get("bttsProb", 0)
        over25_prob = m.get("over25Prob", 0)
        reliability = m.get("reliabilityScore", 0)
        existing = m.get("analysis", "")

        preds = m.get("predictions", [])
        btts_pred = next((p for p in preds if p.get("type") == "BTTS"), {})
        over_pred = next((p for p in preds if p.get("type", "").startswith("Over")), {})
        btts_value = btts_pred.get("prediction", "N/A")
        over_value = over_pred.get("prediction", "N/A")

        matches_summary.append({
            "id": i,
            "match": f"{home} vs {away}",
            "league": league,
            "xG_home": xg_home,
            "xG_away": xg_away,
            "BTTS_prob_pct": round(btts_prob * 100, 1),
            "BTTS_prediction": btts_value,
            "Over25_prob_pct": round(over25_prob * 100, 1),
            "Over25_prediction": over_value,
            "reliability": reliability,
            "existing_data": existing,
        })

    prompt = f"""Tu es le moteur d'analyse statistique de la plateforme BTTSPredict.
Analyse la liste suivante de {len(all_matches)} matchs :

{json.dumps(matches_summary, ensure_ascii=False, indent=2)}

Pour CHAQUE match, génère un objet JSON STRICT respectant cette structure exacte :
[
  {{
    "id": 0,
    "ai_exact_score": "2-1",
    "exact_score_prob": "18%",
    "btts_prob": "74%",
    "over25_prob": "68%",
    "ai_key_fact": "Statistique clé percutante (15 mots max, ex: 3/3 H2H avec BTTS et xG cumulé de 3.02)",
    "ai_analysis": "Analyse détaillée et complète de 3 à 4 phrases sur la dynamique offensive, la forme récente, les xG et les faiblesses défensives."
  }},
  ...
]

Règles :
- Écris en français.
- Le score exact (ai_exact_score) doit être réaliste, basé sur les xG (ex: "2-1", "1-1", "3-0").
- exact_score_prob: probabilité en % que ce score exact se réalise (généralement 8-20%).
- btts_prob: probabilité BTTS en % (ex: "74%").
- over25_prob: probabilité Over 2.5 en % (ex: "68%").
- Sois factuel, aucune garantie de gain.
- N'utilise jamais "sure bet", "gain garanti" ou "100% sûr".
- L'"id" doit correspondre exactement à l'index du match dans la liste ci-dessus."""

    return prompt


def call_gemini_batch(client, all_matches: list) -> list:
    """Send a single batch API call to Gemini and return parsed results.

    Tries each model in MODELS_TO_TRY in order until one succeeds.
    """
    prompt = build_batch_prompt(all_matches)

    for model_name in MODELS_TO_TRY:
        print(f"[enrich] Trying model: {model_name}...")

        for attempt in range(MAX_RETRIES + 1):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={
                        "response_mime_type": "application/json",
                        "temperature": 0.7,
                        "max_output_tokens": 4096,
                    },
                )

                # Parse JSON array response
                result = json.loads(response.text)

                if isinstance(result, list) and len(result) > 0:
                    print(f"[enrich] ✅ Received {len(result)} enrichments from {model_name}")
                    return result
                else:
                    print(f"[enrich] ⚠️ Unexpected response format (attempt {attempt+1})")

            except json.JSONDecodeError as e:
                print(f"[enrich] ⚠️ JSON parse error (attempt {attempt+1}): {e}")
            except Exception as e:
                err_str = str(e)
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                    print(f"[enrich] ⏳ Rate limited on {model_name}, waiting {RATE_LIMIT_WAIT}s...")
                    time.sleep(RATE_LIMIT_WAIT)
                    continue
                elif "quota" in err_str.lower():
                    print(f"[enrich] ❌ Quota exceeded on {model_name} — skipping this model")
                    break  # try next fallback model
                elif "404" in err_str or "NOT_FOUND" in err_str:
                    print(f"[enrich] ⚠️ Model {model_name} not found — trying fallback")
                    break  # try next fallback model
                else:
                    print(f"[enrich] ⚠️ API error on {model_name} (attempt {attempt+1}): {err_str[:150]}")

            if attempt < MAX_RETRIES:
                print(f"[enrich] Retrying in {RETRY_DELAY}s...")
                time.sleep(RETRY_DELAY)

        print(f"[enrich] {model_name} failed — trying next fallback model...")

    print("[enrich] ❌ All models exhausted — keeping existing data")
    return []


def main():
    print("[enrich] Starting BTTSPredict AI enrichment (BATCH MODE)")

    # Check predictions file exists
    if not PREDICTIONS_FILE.exists():
        print(f"[enrich] {PREDICTIONS_FILE} not found — skipping")
        sys.exit(0)

    # Load predictions
    with open(PREDICTIONS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    free_matches = data.get("free", [])
    vip_matches = data.get("vipPreview", [])

    total = len(free_matches) + len(vip_matches)
    if total == 0:
        print("[enrich] No matches to enrich — skipping")
        sys.exit(0)

    print(f"[enrich] Found {len(free_matches)} free + {len(vip_matches)} VIP = {total} matches")

    # Get Gemini client
    client = get_client()
    if client is None:
        print("[enrich] Dry-run complete (no API key)")
        sys.exit(0)

    # Build combined list of all matches to enrich
    all_matches = list(free_matches) + list(vip_matches)

    # Diagnostic: list available models for this API key
    try:
        available = [m.name for m in client.models.list()]
        print(f"[enrich] Models available for this key: {available}")
    except Exception as e:
        print(f"[enrich] Could not list models: {e}")

    print(f"[enrich] Sending 1 batch API call for {len(all_matches)} matches...")

    # Single batch API call
    enrichments = call_gemini_batch(client, all_matches)

    if not enrichments:
        print("[enrich] No enrichments received — saving file unchanged")
    else:
        # Apply enrichments to matches by index
        enriched_count = 0
        for item in enrichments:
            idx = item.get("id")
            ai_exact_score = item.get("ai_exact_score", "").strip()
            exact_score_prob = item.get("exact_score_prob", "").strip()
            btts_prob = item.get("btts_prob", "").strip()
            over25_prob = item.get("over25_prob", "").strip()
            ai_key_fact = item.get("ai_key_fact", "").strip()
            ai_analysis = item.get("ai_analysis", "").strip()

            if idx is None:
                continue

            idx = int(idx)
            if 0 <= idx < len(all_matches):
                match = all_matches[idx]
                if ai_exact_score:
                    match["ai_exact_score"] = ai_exact_score
                if exact_score_prob:
                    match["exact_score_prob"] = exact_score_prob
                if btts_prob:
                    match["ai_btts_prob"] = btts_prob
                if over25_prob:
                    match["ai_over25_prob"] = over25_prob
                if ai_key_fact:
                    match["ai_key_fact"] = ai_key_fact
                if ai_analysis:
                    match["ai_analysis"] = ai_analysis
                match_name = f"{match.get('home', '?')} vs {match.get('away', '?')}"
                print(f"  [{idx+1}] ✅ {match_name}: score={ai_exact_score} ({exact_score_prob}), BTTS={btts_prob}, O2.5={over25_prob}")
                enriched_count += 1

        print(f"[enrich] Enriched {enriched_count}/{len(all_matches)} matches")

    # Sync legacy "predictions" array with free
    data["predictions"] = data.get("free", [])

    # Save enriched predictions
    with open(PREDICTIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[enrich] Saved enriched predictions to {PREDICTIONS_FILE}")
    print("[enrich] Done.")


if __name__ == "__main__":
    main()
