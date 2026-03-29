import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie (Suti) Szabalyzat | DOZIS.",
  description: "A DOZIS. esemeny alkalmazas cookie (suti) szabalyzata.",
};

export default function CookiePolicyPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl text-dozis-amber uppercase tracking-wider mb-8">
        Cookie (Suti) Szabalyzat
      </h1>

      <p className="text-zinc-400 text-sm mb-8">
        Hatalyos: 2026. marcius 29.
      </p>

      {/* 1. Mik azok a sutik? */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          1. Mik azok a sutik?
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A sutik (cookie-k) kis szoveges fajlok, amelyeket a bongeszo tarol
          az On eszkozen, amikor meglategat egy webhelyet. A sutik segitik a
          webhely mukodeset, peldaul megjegyzik a bejelentkezesi
          allapotat.
        </p>
      </section>

      {/* 2. Altalunk hasznalt sutik */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          2. Az altalunk hasznalt sutik
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alkalmazasunk kizarolag a mukodeseshez elengedhetetlenul
          szukseges sutiket hasznalja. Nem hasznalunk marketing, analytics
          vagy reklamcelokat szolgalo sutiket.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Suti neve
                </th>
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Tipusa
                </th>
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Celja
                </th>
                <th className="py-2 text-zinc-200 font-semibold">Lejarat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4 font-mono text-xs text-dozis-amber">
                  better-auth.session_token
                </td>
                <td className="py-2 pr-4">Elengedhetetlen</td>
                <td className="py-2 pr-4">
                  Munkamenet suti — a bejelentkezesi allapot fenntartasa
                </td>
                <td className="py-2">Munkamenet vege</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Harmadik feles sutik */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          3. Harmadik feles sutik
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A Cloudflare tarhelyszolgaltato biztonsagi celbol sajat sutiket
          helyezhet el:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Suti neve
                </th>
                <th className="py-2 pr-4 text-zinc-200 font-semibold">
                  Szolgaltato
                </th>
                <th className="py-2 text-zinc-200 font-semibold">Celja</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4 font-mono text-xs text-dozis-amber">
                  __cf_bm
                </td>
                <td className="py-2 pr-4">Cloudflare</td>
                <td className="py-2">
                  Bot-vedelem es biztonsagi ellenorzes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Sutik kezelese */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          4. Sutik kezelese
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A bongeszo beallitasaiban lehetosege van a sutik torleszere es
          letiltasara. Fontos azonban, hogy az elengedhetetlen sutik
          letiltasa eseten az alkalmazas nem fog megfeleloen mukodni (pl.
          nem fog tudni bejelentkezni).
        </p>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A sutik kezelese a kovetkezo bongeszokben:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Chrome:</strong> Beallitasok
            &rarr; Adatvedelem es biztonsag &rarr; Cookie-k
          </li>
          <li>
            <strong className="text-zinc-200">Firefox:</strong> Beallitasok
            &rarr; Adatvedelem es biztonsag &rarr; Cookie-k es weboldalak
            adatai
          </li>
          <li>
            <strong className="text-zinc-200">Safari:</strong> Beallitasok
            &rarr; Adatvedelem &rarr; Cookie-k kezelese
          </li>
          <li>
            <strong className="text-zinc-200">Edge:</strong> Beallitasok
            &rarr; Cookie-k es webhelyengedlyek
          </li>
        </ul>
      </section>

      {/* 5. Cookie banner */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          5. Miert nincs cookie banner?
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Alkalmazasunk kizarolag a mukodeseshez elengedhetetlenul szukseges
          (strictly necessary) sutiket hasznalja. Az Europai Unio ePrivacy
          iranyelv 5. cikk (3) bekezdesenek kivelenek megfeleloen, a
          kizarolag technikai celbol szukseges sutik tarolasa nem igenyli a
          felhasznalo elozetetes hozzajarulasat, igy cookie banner
          megjelenites sem szukseges.
        </p>
      </section>
    </article>
  );
}
