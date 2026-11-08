import importlib.util
import json
import unittest
from pathlib import Path
from datetime import date, datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "enrich_vip_candidates.py"
SPEC = importlib.util.spec_from_file_location("enrich_vip_candidates", MODULE_PATH)
VIP = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(VIP)


def eligible_row():
    return {
        "id": "match-2099-01-01",
        "match": "Home FC vs Away FC",
        "home": "Home FC",
        "away": "Away FC",
        "league": "Test League",
        "date": "2099-01-01",
        "time": "19:00",
        "status": "SCHEDULED",
        "dataQuality": "HIGH",
        "dataSource": "ESPN_TEAM_SCHEDULE",
        "matchCountHome": 8,
        "matchCountAway": 8,
        "formHome": {"count": 5, "bttsRate": 0.72, "over25Rate": 0.60},
        "formAway": {"count": 5, "bttsRate": 0.76, "over25Rate": 0.60},
        "empiricalBttsRate": 0.74,
        "empiricalOver25Rate": 0.60,
        "ai_source": "gemini-stats-v1",
        "ai_model": VIP.MODEL_NAME,
        "ai_response_status": "pick",
        "ai_abstain": False,
        "ai_market": "OVER_25",
        "prediction": "Oui",
    }


class VipEligibilityTests(unittest.TestCase):
    def test_all_markets_and_outcomes_with_real_empirical_data_are_sent_to_gemini(self):
        choices = VIP.eligible_markets(eligible_row())
        self.assertEqual([(choice["market"], choice["selection"]) for choice in choices], [
            ("BTTS", "Yes"), ("BTTS", "No"), ("OVER_25", "Yes"), ("OVER_25", "No"),
        ])
        self.assertEqual(choices[1]["selection_rates"], [0.26, 0.28, 0.24])

    def test_inconsistent_aggregate_and_team_rates_are_rejected(self):
        row = eligible_row()
        row["empiricalBttsRate"] = 0.9
        self.assertNotIn("BTTS", {choice["market"] for choice in VIP.eligible_markets(row)})

    def test_sample_quality_status_and_future_kickoff_are_mandatory(self):
        cases = [
            ("dataQuality", "MEDIUM"),
            ("dataSource", "OTHER_SOURCE"),
            ("matchCountHome", 5),
            ("matchCountAway", 7),
            ("status", "POSTPONED"),
            ("date", "2000-01-01"),
        ]
        for key, value in cases:
            with self.subTest(field=key):
                row = eligible_row()
                row[key] = value
                self.assertEqual(VIP.eligible_markets(row), [])

    def test_model_estimate_confidence_and_explanation_are_revalidated(self):
        row = eligible_row()
        good = {"market": "BTTS", "selection": "Yes", "probability": 0.74, "confidence": "high",
                "primary_reasons": ["Taux observé", "Forme récente"], "risks": ["Échantillon limité"]}
        output = VIP._candidate_row(row, good)
        self.assertIsNotNone(output)
        self.assertEqual(output["ai_market"], "BTTS")
        self.assertEqual(output["freeMarket"], "OVER_25")
        self.assertEqual(output["prediction"], "Oui")
        for field, value in (("probability", 0), ("confidence", "unrated"), ("risks", [])):
            with self.subTest(field=field):
                candidate = dict(good)
                candidate[field] = value
                self.assertIsNone(VIP._candidate_row(row, candidate))

    def test_any_open_gemini_probability_keeps_its_original_confidence_label(self):
        row = eligible_row()
        reasons = {"primary_reasons": ["Analyse du modèle", "Forme observée"], "risks": ["Incertitude"]}
        for probability, confidence in ((0.12, "low"), (0.5, "medium"), (0.99, "high")):
            with self.subTest(probability=probability, confidence=confidence):
                candidate = VIP._candidate_row(row, {
                    "market": "BTTS", "selection": "Yes", "probability": probability,
                    "confidence": confidence, **reasons,
                })
                self.assertIsNotNone(candidate)
                self.assertEqual(candidate["proba"], probability)
                self.assertEqual(candidate["ai_confidence"], confidence)

    def test_twenty_percent_btts_yes_supports_eighty_percent_no_and_gemini_75_is_no(self):
        row = eligible_row()
        row["empiricalBttsRate"] = 0.2
        row["formHome"]["bttsRate"] = 0.2
        row["formAway"]["bttsRate"] = 0.2

        choices = VIP.eligible_markets(row)
        yes_choice = next(choice for choice in choices if choice["market"] == "BTTS" and choice["selection"] == "Yes")
        no_choice = next(choice for choice in choices if choice["market"] == "BTTS" and choice["selection"] == "No")
        self.assertEqual(yes_choice["selection_rates"], [0.2, 0.2, 0.2])
        self.assertEqual(no_choice["selection_rates"], [0.8, 0.8, 0.8])

        gemini_no = {
            "market": "BTTS", "selection": "No", "probability": 0.75, "confidence": "high",
            "primary_reasons": ["BTTS rate 0.2 observé chez les deux équipes", "Forme récente cohérente"],
            "risks": ["Échantillon limité"],
        }
        candidate = VIP._candidate_row(row, gemini_no)
        self.assertIsNotNone(candidate)
        self.assertEqual(candidate["prediction"], "Non")
        self.assertEqual(candidate["proba"], 0.75)
        self.assertEqual(candidate["ai_confidence"], "high")
        self.assertEqual(candidate["predictions"][0]["prediction"], "Non")
        self.assertEqual(candidate["predictions"][0]["proba"], 0.75)

    def test_gemini_probability_is_open_unit_interval_and_confidence_is_not_upgraded(self):
        row = eligible_row()
        reasons = {"primary_reasons": ["Taux observé", "Forme récente"], "risks": ["Échantillon limité"]}
        for probability in (0, 1):
            with self.subTest(probability=probability):
                candidate = VIP._candidate_row(row, {
                    "market": "BTTS", "selection": "Yes", "probability": probability,
                    "confidence": "high", **reasons,
                })
                self.assertIsNone(candidate)
        for confidence in ("low", "medium", "high"):
            with self.subTest(confidence=confidence):
                candidate = VIP._candidate_row(row, {
                    "market": "BTTS", "selection": "Yes", "probability": 0.37,
                    "confidence": confidence, **reasons,
                })
                self.assertIsNotNone(candidate)
                self.assertEqual(candidate["ai_confidence"], confidence)

    def test_mocked_candidate_analysis_never_mutates_public_rows(self):
        row = eligible_row()
        original = json.dumps(row, sort_keys=True)
        result = [{"id": 0, "vip_candidates": [{
            "market": "BTTS", "selection": "Yes", "probability": 0.74, "confidence": "high",
            "primary_reasons": ["Taux empirique élevé", "Forme récente cohérente"],
            "risks": ["Échantillon limité"],
        }]}]

        class MockClient:
            class Models:
                def generate_content(self, **kwargs):
                    return SimpleNamespace(text=json.dumps(result))
            models = Models()

        fake_types = SimpleNamespace(GenerateContentConfig=lambda **kwargs: kwargs)
        with patch.object(VIP, "genai_types", fake_types):
            candidates, completed, expected = VIP.evaluate_matches([row], MockClient())

        self.assertEqual((completed, expected), (1, 1))
        self.assertEqual(len(candidates), 1)
        self.assertEqual(json.dumps(row, sort_keys=True), original)
        self.assertEqual(candidates[0]["ai_confidence"], "high")
        self.assertEqual(candidates[0]["proba"], 0.74)

    def test_no_eligible_market_makes_no_provider_call_and_returns_no_fake_pick(self):
        row = eligible_row()
        row["empiricalBttsRate"] = None
        row["empiricalOver25Rate"] = None

        class NeverCall:
            class Models:
                def generate_content(self, **kwargs):
                    raise AssertionError("Gemini must not be called without eligible evidence")
            models = Models()

        candidates, completed, expected = VIP.evaluate_matches([row], NeverCall())
        self.assertEqual(candidates, [])
        self.assertEqual((completed, expected), (1, 1))


    def test_missing_status_is_allowed_only_for_strictly_future_valid_kickoff(self):
        row = eligible_row()
        row["status"] = None
        self.assertTrue(VIP._timestamp_is_future(row))
        self.assertIsNotNone(VIP._normalized_match_status(row))
        row["date"] = "2000-01-01"
        self.assertIsNone(VIP._normalized_match_status(row))
        row["date"], row["time"] = "2099-02-30", "19:00"
        self.assertIsNone(VIP._normalized_match_status(row))

    def test_exact_source_kickoff_is_used_when_seconds_differ_from_display_time(self):
        class FrozenDateTime(datetime):
            @classmethod
            def now(cls, tz=None):
                return datetime(2099, 1, 1, 19, 0, 0, tzinfo=timezone.utc)
        row = eligible_row()
        row["status"] = None
        row["sourceKickoffAt"] = "2099-01-01T19:00:00.001Z"
        with patch.object(VIP, "datetime", FrozenDateTime):
            self.assertTrue(VIP._timestamp_is_future(row))
            row["sourceKickoffAt"] = "2099-01-01T19:00:00.000Z"
            self.assertFalse(VIP._timestamp_is_future(row))
            row["sourceKickoffAt"] = "2099-01-01T19:01:00.000Z"
            self.assertFalse(VIP._timestamp_is_future(row))
            row["sourceKickoffAt"] = "not-a-timestamp"
            self.assertFalse(VIP._timestamp_is_future(row))

    def test_clean_candidate_propagates_authoritative_espn_identity(self):
        row = eligible_row()
        row.update({"fixtureId": "401234567", "leagueSlug": "ita.1", "homeTeamId": "123",
                    "awayTeamId": "456", "sourceKickoffAt": "2099-01-01T19:00:00.000Z",
                    "sourceStatus": "STATUS_SCHEDULED", "matchState": "STATUS_SCHEDULED"})
        result = VIP._candidate_row(row, {"market": "BTTS", "selection": "Yes", "probability": 0.74,
                                         "confidence": "high", "primary_reasons": ["a", "b"], "risks": ["c"]})
        self.assertEqual({key: result[key] for key in ("fixtureId", "leagueSlug", "homeTeamId", "awayTeamId", "sourceKickoffAt")}, {
            "fixtureId": "401234567", "leagueSlug": "ita.1", "homeTeamId": "123", "awayTeamId": "456",
            "sourceKickoffAt": "2099-01-01T19:00:00.000Z"})
        self.assertEqual(result["matchState"], "STATUS_SCHEDULED")

    def test_equal_and_past_kickoffs_are_not_future(self):
        class FrozenDateTime(datetime):
            @classmethod
            def now(cls, tz=None):
                return datetime(2099, 1, 1, 19, 0, tzinfo=timezone.utc)
        row = eligible_row()
        row["status"] = None
        with patch.object(VIP, "datetime", FrozenDateTime):
            self.assertFalse(VIP._timestamp_is_future(row))
            row["time"] = "18:59"
            self.assertFalse(VIP._timestamp_is_future(row))
            row["time"] = "19:01"
            self.assertTrue(VIP._timestamp_is_future(row))

    def test_explicit_source_statuses_are_conjunctive_and_exclude_started_or_cancelled(self):
        for field, value in (("matchState", "STATUS_IN_PROGRESS"), ("sourceStatus", "STATUS_CANCELED"),
                             ("matchState", "POSTPONED"), ("sourceStatus", "FINISHED")):
            with self.subTest(field=field, value=value):
                row = eligible_row()
                row[field] = value
                self.assertEqual(VIP.eligible_markets(row), [])
        row = eligible_row()
        row["status"] = "SCHEDULED"
        row["sourceStatus"] = "STATUS_IN_PROGRESS"
        self.assertIsNone(VIP._normalized_match_status(row))

    def test_multi_day_rows_are_distinct_and_duplicate_array_rows_keep_contradictions(self):
        first = eligible_row()
        second = dict(first, id="next-day", date="2099-01-02")
        merged = VIP.collect_public_matches({"free": [first, second], "freeUpcoming": [dict(first, status=None)]})
        self.assertEqual(len(merged), 2)
        moved = dict(first, time="20:00", status="STATUS_IN_PROGRESS", matchState="STATUS_IN_PROGRESS")
        conflict = VIP.collect_public_matches({"free": [first], "predictions": [dict(first, status=None)], "upcoming": [moved]})
        self.assertEqual(len(conflict), 1)
        self.assertEqual(conflict[0]["status"], "CONFLICT")
        self.assertTrue(conflict[0]["kickoffConflict"])
        self.assertEqual(VIP.eligible_markets(conflict[0]), [])

    def test_private_input_rows_are_separate_from_public_rows_and_exact_score_is_always_null(self):
        private = {"fixtures": [eligible_row()]}
        self.assertEqual(len(VIP.collect_private_matches(private)), 1)
        self.assertEqual(VIP.collect_private_matches({"fixtures": [], "free": [eligible_row()]}), [])
        prompt = VIP.build_prompt([])
        self.assertIn("Always return exact_score as null", prompt)
        self.assertIn("strictly between 0 and 1", prompt)
        self.assertIn("never upgraded", prompt)
        self.assertIn("selection_rates", prompt)
        self.assertNotIn("unless the input explicitly", prompt)


if __name__ == "__main__":
    unittest.main()
