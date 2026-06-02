import Footer from "./footer/page";
import Navbar from "./navbar/page";
import ClientOnly from "@/components/shared/ClientOnly";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-20 flex-1">{children}</main>
      <ClientOnly>
        <Footer />
      </ClientOnly>
    </div>
  );
}
