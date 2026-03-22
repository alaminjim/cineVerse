import HeroSection from "./hero/page";

export const dynamic = "force-dynamic";

const page = () => {
  return (
    <main className="min-h-screen flex flex-col bg-[#000]">
      <HeroSection />
    </main>
  );
};

export default page;

