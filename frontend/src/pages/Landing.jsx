import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ParadoksAnto from "@/components/ParadoksAnto";
import ElonParadox from "@/components/ElonParadox";
import Abdurrahman from "@/components/Abdurrahman";
import AIReflection from "@/components/AIReflection";
import Chapters from "@/components/Chapters";
import Bab1Preview from "@/components/Bab1Preview";
import Pricing from "@/components/Pricing";
import Marshmallow from "@/components/Marshmallow";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { track } from "@/lib/api";
import FloatingAI from "@/components/FloatingAI";

export default function Landing() {
  useEffect(() => {
    document.title = "ELON MUSK × ISLAM — Didi Subandi";
    track("landing_view");
  }, []);

  return (
    <main className="bg-bg-primary text-ink-primary">
      <Navbar />
      <Hero />
      <ParadoksAnto />
      <ElonParadox />
      <Abdurrahman />
      <AIReflection />
      <Chapters />
      <Bab1Preview />
      <Pricing />
      <Marshmallow />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <FloatingAI />
    </main>
  );
}
