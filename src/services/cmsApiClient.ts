import type {
  AdminAuditLogDto,
  AdminAuthMeResponse,
  AdminOverviewStatsDto,
  AdminSessionUser,
  BlogArticleDto,
  BlogArticleInput,
  ContactLeadCreateInput,
  ContactLeadDto,
  ContactLeadUpdateInput,
} from '../shared/cmsContracts';

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const cmsApiClient = {
  // --- Auth ---
  async getAuthMe(): Promise<AdminAuthMeResponse> {
    const res = await fetch('/api/auth/me', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!res.ok) {
      return { authenticated: false, user: null };
    }
    return (await res.json()) as AdminAuthMeResponse;
  },

  async loginAdmin(
    email: string,
    accessKey: string
  ): Promise<{ ok: boolean; user?: AdminSessionUser; error?: string }> {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accessKey }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        user?: AdminSessionUser;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        return {
          ok: false,
          error: data.error || `Sign-in failed (${res.status})`,
        };
      }
      return { ok: true, user: data.user };
    } catch {
      return {
        ok: false,
        error:
          'Could not reach the CMS Worker (/api/auth/admin-login). Ensure Wrangler dev is running on port 8787 locally or deployed on Cloudflare.',
      };
    }
  },

  async logoutAdmin(): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    }).catch(() => {});
  },

  // --- Public Blog ---
  async listPublicArticles(params?: {
    search?: string;
    category?: string;
    tag?: string;
    featured?: boolean;
  }): Promise<{
    articles: BlogArticleDto[];
    categories: string[];
    tags: string[];
    total: number;
  }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.category && params.category !== 'all') qs.set('category', params.category);
    if (params?.tag) qs.set('tag', params.tag);
    if (params?.featured) qs.set('featured', 'true');
    const url = qs.toString() ? `/api/blog?${qs.toString()}` : '/api/blog';
    const res = await fetch(url, { credentials: 'same-origin' });
    return parseJson<{
      articles: BlogArticleDto[];
      categories: string[];
      tags: string[];
      total: number;
    }>(res);
  },

  async getPublicArticle(slug: string): Promise<{
    article: BlogArticleDto;
    related: BlogArticleDto[];
  }> {
    const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`, {
      credentials: 'same-origin',
    });
    return parseJson<{ article: BlogArticleDto; related: BlogArticleDto[] }>(res);
  },

  // --- Public Contact / Lead Capture ---
  async submitLead(
    input: ContactLeadCreateInput
  ): Promise<{ ok: boolean; id?: string; message?: string; error?: string }> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      id?: string;
      message?: string;
      error?: string;
    };
    if (!res.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || `Submission failed (${res.status})`,
      };
    }
    return { ok: true, id: data.id, message: data.message };
  },

  // --- Admin Overview ---
  async getAdminOverview(): Promise<AdminOverviewStatsDto> {
    const res = await fetch('/api/admin/overview', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const data = await parseJson<{ overview: AdminOverviewStatsDto }>(res);
    return data.overview;
  },

  // --- Admin Blog ---
  async listAdminArticles(params?: {
    status?: string;
    search?: string;
  }): Promise<BlogArticleDto[]> {
    const qs = new URLSearchParams();
    if (params?.status && params.status !== 'all') qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    const url = qs.toString() ? `/api/admin/blog?${qs.toString()}` : '/api/admin/blog';
    const res = await fetch(url, {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const data = await parseJson<{ articles: BlogArticleDto[] }>(res);
    return data.articles;
  },

  async getAdminArticle(id: string): Promise<BlogArticleDto> {
    const res = await fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const data = await parseJson<{ article: BlogArticleDto }>(res);
    return data.article;
  },

  async createArticle(input: BlogArticleInput): Promise<BlogArticleDto> {
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await parseJson<{ article: BlogArticleDto }>(res);
    return data.article;
  },

  async updateArticle(
    id: string,
    patch: Partial<BlogArticleInput>
  ): Promise<BlogArticleDto> {
    const res = await fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await parseJson<{ article: BlogArticleDto }>(res);
    return data.article;
  },

  async deleteArticle(id: string): Promise<void> {
    const res = await fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    await parseJson<{ ok: boolean }>(res);
  },

  // --- Admin Leads ---
  async listAdminLeads(params?: {
    status?: string;
    priority?: string;
    sourceVariant?: string;
    search?: string;
  }): Promise<{
    leads: ContactLeadDto[];
    summary: {
      total: number;
      newCount: number;
      contactedCount: number;
      qualifiedCount: number;
      wonCount: number;
    };
  }> {
    const qs = new URLSearchParams();
    if (params?.status && params.status !== 'all') qs.set('status', params.status);
    if (params?.priority && params.priority !== 'all') qs.set('priority', params.priority);
    if (params?.sourceVariant && params.sourceVariant !== 'all') {
      qs.set('sourceVariant', params.sourceVariant);
    }
    if (params?.search) qs.set('search', params.search);
    const url = qs.toString() ? `/api/admin/leads?${qs.toString()}` : '/api/admin/leads';
    const res = await fetch(url, {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    return parseJson<{
      leads: ContactLeadDto[];
      summary: {
        total: number;
        newCount: number;
        contactedCount: number;
        qualifiedCount: number;
        wonCount: number;
      };
    }>(res);
  },

  async updateLead(
    id: string,
    patch: ContactLeadUpdateInput
  ): Promise<ContactLeadDto> {
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await parseJson<{ lead: ContactLeadDto }>(res);
    return data.lead;
  },

  async deleteLead(id: string): Promise<void> {
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    await parseJson<{ ok: boolean }>(res);
  },

  // --- Admin Media Upload (R2) ---
  async uploadImage(file: File): Promise<{ url: string; key: string }> {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      credentials: 'same-origin',
      body,
    });
    return parseJson<{ url: string; key: string }>(res);
  },

  // --- Audit Logs ---
  async listAuditLogs(): Promise<AdminAuditLogDto[]> {
    const res = await fetch('/api/admin/audit-logs', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const data = await parseJson<{ logs: AdminAuditLogDto[] }>(res);
    return data.logs;
  },
};
