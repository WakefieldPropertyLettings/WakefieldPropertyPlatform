import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PropertySearch from "@/components/home/PropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <WhyChooseUs />
      <Services />
      <Testimonials />
      <Footer />
    </>
  );
}