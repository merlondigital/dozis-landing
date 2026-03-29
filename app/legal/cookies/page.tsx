import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie (Süti) Szabályzat | DÓZIS.",
  description: "A DÓZIS. esemény alkalmazás cookie (süti) szabályzata.",
};

export default function CookiePolicyPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl text-dozis-amber uppercase tracking-wider mb-8">
        Cookie (Süti) Szabályzat
      </h1>

      <p className="text-zinc-400 text-sm mb-8">
        Hatályos: 2026. március 29.
      </p>

      {/* 1. Mik azok a sütik? */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          1. Mik azok a sütik?
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A sütik (cookie-k) kis szöveges fájlok, amelyeket a böngésző tárol
          az Ön eszközén, amikor meglátogat egy webhelyet. A sütik segítik a
          webhely működését, például megjegyzik a bejelentkezési
          állapotát.
        </p>
      </section>

      {/* 2. Az általunk használt sütik */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          2. Az általunk használt sütik
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alkalmazásunk kizárólag a működéséhez elengedhetetlenül
          szükséges sütiket használja. Nem használunk marketing, analytics
          vagy reklámcélokat szolgáló sütiket.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Süti neve
                </th>
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Típusa
                </th>
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Célja
                </th>
                <th className="py-2 text-zinc-200 font-semibold">Lejárat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4 font-mono text-xs text-dozis-amber">
                  better-auth.session_token
                </td>
                <td className="py-2 pr-4">Elengedhetetlen</td>
                <td className="py-2 pr-4">
                  Munkamenet süti — a bejelentkezési állapot fenntartása
                </td>
                <td className="py-2">Munkamenet vége</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Harmadik féles sütik */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          3. Harmadik féles sütik
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A Cloudflare tárhelyszolgáltató biztonsági célból saját sütiket
          helyezhet el:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Süti neve
                </th>
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Szolgáltató
                </th>
                <th className="py-2 text-zinc-200 font-semibold">Célja</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4 font-mono text-xs text-dozis-amber">
                  __cf_bm
                </td>
                <td className="py-2 pr-4">Cloudflare</td>
                <td className="py-2">
                  Bot-védelem és biztonsági ellenőrzés
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Sütik kezelése */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          4. Sütik kezelése
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A böngésző beállításaiban lehetősége van a sütik törlésére és
          letiltására. Fontos azonban, hogy az elengedhetetlen sütik
          letiltása esetén az alkalmazás nem fog megfelelően működni (pl.
          nem fog tudni bejelentkezni).
        </p>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A sütik kezelése a következő böngészőkben:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Chrome:</strong> Beállítások
            &rarr; Adatvédelem és biztonság &rarr; Cookie-k
          </li>
          <li>
            <strong className="text-zinc-200">Firefox:</strong> Beállítások
            &rarr; Adatvédelem és biztonság &rarr; Cookie-k és weboldalak
            adatai
          </li>
          <li>
            <strong className="text-zinc-200">Safari:</strong> Beállítások
            &rarr; Adatvédelem &rarr; Cookie-k kezelése
          </li>
          <li>
            <strong className="text-zinc-200">Edge:</strong> Beállítások
            &rarr; Cookie-k és webhelyengedélyek
          </li>
        </ul>
      </section>

      {/* 5. Cookie banner */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          5. Miért nincs cookie banner?
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Alkalmazásunk kizárólag a működéséhez elengedhetetlenül szükséges
          (strictly necessary) sütiket használja. Az Európai Unió ePrivacy
          irányelv 5. cikk (3) bekezdésének kivételének megfelelően, a
          kizárólag technikai célból szükséges sütik tárolása nem igényli a
          felhasználó előzetes hozzájárulását, így cookie banner
          megjelenítés sem szükséges.
        </p>
      </section>
    </article>
  );
}
