-- D1 enforces foreign keys in every migration and does not allow toggling
-- PRAGMA foreign_keys. Stage rows without constraints, drop the child table
-- before its parents (so ON DELETE CASCADE cannot erase publication claims),
-- rebuild the parents, then restore the child rows with valid references.
-- This rebuild is destructive to schema objects, but copies every row/column.
CREATE TABLE vip_candidates_0007_backup AS SELECT * FROM vip_candidates;
CREATE TABLE vip_publication_runs_0007_backup AS SELECT * FROM vip_publication_runs;
CREATE TABLE vip_publications_0007_backup AS SELECT * FROM vip_publications;

DROP TABLE vip_publications;
DROP TABLE vip_candidates;
DROP TABLE vip_publication_runs;

CREATE TABLE vip_candidates (
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
  telegram_message_id TEXT,
  CHECK (status IN ('approved', 'published') OR approved_at IS NULL),
  CHECK (status IN ('rejected', 'published') OR rejected_at IS NULL),
  CHECK (status = 'ineligible' OR ineligible_at IS NULL),
  CHECK ((status = 'published' AND published_at IS NOT NULL AND telegram_message_id IS NOT NULL)
    OR (status != 'published' AND published_at IS NULL AND telegram_message_id IS NULL))
);
INSERT INTO vip_candidates SELECT * FROM vip_candidates_0007_backup;
CREATE INDEX idx_vip_candidates_status_kickoff ON vip_candidates(status, kickoff_at);
CREATE INDEX idx_vip_candidates_last_sync ON vip_candidates(last_seen_sync_id);

CREATE TABLE vip_publication_runs (
  window_key TEXT PRIMARY KEY,
  policy_version TEXT NOT NULL CHECK (policy_version = 'verified-auto-v1'),
  scheduled_at TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  state TEXT NOT NULL CHECK (state IN (
    'running', 'no_candidates', 'source_incomplete', 'source_unavailable',
    'destination_unavailable', 'claim_lost', 'sent', 'not_sent', 'unknown', 'failed'
  )),
  claimed_count INTEGER NOT NULL DEFAULT 0 CHECK (claimed_count BETWEEN 0 AND 5),
  sent_count INTEGER NOT NULL DEFAULT 0 CHECK (sent_count BETWEEN 0 AND 5 AND sent_count <= claimed_count)
);
INSERT INTO vip_publication_runs SELECT * FROM vip_publication_runs_0007_backup;

CREATE TABLE vip_publications (
  candidate_key TEXT PRIMARY KEY REFERENCES vip_candidates(candidate_key),
  window_key TEXT NOT NULL REFERENCES vip_publication_runs(window_key),
  claim_token TEXT NOT NULL UNIQUE,
  policy_version TEXT NOT NULL CHECK (policy_version = 'verified-auto-v1'),
  material_hash TEXT NOT NULL,
  source_sync_id TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  message_text TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('claimed', 'sent', 'not_sent', 'unknown')),
  claimed_at TEXT NOT NULL,
  resolved_at TEXT,
  telegram_message_id TEXT,
  error_code TEXT,
  CHECK ((state = 'sent' AND telegram_message_id IS NOT NULL AND resolved_at IS NOT NULL)
    OR (state <> 'sent' AND telegram_message_id IS NULL))
);
INSERT INTO vip_publications SELECT * FROM vip_publications_0007_backup;
CREATE INDEX idx_vip_publications_state_claimed ON vip_publications(state, claimed_at);
CREATE INDEX idx_vip_publications_window ON vip_publications(window_key);

DROP TABLE vip_publications_0007_backup;
DROP TABLE vip_candidates_0007_backup;
DROP TABLE vip_publication_runs_0007_backup;
