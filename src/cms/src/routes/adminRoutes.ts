import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import type { CmsWorkerEnv, CmsWorkerVariables } from '../env';
import { adminAuditLogs, blogPosts, contactLeads } from '../db/schema';
import { requireAdmin } from '../auth/adminAuth';
import {
  computeContentMetrics,
  slugifyTitle,
} from '../../../shared/cmsContracts';
import { sanitizeArticleHtml, serializeBlogRow } from '../utils/htmlSanitizer';

const blogStatusSchema = z.enum(['draft', 'published', 'archived']);

const createBlogSchema = z.object({
  slug: z.string().trim().max(120).optional(),
  title: z.string().trim().min(1, 'Title is required.').max(220),
  subtitle: z.string().trim().max(400).optional(),
  excerpt: z.string().trim().max(600).optional(),
  contentHtml: z.string().max(400_000).default(''),
  contentJson: z.string().max(500_000).nullable().optional(),
  coverImageUrl: z.string().trim().max(1000).nullable().optional(),
  coverImageAlt: z.string().trim().max(300).nullable().optional(),
  category: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(48)).max(12).optional(),
  authorName: z.string().trim().max(120).optional(),
  authorAvatarUrl: z.string().trim().max(1000).nullable().optional(),
  authorBio: z.string().trim().max(500).nullable().optional(),
  status: blogStatusSchema.optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().trim().max(160).nullable().optional(),
  seoDescription: z.string().trim().max(320).nullable().optional(),
  canonicalUrl: z.string().trim().max(500).nullable().optional(),
});

const updateBlogSchema = createBlogSchema.partial();

const updateLeadSchema = z.object({
  status: z
    .enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'archived', 'spam'])
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  adminNotes: z.string().max(8000).optional(),
  contactedAt: z.string().nullable().optional(),
});

function csvEscape(val: string | null | undefined): string {
  const str = String(val ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function ensureUniqueSlug(
  db: ReturnType<typeof drizzle>,
  desiredSlug: string,
  excludeId?: string
): Promise<string> {
  const base = slugifyTitle(desiredSlug);
  let candidate = base;
  for (let suffix = 2; suffix < 50; suffix += 1) {
    const found = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, candidate))
      .limit(1);
    if (!found[0] || found[0].id === excludeId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

async function writeAudit(
  db: ReturnType<typeof drizzle>,
  adminEmail: string,
  action: string,
  resourceType: string,
  resourceId: string | null,
  details: Record<string, unknown> = {}
) {
  await db
    .insert(adminAuditLogs)
    .values({
      id: crypto.randomUUID(),
      adminEmail,
      action,
      resourceType,
      resourceId,
      detailsJson: JSON.stringify(details),
      createdAt: new Date().toISOString(),
    })
    .catch(() => {});
}

export function createAdminRoutes() {
  const admin = new Hono<{
    Bindings: CmsWorkerEnv;
    Variables: CmsWorkerVariables;
  }>();

  admin.use('*', requireAdmin);
  admin.use('*', async (c, next) => {
    await next();
    c.header('Cache-Control', 'private, no-store');
  });

  // --- Dashboard Overview ---
  admin.get('/overview', async (c) => {
    if (!c.env?.DB) {
      return c.json({ ok: false, error: 'Database unavailable' }, 503);
    }
    const db = drizzle(c.env.DB);
    const [allPosts, allLeads, logs] = await Promise.all([
      db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt)),
      db.select().from(contactLeads).orderBy(desc(contactLeads.createdAt)),
      db.select().from(adminAuditLogs).orderBy(desc(adminAuditLogs.createdAt)).limit(25),
    ]);

    const sevenDaysAgoIso = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
    const blogStats = {
      total: allPosts.length,
      published: allPosts.filter((p) => p.status === 'published').length,
      drafts: allPosts.filter((p) => p.status === 'draft').length,
      archived: allPosts.filter((p) => p.status === 'archived').length,
    };
    const leadStats = {
      total: allLeads.length,
      newCount: allLeads.filter((l) => l.status === 'new').length,
      contactedCount: allLeads.filter((l) => l.status === 'contacted').length,
      qualifiedCount: allLeads.filter((l) => l.status === 'qualified' || l.status === 'proposal').length,
      wonCount: allLeads.filter((l) => l.status === 'won').length,
      last7Days: allLeads.filter((l) => l.createdAt >= sevenDaysAgoIso).length,
    };

    return c.json({
      ok: true,
      overview: {
        blog: blogStats,
        leads: leadStats,
        recentLeads: allLeads.slice(0, 6),
        recentPosts: allPosts.slice(0, 6).map(serializeBlogRow),
        recentAuditLogs: logs,
      },
    });
  });

  // --- Blog Management CRUD ---
  admin.get('/blog', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const statusFilter = (c.req.query('status') ?? '').trim();
    const search = (c.req.query('search') ?? '').trim().toLowerCase();

    const db = drizzle(c.env.DB);
    const rows = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.updatedAt), desc(blogPosts.createdAt));

    let items = rows.map(serializeBlogRow);
    if (statusFilter && statusFilter !== 'all') {
      items = items.filter((item) => item.status === statusFilter);
    }
    if (search) {
      items = items.filter((item) =>
        [item.title, item.subtitle, item.slug, item.category, ...item.tags]
          .join(' ')
          .toLowerCase()
          .includes(search)
      );
    }

    return c.json({ ok: true, articles: items, total: items.length });
  });

  admin.get('/blog/:id', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const id = c.req.param('id');
    const db = drizzle(c.env.DB);
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    if (!rows[0]) {
      return c.json({ ok: false, error: 'Article not found' }, 404);
    }
    return c.json({ ok: true, article: serializeBlogRow(rows[0]) });
  });

  admin.post('/blog', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const user = c.get('user')!;
    const rawBody = await c.req.json().catch(() => null);
    const parsed = createBlogSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid blog post payload.' },
        400
      );
    }

    const input = parsed.data;
    const db = drizzle(c.env.DB);
    const nowIso = new Date().toISOString();
    const id = crypto.randomUUID();
    const cleanHtml = sanitizeArticleHtml(input.contentHtml);
    const metrics = computeContentMetrics(cleanHtml);
    const slug = await ensureUniqueSlug(db, input.slug?.trim() || input.title);
    const status = input.status ?? 'draft';
    const publishedAt = status === 'published' ? nowIso : null;
    const normalizedTags = Array.from(
      new Set((input.tags ?? []).map((t) => t.trim()).filter(Boolean))
    );

    const record = {
      id,
      slug,
      title: input.title,
      subtitle: input.subtitle ?? '',
      excerpt: input.excerpt?.trim() || metrics.autoExcerpt,
      contentHtml: cleanHtml,
      contentJson: input.contentJson ?? null,
      coverImageUrl: input.coverImageUrl?.trim() || null,
      coverImageAlt: input.coverImageAlt?.trim() || null,
      category: input.category?.trim() || 'Engineering',
      tagsJson: JSON.stringify(normalizedTags),
      authorName: input.authorName?.trim() || user.displayName || 'GPTX.VIP Editorial',
      authorAvatarUrl: input.authorAvatarUrl?.trim() || null,
      authorBio: input.authorBio?.trim() || null,
      status,
      featured: input.featured ? 1 : 0,
      readingTimeMinutes: metrics.readingTimeMinutes,
      wordCount: metrics.wordCount,
      seoTitle: input.seoTitle?.trim() || null,
      seoDescription: input.seoDescription?.trim() || null,
      canonicalUrl: input.canonicalUrl?.trim() || null,
      publishedAt,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await db.insert(blogPosts).values(record);
    await writeAudit(db, user.email, 'blog.create', 'blog_post', id, {
      slug,
      status,
      title: input.title,
    });

    return c.json({ ok: true, article: serializeBlogRow(record) }, 201);
  });

  admin.patch('/blog/:id', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const user = c.get('user')!;
    const id = c.req.param('id');
    const db = drizzle(c.env.DB);

    const existingRows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    const existing = existingRows[0];
    if (!existing) {
      return c.json({ ok: false, error: 'Article not found' }, 404);
    }

    const rawBody = await c.req.json().catch(() => null);
    const parsed = updateBlogSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid update payload.' },
        400
      );
    }

    const patch = parsed.data;
    const nowIso = new Date().toISOString();
    const nextHtml =
      patch.contentHtml !== undefined
        ? sanitizeArticleHtml(patch.contentHtml)
        : existing.contentHtml;
    const metrics = computeContentMetrics(nextHtml);
    const nextStatus = patch.status ?? (existing.status as 'draft' | 'published' | 'archived');
    const nextPublishedAt =
      nextStatus === 'published'
        ? existing.publishedAt ?? nowIso
        : existing.publishedAt;

    let nextSlug = existing.slug;
    if (patch.slug !== undefined && patch.slug.trim().length > 0 && patch.slug.trim() !== existing.slug) {
      nextSlug = await ensureUniqueSlug(db, patch.slug, id);
    }

    const nextTagsJson =
      patch.tags !== undefined
        ? JSON.stringify(
            Array.from(new Set(patch.tags.map((t) => t.trim()).filter(Boolean)))
          )
        : existing.tagsJson;

    const updated = {
      ...existing,
      slug: nextSlug,
      title: patch.title ?? existing.title,
      subtitle: patch.subtitle ?? existing.subtitle,
      excerpt:
        patch.excerpt !== undefined
          ? patch.excerpt.trim() || metrics.autoExcerpt
          : existing.excerpt || metrics.autoExcerpt,
      contentHtml: nextHtml,
      contentJson:
        patch.contentJson !== undefined ? patch.contentJson : existing.contentJson,
      coverImageUrl:
        patch.coverImageUrl !== undefined
          ? patch.coverImageUrl?.trim() || null
          : existing.coverImageUrl,
      coverImageAlt:
        patch.coverImageAlt !== undefined
          ? patch.coverImageAlt?.trim() || null
          : existing.coverImageAlt,
      category: patch.category?.trim() || existing.category,
      tagsJson: nextTagsJson,
      authorName: patch.authorName?.trim() || existing.authorName,
      authorAvatarUrl:
        patch.authorAvatarUrl !== undefined
          ? patch.authorAvatarUrl?.trim() || null
          : existing.authorAvatarUrl,
      authorBio:
        patch.authorBio !== undefined
          ? patch.authorBio?.trim() || null
          : existing.authorBio,
      status: nextStatus,
      featured:
        patch.featured !== undefined ? (patch.featured ? 1 : 0) : existing.featured,
      readingTimeMinutes: metrics.readingTimeMinutes,
      wordCount: metrics.wordCount,
      seoTitle:
        patch.seoTitle !== undefined ? patch.seoTitle?.trim() || null : existing.seoTitle,
      seoDescription:
        patch.seoDescription !== undefined
          ? patch.seoDescription?.trim() || null
          : existing.seoDescription,
      canonicalUrl:
        patch.canonicalUrl !== undefined
          ? patch.canonicalUrl?.trim() || null
          : existing.canonicalUrl,
      publishedAt: nextPublishedAt,
      updatedAt: nowIso,
    };

    await db
      .update(blogPosts)
      .set(updated)
      .where(eq(blogPosts.id, id));

    await writeAudit(db, user.email, 'blog.update', 'blog_post', id, {
      slug: nextSlug,
      status: nextStatus,
      title: updated.title,
    });

    return c.json({ ok: true, article: serializeBlogRow(updated) });
  });

  admin.delete('/blog/:id', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const user = c.get('user')!;
    const id = c.req.param('id');
    const db = drizzle(c.env.DB);

    const existing = await db
      .select({ id: blogPosts.id, slug: blogPosts.slug, title: blogPosts.title })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    if (!existing[0]) {
      return c.json({ ok: false, error: 'Article not found' }, 404);
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    await writeAudit(db, user.email, 'blog.delete', 'blog_post', id, {
      slug: existing[0].slug,
      title: existing[0].title,
    });

    return c.json({ ok: true });
  });

  // --- Contact & Lead Generation Management ---
  admin.get('/leads', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const statusFilter = (c.req.query('status') ?? '').trim();
    const priorityFilter = (c.req.query('priority') ?? '').trim();
    const variantFilter = (c.req.query('sourceVariant') ?? '').trim();
    const search = (c.req.query('search') ?? '').trim().toLowerCase();

    const db = drizzle(c.env.DB);
    const rows = await db
      .select()
      .from(contactLeads)
      .orderBy(desc(contactLeads.createdAt));

    const summary = {
      total: rows.length,
      newCount: rows.filter((l) => l.status === 'new').length,
      contactedCount: rows.filter((l) => l.status === 'contacted').length,
      qualifiedCount: rows.filter((l) => l.status === 'qualified' || l.status === 'proposal').length,
      wonCount: rows.filter((l) => l.status === 'won').length,
    };

    let filtered = rows;
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }
    if (priorityFilter && priorityFilter !== 'all') {
      filtered = filtered.filter((l) => l.priority === priorityFilter);
    }
    if (variantFilter && variantFilter !== 'all') {
      filtered = filtered.filter((l) => l.sourceVariant === variantFilter);
    }
    if (search) {
      filtered = filtered.filter((l) =>
        [l.name, l.email, l.subject, l.message, l.industry ?? '', l.sourcePage ?? '', l.adminNotes]
          .join(' ')
          .toLowerCase()
          .includes(search)
      );
    }

    return c.json({
      ok: true,
      leads: filtered,
      total: filtered.length,
      summary,
    });
  });

  admin.get('/leads/export', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const db = drizzle(c.env.DB);
    const rows = await db
      .select()
      .from(contactLeads)
      .orderBy(desc(contactLeads.createdAt));

    const header = [
      'ID',
      'Name',
      'Email',
      'Subject',
      'Message',
      'Industry',
      'Source Page',
      'Form Variant',
      'Status',
      'Priority',
      'Admin Notes',
      'Created At',
      'Contacted At',
    ];

    const lines = [
      header.join(','),
      ...rows.map((r) =>
        [
          r.id,
          r.name,
          r.email,
          r.subject,
          r.message,
          r.industry,
          r.sourcePage,
          r.sourceVariant,
          r.status,
          r.priority,
          r.adminNotes,
          r.createdAt,
          r.contactedAt,
        ]
          .map(csvEscape)
          .join(',')
      ),
    ];

    return new Response(lines.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="gptxvip-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'private, no-store',
      },
    });
  });

  admin.patch('/leads/:id', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const user = c.get('user')!;
    const id = c.req.param('id');
    const db = drizzle(c.env.DB);

    const existingRows = await db
      .select()
      .from(contactLeads)
      .where(eq(contactLeads.id, id))
      .limit(1);
    const existing = existingRows[0];
    if (!existing) {
      return c.json({ ok: false, error: 'Lead not found' }, 404);
    }

    const rawBody = await c.req.json().catch(() => null);
    const parsed = updateLeadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid lead update.' },
        400
      );
    }

    const patch = parsed.data;
    const nowIso = new Date().toISOString();
    const nextStatus = patch.status ?? existing.status;
    let nextContactedAt = existing.contactedAt;
    if (patch.contactedAt !== undefined) {
      nextContactedAt = patch.contactedAt;
    } else if (
      !existing.contactedAt &&
      (nextStatus === 'contacted' || nextStatus === 'qualified' || nextStatus === 'proposal' || nextStatus === 'won')
    ) {
      nextContactedAt = nowIso;
    }

    const updated = {
      ...existing,
      status: nextStatus,
      priority: patch.priority ?? existing.priority,
      adminNotes: patch.adminNotes ?? existing.adminNotes,
      contactedAt: nextContactedAt,
      updatedAt: nowIso,
    };

    await db.update(contactLeads).set(updated).where(eq(contactLeads.id, id));
    await writeAudit(db, user.email, 'lead.update', 'contact_lead', id, {
      status: updated.status,
      priority: updated.priority,
      email: existing.email,
    });

    return c.json({ ok: true, lead: updated });
  });

  admin.delete('/leads/:id', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const user = c.get('user')!;
    const id = c.req.param('id');
    const db = drizzle(c.env.DB);

    const existing = await db
      .select({ id: contactLeads.id, email: contactLeads.email })
      .from(contactLeads)
      .where(eq(contactLeads.id, id))
      .limit(1);
    if (!existing[0]) {
      return c.json({ ok: false, error: 'Lead not found' }, 404);
    }

    await db.delete(contactLeads).where(eq(contactLeads.id, id));
    await writeAudit(db, user.email, 'lead.delete', 'contact_lead', id, {
      email: existing[0].email,
    });

    return c.json({ ok: true });
  });

  // --- Media Upload (R2) for Blog Cover & Inline Images ---
  admin.post('/media/upload', async (c) => {
    if (!c.env?.BUCKET) {
      return c.json(
        {
          ok: false,
          error:
            'Cloudflare R2 BUCKET is not bound yet. Paste an external image URL or configure [[r2_buckets]] in src/cms/wrangler.toml.',
        },
        503
      );
    }

    const formData = await c.req.formData().catch(() => null);
    const file = formData?.get('file');
    if (!(file instanceof File)) {
      return c.json({ ok: false, error: 'No image file provided.' }, 400);
    }

    const allowedTypes: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/avif': 'avif',
    };
    const ext = allowedTypes[file.type];
    if (!ext) {
      return c.json(
        { ok: false, error: 'Unsupported image format. Use PNG, JPEG, WebP, GIF, or AVIF.' },
        400
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ ok: false, error: 'Image must be 5 MB or smaller.' }, 413);
    }

    const datePrefix = new Date().toISOString().slice(0, 7);
    const key = `blog/${datePrefix}/${crypto.randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();

    await c.env.BUCKET.put(key, bytes, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    if (c.env.DB) {
      const user = c.get('user')!;
      await writeAudit(drizzle(c.env.DB), user.email, 'media.upload', 'r2_object', key, {
        size: file.size,
        contentType: file.type,
      });
    }

    return c.json({
      ok: true,
      key,
      url: `/media/${key}`,
    });
  });

  // --- Audit Logs ---
  admin.get('/audit-logs', async (c) => {
    if (!c.env?.DB) return c.json({ ok: false, error: 'Database unavailable' }, 503);
    const db = drizzle(c.env.DB);
    const logs = await db
      .select()
      .from(adminAuditLogs)
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(100);
    return c.json({ ok: true, logs });
  });

  return admin;
}
