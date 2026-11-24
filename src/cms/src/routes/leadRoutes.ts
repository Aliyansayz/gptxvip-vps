import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';
import type { CmsWorkerEnv, CmsWorkerVariables } from '../env';
import { contactLeads } from '../db/schema';
import { sha256Base64Url } from '../auth/cryptoUtils';

const createLeadSchema = z.object({
  name: z.string().trim().max(160).optional(),
  email: z.string().trim().email('Please provide a valid email address.').max(254),
  subject: z.string().trim().max(240).optional(),
  message: z.string().trim().max(4000).optional(),
  industry: z.string().trim().max(160).nullable().optional(),
  sourcePage: z.string().trim().max(300).nullable().optional(),
  sourceVariant: z.string().trim().max(60).optional(),
  referrer: z.string().trim().max(500).nullable().optional(),
  company: z.string().optional(), // honeypot
});

export function createPublicLeadRoutes() {
  const leads = new Hono<{
    Bindings: CmsWorkerEnv;
    Variables: CmsWorkerVariables;
  }>();

  leads.post('/', async (c) => {
    c.header('Cache-Control', 'no-store');

    const rawBody = await c.req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== 'object') {
      return c.json({ ok: false, error: 'Invalid JSON submission.' }, 400);
    }

    const parsed = createLeadSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid lead submission.';
      return c.json({ ok: false, error: firstIssue }, 400);
    }

    const data = parsed.data;

    // Silent honeypot drop for bots
    if (data.company && data.company.trim().length > 0) {
      return c.json({ ok: true, id: 'accepted', ignored: true });
    }

    if (!c.env?.DB) {
      return c.json({ ok: false, error: 'Lead database is not bound on this Worker.' }, 503);
    }

    const nowIso = new Date().toISOString();
    const id = crypto.randomUUID();
    const clientIp =
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for') ??
      '';
    const ipHash = clientIp ? await sha256Base64Url(clientIp) : null;
    const userAgent = (c.req.header('user-agent') ?? '').slice(0, 300) || null;

    const normalizedName =
      data.name && data.name.length > 0
        ? data.name
        : data.sourceVariant === 'lead-magnet'
          ? 'Whitepaper Request'
          : 'Website Visitor';
    const normalizedSubject =
      data.subject && data.subject.length > 0
        ? data.subject
        : data.sourceVariant === 'lead-magnet'
          ? 'Whitepaper Download Request'
          : 'General Inquiry';

    const autoPriority =
      data.subject?.toLowerCase().includes('partnership') ||
      data.sourceVariant === 'lead-magnet'
        ? 'high'
        : 'medium';

    const db = drizzle(c.env.DB);
    await db.insert(contactLeads).values({
      id,
      name: normalizedName,
      email: data.email.toLowerCase(),
      subject: normalizedSubject,
      message: data.message ?? '',
      industry: data.industry ?? null,
      sourcePage: data.sourcePage ?? null,
      sourceVariant: data.sourceVariant ?? 'full',
      referrer: data.referrer ?? null,
      status: 'new',
      priority: autoPriority,
      adminNotes: '',
      ipHash,
      userAgent,
      createdAt: nowIso,
      updatedAt: nowIso,
      contactedAt: null,
    });

    // Optional server-side email forwarding via Web3Forms if configured in Worker secrets
    const web3FormsKey = c.env.WEB3FORMS_ACCESS_KEY?.trim();
    if (web3FormsKey) {
      const forwardTask = fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3FormsKey,
          from_name: normalizedName,
          email: data.email,
          subject: `[GPTX.VIP Lead] ${normalizedSubject}`,
          message: [
            data.message || '(No message body)',
            data.industry ? `Industry: ${data.industry}` : '',
            data.sourcePage ? `Source Page: ${data.sourcePage}` : '',
            `Lead ID: ${id}`,
          ]
            .filter(Boolean)
            .join('\n\n'),
        }),
      }).catch(() => {});
      c.executionCtx?.waitUntil(forwardTask);
    }

    return c.json(
      {
        ok: true,
        id,
        message: 'Thanks — your message has been received. We usually reply within a day.',
      },
      201
    );
  });

  return leads;
}
