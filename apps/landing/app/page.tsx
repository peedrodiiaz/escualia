import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { WaitlistSection } from "@/components/waitlist-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <Pricing />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
