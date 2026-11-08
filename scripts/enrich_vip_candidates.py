#!/usr/bin/env python3
"""Analyze only private VIP variants; the public Gemini enrichment is untouched."""
from __future__ import annotations

import json
import math
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

MODEL_NAME = "gemini-3.5-flash-lite"
MIN_VIP_PROBABILITY = 0.70
MAX_VIP_PROBABILITY = 0.78
MIN_TEAM_MATCHES = 6
MIN_FORM_MATCHES = 5
MAX_RETRIES = 3
TIME_BUDGET_SECONDS = 180
REQUEST_TIMEOUT_MS = 45_000
CHUNK_SIZE = 2
ROOT = Path(__file__).resolve().parent.parent
PREDICTIONS_FILE = ROOT / "public" / "predictions.json"
VIP_CANDIDATES_FILE = ROOT / ".private" / "vip-gemini-candidates.json"

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    genai = None
    genai_types = None


def _finite_rate(value) -> float | None:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    value = float(value)
    return value if math.isfinite(value) and 0 <= value <= 1 else None


def _positive_int(value) -> int | None:
    if isinstance(value, bool):
        return None
    if not isinstance(value, (int, float, str)):
        return None
    if isinstance(value, float) and not value.is_integer():
        return None
    if isinstance(value, str) and not value.strip().isdigit():
        return None
    try:
        number = int(value)
    except (TypeError, ValueError):
        return None
    return number if number >= 0 else None


def _timestamp_is_future(row: dict) -> bool:
    date, clock = row.get("date"), row.get("time")
    if not isinstance(date, str) or not isinstance(clock, str):
        return False
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date) or not re.fullmatch(r"(?:[01]\d|2[0-3]):[0-5]\d", clock):
        return False
    try:
        kickoff = datetime.fromisoformat(f"{date}T{clock}:00+00:00")
    except ValueError:
        return False
    return kickoff > datetime.now(timezone.utc)


def eligible_markets(row: dict) -> list[dict]:
    """Return only markets whose aggregate and both team form rates support >=70%."""
    if not isinstance(row, dict):
        return []
    if row.get("dataQuality") != "HIGH" or row.get("dataSource") != "ESPN_TEAM_SCHEDULE":
        return []
    if (_positive_int(row.get("matchCountHome")) or 0) < MIN_TEAM_MATCHES:
        return []
    if (_positive_int(row.get("matchCountAway")) or 0) < MIN_TEAM_MATCHES:
        return []
    home, away = row.get("formHome"), row.get("formAway")
    if not isinstance(home, dict) or not isinstance(away, dict):
        return []
    if (_positive_int(home.get("count")) or 0) < MIN_FORM_MATCHES:
        return []
    if (_positive_int(away.get("count")) or 0) < MIN_FORM_MATCHES:
        return []
    if str(row.get("status", "")).strip().upper() not in {"PENDING", "SCHEDULED", "NOT_STARTED", "UPCOMING"}:
        return []
    if not _timestamp_is_future(row):
        return []

    choices = []
    for market, aggregate_key, form_key in (
        ("BTTS", "empiricalBttsRate", "bttsRate"),
        ("OVER_25", "empiricalOver25Rate", "over25Rate"),
    ):
        aggregate = _finite_rate(row.get(aggregate_key))
        home_rate, away_rate = _finite_rate(home.get(form_key)), _finite_rate(away.get(form_key))
        if aggregate is None or home_rate is None or away_rate is None:
            continue
        if abs(aggregate - (home_rate + away_rate) / 2) > 0.01 + 1e-9:
            continue
        for selection in ("Yes", "No"):
            sign = 1 if selection == "Yes" else -1
            rates = (aggregate, home_rate, away_rate)
            selected_rates = rates if sign == 1 else tuple(1 - rate for rate in rates)
            if all(rate >= MIN_VIP_PROBABILITY for rate in selected_rates):
                choices.append({
                    "market": market,
                    "selection": selection,
                    "aggregate_rate": aggregate,
                    "home_rate": home_rate,
                    "away_rate": away_rate,
                    "selection_rates": list(selected_rates),
                })
    return choices


def build_prompt(records: list[dict]) -> str:
    return f"""You are independently evaluating private VIP football candidates for BTTSPredict.
Return only a JSON array with one object per input id: {{"id": integer, "vip_candidates": array}}.
Never choose a market/selection not listed in eligible_choices. Return zero to two candidates per match, at most one per market. Use only the observed statistics included below. Do not invent injuries, lineups, H2H, or historical market performance. A probability is only a model estimate, not a historical success rate or guarantee.
For each candidate use exactly: market, selection, probability, confidence, primary_reasons, risks. Confidence must be high; probability must be from {MIN_VIP_PROBABILITY:.2f} to {MAX_VIP_PROBABILITY:.2f} and within 0.15 of aggregate_rate, home_rate, and away_rate for the selected outcome. Use 2–4 concise reasons and 1–2 concise risks. If nothing is well-supported, return an empty array. Never copy the free pick; if the same market is considered, choose only the opposite outcome and evaluate it independently.

INPUT:
{json.dumps(records, ensure_ascii=False, separators=(',', ':'))}
"""


def _extract_json(text: str):
    text = str(text or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE)
    return json.loads(text)


def _response_code(error: Exception) -> int | None:
    for value in (getattr(error, "code", None), getattr(getattr(error, "response", None), "status_code", None)):
        try:
            code = int(value)
        except (TypeError, ValueError):
            continue
        if 100 <= code <= 599:
            return code
    return None


def _request_batch(client, batch: list[dict]) -> list[dict] | None:
    prompt = build_prompt(batch)
    for attempt in range(MAX_RETRIES + 1):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=genai_types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                    max_output_tokens=8192,
                ),
            )
            parsed = _extract_json(response.text)
            if not isinstance(parsed, list):
                return None
            return parsed
        except Exception as error:  # Never log request content or provider messages.
            code = _response_code(error)
            if attempt >= MAX_RETRIES or (code is not None and code not in {408, 429, 500, 502, 503, 504}):
                print(f"[vip-analysis] batch failed; error={type(error).__name__}; code={code or 'unknown'}")
                return None
            delay = min(12.0, 1.0 * (2 ** attempt)) + random.uniform(0, 0.25)
            time.sleep(delay)
    return None


def _current_free_pick(row: dict) -> tuple[str | None, str | None]:
    market = str(row.get("ai_market") or "").strip().upper().replace("OVER25", "OVER_25")
    selection = str(row.get("prediction") or "").strip().lower()
    if (row.get("ai_source") != "gemini-stats-v1" or row.get("ai_model") != MODEL_NAME
            or row.get("ai_response_status") != "pick" or row.get("ai_abstain") is not False):
        return None, None
    if market not in {"BTTS", "OVER_25"} or selection not in {"yes", "no", "oui", "non"}:
        return None, None
    return market, "Yes" if selection in {"yes", "oui"} else "No"


def _candidate_row(source: dict, result: dict) -> dict | None:
    market = str(result.get("market") or "").strip().upper().replace("OVER25", "OVER_25")
    if market not in {"BTTS", "OVER_25"}:
        return None
    selection = str(result.get("selection") or "").strip().lower()
    selection = "Yes" if selection in {"yes", "oui"} else "No" if selection in {"no", "non"} else None
    if selection is None:
        return None
    probability = _finite_rate(result.get("probability"))
    if probability is None or not MIN_VIP_PROBABILITY <= probability <= MAX_VIP_PROBABILITY:
        return None
    if str(result.get("confidence") or "").strip().lower() != "high":
        return None
    reasons = result.get("primary_reasons")
    risks = result.get("risks")
    if not isinstance(reasons, list) or not 2 <= len([x for x in reasons if isinstance(x, str) and x.strip()]) <= 4:
        return None
    if not isinstance(risks, list) or not 1 <= len([x for x in risks if isinstance(x, str) and x.strip()]) <= 2:
        return None
    choices = eligible_markets(source)
    choice = next((item for item in choices if item["market"] == market and item["selection"] == selection), None)
    if choice is None or any(abs(probability - rate) > 0.15 + 1e-9 for rate in choice["selection_rates"]):
        return None

    free_market, free_selection = _current_free_pick(source)
    model_market = "BTTS" if market == "BTTS" else "Over 2.5"
    confidence = int(round(probability * 100))
    nested = {
        "type": model_market,
        "prediction": "Oui" if selection == "Yes" else "Non",
        "confidence": confidence,
        "proba": probability,
        "modelEngine": MODEL_NAME,
    }
    nested["bttsProb" if market == "BTTS" else "over25Prob"] = probability
    return {
        "id": str(source.get("id") if source.get("id") is not None else ""),
        "match": source.get("match"),
        "home": source.get("home"),
        "away": source.get("away"),
        "league": source.get("league"),
        "date": source.get("date"),
        "time": source.get("time"),
        "status": source.get("status"),
        "matchState": source.get("status"),
        "dataQuality": source.get("dataQuality"),
        "dataSource": source.get("dataSource"),
        "matchCountHome": source.get("matchCountHome"),
        "matchCountAway": source.get("matchCountAway"),
        "formHome": source.get("formHome"),
        "formAway": source.get("formAway"),
        "empiricalBttsRate": source.get("empiricalBttsRate"),
        "empiricalOver25Rate": source.get("empiricalOver25Rate"),
        "freeMarket": free_market,
        "freeSelection": free_selection if free_market else None,
        "type": model_market,
        "prediction": "Oui" if selection == "Yes" else "Non",
        "proba": probability,
        "confidence": confidence,
        "predictions": [nested],
        "ai_source": "gemini-stats-v1",
        "ai_model": MODEL_NAME,
        "ai_response_status": "pick",
        "ai_market": market,
        "ai_abstain": False,
        "ai_confidence": "high",
        "ai_reasons": [value.strip() for value in reasons if isinstance(value, str) and value.strip()][:4],
        "ai_risks": [value.strip() for value in risks if isinstance(value, str) and value.strip()][:2],
        "modelEngine": "gemini-stats-v1",
    }


def evaluate_matches(matches: list[dict], client=None) -> tuple[list[dict], int, int]:
    """Return candidates and complete-evaluation counts; never mutate public rows."""
    expected = len(matches)
    completed = 0
    candidates: list[dict] = []
    pending: list[tuple[int, dict, list[dict]]] = []
    for index, row in enumerate(matches):
        choices = eligible_markets(row)
        if choices:
            free_market, free_selection = _current_free_pick(row)
            prompt_row = {
                "id": index,
                "match": row.get("match"),
                "league": row.get("league"),
                "date": row.get("date"),
                "time": row.get("time"),
                "home": row.get("home"),
                "away": row.get("away"),
                "free_market": free_market,
                "free_selection": free_selection,
                "eligible_choices": choices,
                "data_quality": row.get("dataQuality"),
                "source": row.get("dataSource"),
                "match_count_home": row.get("matchCountHome"),
                "match_count_away": row.get("matchCountAway"),
                "form_home": row.get("formHome"),
                "form_away": row.get("formAway"),
                "aggregate_btts_rate": row.get("empiricalBttsRate"),
                "aggregate_over25_rate": row.get("empiricalOver25Rate"),
            }
            pending.append((index, row, [prompt_row]))
        else:
            completed += 1  # All candidate markets fail the deterministic evidence gate.

    if pending and client is None:
        return candidates, completed, expected

    started = time.monotonic()
    for offset in range(0, len(pending), CHUNK_SIZE):
        if time.monotonic() - started >= TIME_BUDGET_SECONDS:
            print("[vip-analysis] time budget reached; remaining matches excluded")
            break
        batch_items = pending[offset:offset + CHUNK_SIZE]
        prompt_rows = [item[2][0] for item in batch_items]
        response = _request_batch(client, prompt_rows)
        if response is None:
            continue
        by_id: dict[int, dict] = {}
        duplicate_ids: set[int] = set()
        for item in response:
            if not isinstance(item, dict) or isinstance(item.get("id"), bool):
                continue
            try:
                response_id = int(item.get("id"))
            except (TypeError, ValueError):
                continue
            if response_id in by_id:
                duplicate_ids.add(response_id)
            else:
                by_id[response_id] = item
        for response_id in duplicate_ids:
            by_id.pop(response_id, None)
        for index, source, _ in batch_items:
            item = by_id.get(index)
            if item is None or not isinstance(item.get("vip_candidates"), list) or len(item["vip_candidates"]) > 2:
                continue
            completed += 1
            allowed = {(choice["market"], choice["selection"]) for choice in eligible_markets(source)}
            seen_markets = set()
            for result in item["vip_candidates"]:
                row = _candidate_row(source, result) if isinstance(result, dict) else None
                if row is None:
                    continue
                identity = (row["ai_market"], "Yes" if row["prediction"] == "Oui" else "No")
                if identity not in allowed or identity[0] in seen_markets:
                    continue
                seen_markets.add(identity[0])
                candidates.append(row)
    return candidates, completed, expected


def write_sidecar(payload: dict) -> None:
    VIP_CANDIDATES_FILE.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(VIP_CANDIDATES_FILE.parent, 0o700)
    temporary = VIP_CANDIDATES_FILE.with_suffix(VIP_CANDIDATES_FILE.suffix + ".tmp")
    with temporary.open("w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)
        file.write("\n")
    os.chmod(temporary, 0o600)
    os.replace(temporary, VIP_CANDIDATES_FILE)
    os.chmod(VIP_CANDIDATES_FILE, 0o600)


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or genai is None:
        return None
    return genai.Client(
        api_key=api_key,
        http_options=genai_types.HttpOptions(
            timeout=REQUEST_TIMEOUT_MS,
            retry_options=genai_types.HttpRetryOptions(attempts=1),
        ),
    )


def main() -> None:
    if not PREDICTIONS_FILE.exists():
        write_sidecar({"version": 1, "date": None, "lastUpdated": datetime.now(timezone.utc).isoformat(),
                       "sourceLastUpdated": None, "analysisComplete": False, "analysisResponseCount": 0,
                       "analysisExpectedCount": 0, "vipCandidates": []})
        print("[vip-analysis] predictions input missing; no candidates")
        return
    with PREDICTIONS_FILE.open(encoding="utf-8") as file:
        payload = json.load(file)
    matches = payload.get("free") or payload.get("predictions") or []
    if not isinstance(matches, list):
        matches = []
    choices_exist = any(eligible_markets(row) for row in matches if isinstance(row, dict))
    client = get_client() if choices_exist else None
    if choices_exist and client is None:
        print("[vip-analysis] eligible evidence exists but Gemini client is unavailable")
    candidates, response_count, expected_count = evaluate_matches(matches, client)
    complete = response_count == expected_count
    analyzed_at = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    sidecar = {
        "version": 1,
        "date": payload.get("date"),
        "lastUpdated": analyzed_at,
        "sourceLastUpdated": payload.get("lastUpdated"),
        "analysisComplete": complete,
        "analysisResponseCount": response_count,
        "analysisExpectedCount": expected_count,
        "vipCandidates": candidates if complete else [],
    }
    write_sidecar(sidecar)
    print(f"[vip-analysis] evaluated={response_count}/{expected_count}; private variants={len(sidecar['vipCandidates'])}; public feed unchanged")


if __name__ == "__main__":
    main()
