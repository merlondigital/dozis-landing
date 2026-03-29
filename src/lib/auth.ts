import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins/email-otp";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/src/db";
import { user as userTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { sendOtpEmail } from "./email";
import "@/src/env"; // augment global CloudflareEnv

function parseAdminEmails(raw: string | undefined): string[] {
  return (raw || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function createAuth(env: CloudflareEnv) {
  const db = getDb(env.DB);
  const adminEmails = parseAdminEmails(env.ADMIN_EMAILS);

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
    databaseHooks: {
      user: {
        create: {
          before: async (userData) => {
            // Assign admin role on first sign-up if email is in ADMIN_EMAILS
            if (adminEmails.includes(userData.email.toLowerCase())) {
              return {
                data: {
                  ...userData,
                  role: "admin",
                },
              };
            }
          },
        },
      },
      session: {
        create: {
          after: async (sessionData) => {
            // Sync admin role for existing users on every sign-in
            // This handles: (1) users created before the hook existed,
            // (2) emails added to/removed from ADMIN_EMAILS
            const userId = sessionData.userId;
            try {
              const rows = await db
                .select({ email: userTable.email, role: userTable.role })
                .from(userTable)
                .where(eq(userTable.id, userId))
                .limit(1);
              const row = rows[0];
              if (!row) return;

              const shouldBeAdmin = adminEmails.includes(row.email.toLowerCase());
              const currentRole = row.role || "user";
              const targetRole = shouldBeAdmin ? "admin" : "user";

              if (currentRole !== targetRole) {
                await db
                  .update(userTable)
                  .set({ role: targetRole, updatedAt: new Date() })
                  .where(eq(userTable.id, userId));
              }
            } catch (err) {
              console.error("[auth] Failed to sync admin role on sign-in:", err);
            }
          },
        },
      },
    },
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
