import type { AdminSessionUser } from '../../shared/cmsContracts';

export interface CmsWorkerEnv {
  APP_ORIGIN?: string;
  ENVIRONMENT?: string;
  ADMIN_LOGIN_EMAIL?: string;
  ADMIN_BOOTSTRAP_EMAILS?: string;
  ADMIN_ACCESS_KEY?: string;
  SESSION_SECRET?: string;
  WEB3FORMS_ACCESS_KEY?: string;
  DB: D1Database;
  BUCKET?: R2Bucket;
  ASSETS?: Fetcher;
}

export interface CmsWorkerVariables {
  user: AdminSessionUser | null;
  sessionId: string | null;
}
