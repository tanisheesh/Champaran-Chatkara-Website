import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { SignatureDishesSection } from "@/components/landing/signature-dishes-section";
import { MenuSection } from "@/components/landing/menu-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <SignatureDishesSection />
        <MenuSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
