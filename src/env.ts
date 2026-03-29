// Augment the global CloudflareEnv interface from @opennextjs/cloudflare
// with DOZIS-specific bindings

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    RESEND_API_KEY: string;
    ADMIN_EMAILS: string; // comma-separated list of admin email addresses
    // Apple Wallet PKPass signing (base64-encoded PEM)
    APPLE_PASS_SIGNERKEY?: string;
    APPLE_PASS_SIGNERCERT?: string;
    APPLE_PASS_WWDR?: string;
    APPLE_PASS_TYPE_ID?: string;
    APPLE_TEAM_ID?: string;
  }
}

export {};
