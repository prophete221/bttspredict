import importlib.util
import json
import unittest
from pathlib import Path
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
        "matchCountAway": 7,
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
    def test_only_empirically_supported_markets_are_sent_to_gemini(self):
        choices = VIP.eligible_markets(eligible_row())
        self.assertEqual([(choice["market"], choice["selection"]) for choice in choices], [("BTTS", "Yes")])
        self.assertTrue(all(rate >= VIP.MIN_VIP_PROBABILITY for choice in choices for rate in choice["selection_rates"]))

    def test_below_threshold_or_inconsistent_team_rates_are_rejected(self):
        row = eligible_row()
        row["formAway"]["bttsRate"] = 0.69
        row["empiricalBttsRate"] = 0.705
        self.assertNotIn("BTTS", {choice["market"] for choice in VIP.eligible_markets(row)})

    def test_sample_quality_status_and_future_kickoff_are_mandatory(self):
        cases = [
            ("dataQuality", "MEDIUM"),
            ("dataSource", "OTHER_SOURCE"),
            ("matchCountHome", 5),
            ("status", "POSTPONED"),
            ("date", "2000-01-01"),
        ]
        for key, value in cases:
            with self.subTest(field=key):
                row = eligible_row()
                row[key] = value
                self.assertEqual(VIP.eligible_markets(row), [])

    def test_probability_confidence_and_explanation_are_revalidated(self):
        row = eligible_row()
        good = {"market": "BTTS", "selection": "Yes", "probability": 0.74, "confidence": "high",
                "primary_reasons": ["Taux observé", "Forme récente"], "risks": ["Échantillon limité"]}
        output = VIP._candidate_row(row, good)
        self.assertIsNotNone(output)
        self.assertEqual(output["ai_market"], "BTTS")
        self.assertEqual(output["freeMarket"], "OVER_25")
        self.assertEqual(output["prediction"], "Oui")
        for field, value in (("probability", 0.69), ("confidence", "medium"), ("risks", [])):
            with self.subTest(field=field):
                candidate = dict(good)
                candidate[field] = value
                self.assertIsNone(VIP._candidate_row(row, candidate))

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
        row["formHome"]["bttsRate"] = 0.65
        row["empiricalBttsRate"] = 0.655

        class NeverCall:
            class Models:
                def generate_content(self, **kwargs):
                    raise AssertionError("Gemini must not be called without eligible evidence")
            models = Models()

        candidates, completed, expected = VIP.evaluate_matches([row], NeverCall())
        self.assertEqual(candidates, [])
        self.assertEqual((completed, expected), (1, 1))


if __name__ == "__main__":
    unittest.main()
