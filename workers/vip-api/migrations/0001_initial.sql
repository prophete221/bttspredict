PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS vip_requests (
  id TEXT PRIMARY KEY,
  receipt_hash TEXT NOT NULL UNIQUE,
  partner TEXT NOT NULL CHECK (partner IN ('linebet', '888starz', '1xbet', 'melbet')),
  promo_code TEXT NOT NULL CHECK (length(promo_code) BETWEEN 1 AND 40),
  account_identifier TEXT NOT NULL CHECK (length(account_identifier) BETWEEN 1 AND 80),
  deposit_usd REAL NOT NULL CHECK (deposit_usd >= 3 AND deposit_usd <= 100000),
  contact_channel TEXT NOT NULL CHECK (contact_channel IN ('telegram', 'whatsapp')),
  whatsapp_phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending_review', 'approved_pending_telegram', 'rejected')),
  proof_blob BLOB NOT NULL CHECK (typeof(proof_blob) = 'blob' AND length(proof_blob) BETWEEN 1 AND 1400000),
  proof_mime TEXT NOT NULL CHECK (proof_mime IN ('image/png', 'image/jpeg')),
  proof_size INTEGER NOT NULL CHECK (proof_size BETWEEN 1 AND 1400000),
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  expires_at INTEGER NOT NULL,
  CHECK (
    (contact_channel = 'telegram' AND whatsapp_phone IS NULL)
    OR (contact_channel = 'whatsapp' AND whatsapp_phone IS NOT NULL
      AND length(whatsapp_phone) BETWEEN 9 AND 16 AND substr(whatsapp_phone, 1, 1) = '+'
      AND substr(whatsapp_phone, 2, 1) BETWEEN '1' AND '9' AND substr(whatsapp_phone, 2) NOT GLOB '*[^0-9]*')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS vip_unique_active_partner_account
  ON vip_requests (partner, account_identifier)
  WHERE status IN ('pending_review', 'approved_pending_telegram');
CREATE INDEX IF NOT EXISTS vip_requests_created_at ON vip_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS vip_requests_expires_at ON vip_requests (expires_at);

CREATE TABLE IF NOT EXISTS vip_admin_sessions (
  token_hash TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS vip_admin_sessions_expires_at ON vip_admin_sessions (expires_at);

CREATE TABLE IF NOT EXISTS vip_rate_limits (
  scope TEXT NOT NULL CHECK (scope IN ('submit', 'login')),
  ip_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  hits INTEGER NOT NULL CHECK (hits >= 0),
  PRIMARY KEY (scope, ip_hash)
);
CREATE INDEX IF NOT EXISTS vip_rate_limits_window_start ON vip_rate_limits (window_start);
