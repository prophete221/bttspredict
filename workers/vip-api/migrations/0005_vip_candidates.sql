CREATE TABLE IF NOT EXISTS vip_candidates (
  candidate_key TEXT PRIMARY KEY CHECK (
    length(candidate_key) = 64 AND candidate_key NOT GLOB '*[^0-9a-f]*'
  ),
  material_hash TEXT NOT NULL CHECK (
    length(material_hash) = 64 AND material_hash NOT GLOB '*[^0-9a-f]*'
  ),
  candidate_json TEXT NOT NULL,
  match_id TEXT NOT NULL,
  kickoff_at TEXT NOT NULL,
  analyzed_at TEXT NOT NULL,
  match_state TEXT NOT NULL CHECK (
    match_state IN ('PENDING', 'SCHEDULED', 'NOT_STARTED', 'UPCOMING')
  ),
  status TEXT NOT NULL DEFAULT 'pending_owner_approval' CHECK (
    status IN ('pending_owner_approval', 'approved', 'rejected', 'ineligible', 'published')
  ),
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  last_seen_sync_id TEXT NOT NULL,
  approved_at TEXT,
  rejected_at TEXT,
  ineligible_at TEXT,
  ineligible_reason TEXT,
  published_at TEXT,
  publication_window TEXT,
  telegram_message_id TEXT UNIQUE,
  CHECK (status IN ('approved', 'published') OR approved_at IS NULL),
  CHECK (status IN ('rejected', 'published') OR rejected_at IS NULL),
  CHECK (status = 'ineligible' OR ineligible_at IS NULL),
  CHECK ((status = 'published' AND published_at IS NOT NULL AND telegram_message_id IS NOT NULL)
    OR (status != 'published' AND published_at IS NULL AND telegram_message_id IS NULL))
);

CREATE INDEX IF NOT EXISTS idx_vip_candidates_status_kickoff
  ON vip_candidates(status, kickoff_at);

CREATE INDEX IF NOT EXISTS idx_vip_candidates_last_sync
  ON vip_candidates(last_seen_sync_id);

CREATE TABLE IF NOT EXISTS vip_candidate_sync_runs (
  run_id TEXT PRIMARY KEY,
  source_updated_at TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  candidate_count INTEGER NOT NULL CHECK (candidate_count >= 0),
  accepted_count INTEGER NOT NULL CHECK (accepted_count >= 0 AND accepted_count <= candidate_count),
  audit_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vip_candidate_sync_state (
  id TEXT PRIMARY KEY CHECK (id = 'vip'),
  last_generated_at TEXT NOT NULL,
  last_source_updated_at TEXT NOT NULL,
  last_sync_id TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
