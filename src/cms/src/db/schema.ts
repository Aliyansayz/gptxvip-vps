import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: text('created_at').notNull(),
  lastLoginAt: text('last_login_at').notNull(),
});

export const adminSessions = sqliteTable(
  'admin_sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => adminUsers.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('idx_admin_sessions_token_hash').on(table.tokenHash),
    index('idx_admin_sessions_expires_at').on(table.expiresAt),
  ]
);

export const blogPosts = sqliteTable(
  'blog_posts',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    subtitle: text('subtitle').notNull().default(''),
    excerpt: text('excerpt').notNull().default(''),
    contentHtml: text('content_html').notNull().default(''),
    contentJson: text('content_json'),
    coverImageUrl: text('cover_image_url'),
    coverImageAlt: text('cover_image_alt'),
    category: text('category').notNull().default('Engineering'),
    tagsJson: text('tags_json').notNull().default('[]'),
    authorName: text('author_name').notNull().default('GPTX.VIP Editorial'),
    authorAvatarUrl: text('author_avatar_url'),
    authorBio: text('author_bio'),
    status: text('status').notNull().default('draft'),
    featured: integer('featured').notNull().default(0),
    readingTimeMinutes: integer('reading_time_minutes').notNull().default(1),
    wordCount: integer('word_count').notNull().default(0),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    canonicalUrl: text('canonical_url'),
    publishedAt: text('published_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_blog_posts_status_published').on(table.status, table.publishedAt),
    index('idx_blog_posts_category_status').on(table.category, table.status),
    index('idx_blog_posts_updated').on(table.updatedAt),
  ]
);

export const contactLeads = sqliteTable(
  'contact_leads',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().default('Website Visitor'),
    email: text('email').notNull(),
    subject: text('subject').notNull().default('General Inquiry'),
    message: text('message').notNull().default(''),
    industry: text('industry'),
    sourcePage: text('source_page'),
    sourceVariant: text('source_variant').notNull().default('full'),
    referrer: text('referrer'),
    status: text('status').notNull().default('new'),
    priority: text('priority').notNull().default('medium'),
    adminNotes: text('admin_notes').notNull().default(''),
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    contactedAt: text('contacted_at'),
  },
  (table) => [
    index('idx_contact_leads_status_created').on(table.status, table.createdAt),
    index('idx_contact_leads_created').on(table.createdAt),
    index('idx_contact_leads_email').on(table.email),
  ]
);

export const adminAuditLogs = sqliteTable(
  'admin_audit_logs',
  {
    id: text('id').primaryKey(),
    adminEmail: text('admin_email').notNull(),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id'),
    detailsJson: text('details_json').notNull().default('{}'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('idx_admin_audit_logs_created').on(table.createdAt)]
);
