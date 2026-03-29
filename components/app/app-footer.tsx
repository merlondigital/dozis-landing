import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-dozis-navy-deep py-6 px-4 mt-auto">
      <div className="container mx-auto flex flex-col items-center gap-2">
        <div className="flex items-center">
          <Link
            href="/legal/privacy"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Adatvedelmi Tajekoztato
          </Link>
          <span className="mx-2 text-zinc-700">|</span>
          <Link
            href="/legal/cookies"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Cookie Szabalyzat
          </Link>
          <span className="mx-2 text-zinc-700">|</span>
          <Link
            href="/legal/terms"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ASZF
          </Link>
        </div>
        <span className="text-[0.65rem] text-zinc-600 mt-2">
          DOZIS. Elektronikus Zenei Esemenyek
        </span>
      </div>
    </footer>
  );
}
