import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altalanos Szerzodesi Feltetelek (ASZF) | DOZIS.",
  description: "A DOZIS. esemeny alkalmazas altalanos szerzodesi feltetelei.",
};

export default function TermsOfServicePage() {
  return (
    <article>
      <h1 className="font-heading text-3xl text-dozis-amber uppercase tracking-wider mb-8">
        Altalanos Szerzodesi Feltetelek (ASZF)
      </h1>

      <p className="text-zinc-400 text-sm mb-8">
        Hatalyos: 2026. marcius 29.
      </p>

      {/* 1. Szolgaltato */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          1. Szolgaltato
        </h2>
        {/* TODO: Replace with actual data controller details */}
        <div className="text-zinc-300 leading-relaxed mb-4 space-y-1">
          <p>
            <strong className="text-zinc-200">Nev:</strong> [Teljes Nev]
          </p>
          <p>
            <strong className="text-zinc-200">E-mail:</strong>{" "}
            <a
              href="mailto:dozis@example.com"
              className="text-dozis-amber hover:text-dozis-amber-light underline"
            >
              dozis@example.com
            </a>
          </p>
          <p>
            <strong className="text-zinc-200">Lakcim:</strong> [Lakcim]
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A szolgaltato termeszetes szemely, aki a DOZIS. esemeny alkalmazast
          uzemelteti (a tovabbiakban: &quot;Szolgaltato&quot;).
        </p>
      </section>

      {/* 2. A szolgaltatas leirasa */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          2. A szolgaltatas leirasa
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A DOZIS. alkalmazas az alabbi szolgaltatasokat nyujtja:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Ingyenes esemeny regisztracios platform a DOZIS. elektronikus
            zenei esemenyek szamara
          </li>
          <li>
            QR kod alapu becsekkolasi rendszer az esemenyen valo jelenleti
            igazolashoz
          </li>
          <li>
            Husegprogram: az 5. igazolt latogatas alkalmaval a belepes
            ingyenes
          </li>
        </ul>
      </section>

      {/* 3. Felhasznalasi feltetelek */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          3. Felhasznalasi feltetelek
        </h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Az alkalmazas hasznalata kizarolag 18 evet betoltott szemelyek
            szamara engedelyezett.
          </li>
          <li>
            A regisztracio soran valos es pontos adatok megadasa szukseges.
          </li>
          <li>
            Egy felhasznalohoz kizarolag egy e-mail cim tartozhat; tobbszoros
            regisztracio nem megengedett.
          </li>
          <li>
            A felhasznalo koteles az alkalmazast a jelen ASZF-nek es a
            hatalyos jogszabalyoknak megfeleloen hasznalni.
          </li>
        </ul>
      </section>

      {/* 4. Regisztracio es fiok */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          4. Regisztracio es felhasznaloi fiok
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A regisztracio e-mail OTP (egyszeri jelszavas) azonositassal
          tortenik. A felhasznalo az e-mail cimere kapott 6 jegyu koddal
          igazolja szemelyet. A regisztracio soran a profil adatok (nev,
          szuletesi ev, lakcim) megadasa kotelezo.
        </p>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A felhasznalo felelos a fiokjahoz tartozo e-mail cim
          biztonsagaert. Az OTP kod harmadik felnek torteno atadasa tilos.
        </p>
      </section>

      {/* 5. Esemenyek es reszvetel */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          5. Esemenyek es reszvetel
        </h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Az esemenyre torteno regisztracio nem garantalja automatikusan a
            belepest; a szervezo fenntartja a jogot a letszamkorlat
            megallpitasara.
          </li>
          <li>
            Az esemeny regisztraciokor kapott QR kod szemelyhez kotott es
            atruhazhatatlan.
          </li>
          <li>
            A QR kod felmutatasa az esemenyen torteno becsekkolashoz
            szukseges.
          </li>
          <li>
            A szervezo fenntartja a jogot esemenyek torlesere, modositasara
            vagy elhalasztasara.
          </li>
        </ul>
      </section>

      {/* 6. Husegprogram */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          6. Husegprogram
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A DOZIS. husegprogram kereteben minden 5. igazolt esemeny
          latogatas alkalmaval a belepes ingyenes. A husegprogram reszletei:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            A szamlalo az igazolt (becsekkolassal megerositett) latogatasokat
            szamolja.
          </li>
          <li>
            Az 5. alkalom automatikusan ingyenes; a szamlalo ezt kovetoen
            ujraindul.
          </li>
          <li>
            A Szolgaltato fenntartja a jogot a husegprogram felteleteleinek
            modositasara vagy megszuntetesere, errol a felhasznalokat
            elozetetesen ertesiti.
          </li>
        </ul>
      </section>

      {/* 7. Felelosseg korlatozasa */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          7. Felelosseg korlatozasa
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Az alkalmazas &quot;jelen allapotaban&quot; (as is) kerul
          biztositasra. A Szolgaltato nem vallal feleloseget:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
          <li>
            Az alkalmazas folyamatos es hibamentes mukodeseert.
          </li>
          <li>
            Az internetkapcsolat megszakadasabol eredo problemakert.
          </li>
          <li>
            A felhasznalo altal megadott helytelen adatokbol szarmazo
            karokert.
          </li>
          <li>
            Vis maior (hatalyos jogszbaly-valtozas, termeszeti katasztrofa,
            jarvany stb.) eseten bekovetkezo szolgaltatas-kiesert.
          </li>
        </ul>
      </section>

      {/* 8. Modositas */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          8. Az ASZF modositasa
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A Szolgaltato fenntartja a jogot a jelen ASZF egyoldalu
          modositasara. A modositasrol a felhasznalokat a regisztralt e-mail
          cimukon keresztul ertesitjuk. A modositott ASZF a kovetkezo
          belepskor torteno elfogadassal lep hatalyba.
        </p>
      </section>

      {/* 9. Alkalmazando jog */}
      <section className="mb-8">
        <h2 className="font-heading text-xl text-dozis-amber uppercase mt-8 mb-3">
          9. Alkalmazando jog es jogvitak
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          A jelen ASZF-re a magyar jog az iranyadoo. Az ASZF-bol eredo
          jogvitak elbiralasara a Budapesti birosagok rendelkeznek
          hataskorrel es illetekesseggel.
        </p>
      </section>
    </article>
  );
}
