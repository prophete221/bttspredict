-- Normalize the initial request schema for real application storage.
-- Existing requests are copied verbatim; Telegram contacts are NULL for legacy rows.
DROP INDEX IF EXISTS vip_unique_active_partner_account;
DROP INDEX IF EXISTS vip_requests_created_at;
DROP INDEX IF EXISTS vip_requests_expires_at;

ALTER TABLE vip_requests RENAME TO vip_requests_legacy;

CREATE TABLE vip_requests (
  id TEXT PRIMARY KEY,
  receipt_hash TEXT NOT NULL UNIQUE,
  partner TEXT NOT NULL CHECK (partner IN ('linebet', '888starz', '1xbet', 'melbet')),
  promo_code TEXT NOT NULL CHECK (length(promo_code) BETWEEN 1 AND 40),
  account_identifier TEXT NOT NULL CHECK (length(account_identifier) BETWEEN 1 AND 80),
  deposit_usd REAL NOT NULL CHECK (deposit_usd >= 3 AND deposit_usd <= 100000),
  contact_channel TEXT NOT NULL CHECK (contact_channel IN ('telegram', 'whatsapp')),
  telegram_username TEXT,
  whatsapp_phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending_review', 'approved_pending_telegram', 'rejected')),
  proof_blob BLOB NOT NULL CHECK (typeof(proof_blob) = 'blob' AND length(proof_blob) BETWEEN 1 AND 1400000),
  proof_mime TEXT NOT NULL CHECK (proof_mime IN ('image/png', 'image/jpeg')),
  proof_size INTEGER NOT NULL CHECK (proof_size BETWEEN 1 AND 1400000),
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  expires_at INTEGER NOT NULL,
  CHECK (
    (contact_channel = 'telegram' AND whatsapp_phone IS NULL
      AND (telegram_username IS NULL OR (length(telegram_username) BETWEEN 5 AND 32 AND telegram_username NOT GLOB '*[^A-Za-z0-9_]*')))
    OR (contact_channel = 'whatsapp' AND telegram_username IS NULL AND whatsapp_phone IS NOT NULL
      AND length(whatsapp_phone) BETWEEN 9 AND 16 AND substr(whatsapp_phone, 1, 1) = '+'
      AND substr(whatsapp_phone, 2, 1) BETWEEN '1' AND '9' AND substr(whatsapp_phone, 2) NOT GLOB '*[^0-9]*')
  )
);

INSERT INTO vip_requests (
  id, receipt_hash, partner, promo_code, account_identifier, deposit_usd,
  contact_channel, telegram_username, whatsapp_phone, status, proof_blob,
  proof_mime, proof_size, created_at, reviewed_at, expires_at
)
SELECT
  id, receipt_hash, partner, promo_code, account_identifier, deposit_usd,
  contact_channel, NULL, whatsapp_phone, status, proof_blob,
  proof_mime, proof_size, created_at, reviewed_at, expires_at
FROM vip_requests_legacy;

DROP TABLE vip_requests_legacy;

CREATE UNIQUE INDEX vip_unique_active_partner_account
  ON vip_requests (partner, account_identifier)
  WHERE status IN ('pending_review', 'approved_pending_telegram');
CREATE INDEX vip_requests_created_at ON vip_requests (created_at DESC);
CREATE INDEX vip_requests_expires_at ON vip_requests (expires_at);
