import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="min-h-[80vh]">{children}</main>
      <Footer />
    </div>
  );
}
