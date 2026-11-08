-- Store only the individual Telegram invite needed by the authenticated applicant status view.
-- Existing requests remain unchanged and have no invite until an administrator approves them.
ALTER TABLE vip_requests ADD COLUMN telegram_invite_link TEXT;
ALTER TABLE vip_requests ADD COLUMN telegram_invite_expires_at INTEGER;

CREATE UNIQUE INDEX vip_unique_telegram_invite_link
  ON vip_requests (telegram_invite_link)
  WHERE telegram_invite_link IS NOT NULL;
