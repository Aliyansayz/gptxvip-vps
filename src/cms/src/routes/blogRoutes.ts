import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { and, desc, eq, ne } from 'drizzle-orm';
import type { CmsWorkerEnv, CmsWorkerVariables } from '../env';
import { blogPosts } from '../db/schema';
import { serializeBlogRow } from '../utils/htmlSanitizer';

export function createPublicBlogRoutes() {
  const blog = new Hono<{
    Bindings: CmsWorkerEnv;
    Variables: CmsWorkerVariables;
  }>();

  blog.get('/', async (c) => {
    if (!c.env?.DB) {
      return c.json({ ok: true, articles: [], categories: [], tags: [], total: 0 });
    }

    const search = (c.req.query('search') ?? '').trim().toLowerCase();
    const category = (c.req.query('category') ?? '').trim();
    const tag = (c.req.query('tag') ?? '').trim().toLowerCase();
    const featuredOnly = c.req.query('featured') === 'true';
    const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') ?? 50) || 50));
    const offset = Math.max(0, Number(c.req.query('offset') ?? 0) || 0);

    const db = drizzle(c.env.DB);
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.featured), desc(blogPosts.publishedAt), desc(blogPosts.createdAt));

    const allPublished = rows.map(serializeBlogRow);
    const categoriesSet = new Set<string>();
    const tagsSet = new Set<string>();
    for (const item of allPublished) {
      if (item.category) categoriesSet.add(item.category);
      for (const t of item.tags) tagsSet.add(t);
    }

    let filtered = allPublished;
    if (category && category !== 'all') {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (tag) {
      filtered = filtered.filter((item) =>
        item.tags.some((t) => t.toLowerCase() === tag)
      );
    }
    if (featuredOnly) {
      filtered = filtered.filter((item) => item.featured);
    }
    if (search) {
      filtered = filtered.filter((item) => {
        const haystack = [
          item.title,
          item.subtitle,
          item.excerpt,
          item.category,
          item.authorName,
          ...item.tags,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    const paginated = filtered.slice(offset, offset + limit);
    c.header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');

    return c.json({
      ok: true,
      articles: paginated,
      total: filtered.length,
      categories: Array.from(categoriesSet).sort(),
      tags: Array.from(tagsSet).sort(),
    });
  });

  blog.get('/:slug', async (c) => {
    if (!c.env?.DB) {
      return c.json({ ok: false, error: 'Database unavailable' }, 503);
    }

    const slug = (c.req.param('slug') ?? '').trim().toLowerCase();
    if (!slug) {
      return c.json({ ok: false, error: 'Article slug is required' }, 400);
    }

    const db = drizzle(c.env.DB);
    const rows = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return c.json({ ok: false, error: 'Article not found' }, 404);
    }

    const article = serializeBlogRow(row);

    const relatedRows = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.status, 'published'), ne(blogPosts.id, row.id)))
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
      .limit(12);

    const serializedRelated = relatedRows.map(serializeBlogRow);
    const sameCategory = serializedRelated.filter(
      (r) => r.category.toLowerCase() === article.category.toLowerCase()
    );
    const others = serializedRelated.filter(
      (r) => r.category.toLowerCase() !== article.category.toLowerCase()
    );
    const related = [...sameCategory, ...others].slice(0, 3);

    c.header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    return c.json({ ok: true, article, related });
  });

  return blog;
}
