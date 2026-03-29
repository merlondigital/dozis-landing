export default function Footer() {
  return (
    <footer id="contact" className="relative z-[1] py-12 px-8">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between max-md:flex-col max-md:gap-6 max-md:text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/dozis-logo.svg" alt="DOZIS." className="h-4 w-auto opacity-40" />

        <a
          href="https://www.instagram.com/dozis_bp/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white opacity-30 transition-opacity duration-300 hover:opacity-80"
          aria-label="Instagram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <span
          className="text-[0.65rem] tracking-[0.25em] uppercase text-white/20"
          style={{ fontFamily: "var(--font-body)" }}
        >
          DOPAMIN, BUDAPEST
        </span>
      </div>
    </footer>
  );
}
