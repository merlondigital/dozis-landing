"use client";

import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";

interface AppShellProps {
  user: {
    name: string;
    email: string;
    role?: string;
    profileCompleted?: boolean;
  };
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-dozis-navy-deep flex flex-col relative">
      {/* Subtle ambient gradient background echoing the landing page palette */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0, 85, 170, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 90% 80%, rgba(179, 102, 0, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0, 136, 255, 0.04) 0%, transparent 60%)
          `,
        }}
      />
      <AppHeader user={user} />
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 relative z-10">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
