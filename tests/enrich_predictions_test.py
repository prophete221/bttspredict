import copy
import importlib.util
import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

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
FORBIDDEN_OVERWRITE = ("xgHome", "xgAway", "estimatedCote")
FORBIDDEN = FORBIDDEN_CREATION + FORBIDDEN_OVERWRITE


class EnrichmentImmutabilityTests(unittest.TestCase):
    def test_uses_provider_recommended_gemini_model_ids(self):
        self.assertEqual(
            enrich.MODELS_TO_TRY,
            ["gemini-3.5-flash-lite", "gemini-3.8-flash"],
        )

    def test_zero_provider_enrichments_warns_fails_and_keeps_local_fallback(self):
        class FailingModels:
            def generate_content(self, **_kwargs):
                raise RuntimeError("503 UNAVAILABLE: temporary provider capacity issue")

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
                patch.object(enrich, "MAX_RETRIES", 0),
                patch.object(enrich, "RETRY_DELAY", 0),
                patch.object(enrich.time, "sleep"),
                redirect_stdout(output),
            ):
                with self.assertRaises(SystemExit) as raised:
                    enrich.main()

            self.assertEqual(raised.exception.code, 1)
            saved = json.loads(predictions_file.read_text(encoding="utf-8"))
            self.assertEqual(saved["free"][0]["ai_source"], "local-empirical-v1")
            self.assertIn("Gemini applied 0/1", output.getvalue())
            self.assertIn("::warning::Gemini n'a appliqué aucun enrichissement", output.getvalue())
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
        # probabilité refusée → ABSTAIN, aucune valeur existante écrasée
        self.assertTrue(match["ai_abstain"])
        self.assertEqual(match["ai_market"], "ABSTAIN")
        for key in ("proba", "confidence", "bttsProb", "over25Prob", "xgHome", "xgAway",
                    "estimatedCote", "predictions"):
            self.assertEqual(match[key], before[key], key)
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
        match = {"home": "Home FC", "away": "Away FC", "bttsProb": 0.6, "over25Prob": 0.7}
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

    def test_fallback_stays_within_empirical_rates_and_bounds(self):
        """Le fallback local ne décide qu'à partir des taux empiriques, borné,
        et ne fabrique jamais de champ interdit."""
        decision = enrich.local_decision({
            "home": "Home FC", "away": "Away FC", "bttsProb": 0.6, "over25Prob": 0.7,
        })
        self.assertIn(decision["market"], ("BTTS", "OVER_25", "BOTH", "ABSTAIN"))
        if decision["probability"] is not None:
            self.assertTrue(enrich.PROBA_MIN <= decision["probability"] <= enrich.PROBA_MAX)
        self.assertTrue(set(FORBIDDEN).isdisjoint(decision))

        # taux empiriques exagérés → bornés, jamais recopiés tels quels
        hot = enrich.local_decision({
            "home": "A", "away": "B", "bttsProb": 0.95, "over25Prob": 0.10,
        })
        self.assertEqual(hot["market"], "BTTS")
        self.assertEqual(hot["probability"], enrich.PROBA_MAX)

        # application : aucun champ interdit créé, source tracée
        match = {"home": "Home FC", "away": "Away FC", "bttsProb": 0.6, "over25Prob": 0.7}
        enrich.apply_local_fallback(match)
        for key in FORBIDDEN_CREATION:
            self.assertNotIn(key, match, key)
        self.assertEqual(match["ai_source"], "local-empirical-v1")

        # taux faibles → ABSTAIN explicite, pas de Oui marketing
        weak = {"home": "H", "away": "A", "bttsProb": 0.30, "over25Prob": 0.35}
        enrich.apply_local_fallback(weak)
        self.assertTrue(weak["ai_abstain"])
        self.assertEqual(weak["ai_market"], "ABSTAIN")

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
        self.assertIn("Réponds UNIQUEMENT un tableau JSON valide", prompt)
        # clamp_proba : refus hors [0.40, 0.90], borne dans [PROBA_MIN, PROBA_MAX]
        self.assertIsNone(enrich.clamp_proba(0.99))
        self.assertIsNone(enrich.clamp_proba(0.30))
        self.assertIsNone(enrich.clamp_proba(None))
        self.assertEqual(enrich.clamp_proba(0.85), enrich.PROBA_MAX)
        self.assertEqual(enrich.clamp_proba(0.62), 0.62)


if __name__ == "__main__":
    unittest.main()
