import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import BackedBy from "@/components/BackedBy";
import Pricing from "@/components/Pricing";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PricingComparison from "@/components/PricingComparison";
import Faq from "@/components/Faq";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <BackedBy />
        <PerformanceMetrics />
        <Pricing />
        <PricingComparison />
        <Faq />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
