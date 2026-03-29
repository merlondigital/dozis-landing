import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adatvédelmi Tájékoztató | DÓZIS.",
  description: "A DÓZIS. esemény alkalmazás adatvédelmi tájékoztatója.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl text-dozis-amber uppercase tracking-wider mb-8">
        Adatvédelmi Tájékoztató
      </h1>

      <p className="text-zinc-400 text-sm mb-8">
        Hatályos: 2026. március 29.
      </p>

      {/* 1. Adatkezelő */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          1. Adatkezelő
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az adatkezelő természetes személy, aki a DÓZIS. esemény alkalmazás
          üzemeltetését és az ezzel kapcsolatos személyesadat-kezelést végzi
          (a továbbiakban: &quot;Adatkezelő&quot;).
        </p>
        <div className="text-zinc-300 leading-relaxed mb-4 space-y-1">
          <p>
            <strong className="text-zinc-200">Név:</strong> Természetes személy (az alkalmazás üzemeltetője)
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
            <strong className="text-zinc-200">Lakcím:</strong> 1000 Budapest
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az Adatkezelő nem minősül jogi személynek (vállalkozásnak), hanem
          természetes személyként jelen tájékoztatóban foglaltak szerint kezeli
          az alkalmazás felhasználóinak személyes adatait, az Európai
          Parlament és a Tanács (EU) 2016/679 rendelete (GDPR) és az
          információs önrendelkezési jogról és az információszabadságról szóló
          2011. évi CXII. törvény (Infotv.) előírásainak megfelelően.
        </p>
      </section>

      {/* 2. Kezelt adatok */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          2. Kezelt adatok
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alkalmazás használata során az alábbi személyes adatokat kezeljük:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>E-mail cím</li>
          <li>Vezetéknév</li>
          <li>Keresztnév</li>
          <li>Születési év</li>
          <li>Lakcím</li>
          <li>Esemény látogatási előzmény (részvételi történet)</li>
        </ul>
      </section>

      {/* 3. Adatkezelés célja */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          3. Az adatkezelés célja
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A személyes adatok kezelése az alábbi célokból történik:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Esemény regisztráció:</strong>{" "}
            A felhasználó eseményre való regisztrációjának kezelése és
            nyilvántartása.
          </li>
          <li>
            <strong className="text-zinc-200">
              Becsekkolási azonosítás:
            </strong>{" "}
            QR kód alapú jelenlétigazolás az eseményen.
          </li>
          <li>
            <strong className="text-zinc-200">Hűségprogram:</strong> Az 5.
            alkalommal ingyenes belépés biztosítása érdekében a látogatási
            szám nyomon követése.
          </li>
        </ul>
      </section>

      {/* 4. Adatkezelés jogalapja */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          4. Az adatkezelés jogalapja
        </h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">
              GDPR 6. cikk (1) bekezdés a) pont — Hozzájárulás:
            </strong>{" "}
            A felhasználó önkéntesen regisztrál az alkalmazásban és megadja
            személyes adatait.
          </li>
          <li>
            <strong className="text-zinc-200">
              GDPR 6. cikk (1) bekezdés b) pont — Szerződéses jogalap:
            </strong>{" "}
            Az adatkezelés az esemény regisztrációhoz kapcsolódó szolgáltatás
            teljesítéséhez szükséges.
          </li>
        </ul>
      </section>

      {/* 5. Adatok megőrzése */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          5. Az adatok megőrzési ideje
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A személyes adatokat addig őrizzük meg, amíg a felhasználói fiók
          létezik. A felhasználó bármikor kérelmezheti adatainak törlését,
          amelyet indokolatlan késlekedés nélkül, legkésőbb 30 napon belül
          teljesítünk.
        </p>
      </section>

      {/* 6. Harmadik felek */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          6. Adatfeldolgozók és harmadik felek
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alábbi harmadik feleket vesszük igénybe a szolgáltatás
          működtetéséhez:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Resend</strong> —
            Tranzakciós e-mail küldés (OTP kódok, értesítések). A Resend
            kizárólag az e-mail címeket kezeli a küldés céljára.
          </li>
          <li>
            <strong className="text-zinc-200">Cloudflare</strong> —
            Tárhelyszolgáltatás, CDN és adatbázis-szolgáltatás (D1). Az
            adatok az Európai Unió területén belül kerülnek feldolgozásra.
          </li>
        </ul>
      </section>

      {/* 7. Felhasználói jogok */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          7. Az Ön jogai
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A GDPR alapján Ön az alábbi jogokkal rendelkezik:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            <strong className="text-zinc-200">Hozzáférés joga:</strong>{" "}
            Tájékoztatás kérése az Önről kezelt adatokról.
          </li>
          <li>
            <strong className="text-zinc-200">Helyesbítés joga:</strong>{" "}
            Pontatlan adatainak javítása.
          </li>
          <li>
            <strong className="text-zinc-200">Törlés joga:</strong> Adatai
            törlésének kérelmezése (&quot;elfeledtetéshez való jog&quot;).
          </li>
          <li>
            <strong className="text-zinc-200">
              Adatkezelés korlátozása:
            </strong>{" "}
            Az adatkezelés korlátozásának kérése bizonyos esetekben.
          </li>
          <li>
            <strong className="text-zinc-200">
              Adathordozhatóság joga:
            </strong>{" "}
            Adatainak géppel olvashatóan történő megkapása.
          </li>
          <li>
            <strong className="text-zinc-200">Tiltakozás joga:</strong>{" "}
            Tiltakozás az adatkezelés ellen.
          </li>
        </ul>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Jogai gyakorlásához kérem, vegye fel velünk a kapcsolatot az
          alábbi elérhetőségen. Panasz esetén a Nemzeti Adatvédelmi és
          Információszabadság Hatósághoz (NAIH) is fordulhat:{" "}
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
          Adatvédelmi kérdéseivel, jogai gyakorlásával kapcsolatban az alábbi
          elérhetőségen tud velünk kapcsolatba lépni:
        </p>
        <div className="text-zinc-300 leading-relaxed space-y-1">
          <p>
            <strong className="text-zinc-200">Név:</strong> Természetes személy (az alkalmazás üzemeltetője)
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
            <strong className="text-zinc-200">Lakcím:</strong> 1000 Budapest
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed mt-4">
          A megkeresésekre legkésőbb 30 napon belül válaszolunk.
        </p>
      </section>
    </article>
  );
}
