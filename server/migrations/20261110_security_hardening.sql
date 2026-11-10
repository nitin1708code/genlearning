-- Required by the auth flow hardening in this release.
-- Run once against the application database before deploying the new server code.
ALTER TABLE email_verifications
  ADD COLUMN attempts INT NOT NULL DEFAULT 0;

ALTER TABLE password_resets
  ADD COLUMN attempts INT NOT NULL DEFAULT 0;

ALTER TABLE users
  ADD COLUMN token_version INT NOT NULL DEFAULT 0;
