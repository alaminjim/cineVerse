import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}
