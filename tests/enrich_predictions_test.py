import copy
import importlib.util
import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import call, patch

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "enrich_predictions.py"
SPEC = importlib.util.spec_from_file_location("enrich_predictions", SCRIPT)
enrich = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(enrich)

# Champs que Gemini ne doit JAMAIS pouvoir créer sur un match
FORBIDDEN_CREATION = (
    "ai_exact_score", "exact_score_prob", "ai_btts_view", "ai_over25_view", "winner",
    "winner_prob", "ai_winner_prob", "team_over15", "double_chance", "risk",
    "ai_odds_insight",
)
# Champs empiriques intouchables : jamais écrasés par un item Gemini
FORBIDDEN_OVERWRITE = ("xgHome", "xgAway")
FORBIDDEN = FORBIDDEN_CREATION + FORBIDDEN_OVERWRITE


class FakeGeminiAPIError(Exception):
    def __init__(self, code, response=None, details=None):
        self.code = code
        self.response = response
        self.details = details or {"error": {"code": code}}
        super().__init__(f"{code} fake Gemini API error")


class EnrichmentImmutabilityTests(unittest.TestCase):
    def test_uses_only_the_proven_gemini_model(self):
        # Le run #937 a appliqué 40/40 avec cet alias en 2 min 04.
        self.assertEqual(enrich.MODELS_TO_TRY, ["gemini-flash-lite-latest"])

    def test_transient_503_retries_the_same_gemini_model(self):
        calls = []

        class FlakyModels:
            def generate_content(self, **kwargs):
                calls.append(kwargs["model"])
                if len(calls) == 1:
                    raise FakeGeminiAPIError(503)
                return type("Response", (), {"text": json.dumps([{
                    "id": 0, "market": "BTTS", "selection": "Yes", "probability": 0.60,
                }])})()

        class Client:
            models = FlakyModels()

        with (
            patch.object(enrich, "GeminiAPIError", FakeGeminiAPIError),
            patch.object(enrich.time, "sleep") as sleep,
            patch.object(enrich.random, "uniform", return_value=0.10),
        ):
            result = enrich._call_gemini_chunk(Client(), [{"home": "Home", "away": "Away"}], 0)

        self.assertEqual(calls, ["gemini-flash-lite-latest", "gemini-flash-lite-latest"])
        self.assertEqual(len(result), 1)
        sleep.assert_called_once_with(4.1)

    def test_three_transient_503_attempts_do_not_sleep_after_the_final_try(self):
        class FailingModels:
            calls = 0

            def generate_content(self, **_kwargs):
                self.calls += 1
                raise FakeGeminiAPIError(503)

        class Client:
            models = FailingModels()

        client = Client()
        with (
            patch.object(enrich, "MODELS_TO_TRY", ["gemini-flash-lite-latest"]),
            patch.object(enrich, "GeminiAPIError", FakeGeminiAPIError),
            patch.object(enrich.time, "sleep") as sleep,
            patch.object(enrich.random, "uniform", return_value=0.0),
        ):
            result = enrich._call_gemini_chunk(client, [{"home": "Home", "away": "Away"}], 0)

        self.assertEqual(result, [])
        self.assertEqual(client.models.calls, enrich.MAX_RETRIES + 1)
        self.assertEqual(sleep.call_args_list, [call(4.0), call(8.0), call(16.0)])

    def test_permanent_4xx_is_not_retried(self):
        for code in (400, 401, 403, 404):
            with self.subTest(code=code):
                class FailingModels:
                    calls = 0

                    def generate_content(self, **_kwargs):
                        self.calls += 1
                        raise FakeGeminiAPIError(code)

                class Client:
                    models = FailingModels()

                client = Client()
                with (
                    patch.object(enrich, "MODELS_TO_TRY", ["gemini-flash-lite-latest"]),
                    patch.object(enrich, "GeminiAPIError", FakeGeminiAPIError),
                    patch.object(enrich.time, "sleep") as sleep,
                ):
                    result = enrich._call_gemini_chunk(client, [{"home": "Home", "away": "Away"}], 0)

                self.assertEqual(result, [])
                self.assertEqual(client.models.calls, 1)
                sleep.assert_not_called()

    def test_429_honors_retry_after_with_bounded_jitter(self):
        response = type("HttpResponse", (), {"headers": {"Retry-After": "7"}})()

        class FlakyModels:
            calls = 0

            def generate_content(self, **kwargs):
                self.calls += 1
                if self.calls == 1:
                    raise FakeGeminiAPIError(429, response=response)
                return type("Response", (), {"text": json.dumps([{
                    "id": 0, "market": "BTTS", "selection": "Yes", "probability": 0.60,
                }])})()

        class Client:
            models = FlakyModels()

        client = Client()
        with (
            patch.object(enrich, "GeminiAPIError", FakeGeminiAPIError),
            patch.object(enrich.time, "sleep") as sleep,
            patch.object(enrich.random, "uniform", return_value=0.0),
        ):
            result = enrich._call_gemini_chunk(client, [{"home": "Home", "away": "Away"}], 0)

        self.assertEqual(len(result), 1)
        sleep.assert_called_once_with(7.0)

    def test_retry_after_is_capped_by_the_backoff_limit(self):
        response = type("HttpResponse", (), {"headers": {"Retry-After": "120"}})()
        error = FakeGeminiAPIError(429, response=response)
        with (
            patch.object(enrich, "GeminiAPIError", FakeGeminiAPIError),
            patch.object(enrich.random, "uniform", return_value=0.0),
        ):
            delay = enrich._retry_delay_seconds(0, error)
        self.assertEqual(delay, enrich.RETRY_MAX_DELAY_S)

    def test_status_text_without_structured_code_is_not_retried(self):
        class TextOnlyError(RuntimeError):
            pass

        class FailingModels:
            calls = 0

            def generate_content(self, **_kwargs):
                self.calls += 1
                raise TextOnlyError("503 UNAVAILABLE")

        class Client:
            models = FailingModels()

        client = Client()
        with (
            patch.object(enrich, "MODELS_TO_TRY", ["gemini-flash-lite-latest"]),
            patch.object(enrich.time, "sleep") as sleep,
        ):
            result = enrich._call_gemini_chunk(client, [{"home": "Home", "away": "Away"}], 0)

        self.assertEqual(result, [])
        self.assertEqual(client.models.calls, 1)
        sleep.assert_not_called()

    def test_invalid_json_response_is_not_retried(self):
        class InvalidModels:
            calls = 0

            def generate_content(self, **_kwargs):
                self.calls += 1
                return type("Response", (), {"text": "not json"})()

        class Client:
            models = InvalidModels()

        client = Client()
        with (
            patch.object(enrich, "MODELS_TO_TRY", ["gemini-flash-lite-latest"]),
            patch.object(enrich.time, "sleep") as sleep,
        ):
            result = enrich._call_gemini_chunk(client, [{"home": "Home", "away": "Away"}], 0)

        self.assertEqual(result, [])
        self.assertEqual(client.models.calls, 1)
        sleep.assert_not_called()

    def test_zero_provider_enrichments_warns_fails_and_keeps_no_pick_abstentions(self):
        class FailingModels:
            def generate_content(self, **_kwargs):
                raise FakeGeminiAPIError(503)

        class Client:
            models = FailingModels()

        with tempfile.TemporaryDirectory() as directory:
            predictions_file = Path(directory) / "predictions.json"
            predictions_file.write_text(json.dumps({"free": [{
                "match": "Home FC vs Away FC", "home": "Home FC", "away": "Away FC",
                "bttsProb": 0.60, "over25Prob": 0.70,
            }]}), encoding="utf-8")
            output = io.StringIO()
            with (
                patch.object(enrich, "PREDICTIONS_FILE", predictions_file),
                patch.object(enrich, "get_client", return_value=Client()),
                patch.object(enrich, "GeminiAPIError", FakeGeminiAPIError),
                patch.object(enrich, "MAX_RETRIES", 0),
                patch.object(enrich.time, "sleep"),
                redirect_stdout(output),
            ):
                enrich.main()

            saved = json.loads(predictions_file.read_text(encoding="utf-8"))
            self.assertEqual(saved["analysisEngine"], "unavailable")
            row = saved["free"][0]
            self.assertTrue(row["ai_abstain"])
            self.assertEqual(row["ai_market"], "ABSTAIN")
            self.assertNotIn("ai_source", row)
            for field in ("prediction", "predictions", "proba", "confidence", "bttsProb", "over25Prob"):
                self.assertNotIn(field, row)
            self.assertEqual(row["empiricalBttsRate"], 0.60)
            self.assertEqual(row["empiricalOver25Rate"], 0.70)
            self.assertIn("Gemini applied 0/1", output.getvalue())
            self.assertIn("::warning::Gemini n'a fourni aucun résultat exploitable", output.getvalue())
            self.assertIn("codes API: 503", output.getvalue())

    def test_successful_gemini_enrichment_does_not_raise(self):
        class SuccessfulModels:
            def generate_content(self, **_kwargs):
                return type("Response", (), {"text": json.dumps([{
                    "id": 0, "market": "BTTS", "selection": "Yes", "probability": 0.60,
                    "confidence": "medium", "analysis_fr": "Analyse fondée sur les statistiques.",
                    "analysis_en": "Analysis based on the supplied statistics.",
                }])})()

        class Client:
            models = SuccessfulModels()

        with tempfile.TemporaryDirectory() as directory:
            predictions_file = Path(directory) / "predictions.json"
            predictions_file.write_text(json.dumps({"free": [{
                "match": "Home FC vs Away FC", "home": "Home FC", "away": "Away FC",
                "matchCountHome": 5, "matchCountAway": 6,
                "bttsProb": 0.60, "over25Prob": 0.70,
            }]}), encoding="utf-8")
            output = io.StringIO()
            with (
                patch.object(enrich, "PREDICTIONS_FILE", predictions_file),
                patch.object(enrich, "get_client", return_value=Client()),
                patch.object(enrich.time, "sleep"),
                redirect_stdout(output),
            ):
                enrich.main()

            saved = json.loads(predictions_file.read_text(encoding="utf-8"))
            self.assertEqual(saved["free"][0]["ai_source"], "gemini-stats-v1")
            self.assertFalse(saved["free"][0]["ai_abstain"])
            self.assertEqual(len(saved["free"][0]["predictions"]), 1)
            self.assertNotIn("over25Prob", saved["free"][0])
            self.assertIn("Gemini applied 1/1", output.getvalue())

    def test_gemini_abstention_is_not_replaced_by_local_fallback(self):
        abstention = {
            "id": 0, "market": "ABSTAIN", "selection": None, "probability": None,
            "confidence": "low", "analysis_fr": "Les données ne permettent pas de trancher.",
            "analysis_en": "The available data is insufficient for a confident pick.",
            "primary_reasons": ["Signaux insuffisants"], "risks": [],
        }

        with tempfile.TemporaryDirectory() as directory:
            predictions_file = Path(directory) / "predictions.json"
            predictions_file.write_text(json.dumps({"free": [{
                "match": "Home FC vs Away FC", "home": "Home FC", "away": "Away FC",
                "bttsProb": 0.60, "over25Prob": 0.70,
            }]}), encoding="utf-8")
            output = io.StringIO()
            with (
                patch.object(enrich, "PREDICTIONS_FILE", predictions_file),
                patch.object(enrich, "get_client", return_value=object()),
                patch.object(enrich, "call_gemini_batch", return_value=[abstention]),
                redirect_stdout(output),
            ):
                enrich.main()

            saved = json.loads(predictions_file.read_text(encoding="utf-8"))
            result = saved["free"][0]
            self.assertEqual(result["ai_source"], "gemini-stats-v1")
            self.assertTrue(result["ai_abstain"])
            self.assertEqual(result["ai_market"], "ABSTAIN")
            self.assertEqual(result["ai_analysis"], abstention["analysis_fr"])
            self.assertNotIn("local fallback on", output.getvalue())

    def test_gemini_can_only_write_allowlisted_narrative_fields(self):
        """Un item Gemini hostile ne peut écrire que les champs narratifs
        autorisés ; une probabilité hors bornes est refusée (ABSTAIN) et les
        valeurs empiriques existantes restent intactes."""
        match = {
            "proba": 0.6432,
            "confidence": 64,
            "bttsProb": 0.6432,
            "over25Prob": 0.7021,
            "xgHome": 1.42,
            "xgAway": 1.11,
            "estimatedCote": 1.55,
            "predictions": [{"type": "BTTS", "prediction": "Oui", "confidence": 64}],
        }
        before = copy.deepcopy(match)
        hostile = {
            "id": 0,
            "market": "BTTS",
            "selection": "Yes",
            "probability": 0.99,  # hors bornes → refus
            "confidence": 99,  # numérique → normalisé "medium"
            "analysis_fr": "Analyse fondée sur les seules données du match.",
            "analysis_en": "Analysis based on the match data only.",
            "key_fact": "La forme récente fournie est contrastée.",
            "form_summary_fr": "Forme contrastée des deux équipes.",
            "form_summary_en": "Contrasted recent form for both teams.",
            "primary_reasons": ["Raison appuyée sur les stats fournies"],
            "risks": ["Risque lié à la forme récente"],
            # Champs interdits — doivent être ignorés :
            "ai_exact_score": "5-0",
            "exact_score_prob": "99%",
            "ai_btts_view": "99%",
            "ai_over25_view": "99%",
            "ai_winner_prob": "99%",
            "winner": "1",
            "team_over15": "A: OUI",
            "double_chance": "1X",
            "risk": "FAIBLE",
            "ai_odds_insight": "Nouvelle cote supposée: 9.99.",
            "xgHome": 5.0,
            "estimatedCote": 9.99,
        }

        self.assertTrue(enrich.apply_analysis(match, hostile))
        # probabilité refusée → ABSTAIN, les valeurs empiriques restent du contexte
        self.assertTrue(match["ai_abstain"])
        self.assertEqual(match["ai_market"], "ABSTAIN")
        for key in ("proba", "confidence", "bttsProb", "over25Prob", "estimatedCote", "predictions"):
            self.assertNotIn(key, match, key)
        for key in ("xgHome", "xgAway"):
            self.assertEqual(match[key], before[key], key)
        self.assertEqual(match["empiricalBttsRate"], before["bttsProb"])
        self.assertEqual(match["empiricalOver25Rate"], before["over25Prob"])
        # seuls les champs narratifs autorisés sont écrits
        self.assertEqual(match["ai_analysis"], hostile["analysis_fr"])
        self.assertEqual(match["ai_analysis_en"], hostile["analysis_en"])
        self.assertEqual(match["ai_key_fact"], hostile["key_fact"])
        self.assertEqual(match["ai_confidence"], "medium")
        # aucun champ interdit créé, champs empiriques intacts
        for key in FORBIDDEN_CREATION:
            self.assertNotIn(key, match, key)
        for key in FORBIDDEN_OVERWRITE:
            self.assertEqual(match[key], before[key], key)

    def test_probability_is_clamped_into_allowed_band(self):
        """La probabilité fournie par Gemini est bornée à [PROBA_MIN, PROBA_MAX]."""
        match = {
            "home": "Home FC", "away": "Away FC", "matchCountHome": 6, "matchCountAway": 5,
            "bttsProb": 0.6, "over25Prob": 0.7,
        }
        item = {
            "id": 0,
            "market": "BTTS",
            "selection": "Yes",
            "probability": 0.85,  # > PROBA_MAX → clampe
            "confidence": "high",
            "analysis_fr": "Analyse.",
            "analysis_en": "Analysis.",
        }
        self.assertTrue(enrich.apply_analysis(match, item))
        self.assertFalse(match["ai_abstain"])
        self.assertEqual(match["bttsProb"], enrich.PROBA_MAX)
        self.assertEqual(match["proba"], enrich.PROBA_MAX)
        self.assertTrue(enrich.PROBA_MIN <= match["proba"] <= enrich.PROBA_MAX)
        self.assertEqual(match["confidence"], int(round(enrich.PROBA_MAX * 100)))

    def test_no_local_decision_or_fallback_functions_exist(self):
        self.assertFalse(hasattr(enrich, "local_decision"))
        self.assertFalse(hasattr(enrich, "apply_local_fallback"))

    def test_ambiguous_both_market_response_is_rejected_as_abstention(self):
        match = {"bttsProb": 0.60, "over25Prob": 0.70}
        accepted = enrich.apply_analysis(match, {
            "id": 0, "market": "BOTH", "selection": "Yes", "probability": 0.66,
        })
        self.assertTrue(accepted)
        self.assertTrue(match["ai_abstain"])
        self.assertEqual(match["ai_source"], "gemini-stats-v1")
        self.assertNotIn("predictions", match)
        self.assertNotIn("bttsProb", match)
        self.assertNotIn("over25Prob", match)

    def test_gemini_pick_requires_at_least_four_observed_matches_per_team(self):
        self.assertFalse(enrich.sample_ok({}))
        self.assertFalse(enrich.sample_ok({"matchCountHome": 4, "matchCountAway": 3}))
        self.assertFalse(enrich.sample_ok({"matchCountHome": 0, "matchCountAway": 0}))
        self.assertTrue(enrich.sample_ok({"matchCountHome": 4, "matchCountAway": 4}))

        insufficient = {"matchCountHome": 8, "matchCountAway": 3, "bttsProb": 0.65}
        enrich.apply_analysis(insufficient, {
            "id": 0, "market": "BTTS", "selection": "Yes", "probability": 0.65,
        })
        self.assertTrue(insufficient["ai_abstain"])
        self.assertNotIn("predictions", insufficient)
        self.assertNotIn("prediction", insufficient)

    def test_prompt_bounds_gemini_decision_fields(self):
        prompt = enrich.build_batch_prompt([{"home": "A", "away": "B", "bttsProb": 0.6, "over25Prob": 0.5}])
        # aucun champ de prédiction interdit demandé à Gemini
        self.assertNotIn('"ai_exact_score":', prompt)
        self.assertNotIn('"ai_btts_view":', prompt)
        self.assertNotIn('"winner_prob":', prompt)
        # la probabilité demandée est explicitement bornée
        self.assertIn(str(enrich.PROBA_MIN), prompt)
        self.assertIn(str(enrich.PROBA_MAX), prompt)
        # garde-fous anti-hallucination et abstention présents
        self.assertIn("N'invente AUCUNE stat", prompt)
        self.assertIn("ABSTAIN", prompt)
        self.assertNotIn('"BOTH"', prompt)
        self.assertIn("Réponds UNIQUEMENT un tableau JSON valide", prompt)
        # clamp_proba : refus hors [0.40, 0.90], borne dans [PROBA_MIN, PROBA_MAX]
        self.assertIsNone(enrich.clamp_proba(0.99))
        self.assertIsNone(enrich.clamp_proba(0.30))
        self.assertIsNone(enrich.clamp_proba(None))
        self.assertEqual(enrich.clamp_proba(0.85), enrich.PROBA_MAX)
        self.assertEqual(enrich.clamp_proba(0.62), 0.62)


if __name__ == "__main__":
    unittest.main()
