import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adatvedelmi Tajekoztato | DOZIS.",
  description: "A DOZIS. esemeny alkalmazas adatvedelmi tajekoztatoja.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl text-dozis-amber uppercase tracking-wider mb-8">
        Adatvedelmi Tajekoztato
      </h1>

      <p className="text-zinc-400 text-sm mb-8">
        Hatalyos: 2026. marcius 29.
      </p>

      {/* 1. Adatkezelo */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          1. Adatkezelo
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az adatkezelo termeszetes szemely, aki a DOZIS. esemeny alkalmazas
          uzemelteteset es az ezzel kapcsolatos szemelyesadat-kezelest vegzi
          (a tovabbiakban: &quot;Adatkezelo&quot;).
        </p>
        <div className="text-zinc-300 leading-relaxed mb-4 space-y-1">
          <p>
            <strong className="text-zinc-200">Nev:</strong> Polomai Zoltan
          </p>
          <p>
            <strong className="text-zinc-200">E-mail:</strong>{" "}
            <a
              href="mailto:dozisdozis0@gmail.com"
              className="text-dozis-amber hover:text-dozis-amber-light underline"
            >
              dozisdozis0@gmail.com
            </a>
          </p>
          <p>
            <strong className="text-zinc-200">Lakcim:</strong> 1000 Budapest
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az Adatkezelo nem minosul jogi szemelynek (vallalkozasnak), hanem
          termeszetes szemelykent jelen tajekoztatoban foglaltak szerint kezeli
          az alkalmazas felhasznaloianak szemelyes adatait, az Europai
          Parlament es a Tanacs (EU) 2016/679 rendelete (GDPR) es az
          informacios onrendelkezesi jogrol es az informacioszabadsagrol szolo
          2011. evi CXII. torveny (Infotv.) eloirasainak megfeleloen.
        </p>
      </section>

      {/* 2. Kezelt adatok */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          2. Kezelt adatok
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alkalmazas hasznalata soran az alabbi szemelyes adatokat kezeljuk:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>E-mail cim</li>
          <li>Vezeteknev</li>
          <li>Keresztnev</li>
          <li>Szuletesi ev</li>
          <li>Lakcim</li>
          <li>Esemeny latogatasi elozmeny (reszveteli tortenet)</li>
        </ul>
      </section>

      {/* 3. Adatkezeles celja */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          3. Az adatkezeles celja
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A szemelyes adatok kezelese az alabbi celokbol tortenik:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Esemeny regisztracio:</strong>{" "}
            A felhasznalo esemenyre valo regisztraciojanak kezelese es
            nyilvantartasa.
          </li>
          <li>
            <strong className="text-zinc-200">
              Becsekkolasi azonositas:
            </strong>{" "}
            QR kod alapu jelenletigazolas az esemenyen.
          </li>
          <li>
            <strong className="text-zinc-200">Husegprogram:</strong> Az 5.
            alkalommal ingyenes belepes biztositasa erdekeben a latogatasi
            szam nyomon kovetese.
          </li>
        </ul>
      </section>

      {/* 4. Adatkezeles jogalapja */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          4. Az adatkezeles jogalapja
        </h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">
              GDPR 6. cikk (1) bekezdes a) pont — Hozzajarulas:
            </strong>{" "}
            A felhasznalo onkentesen regisztral az alkalmazasban es megadja
            szemelyes adatait.
          </li>
          <li>
            <strong className="text-zinc-200">
              GDPR 6. cikk (1) bekezdes b) pont — Szerzodeses jogalap:
            </strong>{" "}
            Az adatkezeles az esemeny regisztraciohoz kapcsolodo szolgaltatas
            teljesitesehez szukseges.
          </li>
        </ul>
      </section>

      {/* 5. Adatok megorzese */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          5. Az adatok megorzesi ideje
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A szemelyes adatokat addig orizzzuk meg, amig a felhasznaloi fiok
          letezik. A felhasznalo barmikor kerelmezheti adatainak torleset,
          amelyet indokolatlan keslekedes nelkul, legkesobb 30 napon belul
          teljesitunk.
        </p>
      </section>

      {/* 6. Harmadik felek */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          6. Adatfeldolgozok es harmadik felek
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alabbi harmadik feleket vesszuk igenybe a szolgaltatas
          mukodtetesehez:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Resend</strong> —
            Tranzakcios e-mail kuldes (OTP kodok, ertesitesek). A Resend
            kizarolag az e-mail cimeket kezeli a kuldes celjara.
          </li>
          <li>
            <strong className="text-zinc-200">Cloudflare</strong> —
            Tarhelyszolgaltatas, CDN es adatbazis-szolgaltatas (D1). Az
            adatok az Europai Unio teruleten belul kerulnek feldolgozasra.
          </li>
        </ul>
      </section>

      {/* 7. Felhasznaloi jogok */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          7. Az On jogai
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A GDPR alapjan On az alabbi jogokkal rendelkezik:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Hozzaferes joga:</strong>{" "}
            Tajekoztatas kerese az Onrol kezelt adatokrol.
          </li>
          <li>
            <strong className="text-zinc-200">Helyesbites joga:</strong>{" "}
            Pontatlan adatainak javitasa.
          </li>
          <li>
            <strong className="text-zinc-200">Torles joga:</strong> Adatai
            torlesenek kerelmezes (&quot;elfeledteteshez valo jog&quot;).
          </li>
          <li>
            <strong className="text-zinc-200">
              Adatkezeles korlatozasa:
            </strong>{" "}
            Az adatkezeles korlatozasanak kerese bizonyos esetekben.
          </li>
          <li>
            <strong className="text-zinc-200">
              Adathordozhatosag joga:
            </strong>{" "}
            Adatainak geppel olvashatoan torteno megkapasa.
          </li>
          <li>
            <strong className="text-zinc-200">Tiltakozas joga:</strong>{" "}
            Tiltakozas az adatkezeles ellen.
          </li>
        </ul>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Jogai gyakorlasahoz kerem, vegye fel velunk a kapcsolatot az
          alabbi elerhetosegen. Panasz eseten a Nemzeti Adatvedelmi es
          Informacioszabadsag Hatosaghoz (NAIH) is fordulhat:{" "}
          <a
            href="https://www.naih.hu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dozis-amber hover:text-dozis-amber-light underline"
          >
            www.naih.hu
          </a>
        </p>
      </section>

      {/* 8. Kapcsolat */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          8. Kapcsolat
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Adatvedelmi kerdeseivel, jogai gyakorlasaval kapcsolatban az alabbi
          elerhetosegen tud velunk kapcsolatba lepni:
        </p>
        <div className="text-zinc-300 leading-relaxed space-y-1">
          <p>
            <strong className="text-zinc-200">Nev:</strong> Polomai Zoltan
          </p>
          <p>
            <strong className="text-zinc-200">E-mail:</strong>{" "}
            <a
              href="mailto:dozisdozis0@gmail.com"
              className="text-dozis-amber hover:text-dozis-amber-light underline"
            >
              dozisdozis0@gmail.com
            </a>
          </p>
          <p>
            <strong className="text-zinc-200">Lakcim:</strong> 1000 Budapest
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed mt-4">
          A megkeresekre legkesobb 30 napon belul valaszolunk.
        </p>
      </section>
    </article>
  );
}
