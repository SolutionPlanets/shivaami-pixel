import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import BenefitsGrid from "@/components/landing/BenefitsGrid";
import ProductsTeaser from "@/components/landing/ProductsTeaser";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PlanComparison from "@/components/landing/PlanComparison";
import FAQSection from "@/components/landing/FAQSection";
import ContactCTA from "@/components/landing/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BenefitsGrid />
        <ProductsTeaser />
        <FeaturesSection />
        <PlanComparison />
        <FAQSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
