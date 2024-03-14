export interface Env {
  DB: D1Database;
  SESSION_KV: KVNamespace;
  SESSION_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  ADMIN_PAGE_BASIC_AUTH_USER: string;
  ADMIN_PAGE_BASIC_AUTH_PASS: string;
}
