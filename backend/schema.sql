-- QCL Staff Boats — database schema
-- Reconstructed from backend/database.js queries (no original dump survived the Hetzner shutdown).
-- Target: MySQL 8.x. Run once against a fresh database, e.g.:
--   mysql -h <host> -u <user> -p < schema.sql
-- The application code references the schema as `qcl` (e.g. `SELECT ... FROM qcl.user`).

CREATE DATABASE IF NOT EXISTS qcl
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qcl;

-- ---------------------------------------------------------------------------
-- user
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user (
  userId        INT          NOT NULL AUTO_INCREMENT,
  firstName     VARCHAR(100) NOT NULL,
  lastName      VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password      VARCHAR(255) NOT NULL,            -- bcrypt hash
  role          VARCHAR(20)  NOT NULL DEFAULT 'standard',  -- 'standard' | 'admin'
  fishingLicence VARCHAR(100) NULL,
  pcoc          VARCHAR(100) NULL,                -- optional (Pleasure Craft Operator Card)
  points        INT          NOT NULL DEFAULT 0,
  isConfirmed   TINYINT(1)   NOT NULL DEFAULT 0,  -- admin must confirm before login
  PRIMARY KEY (userId),
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- halfDay  (presence of a row marks that calendar date as a half day)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS halfDay (
  date DATE NOT NULL,
  PRIMARY KEY (date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- boatUnavailable  (a boat is out of service on a given date)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boatUnavailable (
  boatId          INT  NOT NULL,
  dateUnavailable DATE NOT NULL,
  PRIMARY KEY (boatId, dateUnavailable)   -- supports INSERT IGNORE de-dupe
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- booking
--   isMorningBooking: 1 = morning, 0 = evening, NULL = full day
--   isConfirmed:      NULL = pending/auto-granted, 1 = confirmed, 0 = not granted
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking (
  bookingId        INT        NOT NULL AUTO_INCREMENT,
  date             DATE       NOT NULL,
  isMorningBooking TINYINT(1) NULL,
  isConfirmed      TINYINT(1) NULL,
  userId           INT        NOT NULL,
  timeBooked       DATETIME   NOT NULL,
  isPriority       TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (bookingId),
  -- Enables the ON DUPLICATE KEY UPDATE in createBooking() so a user can't
  -- double-book the same session. NOTE: MySQL treats NULLs as distinct, so
  -- this does NOT dedupe full-day bookings (isMorningBooking IS NULL) — same
  -- behaviour the app already had on Hetzner.
  UNIQUE KEY uq_booking_user_session (userId, date, isMorningBooking),
  KEY idx_booking_date (date),
  CONSTRAINT fk_booking_user FOREIGN KEY (userId)
    REFERENCES user (userId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Seed: create your first admin so you can confirm other accounts.
-- Generate the bcrypt hash (HASH_ROUNDS = 5) and paste it below, e.g. in backend/:
--   node -e "import('bcrypt').then(b=>b.hash('YOUR_PASSWORD',5).then(h=>console.log(h)))"
-- ---------------------------------------------------------------------------
-- INSERT INTO user (firstName, lastName, email, password, role, isConfirmed, points)
-- VALUES ('Merek', 'Pipes', 'you@example.com', '<bcrypt-hash>', 'admin', 1, 0);
