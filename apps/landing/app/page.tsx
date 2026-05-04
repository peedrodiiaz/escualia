import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { Problem } from "@/components/problem";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { WaitlistSection } from "@/components/waitlist-section";
import { Footer } from "@/components/footer";

/** Curva SVG que hace la transición de bg-subtle → bg */
function WaveDown({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div className="section-divider-wave" style={{ background: fromColor }}>
      <svg
        viewBox="0 0 1440 56"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ fill: toColor }}
      >
        <path d="M0,32 C360,60 1080,0 1440,32 L1440,56 L0,56 Z" />
      </svg>
    </div>
  );
}

/** Curva SVG inversa: transición de bg → bg-subtle */
function WaveUp({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div className="section-divider-wave" style={{ background: fromColor }}>
      <svg
        viewBox="0 0 1440 56"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ fill: toColor }}
      >
        <path d="M0,24 C360,0 1080,56 1440,24 L1440,56 L0,56 Z" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero: bg-subtle */}
      <Hero />

      {/* Transición hero (bg-subtle) → social-proof (bg-subtle): sin separador, mismo fondo */}
      <SocialProof />

      {/* Transición social-proof (bg-subtle) → problem (bg) */}
      <WaveDown fromColor="var(--bg-subtle)" toColor="var(--bg)" />
      <Problem />

      {/* Transición problem (bg) → how-it-works (bg-subtle) */}
      <WaveUp fromColor="var(--bg)" toColor="var(--bg-subtle)" />
      <HowItWorks />

      {/* Transición how-it-works (bg-subtle) → features (bg) */}
      <WaveDown fromColor="var(--bg-subtle)" toColor="var(--bg)" />
      <Features />

      {/* Transición features (bg) → pricing (bg-subtle) */}
      <WaveUp fromColor="var(--bg)" toColor="var(--bg-subtle)" />
      <Pricing />

      {/* Transición pricing (bg-subtle) → faq (bg) */}
      <WaveDown fromColor="var(--bg-subtle)" toColor="var(--bg)" />
      <FAQ />

      {/* Transición faq (bg) → waitlist (brand gradient): usamos una línea decorativa */}
      <div
        style={{
          background: "linear-gradient(180deg, var(--bg) 0%, var(--brand-deeper) 100%)",
          height: "60px",
        }}
      />
      <WaitlistSection />

      {/* Transición waitlist (brand) → footer (bg-subtle) */}
      <div
        style={{
          background: "linear-gradient(180deg, #1e40af 0%, var(--bg-subtle) 100%)",
          height: "48px",
        }}
      />
      <Footer />
    </main>
  );
}
