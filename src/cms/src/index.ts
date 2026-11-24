import { Hono } from 'hono';
import type { CmsWorkerEnv, CmsWorkerVariables } from './env';
import { attachAdminSession, createAdminAuthRoutes } from './auth/adminAuth';
import { createPublicBlogRoutes } from './routes/blogRoutes';
import { createPublicLeadRoutes } from './routes/leadRoutes';
import { createAdminRoutes } from './routes/adminRoutes';
import { createMediaRoutes } from './routes/mediaRoutes';

export function createCmsApp() {
  const app = new Hono<{
    Bindings: CmsWorkerEnv;
    Variables: CmsWorkerVariables;
  }>();

  app.use('/api/*', async (c, next) => {
    await next();
    c.header('X-Robots-Tag', 'noindex, nofollow');
  });

  app.use('/api/*', attachAdminSession);

  app.get('/api/health', (c) => {
    return c.json({
      ok: true,
      service: 'gptxvip-vps',
      environment: c.env?.ENVIRONMENT ?? 'development',
      hasD1: Boolean(c.env?.DB),
      hasR2: Boolean(c.env?.BUCKET),
      adminAuthConfigured: Boolean(
        c.env?.ADMIN_ACCESS_KEY?.trim() &&
          (c.env?.ADMIN_LOGIN_EMAIL?.trim() || c.env?.ADMIN_BOOTSTRAP_EMAILS?.trim())
      ),
      timestamp: new Date().toISOString(),
    });
  });

  app.route('/api/auth', createAdminAuthRoutes());
  app.route('/api/blog', createPublicBlogRoutes());
  app.route('/api/leads', createPublicLeadRoutes());
  app.route('/api/admin', createAdminRoutes());
  app.route('/media', createMediaRoutes());

  // Fall back to Cloudflare Workers Static Assets for any unmatched route (SPA + static JSON)
  app.all('*', async (c) => {
    if (c.env?.ASSETS) {
      return c.env.ASSETS.fetch(c.req.raw);
    }
    return c.json({ ok: false, error: 'Not found' }, 404);
  });

  return app;
}

const app = createCmsApp();
export default app;
