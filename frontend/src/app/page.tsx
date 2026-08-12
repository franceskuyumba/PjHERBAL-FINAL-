import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import PromoBanner from "@/components/home/PromoBanner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import HealthBlog from "@/components/home/HealthBlog";
import HowToOrder from "@/components/home/HowToOrder";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <FeaturedCategories />
      <BestSellers />
      <HowToOrder />
      <WhyChooseUs />
      <Testimonials />
      <HealthBlog />
    </>
  );
}
