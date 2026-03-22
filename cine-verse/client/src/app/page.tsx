import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import FeaturedSection from "@/components/featured-section";
import TrendingSection from "@/components/trending-section";
import SubscriptionSection from "@/components/subscription-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 overflow-hidden">
        <HeroSection />
        <FeaturedSection />
        <TrendingSection />
        <SubscriptionSection />
      </main>
      <Footer />
    </>
  );
}
