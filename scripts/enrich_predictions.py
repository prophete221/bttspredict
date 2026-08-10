#!/usr/bin/env python3
"""
BTTSPredict — Enrichissement des pronostics avec Gemini 2.5 Flash
==================================================================

Pour chaque match dans public/predictions.json, appelle l'API Gemini
pour générer :
  - key_fact : une statistique clé percutante (ex: "80% de BTTS sur les 5 derniers H2H")
  - analysis : un résumé explicatif de 2 phrases maximum

Le résultat est sauvegardé dans public/predictions.json (champs ajoutés
à chaque match : gemini_key_fact, gemini_analysis).

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
MODEL = "gemini-2.0-flash"
PREDICTIONS_FILE = Path(__file__).parent.parent / "public" / "predictions.json"
MAX_RETRIES = 2
RETRY_DELAY = 3  # seconds

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


def build_prompt(match: dict) -> str:
    """Build the structured prompt for a single match."""
    home = match.get("home", "Unknown")
    away = match.get("away", "Unknown")
    league = match.get("league", "Unknown")
    date = match.get("date", "Unknown")
    time_str = match.get("time", "--:--")
    xg_home = match.get("xgHome", match.get("homeLambda", 0))
    xg_away = match.get("xgAway", match.get("awayLambda", 0))
    btts_prob = match.get("bttsProb", 0)
    over25_prob = match.get("over25Prob", 0)
    reliability = match.get("reliabilityScore", 0)
    existing_analysis = match.get("analysis", "")

    preds = match.get("predictions", [])
    btts_pred = next((p for p in preds if p.get("type") == "BTTS"), {})
    over_pred = next((p for p in preds if p.get("type", "").startswith("Over")), {})
    btts_value = btts_pred.get("prediction", "N/A")
    over_value = over_pred.get("prediction", "N/A")

    return f"""You are a football betting analyst. Analyze this match and provide a key fact + short analysis.

Match: {home} vs {away}
League: {league}
Date: {date} {time_str}
Expected Goals (xG): Home {xg_home} / Away {xg_away}
BTTS Probability: {btts_prob*100:.1f}% → Prediction: {btts_value}
Over 2.5 Probability: {over25_prob*100:.1f}% → Prediction: {over_value}
Reliability Score: {reliability}/100
Existing data: {existing_analysis}

Respond in JSON format with exactly these two fields:
{{
  "key_fact": "One punchy key statistic (max 15 words, e.g. '80% BTTS rate in last 5 H2H meetings')",
  "analysis": "2-sentence max explanation of why BTTS and Over 2.5 are predicted"
}}

Write in French. Be factual, no guarantees. No 'sure bet' language."""


def enrich_match(client, match: dict, index: int) -> dict:
    """Call Gemini API for a single match and return enriched match."""
    home = match.get("home", "Unknown")
    away = match.get("away", "Unknown")
    match_name = f"{home} vs {away}"

    # Default: keep existing data if API fails
    match["gemini_key_fact"] = match.get("gemini_key_fact", "")
    match["gemini_analysis"] = match.get("gemini_analysis", match.get("analysis", ""))

    prompt = build_prompt(match)

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "temperature": 0.7,
                    "max_output_tokens": 200,
                },
            )

            # Parse JSON response
            result = json.loads(response.text)

            key_fact = result.get("key_fact", "").strip()
            analysis = result.get("analysis", "").strip()

            if key_fact and analysis:
                match["gemini_key_fact"] = key_fact
                match["gemini_analysis"] = analysis
                print(f"  [{index+1}] ✅ {match_name}: '{key_fact[:60]}...'")
                return match
            else:
                print(f"  [{index+1}] ⚠️ {match_name}: incomplete response (attempt {attempt+1})")

        except json.JSONDecodeError as e:
            print(f"  [{index+1}] ⚠️ {match_name}: JSON parse error (attempt {attempt+1}): {e}")
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                wait = RETRY_DELAY * (attempt + 1) * 2
                print(f"  [{index+1}] ⏳ {match_name}: rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            elif "quota" in err_str.lower():
                print(f"  [{index+1}] ❌ {match_name}: quota exceeded — stopping enrichment")
                return match
            else:
                print(f"  [{index+1}] ⚠️ {match_name}: API error (attempt {attempt+1}): {err_str[:100]}")

        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY)

    print(f"  [{index+1}] ❌ {match_name}: all retries exhausted, keeping existing data")
    return match


def main():
    print("[enrich] Starting Gemini 2.5 Flash enrichment")

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
        # Dry-run mode: save file unchanged
        print("[enrich] Dry-run complete (no API key)")
        sys.exit(0)

    # Enrich free matches
    print(f"[enrich] Enriching {len(free_matches)} free matches...")
    for i, match in enumerate(free_matches):
        enrich_match(client, match, i)

    # Enrich VIP matches
    if vip_matches:
        print(f"[enrich] Enriching {len(vip_matches)} VIP matches...")
        for i, match in enumerate(vip_matches):
            enrich_match(client, match, i + len(free_matches))

    # Also enrich the legacy "predictions" array (same as free)
    data["predictions"] = data.get("free", [])

    # Save enriched predictions
    with open(PREDICTIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[enrich] Saved enriched predictions to {PREDICTIONS_FILE}")
    print("[enrich] Done.")


if __name__ == "__main__":
    main()
