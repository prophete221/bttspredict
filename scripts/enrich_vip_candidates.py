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
MIN_TEAM_MATCHES = 8
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
    source_kickoff = row.get("sourceKickoffAt")
    if source_kickoff is not None:
        if not isinstance(source_kickoff, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z", source_kickoff):
            return False
        try:
            exact_kickoff = datetime.fromisoformat(source_kickoff[:-1] + "+00:00")
        except ValueError:
            return False
        if exact_kickoff.strftime("%Y-%m-%dT%H:%M") != f"{date}T{clock}":
            return False
        kickoff = exact_kickoff
    return kickoff > datetime.now(timezone.utc)


def _normalized_match_status(row: dict) -> str | None:
    explicit = []
    for field in ("status", "matchState", "sourceStatus"):
        raw = row.get(field)
        if raw is None or not str(raw).strip():
            continue
        value = str(raw).strip().upper()
        if value == "CONFLICT":
            return None
        aliases = {
            "STATUS_SCHEDULED": "PENDING", "STATUS_PRE_GAME": "PENDING",
            "STATUS_DELAYED": "PENDING", "STATUS_NOT_STARTED": "PENDING",
            "PENDING": "PENDING", "SCHEDULED": "PENDING",
            "NOT_STARTED": "PENDING", "UPCOMING": "PENDING",
        }
        normalized = aliases.get(value)
        if normalized is None:
            return None
        explicit.append(normalized)
    if explicit:
        return explicit[0] if all(value == explicit[0] for value in explicit) else None
    return "PENDING" if _timestamp_is_future(row) else None


def _merge_feed_rows(fields: tuple[str, ...], payload: dict) -> list[dict]:
    rows: list[dict] = []
    state_fields = ("status", "matchState", "sourceStatus")
    for field in fields:
        value = payload.get(field)
        if not isinstance(value, list):
            continue
        for row in value:
            if not isinstance(row, dict):
                continue
            fixture = tuple(str(row.get(key) or "").strip().casefold() for key in ("date", "time", "league", "home", "away"))
            row_id = str(row.get("fixtureId") or row.get("id") or "").strip()
            index = next((i for i, old in enumerate(rows) if
                          (row_id and str(old.get("fixtureId") or old.get("id") or "").strip() == row_id) or
                          (all(fixture) and tuple(str(old.get(key) or "").strip().casefold() for key in ("date", "time", "league", "home", "away")) == fixture)), None)
            if index is None:
                rows.append(dict(row))
                continue
            previous = rows[index]
            merged = {**previous, **row}
            old_kickoff = (previous.get("date"), previous.get("time"))
            new_kickoff = (row.get("date"), row.get("time"))
            if all(old_kickoff) and all(new_kickoff) and old_kickoff != new_kickoff:
                merged["kickoffConflict"] = True
            elif previous.get("kickoffConflict") or row.get("kickoffConflict"):
                merged["kickoffConflict"] = True
            for state_field in state_fields:
                old_state = str(previous.get(state_field) or "").strip()
                new_state = str(row.get(state_field) or "").strip()
                if old_state and new_state and old_state.casefold() != new_state.casefold():
                    merged[state_field] = "CONFLICT"
                elif old_state and not new_state:
                    merged[state_field] = previous[state_field]
                elif not old_state and new_state:
                    merged[state_field] = row[state_field]
                elif old_state and new_state:
                    merged[state_field] = previous[state_field]
                else:
                    merged.pop(state_field, None)
            rows[index] = merged
    return rows


def collect_public_matches(payload: dict) -> list[dict]:
    """Read only public arrays; a private vipCandidates key can never mask free rows."""
    if not isinstance(payload, dict):
        return []
    return _merge_feed_rows(("free", "freeUpcoming", "upcoming", "predictions"), payload)


def collect_private_matches(payload) -> list[dict]:
    """Read private fixtures only, independent of public rows and without synthesizing fixtures."""
    if isinstance(payload, list):
        raw = payload
    elif isinstance(payload, dict):
        raw = payload.get("fixtures")
        if not isinstance(raw, list):
            raw = payload.get("vipCandidates", [])
    else:
        raw = []
    return _merge_feed_rows(("fixtures",), {"fixtures": raw})


def eligible_markets(row: dict) -> list[dict]:
    """Return empirically described Yes/No choices; Gemini alone estimates pick probability."""
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
    if _normalized_match_status(row) is None:
        return []
    if row.get("kickoffConflict") or not _timestamp_is_future(row):
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
            rates = (aggregate, home_rate, away_rate)
            selected_rates = rates if selection == "Yes" else tuple(1 - rate for rate in rates)
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
Return only a JSON array with one object per input id: {{"id": integer, "vip_candidates": array, "exact_score": null}}.
Evaluate BTTS and Over 2.5 separately and independently, only among the market/selection choices listed in eligible_choices and using only evidence actually available for each market. In each choice, aggregate_rate, home_rate, and away_rate are observed Yes rates; selection_rates contains the rates for that choice's selected outcome, in aggregate/home/away order. For a No choice, assess support only against selection_rates (the complements of the Yes rates), never against the raw Yes rates. Return zero to two candidates per match, at most one per market. Use the recent form, goals scored/conceded, last-five results, standings, odds, and head-to-head data only when those fields are actually present. Do not invent injuries, lineups, H2H, or historical market performance. Return only a genuine Gemini model estimate strictly between 0 and 1; never substitute or derive the model probability from empirical rates. A probability is only a model estimate, not a historical success rate or guarantee.
Exact score is not empirically validated in this pipeline: abstention is mandatory with no exceptions. Always return exact_score as null; never generate, include, or publish an exact-score pick.
For each candidate use exactly: market, selection, probability, confidence, primary_reasons, risks. Confidence must be the model's actual low, medium, or high label, never upgraded; probability must be strictly between 0 and 1 and must be a model estimate, not a transformation of empirical rates. The empirical selection_rates are evidence for the choice, not a substitute probability or a hard threshold. Use 2–4 concise reasons and 1–2 concise risks. If nothing is well-supported, return an empty array. Never copy the free pick; if the same market is considered, choose only the opposite outcome and evaluate it independently.

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
    if probability is None or not 0 < probability < 1:
        return None
    model_confidence = str(result.get("confidence") or "").strip().lower()
    if model_confidence not in {"low", "medium", "high"}:
        return None
    reasons = result.get("primary_reasons")
    risks = result.get("risks")
    if not isinstance(reasons, list) or not 2 <= len([x for x in reasons if isinstance(x, str) and x.strip()]) <= 4:
        return None
    if not isinstance(risks, list) or not 1 <= len([x for x in risks if isinstance(x, str) and x.strip()]) <= 2:
        return None
    choices = eligible_markets(source)
    choice = next((item for item in choices if item["market"] == market and item["selection"] == selection), None)
    if choice is None:
        return None

    free_market, free_selection = _current_free_pick(source)
    match_status = _normalized_match_status(source)
    if match_status is None:
        return None
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
        "status": source.get("status") if source.get("status") is not None else match_status,
        "matchState": source.get("matchState") if source.get("matchState") is not None else match_status,
        **{key: source[key] for key in ("fixtureId", "leagueSlug", "homeTeamId", "awayTeamId", "sourceKickoffAt", "sourceStatus") if isinstance(source.get(key), str)},
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
        "ai_confidence": model_confidence,
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
                "recent_results_home": row.get("last5Home"),
                "recent_results_away": row.get("last5Away"),
                "head_to_head_available": row.get("h2hAvailable", False),
                "head_to_head": row.get("h2h", row.get("headToHead")),
                "standings_home": row.get("standingsHome"),
                "standings_away": row.get("standingsAway"),
                "market_odds": row.get("odds"),
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
    input_file = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else PREDICTIONS_FILE
    if not input_file.exists():
        write_sidecar({"version": 1, "date": None, "lastUpdated": datetime.now(timezone.utc).isoformat(),
                       "sourceLastUpdated": None, "analysisComplete": False, "analysisResponseCount": 0,
                       "analysisExpectedCount": 0, "vipCandidates": [], "privateFixtures": [],
                       "privateFixturesComplete": False})
        print("[vip-analysis] input missing; no candidates")
        return
    with input_file.open(encoding="utf-8") as file:
        payload = json.load(file)
    private_input = len(sys.argv) > 1
    matches = collect_private_matches(payload) if private_input else collect_public_matches(payload)
    choices_exist = any(eligible_markets(row) for row in matches if isinstance(row, dict))
    client = get_client() if choices_exist else None
    if choices_exist and client is None:
        print("[vip-analysis] eligible evidence exists but Gemini client is unavailable")
    candidates, response_count, expected_count = evaluate_matches(matches, client)
    complete = response_count == expected_count
    analyzed_at = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    source_updated = payload.get("lastUpdated") if isinstance(payload, dict) else None
    source_date = payload.get("date") if isinstance(payload, dict) else None
    sidecar = {
        "version": 1,
        "date": source_date,
        "lastUpdated": analyzed_at,
        "sourceLastUpdated": source_updated,
        "analysisComplete": complete,
        "analysisResponseCount": response_count,
        "analysisExpectedCount": expected_count,
        "vipCandidates": candidates if complete else [],
        "privateFixtures": matches if private_input else [],
        "privateFixturesComplete": bool(private_input and isinstance(payload, dict)
                                         and payload.get("collectionComplete") is True),
    }
    write_sidecar(sidecar)
    print(f"[vip-analysis] evaluated={response_count}/{expected_count}; private variants={len(sidecar['vipCandidates'])}; public feed unchanged")


if __name__ == "__main__":
    main()
