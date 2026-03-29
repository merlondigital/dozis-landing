"use client";

import { AppHeader } from "./app-header";

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
    <div className="min-h-screen bg-dozis-navy-deep">
      <AppHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
