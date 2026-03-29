import type { Metadata } from "next";
import { Anton, Montserrat } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DOZIS. | Elektronikus Zenei Események",
  description: "Regisztrálj DÓZIS. eseményekre, kapj QR kódot és gyűjtsd az ingyenes belépődet!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" className="dark">
      <body className={`${anton.variable} ${montserrat.variable}`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`
          }}
        />
      </body>
    </html>
  );
}
