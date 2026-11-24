export type AdminRole = 'admin';

export interface AdminSessionUser {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  lastLoginAt: string;
}

export interface AdminAuthMeResponse {
  authenticated: boolean;
  user: AdminSessionUser | null;
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogArticleDto {
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
  tags: string[];
  authorName: string;
  authorAvatarUrl: string | null;
  authorBio: string | null;
  status: BlogPostStatus;
  featured: boolean;
  readingTimeMinutes: number;
  wordCount: number;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogArticleInput {
  slug?: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  contentHtml: string;
  contentJson?: string | null;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  category?: string;
  tags?: string[];
  authorName?: string;
  authorAvatarUrl?: string | null;
  authorBio?: string | null;
  status?: BlogPostStatus;
  featured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'won'
  | 'archived'
  | 'spam';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ContactLeadDto {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  industry: string | null;
  sourcePage: string | null;
  sourceVariant: string;
  referrer: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
  contactedAt: string | null;
}

export interface ContactLeadCreateInput {
  name?: string;
  email: string;
  subject?: string;
  message?: string;
  industry?: string | null;
  sourcePage?: string | null;
  sourceVariant?: string;
  referrer?: string | null;
  company?: string; // honeypot
}

export interface ContactLeadUpdateInput {
  status?: LeadStatus;
  priority?: LeadPriority;
  adminNotes?: string;
  contactedAt?: string | null;
}

export interface AdminAuditLogDto {
  id: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  detailsJson: string;
  createdAt: string;
}

export interface AdminOverviewStatsDto {
  blog: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
  };
  leads: {
    total: number;
    newCount: number;
    contactedCount: number;
    qualifiedCount: number;
    wonCount: number;
    last7Days: number;
  };
  recentLeads: ContactLeadDto[];
  recentPosts: BlogArticleDto[];
  recentAuditLogs: AdminAuditLogDto[];
}

export function slugifyTitle(input: string): string {
  const cleaned = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
  return cleaned || `article-${Date.now().toString(36)}`;
}

export function stripHtmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function computeContentMetrics(html: string): {
  wordCount: number;
  readingTimeMinutes: number;
  autoExcerpt: string;
} {
  const plain = stripHtmlToText(html);
  const words = plain ? plain.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const autoExcerpt =
    plain.length > 210 ? `${plain.slice(0, 207).trimEnd()}...` : plain;
  return { wordCount, readingTimeMinutes, autoExcerpt };
}
