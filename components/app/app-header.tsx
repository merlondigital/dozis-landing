"use client";

import { signOut } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-zinc-800 bg-dozis-navy">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/app" className="font-heading text-2xl text-dozis-amber tracking-wider">
          DOZIS.
        </a>
        <div className="flex items-center gap-2">
          {user.role === "admin" && (
            <a
              href="/app/admin"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-sm font-body text-dozis-blue-light hover:text-white transition-colors"
            >
              Admin
            </a>
          )}
          <span className="hidden md:inline text-sm font-body text-zinc-400">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-sm font-body text-zinc-500 hover:text-white transition-colors"
          >
            Kilépés
          </button>
        </div>
      </div>
    </header>
  );
}
