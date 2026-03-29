"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  plugins: [emailOTPClient()],
});

// Re-export commonly used methods
export const { signOut, useSession } = authClient;

// Email OTP specific methods
export const { sendVerificationOtp, verifyEmail } = authClient.emailOtp;
