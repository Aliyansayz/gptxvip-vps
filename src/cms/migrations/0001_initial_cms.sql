-- Migration 0001: GPTX.VIP CMS (Admin Auth, Blog Articles, Contact Leads, Audit Logs)

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL,
  last_login_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL DEFAULT '',
  content_json TEXT,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  category TEXT NOT NULL DEFAULT 'Engineering',
  tags_json TEXT NOT NULL DEFAULT '[]',
  author_name TEXT NOT NULL DEFAULT 'GPTX.VIP Editorial',
  author_avatar_url TEXT,
  author_bio TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  featured INTEGER NOT NULL DEFAULT 0,
  reading_time_minutes INTEGER NOT NULL DEFAULT 1,
  word_count INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status ON blog_posts(category, status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated ON blog_posts(updated_at DESC);

CREATE TABLE IF NOT EXISTS contact_leads (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL DEFAULT 'Website Visitor',
  email TEXT NOT NULL COLLATE NOCASE,
  subject TEXT NOT NULL DEFAULT 'General Inquiry',
  message TEXT NOT NULL DEFAULT '',
  industry TEXT,
  source_page TEXT,
  source_variant TEXT NOT NULL DEFAULT 'full',
  referrer TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_notes TEXT NOT NULL DEFAULT '',
  ip_hash TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  contacted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_leads_status_created ON contact_leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_leads_created ON contact_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_leads_email ON contact_leads(email);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs(created_at DESC);
