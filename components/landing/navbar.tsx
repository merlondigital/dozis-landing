"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#about", label: "ABOUT" },
  { href: "#events", label: "EVENTS" },
  { href: "#djs", label: "DJS" },
  { href: "#contact", label: "CONTACT" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-8 py-5 transition-all duration-500 ${
        scrolled
          ? "opacity-100 translate-y-0 bg-[rgba(5,10,21,0.6)] backdrop-blur-[16px]"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <a href="#" className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/dozis-logo.svg" alt="DOZIS." className="h-[22px] w-auto opacity-90" />
      </a>

      <ul
        className={`flex gap-10 max-md:fixed max-md:inset-0 max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-10 max-md:bg-[rgba(5,10,21,0.95)] max-md:backdrop-blur-[24px] max-md:transition-opacity max-md:duration-300 ${
          menuOpen
            ? "max-md:opacity-100 max-md:pointer-events-auto"
            : "max-md:opacity-0 max-md:pointer-events-none"
        }`}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-xs font-normal tracking-[0.2em] uppercase text-white opacity-50 transition-opacity duration-300 hover:opacity-100 max-md:text-xl max-md:tracking-[0.3em] max-md:opacity-80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {label}
            </a>
          </li>
        ))}
        <li className="md:hidden">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-base font-medium tracking-[0.15em] uppercase border border-dozis-amber text-dozis-amber px-6 py-3 rounded mt-4 inline-block hover:bg-dozis-amber hover:text-black transition-all duration-300 min-h-[44px]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Bejelentkezes
          </Link>
        </li>
      </ul>

      <Link
        href="/login"
        className="max-md:hidden text-xs font-medium tracking-[0.15em] uppercase border border-dozis-amber text-dozis-amber px-4 py-2 rounded transition-all duration-300 hover:bg-dozis-amber hover:text-black min-h-[44px] flex items-center"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Bejelentkezes
      </Link>

      <button
        className={`hidden max-md:flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1 z-[101] ${
          menuOpen ? "navbar-hamburger-open" : ""
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Menu bezarasa" : "Menu megnyitasa"}
        aria-expanded={menuOpen}
      >
        <span
          className={`block w-[22px] h-[1.5px] bg-white transition-all duration-300 ${
            menuOpen ? "translate-y-[6.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`block w-[22px] h-[1.5px] bg-white transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-[22px] h-[1.5px] bg-white transition-all duration-300 ${
            menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
          }`}
        />
      </button>
    </nav>
  );
}
