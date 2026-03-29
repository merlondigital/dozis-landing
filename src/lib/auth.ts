import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins/email-otp";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/src/db";
import { sendOtpEmail } from "./email";
import "@/src/env"; // augment global CloudflareEnv

export function createAuth(env: CloudflareEnv) {
  const db = getDb(env.DB);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
      enabled: false, // OTP only, no passwords
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days (D-16)
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 min cache
      },
    },
    // Global rate limit (per-IP, default for all endpoints)
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 300, // 5 minutes (D-17)
        allowedAttempts: 5, // AUTH-02: max 5 verification attempts per OTP
        // AUTH-02: rate limit OTP send requests — max 5 per 15-minute window per email
        rateLimit: {
          window: 60 * 15, // 15 minutes
          max: 5,
        },
        sendVerificationOTP: async ({ email, otp }) => {
          // Debug: save plain OTP to D1 for testing (remove in production)
          try {
            await env.DB.prepare(
              "INSERT INTO otp_debug (email, otp, created_at) VALUES (?, ?, ?)"
            ).bind(email, otp, new Date().toISOString()).run();
          } catch {
            // table might not exist yet, ignore
            console.log(`[OTP DEBUG] ${email}: ${otp}`);
          }

          await sendOtpEmail({
            email,
            otp,
            resendApiKey: env.RESEND_API_KEY,
          });
        },
      }),
      nextCookies(), // proper cookie handling in Next.js
    ],
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false, // cannot be set by client
        },
        lastName: {
          type: "string",
          required: false,
        },
        firstName: {
          type: "string",
          required: false,
        },
        birthYear: {
          type: "number",
          required: false,
        },
        address: {
          type: "string",
          required: false,
        },
        profileCompleted: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
