/**
 * Lightweight Worker-safe HTML sanitizer for WYSIWYG blog articles.
 * Removes executable tags, inline event handlers, and javascript:/data: URLs
 * while preserving rich editorial markup (headings, lists, quotes, code, images, links).
 */
export function sanitizeArticleHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  return rawHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<(iframe|object|embed|form|input|button|textarea|meta|link|base)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|form|input|button|textarea|meta|link|base)[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(
      /(href|src)\s*=\s*(["'])\s*(?:javascript|vbscript|data:(?!image\/(?:png|jpeg|jpg|webp|gif|avif);base64,))[^"']*\2/gi,
      '$1="#"'
    )
    .trim();
}

export function serializeBlogRow(row: {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  contentHtml: string;
  contentJson: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  category: string;
  tagsJson: string;
  authorName: string;
  authorAvatarUrl: string | null;
  authorBio: string | null;
  status: string;
  featured: number;
  readingTimeMinutes: number;
  wordCount: number;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}) {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(row.tagsJson);
    if (Array.isArray(parsed)) {
      tags = parsed.filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
    }
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    contentHtml: row.contentHtml,
    contentJson: row.contentJson,
    coverImageUrl: row.coverImageUrl,
    coverImageAlt: row.coverImageAlt,
    category: row.category,
    tags,
    authorName: row.authorName,
    authorAvatarUrl: row.authorAvatarUrl,
    authorBio: row.authorBio,
    status: row.status as 'draft' | 'published' | 'archived',
    featured: row.featured === 1,
    readingTimeMinutes: row.readingTimeMinutes,
    wordCount: row.wordCount,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    canonicalUrl: row.canonicalUrl,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
