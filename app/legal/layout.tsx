import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dozis-navy-deep flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-dozis-navy">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-2xl text-dozis-amber tracking-wider"
          >
            DOZIS.
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Vissza a főlapra
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Footer with cross-links to other legal pages */}
      <footer className="border-t border-zinc-800 bg-dozis-navy py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link
            href="/legal/privacy"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Adatvédelmi Tájékoztató
          </Link>
          <span className="text-zinc-700">|</span>
          <Link
            href="/legal/cookies"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Cookie Szabalyzat
          </Link>
          <span className="text-zinc-700">|</span>
          <Link
            href="/legal/terms"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ASZF
          </Link>
        </div>
      </footer>
    </div>
  );
}
