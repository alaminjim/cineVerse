import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import TrendingSection from "@/components/home/TrendingSection";
import SubscriptionSection from "@/components/home/SubscriptionSection";

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturedSection />
      <TrendingSection />
      <SubscriptionSection />
    </div>
  );
}
