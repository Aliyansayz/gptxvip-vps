import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { createCmsApp } from './index';
import type { CmsWorkerEnv } from './env';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationSql = readFileSync(
  join(__dirname, '../migrations/0001_initial_cms.sql'),
  'utf8'
);

/**
 * Minimal in-memory Cloudflare D1 shim backed by Node 22's built-in `node:sqlite`,
 * compatible with Drizzle ORM's `drizzle-orm/d1` adapter.
 */
function createMockD1(): D1Database {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec('PRAGMA foreign_keys = ON;');
  sqlite.exec(migrationSql);

  const normalizeRow = (row: Record<string, unknown> | undefined) => {
    if (!row) return null;
    return { ...row };
  };

  class MockPreparedStatement {
    private params: unknown[] = [];
    constructor(private readonly sql: string) {}

    bind(...values: unknown[]) {
      const next = new MockPreparedStatement(this.sql);
      next.params = values.map((v) => (v === undefined ? null : v));
      return next;
    }

    async all<T = Record<string, unknown>>() {
      const stmt = sqlite.prepare(this.sql);
      const rows = stmt.all(...(this.params as never[])) as Record<string, unknown>[];
      return {
        results: rows.map((r) => ({ ...r })) as T[],
        success: true,
        meta: {},
      };
    }

    async raw<T = unknown[]>() {
      const stmt = sqlite.prepare(this.sql) as unknown as {
        setReturnArrays?: (enabled: boolean) => void;
        all: (...args: never[]) => unknown[];
      };
      if (typeof stmt.setReturnArrays === 'function') {
        stmt.setReturnArrays(true);
        return stmt.all(...(this.params as never[])) as T[];
      }
      const rows = stmt.all(...(this.params as never[])) as Record<string, unknown>[];
      return rows.map((r) => Object.values(r)) as T[];
    }

    async first<T = Record<string, unknown>>(colName?: string) {
      const stmt = sqlite.prepare(this.sql);
      const row = normalizeRow(
        stmt.get(...(this.params as never[])) as Record<string, unknown> | undefined
      );
      if (!row) return null;
      if (colName) return (row[colName] ?? null) as T;
      return row as T;
    }

    async run() {
      const stmt = sqlite.prepare(this.sql);
      const info = stmt.run(...(this.params as never[]));
      return {
        results: [],
        success: true,
        meta: { changes: Number(info.changes ?? 0) },
      };
    }
  }

  return {
    prepare(sql: string) {
      return new MockPreparedStatement(sql);
    },
    async batch(stmts: MockPreparedStatement[]) {
      return Promise.all(stmts.map((s) => s.all()));
    },
    async exec(sql: string) {
      sqlite.exec(sql);
      return { count: 1, duration: 0 };
    },
  } as unknown as D1Database;
}

function createTestEnv(): CmsWorkerEnv {
  return {
    ENVIRONMENT: 'test',
    APP_ORIGIN: 'http://localhost:3000',
    ADMIN_LOGIN_EMAIL: 'owner@gptx.vip',
    ADMIN_ACCESS_KEY: 'super-secret-passkey-2026',
    SESSION_SECRET: 'test-session-secret-0123456789abcdef',
    DB: createMockD1(),
  };
}

function extractCookiePair(setCookieHeader: string | null): string {
  assert.ok(setCookieHeader, 'Expected Set-Cookie header');
  return setCookieHeader.split(';')[0];
}

test('Admin authentication enforces email + env passkey and issues HttpOnly session cookie', async () => {
  const app = createCmsApp();
  const env = createTestEnv();

  // Unauthenticated admin access must fail
  const blocked = await app.request('/api/admin/overview', {}, env);
  assert.equal(blocked.status, 401);

  // Wrong passkey rejected
  const badKey = await app.request(
    '/api/auth/admin-login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@gptx.vip', accessKey: 'wrong-key' }),
    },
    env
  );
  assert.equal(badKey.status, 401);

  // Wrong email rejected
  const badEmail = await app.request(
    '/api/auth/admin-login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'intruder@example.com',
        accessKey: 'super-secret-passkey-2026',
      }),
    },
    env
  );
  assert.equal(badEmail.status, 401);

  // Correct email + passkey succeeds
  const loginRes = await app.request(
    '/api/auth/admin-login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'OWNER@gptx.vip',
        accessKey: 'super-secret-passkey-2026',
      }),
    },
    env
  );
  assert.equal(loginRes.status, 200);
  const setCookie = loginRes.headers.get('set-cookie');
  assert.ok(setCookie?.includes('HttpOnly'));
  assert.ok(setCookie?.includes('SameSite=Lax'));
  const cookie = extractCookiePair(setCookie);

  // /api/auth/me recognizes session
  const meRes = await app.request(
    '/api/auth/me',
    { headers: { Cookie: cookie } },
    env
  );
  const meData = (await meRes.json()) as { authenticated: boolean; user?: { email: string } };
  assert.equal(meData.authenticated, true);
  assert.equal(meData.user?.email, 'owner@gptx.vip');

  // Logout invalidates session
  const logoutRes = await app.request(
    '/api/auth/logout',
    { method: 'POST', headers: { Cookie: cookie } },
    env
  );
  assert.equal(logoutRes.status, 200);

  const afterLogout = await app.request(
    '/api/admin/overview',
    { headers: { Cookie: cookie } },
    env
  );
  assert.equal(afterLogout.status, 401);
});

test('Blog CRUD isolates drafts from public /api/blog and sanitizes HTML', async () => {
  const app = createCmsApp();
  const env = createTestEnv();

  const loginRes = await app.request(
    '/api/auth/admin-login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@gptx.vip',
        accessKey: 'super-secret-passkey-2026',
      }),
    },
    env
  );
  const cookie = extractCookiePair(loginRes.headers.get('set-cookie'));

  // Create draft with unsafe script tag to confirm sanitization
  const createRes = await app.request(
    '/api/admin/blog',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({
        title: 'Multi-Agent Architecture at the Edge',
        subtitle: 'Building fast systems on Cloudflare Workers + D1',
        contentHtml:
          '<h2>Overview</h2><p>Edge compute works great.</p><script>alert(1)</script>',
        category: 'Architecture',
        tags: ['cloudflare', 'agents'],
        status: 'draft',
      }),
    },
    env
  );
  assert.equal(createRes.status, 201);
  const created = (await createRes.json()) as {
    article: { id: string; slug: string; contentHtml: string; status: string };
  };
  assert.equal(created.article.slug, 'multi-agent-architecture-at-the-edge');
  assert.equal(created.article.status, 'draft');
  assert.ok(!created.article.contentHtml.includes('<script>'));

  // Draft must NOT be visible on public /api/blog
  const pubBefore = await app.request('/api/blog', {}, env);
  const pubBeforeData = (await pubBefore.json()) as { articles: unknown[] };
  assert.equal(pubBeforeData.articles.length, 0);

  // Publish article
  const publishRes = await app.request(
    `/api/admin/blog/${created.article.id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ status: 'published', featured: true }),
    },
    env
  );
  assert.equal(publishRes.status, 200);

  // Now visible on public /api/blog and /api/blog/:slug
  const pubAfter = await app.request('/api/blog', {}, env);
  const pubAfterData = (await pubAfter.json()) as { articles: { slug: string }[] };
  assert.equal(pubAfterData.articles.length, 1);
  assert.equal(pubAfterData.articles[0].slug, 'multi-agent-architecture-at-the-edge');

  const singleRes = await app.request(
    '/api/blog/multi-agent-architecture-at-the-edge',
    {},
    env
  );
  assert.equal(singleRes.status, 200);
});

test('Contact form submission stores lead in D1 and is manageable & exportable in Admin', async () => {
  const app = createCmsApp();
  const env = createTestEnv();

  // Public visitor submits lead
  const submitRes = await app.request(
    '/api/leads',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Chen',
        email: 'sarah@enterprise.io',
        subject: 'Partnership/Business',
        message: 'We want to deploy custom AI agent workflows for our quant desk.',
        sourcePage: '/contact',
        sourceVariant: 'full',
      }),
    },
    env
  );
  assert.equal(submitRes.status, 201);
  const submitted = (await submitRes.json()) as { ok: boolean; id: string };
  assert.equal(submitted.ok, true);
  assert.ok(submitted.id);

  // Admin logs in and views lead
  const loginRes = await app.request(
    '/api/auth/admin-login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@gptx.vip',
        accessKey: 'super-secret-passkey-2026',
      }),
    },
    env
  );
  const cookie = extractCookiePair(loginRes.headers.get('set-cookie'));

  const listRes = await app.request(
    '/api/admin/leads',
    { headers: { Cookie: cookie } },
    env
  );
  const listData = (await listRes.json()) as {
    leads: { id: string; email: string; status: string; priority: string }[];
    summary: { newCount: number };
  };
  assert.equal(listData.leads.length, 1);
  assert.equal(listData.leads[0].email, 'sarah@enterprise.io');
  assert.equal(listData.leads[0].status, 'new');
  assert.equal(listData.leads[0].priority, 'high');
  assert.equal(listData.summary.newCount, 1);

  // Admin updates lead pipeline status + internal notes
  const patchRes = await app.request(
    `/api/admin/leads/${submitted.id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({
        status: 'qualified',
        priority: 'urgent',
        adminNotes: 'Scheduled discovery call for Thursday.',
      }),
    },
    env
  );
  assert.equal(patchRes.status, 200);
  const patched = (await patchRes.json()) as {
    lead: { status: string; priority: string; adminNotes: string; contactedAt: string | null };
  };
  assert.equal(patched.lead.status, 'qualified');
  assert.equal(patched.lead.priority, 'urgent');
  assert.equal(patched.lead.adminNotes, 'Scheduled discovery call for Thursday.');
  assert.ok(patched.lead.contactedAt);

  // CSV export returns lead row
  const csvRes = await app.request(
    '/api/admin/leads/export',
    { headers: { Cookie: cookie } },
    env
  );
  assert.equal(csvRes.status, 200);
  const csvText = await csvRes.text();
  assert.ok(csvText.includes('sarah@enterprise.io'));
  assert.ok(csvText.includes('Scheduled discovery call'));
});
