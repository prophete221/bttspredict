#!/usr/bin/env python3
"""
BTTSPredict — Enrichissement des pronostics avec Gemini 2.0 Flash (BATCH MODE)
==============================================================================

UN SEUL appel API Gemini pour enrichir TOUS les matchs (Free + VIP)
en une seule requête — évite les timeouts et les erreurs 429.

Génère pour chaque match :
  - gemini_key_fact : une statistique clé percutante (max 15 mots)
  - gemini_analysis : un résumé explicatif de 2 phrases maximum

Le résultat est sauvegardé dans public/predictions.json.

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
MODELS_TO_TRY = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]
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

    prompt = f"""Tu es un expert en analyse statistique de football.
Analyse la liste suivante de {len(all_matches)} matchs :

{json.dumps(matches_summary, ensure_ascii=False, indent=2)}

Pour CHAQUE match, génère :
1. "gemini_key_fact": Une stat clé percutante (max 15 mots, ex: "80% de BTTS sur les 5 derniers H2H").
2. "gemini_analysis": Résumé de 2 phrases max expliquant la dynamique (xG, forme, fiabilité).

Réponds STRICTEMENT sous forme d'un tableau JSON contenant un objet par match avec la structure :
[
  {{
    "id": {matches_summary[0]["id"] if matches_summary else 0},
    "gemini_key_fact": "...",
    "gemini_analysis": "..."
  }},
  ...
]

Règles :
- Écris en français.
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
    print("[enrich] Starting Gemini 2.0 Flash-Lite enrichment (BATCH MODE)")

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
            key_fact = item.get("gemini_key_fact", "").strip()
            analysis = item.get("gemini_analysis", "").strip()

            if idx is None or not key_fact or not analysis:
                continue

            idx = int(idx)
            if 0 <= idx < len(all_matches):
                match = all_matches[idx]
                match["gemini_key_fact"] = key_fact
                match["gemini_analysis"] = analysis
                match_name = f"{match.get('home', '?')} vs {match.get('away', '?')}"
                print(f"  [{idx+1}] ✅ {match_name}: '{key_fact[:60]}...'")
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
