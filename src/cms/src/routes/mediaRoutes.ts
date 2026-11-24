import { Hono } from 'hono';
import type { CmsWorkerEnv, CmsWorkerVariables } from '../env';

/**
 * Serves R2 objects on the same origin (`/media/*`) with immutable caching.
 */
export function createMediaRoutes() {
  const media = new Hono<{
    Bindings: CmsWorkerEnv;
    Variables: CmsWorkerVariables;
  }>();

  media.get('/*', async (c) => {
    const key = c.req.path.replace(/^\/media\/+/, '');
    if (!key) {
      return c.json({ ok: false, error: 'Media key required' }, 400);
    }

    if (c.env.BUCKET) {
      const obj = await c.env.BUCKET.get(key);
      if (obj) {
        const headers = new Headers();
        obj.writeHttpMetadata(headers);
        headers.set('etag', obj.httpEtag);
        headers.set('cache-control', 'public, max-age=31536000, immutable');
        return new Response(obj.body, { headers });
      }
    }

    if (c.env.ASSETS) {
      const url = new URL(c.req.url);
      url.pathname = `/${key}`;
      return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
    }

    return c.json({ ok: false, error: 'Media object not found' }, 404);
  });

  return media;
}
