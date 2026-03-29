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
    <div className="min-h-screen bg-dozis-navy-deep flex flex-col">
      <AppHeader user={user} />
      <main className="flex-1 container mx-auto px-4 py-8 pb-24">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
