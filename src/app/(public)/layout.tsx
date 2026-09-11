import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PublicDock } from "@/components/site/PublicDock";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />

      <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 xl:hidden">
        <PublicDock />
      </div>
    </>
  );
}
