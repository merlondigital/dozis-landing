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

// Email OTP: send OTP
export const { sendVerificationOtp } = authClient.emailOtp;

// Email OTP: sign in with OTP (uses /sign-in/email-otp endpoint)
export const signInWithOtp = authClient.signIn.emailOtp;
