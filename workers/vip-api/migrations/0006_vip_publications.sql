-- Private durable outbox. Never expose snapshots/messages through a public route.
-- A claim is never automatically retried: Telegram has no client idempotency key.
CREATE TABLE IF NOT EXISTS vip_publication_runs (
  window_key TEXT PRIMARY KEY,
  policy_version TEXT NOT NULL CHECK (policy_version = 'verified-auto-v1'),
  scheduled_at TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  state TEXT NOT NULL CHECK (state IN (
    'running', 'no_candidates', 'source_incomplete', 'source_unavailable',
    'destination_unavailable', 'claim_lost', 'sent', 'not_sent', 'unknown', 'failed'
  )),
  claimed_count INTEGER NOT NULL DEFAULT 0 CHECK (claimed_count IN (0, 1)),
  sent_count INTEGER NOT NULL DEFAULT 0 CHECK (sent_count IN (0, 1) AND sent_count <= claimed_count)
);

CREATE TABLE IF NOT EXISTS vip_publications (
  candidate_key TEXT PRIMARY KEY REFERENCES vip_candidates(candidate_key),
  window_key TEXT NOT NULL UNIQUE REFERENCES vip_publication_runs(window_key),
  claim_token TEXT NOT NULL UNIQUE,
  policy_version TEXT NOT NULL CHECK (policy_version = 'verified-auto-v1'),
  material_hash TEXT NOT NULL,
  source_sync_id TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  message_text TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('claimed', 'sent', 'not_sent', 'unknown')),
  claimed_at TEXT NOT NULL,
  resolved_at TEXT,
  telegram_message_id TEXT UNIQUE,
  error_code TEXT,
  CHECK ((state = 'sent' AND telegram_message_id IS NOT NULL AND resolved_at IS NOT NULL)
    OR (state <> 'sent' AND telegram_message_id IS NULL))
);

CREATE INDEX IF NOT EXISTS idx_vip_publications_state_claimed
  ON vip_publications(state, claimed_at);
