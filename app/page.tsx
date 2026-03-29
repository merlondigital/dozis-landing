import SwirlingBg from "@/components/landing/swirling-bg";
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import Events from "@/components/landing/events";
import DJs from "@/components/landing/djs";
import Footer from "@/components/landing/footer";
import GrainOverlay from "@/components/landing/grain-overlay";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <SwirlingBg />
      <Navbar />
      <main className="relative z-[1]">
        <Hero />
        <About />
        <Events />
        <DJs />
      </main>
      <Footer />
      <GrainOverlay />
    </div>
  );
}
