// Augment the global CloudflareEnv interface from @opennextjs/cloudflare
// with DOZIS-specific bindings

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    RESEND_API_KEY: string;
    ADMIN_EMAILS: string; // comma-separated list of admin email addresses
  }
}

export {};
