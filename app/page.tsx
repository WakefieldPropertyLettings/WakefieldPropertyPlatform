import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import AISection from "@/components/home/AISection";
import ContactCTA from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Featured Properties */}
      <FeaturedProperties />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Services */}
      <Services />

      {/* Testimonials */}
      <Testimonials />

      {/* AI Section */}
      <AISection />

      {/* Contact CTA */}
      <ContactCTA />
    </>
  );
}