import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek (ÁSZF) | DÓZIS.",
  description: "A DÓZIS. esemény alkalmazás általános szerződési feltételei.",
};

export default function TermsOfServicePage() {
  return (
    <article>
      <h1 className="font-heading text-3xl text-dozis-amber uppercase tracking-wider mb-8">
        Általános Szerződési Feltételek (ÁSZF)
      </h1>

      <p className="text-zinc-400 text-sm mb-8">
        Hatályos: 2026. március 29.
      </p>

      {/* 1. Szolgáltató */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          1. Szolgáltató
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A DÓZIS. esemény alkalmazás szolgáltatója természetes személy
          (a továbbiakban: &quot;Szolgáltató&quot;):
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
          A Szolgáltató nem minősül jogi személynek (vállalkozásnak). A
          szolgáltatás a DÓZIS. budapesti elektronikus zenei kollektíva
          eseményszervezői tevékenységéhez kapcsolódik.
        </p>
      </section>

      {/* 2. A szolgáltatás leírása */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          2. A szolgáltatás leírása
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A DÓZIS. alkalmazás az alábbi szolgáltatásokat nyújtja:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Ingyenes esemény regisztrációs platform a DÓZIS. elektronikus
            zenei események számára
          </li>
          <li>
            QR kód alapú becsekkolási rendszer az eseményen való jelenléti
            igazoláshoz
          </li>
          <li>
            Hűségprogram: az 5. igazolt látogatás alkalmával a belépés
            ingyenes
          </li>
        </ul>
      </section>

      {/* 3. Felhasználási feltételek */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          3. Felhasználási feltételek
        </h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Az alkalmazás használata kizárólag 18 évet betöltött személyek
            számára engedélyezett.
          </li>
          <li>
            A regisztráció során valós és pontos adatok megadása szükséges.
          </li>
          <li>
            Egy felhasználóhoz kizárólag egy e-mail cím tartozhat; többszörös
            regisztráció nem megengedett.
          </li>
          <li>
            A felhasználó köteles az alkalmazást a jelen ÁSZF-nek és a
            hatályos jogszabályoknak megfelelően használni.
          </li>
        </ul>
      </section>

      {/* 4. Regisztráció és fiók */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          4. Regisztráció és felhasználói fiók
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A regisztráció e-mail OTP (egyszeri jelszavas) azonosítással
          történik. A felhasználó az e-mail címére kapott 6 jegyű kóddal
          igazolja személyét. A regisztráció során a profil adatok (név,
          születési év, lakcím) megadása kötelező.
        </p>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A felhasználó felelős a fiókjához tartozó e-mail cím
          biztonságáért. Az OTP kód harmadik félnek történő átadása tilos.
        </p>
      </section>

      {/* 5. Események és részvétel */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          5. Események és részvétel
        </h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Az eseményre történő regisztráció nem garantálja automatikusan a
            belépést; a szervező fenntartja a jogot a létszámkorlát
            megállapítására.
          </li>
          <li>
            Az esemény regisztrációkor kapott QR kód személyhez kötött és
            átruházhatatlan.
          </li>
          <li>
            A QR kód felmutatása az eseményen történő becsekkoláshoz
            szükséges.
          </li>
          <li>
            A szervező fenntartja a jogot események törlésére, módosítására
            vagy elhalasztására.
          </li>
        </ul>
      </section>

      {/* 6. Hűségprogram */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          6. Hűségprogram
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A DÓZIS. hűségprogram keretében minden 5. igazolt esemény
          látogatás alkalmával a belépés ingyenes. A hűségprogram részletei:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            A számláló az igazolt (becsekkolással megerősített) látogatásokat
            számolja.
          </li>
          <li>
            Az 5. alkalom automatikusan ingyenes; a számláló ezt követően
            újraindul.
          </li>
          <li>
            A Szolgáltató fenntartja a jogot a hűségprogram feltételeinek
            módosítására vagy megszüntetésére, erről a felhasználókat
            előzetesen értesíti.
          </li>
        </ul>
      </section>

      {/* 7. Felelősség korlátozása */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          7. Felelősség korlátozása
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alkalmazás &quot;jelen állapotában&quot; (as is) kerül
          biztosításra. A Szolgáltató nem vállal felelősséget:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Az alkalmazás folyamatos és hibamentes működéséért.
          </li>
          <li>
            Az internetkapcsolat megszakadásából eredő problémákért.
          </li>
          <li>
            A felhasználó által megadott helytelen adatokból származó
            károkért.
          </li>
          <li>
            Vis maior (hatályos jogszabály-változás, természeti katasztrófa,
            járvány stb.) esetén bekövetkező szolgáltatás-kiesésért.
          </li>
        </ul>
      </section>

      {/* 8. Módosítás */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          8. Az ÁSZF módosítása
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A Szolgáltató fenntartja a jogot a jelen ÁSZF egyoldalú
          módosítására. A módosításról a felhasználókat a regisztrált e-mail
          címükön keresztül értesítjük. A módosított ÁSZF a következő
          belépéskor történő elfogadással lép hatályba.
        </p>
      </section>

      {/* 9. Alkalmazandó jog */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          9. Alkalmazandó jog és jogviták
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A jelen ÁSZF-re a magyar jog az irányadó. Az ÁSZF-ből eredő
          jogviták elbírálására a budapesti bíróságok rendelkeznek
          hatáskörrel és illetékességgel.
        </p>
      </section>
    </article>
  );
}
