-- Run this in the Cloudflare D1 console before enabling the Pages Function.
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  page_path TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_page_views_day ON page_views(day);

CREATE TABLE IF NOT EXISTS unique_visitors (
  visitor_id TEXT PRIMARY KEY,
  first_day TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_visitors (
  day TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  PRIMARY KEY (day, visitor_id)
);
CREATE INDEX IF NOT EXISTS idx_daily_visitors_day ON daily_visitors(day);
