-- Record explicit applicant consent for request processing and follow-up.
ALTER TABLE vip_requests ADD COLUMN consent_version TEXT;
ALTER TABLE vip_requests ADD COLUMN consented_at TEXT;
ALTER TABLE vip_requests ADD COLUMN contact_consented_at TEXT;
