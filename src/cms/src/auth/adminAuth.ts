import { Hono, type MiddlewareHandler } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { and, eq, gt, lt } from 'drizzle-orm';
import type { CmsWorkerEnv, CmsWorkerVariables } from '../env';
import { adminAuditLogs, adminSessions, adminUsers } from '../db/schema';
import type { AdminSessionUser } from '../../../shared/cmsContracts';
import {
  constantTimeEqual,
  parseCookieHeader,
  randomToken,
  serializeCookie,
  sha256Base64Url,
} from './cryptoUtils';

export const ADMIN_SESSION_COOKIE_NAME = 'gptxvip_admin_sid';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function isHttpsOrigin(requestUrl: string, appOrigin?: string): boolean {
  return (appOrigin?.trim() || requestUrl).startsWith('https://');
}

export function getAllowedAdminEmails(env: CmsWorkerEnv): Set<string> {
  const allowed = new Set<string>();
  const rawList = [env.ADMIN_LOGIN_EMAIL ?? '', env.ADMIN_BOOTSTRAP_EMAILS ?? '']
    .join(',')
    .split(',');
  for (const item of rawList) {
    const cleaned = item.trim().toLowerCase();
    if (cleaned) allowed.add(cleaned);
  }
  return allowed;
}

/**
 * Attaches the authenticated admin user (from same-origin HttpOnly cookie)
 * to `c.get('user')`, or `null` when unauthenticated.
 */
export const attachAdminSession: MiddlewareHandler<{
  Bindings: CmsWorkerEnv;
  Variables: CmsWorkerVariables;
}> = async (c, next) => {
  c.set('user', null);
  c.set('sessionId', null);

  if (!c.env?.DB) {
    await next();
    return;
  }

  const cookies = parseCookieHeader(c.req.header('cookie'));
  const rawToken = cookies[ADMIN_SESSION_COOKIE_NAME];
  if (!rawToken) {
    await next();
    return;
  }

  try {
    const tokenHash = await sha256Base64Url(rawToken);
    const db = drizzle(c.env.DB);
    const nowIso = new Date().toISOString();

    const rows = await db
      .select({
        sessionId: adminSessions.id,
        userId: adminUsers.id,
        email: adminUsers.email,
        displayName: adminUsers.displayName,
        role: adminUsers.role,
        lastLoginAt: adminUsers.lastLoginAt,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
      .where(
        and(
          eq(adminSessions.tokenHash, tokenHash),
          gt(adminSessions.expiresAt, nowIso)
        )
      )
      .limit(1);

    const match = rows[0];
    if (match && match.role === 'admin') {
      const user: AdminSessionUser = {
        id: match.userId,
        email: match.email,
        displayName: match.displayName,
        role: 'admin',
        lastLoginAt: match.lastLoginAt,
      };
      c.set('user', user);
      c.set('sessionId', match.sessionId);
    }
  } catch (err) {
    console.error('Admin session lookup failed:', err);
  }

  await next();
};

export const requireAdmin: MiddlewareHandler<{
  Bindings: CmsWorkerEnv;
  Variables: CmsWorkerVariables;
}> = async (c, next) => {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    return c.json(
      { ok: false, error: 'Admin authentication required.' },
      401
    );
  }
  await next();
};

export function createAdminAuthRoutes() {
  const auth = new Hono<{
    Bindings: CmsWorkerEnv;
    Variables: CmsWorkerVariables;
  }>();

  auth.get('/me', (c) => {
    c.header('Cache-Control', 'no-store');
    const user = c.get('user');
    return c.json({
      authenticated: Boolean(user),
      user,
    });
  });

  auth.post('/admin-login', async (c) => {
    c.header('Cache-Control', 'no-store');

    const configuredKey = (c.env?.ADMIN_ACCESS_KEY ?? '').trim();
    const allowedEmails = getAllowedAdminEmails(c.env ?? ({} as CmsWorkerEnv));

    if (!configuredKey || allowedEmails.size === 0 || !c.env?.DB) {
      return c.json(
        {
          ok: false,
          error:
            'Admin authentication is not configured yet. Set ADMIN_LOGIN_EMAIL and ADMIN_ACCESS_KEY in Cloudflare Worker secrets (or src/cms/.dev.vars locally) and bind D1.',
        },
        503
      );
    }

    const body = (await c.req.json().catch(() => null)) as {
      email?: unknown;
      accessKey?: unknown;
    } | null;

    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const accessKey =
      typeof body?.accessKey === 'string' ? body.accessKey : '';

    const emailAllowed = email.length > 0 && allowedEmails.has(email);
    const keyValid =
      accessKey.length > 0 &&
      (await constantTimeEqual(accessKey, configuredKey));

    if (!emailAllowed || !keyValid) {
      return c.json(
        { ok: false, error: 'Invalid admin email or passkey.' },
        401
      );
    }

    const db = drizzle(c.env.DB);
    const nowIso = new Date().toISOString();

    // Opportunistically clean expired sessions
    await db
      .delete(adminSessions)
      .where(lt(adminSessions.expiresAt, nowIso))
      .catch(() => {});

    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    let userId: string;
    let displayName = email.split('@')[0] || 'Admin';

    if (existing[0]) {
      userId = existing[0].id;
      displayName = existing[0].displayName;
      await db
        .update(adminUsers)
        .set({ role: 'admin', lastLoginAt: nowIso })
        .where(eq(adminUsers.id, userId));
    } else {
      userId = crypto.randomUUID();
      await db.insert(adminUsers).values({
        id: userId,
        email,
        displayName,
        role: 'admin',
        createdAt: nowIso,
        lastLoginAt: nowIso,
      });
    }

    const rawSessionToken = randomToken(32);
    const tokenHash = await sha256Base64Url(rawSessionToken);
    const expiresAt = new Date(
      Date.now() + SESSION_TTL_SECONDS * 1000
    ).toISOString();

    await db.insert(adminSessions).values({
      id: crypto.randomUUID(),
      userId,
      tokenHash,
      expiresAt,
      createdAt: nowIso,
    });

    await db
      .insert(adminAuditLogs)
      .values({
        id: crypto.randomUUID(),
        adminEmail: email,
        action: 'admin.login',
        resourceType: 'session',
        resourceId: userId,
        detailsJson: JSON.stringify({ method: 'email_passkey' }),
        createdAt: nowIso,
      })
      .catch(() => {});

    const secure = isHttpsOrigin(c.req.url, c.env.APP_ORIGIN);
    c.header(
      'Set-Cookie',
      serializeCookie(ADMIN_SESSION_COOKIE_NAME, rawSessionToken, {
        httpOnly: true,
        secure,
        sameSite: 'Lax',
        path: '/',
        maxAgeSeconds: SESSION_TTL_SECONDS,
      })
    );

    const sessionUser: AdminSessionUser = {
      id: userId,
      email,
      displayName,
      role: 'admin',
      lastLoginAt: nowIso,
    };

    return c.json({ ok: true, user: sessionUser });
  });

  auth.post('/logout', async (c) => {
    c.header('Cache-Control', 'no-store');
    const sessionId = c.get('sessionId');
    const user = c.get('user');
    if (sessionId && c.env?.DB) {
      const db = drizzle(c.env.DB);
      await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
      if (user) {
        await db
          .insert(adminAuditLogs)
          .values({
            id: crypto.randomUUID(),
            adminEmail: user.email,
            action: 'admin.logout',
            resourceType: 'session',
            resourceId: sessionId,
            detailsJson: '{}',
            createdAt: new Date().toISOString(),
          })
          .catch(() => {});
      }
    }

    const secure = isHttpsOrigin(c.req.url, c.env?.APP_ORIGIN);
    c.header(
      'Set-Cookie',
      serializeCookie(ADMIN_SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure,
        sameSite: 'Lax',
        path: '/',
        maxAgeSeconds: 0,
      })
    );
    return c.json({ ok: true });
  });

  return auth;
}
